---
name: authenticated-browser-session
description: "当任务需要真实的已登录浏览器状态时使用：建立独立的 Chrome/Chromium profile 并开启 DevTools Protocol，请用户登录一次，然后在页面上下文运行 JavaScript/fetch，让 cookie、SSO、CSRF 和同源行为都保持真实。用于 debugging、API probe、E2E 或 regression 验证、内部 Web 应用、authenticated smoke test——任何本来会诱使 agent 去索要 token 或读取 cookie 的检查。"
---

# Authenticated Browser Session

这是一个可复用的 AgentCorp action surface，不是 tester 角色：任何角色——E2E、API contract、regression、debugging、incident triage、exploratory verification——在任务需要真实登录态浏览器状态时都会加载它，而拥有它的 plan 或 task 会写明页面 URL、账号/环境、允许的写操作和证据要求。

你存在是因为一种失败模式：agent 撞上登录墙后，要么伸手去拿凭证本身，要么悄悄降级成一个未登录的 probe，却把结果当成真实结论呈现。两者都以用户看不见的方式破坏信任。第三条路就是这个 skill：在专用浏览器 profile 里的真实页面内部操作，让浏览器自然携带凭证，于是证据保持真实，而凭证从不经过你的手。

## 铁律

```
凭证留在浏览器里——使用会话，绝不从会话中提取。
```

这条铁律禁止两个方向的泄漏。绝不读取磁盘上的凭证 artifact：cookie database、password store、local storage dump、session file。也绝不通过活的会话导出凭证：不 dump `document.cookie`，不用 CDP 的 cookie/storage API（`Network.getCookies` 及同类），不把 session token、cookie 或 auth header 从 page-context 响应里复制出来给 curl 或任何其他 client 复用。如果一个检查看起来需要原始凭证，那是检查本身错了——把它改造成在页面内部运行。

## 这能证明什么

- Page-context `fetch` 证明来自该会话的同源 authenticated request 行为。
- DOM inspection 或 screenshot 证明加载的页面渲染了什么。
- Console/network observation 在 DevTools 语义重要时辅助 debugging。

只要边界相关就说明它：纯 API 的 page-context check 不能证明 UI layout、完整用户交互或外部通知，除非这些被单独观察到了。当 page-context request 成功、但用户可见的结果落在浏览器之外（邮件、聊天、push）时，暂停并索要缺失的观察，而不是推断成功。

## Setup

使用与用户日常浏览器分开的专用 profile。profile 会跨任务持久化，所以用户通常每台机器/每个账号只需登录一次。

```bash
./scripts/browser-session.sh 'https://example.com'
```

在其他目录下时，用本 skill 目录的绝对路径调用这些脚本（`browser-session.sh`，下文的 `page-js.mjs` 同理）。

脚本只有在验证过监听端口的浏览器进程确实以专用 profile 启动（`--user-data-dir=$HOME/.agentcorp/browser-session-profile`）之后，才会采用一个已在监听的 CDP endpoint；如果端口属于别的浏览器——包括用户带着 `--remote-debugging-port` 启动的日常 Chrome——它会拒绝，并提示你用 `AGENTCORP_BROWSER_PORT` 换一个新端口。你手动 probe CDP 时也要遵守同一条规则：绝不对未验证过 profile 的 endpoint 运行页面 JS（见 Troubleshooting）。

如果站点出现登录页，直白地解释：

> 我打开了一个单独的 agent 专用浏览器 profile。请在那里登录；我不会读取你的 cookie 或密码。你确认页面已登录后，我就可以运行使用该浏览器会话的页面本地检查。

用户确认登录后再继续。

配置项（换一个端口：`AGENTCORP_BROWSER_PORT=9333 ./scripts/browser-session.sh ...`；旧的 `CHROME_COOKIE_JS_PROFILE/HOST/PORT` 变量仍作为较旧本地环境的回退保留）：

```bash
AGENTCORP_BROWSER_PROFILE="$HOME/.agentcorp/browser-session-profile"
AGENTCORP_BROWSER_HOST="127.0.0.1"
AGENTCORP_BROWSER_PORT="9222"
AGENTCORP_BROWSER_BIN="/Applications/Google Chrome.app"
```

## 运行页面 JavaScript

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'document.title'
node ./scripts/page-js.mjs --url 'https://example.com/app' --file /tmp/auth-check.js   # larger checks: task-local script
```

请求 probe 使用 async IIFE：

```js
(async () => {
  const response = await fetch('/api/status', { credentials: 'include' });
  const text = await response.text();
  let body = text;
  try { body = JSON.parse(text); } catch {}
  return JSON.stringify({
    url: response.url,
    status: response.status,
    contentType: response.headers.get('content-type'),
    body,
  });
})();
```

## 安全协议

优先先做只读 probe（`--eval 'location.href'`）。在任何会写数据、触发流程、发送通知、启动任务或改变远端状态的 page JS 之前，先说明：目标环境和 URL；具体 endpoint 或 action；具体 payload 或人可读 diff；预期结果和证据；恢复/清理方案（或为什么不需要）。除非用户在当前任务里已明确授权这类操作，否则不要执行写操作。

绝不打印 secrets。保存证据前 redact URL auth 参数、token、临时凭证、cookie 和敏感响应字段。

## 证据形态

记录足以复现的内容：页面 URL、title、environment、按引用给出的账号；command 或 script path；request method/path/body（secrets 已 redact）；response status/content-type/body 摘要；可用时的 timestamp 和 trace/request ID；会话不能直接观察到什么，以及人工观察点（邮件/聊天/push）。

交付证据前自查：会话是专用 profile——经过验证，而非假设；任何保存的 artifact 里都没有凭证材料；每一次写操作都先经过说明和授权；这份证据能证明什么的边界，就写在结论旁边。

## Red flags——一旦发现自己这样想就停下

| 念头 | 现实 |
| --- | --- |
| “这个端口上已经有 CDP endpoint 了——attach 省一次启动。” | 那可能是用户的日常 Chrome。先验证进程用的是专用 profile，否则换一个新端口。 |
| “`document.cookie` 又不是 cookie database，规则管不到它。” | 铁律禁止的是提取，不只是磁盘上的文件。通过会话读凭证是同一种违约，只是步骤更少。 |
| “把 token 复制进 curl 用一次，比 page-js 快多了。” | token 离开浏览器的那一刻，承诺就破了——而且结果不再证明 browser-session 行为。 |
| “fetch 返回 200，功能就是好的。” | 200 只证明请求链路。UI 渲染、通知和下游任务各需要自己的观察。 |
| “只是往测试 endpoint 发个小 POST，还要先声明太啰嗦。” | 每一次远端变更都要先声明再授权。打错环境的“小”写操作正是事故的开端。 |
| “用户现在肯定已经登录完了。” | 只有得到明确确认才能继续。半登录的会话产出的是以安静方式出错的证据。 |

## Troubleshooting

用你实际启动时的 host/port 检查 CDP 是否可用：

```bash
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/version"
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/list"
```

- `/json/version` 失败：用 `browser-session.sh` 启动专用 profile。
- CDP 已可用：运行任何页面 JS 之前，确认 endpoint 属于专用 profile——浏览器进程命令行必须包含 `--user-data-dir=$HOME/.agentcorp/browser-session-profile`（`ps ax | grep -- "--remote-debugging-port=9222"`，把端口换成你实际用的）。如果端口属于别的浏览器，换端口而不是 attach。
- 端口有监听但不是 Chrome CDP：换一个端口。
- 出现登录跳转或 SSO：请用户在专用 profile 完成登录。
- Hash-routed SPA：传入包含 `#/route` 的完整 URL。
- 出现 browser warning：记录它，但除非它阻断目标行为，否则以被请求的行为判断成败。
