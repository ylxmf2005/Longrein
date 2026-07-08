---
name: authenticated-browser-session
description: "当任务需要一个持久化的已登录浏览器会话作为 AgentCorp 可复用行为时使用：建立独立的 Chrome/Chromium profile 并开启 DevTools Protocol，请用户登录一次，然后在页面上下文执行 JavaScript/fetch，让 cookie、SSO、CSRF 和同源行为都保持真实。用于 debugging、API probe、E2E 或 regression 验证、内部 Web 应用、authenticated smoke test，以及任何需要真实登录态但不能读取 cookie 的任务。"
---

# Authenticated Browser Session

这是 AgentCorp 的可复用 action surface，不是 tester 角色：E2E、API contract、regression、debugging、incident triage 和 exploratory verification 在任务需要真实登录态浏览器时都可以加载它。

你存在是因为一种失败模式：agent 撞上登录墙后伸手去拿凭证本身——要求用户粘贴 token、读取 cookie database、dump `document.cookie`——或者悄悄降级成未登录的 probe，把结果当成真实结论呈现。两者都以用户看不见的方式破坏信任。第三条路就是这个 skill：在专用浏览器 profile 里的真实页面内部操作，让浏览器自然携带凭证，证据保持真实，而凭证从不经过你的手。

**铁律：凭证留在浏览器里——使用会话，绝不从会话中提取。**

这条铁律禁止两个方向的泄漏。不要读取磁盘上的凭证 artifact：cookie database、password store、local storage dump 或 session file。也不要通过活的会话导出凭证：不 dump `document.cookie`，不用 CDP 的 cookie 或 storage API（`Network.getCookies` 及同类），不把 session token、cookie 或 auth header 从 page-context 响应里复制出来给 curl 或任何其他 client 复用。如果一个检查看起来需要拿到原始凭证，那是检查本身错了——把它改造成在页面内部执行。

## 这能证明什么

- Page-context `fetch` 证明同一个浏览器会话里的同源 authenticated request 行为。
- DOM inspection 或 screenshot 证明页面实际渲染状态。
- Console/network observation 可以在需要 DevTools 语义时辅助 debug。

每次相关时都要说明边界：纯 API 的 page-context check 不能证明 UI layout、完整用户交互或外部通知，除非这些也被单独观察到了。

## Setup

使用与用户日常浏览器分开的专用 profile。profile 会跨任务持久化，所以用户通常每台机器/每个账号只需要登录一次。

```bash
./scripts/browser-session.sh 'https://example.com'
```

如果不在本 skill 目录执行，用绝对路径调用脚本（`browser-session.sh`，下文的 `page-js.mjs` 同理）：

```bash
/path/to/authenticated-browser-session/scripts/browser-session.sh 'https://example.com'
```

脚本只有在验证过监听端口的浏览器进程确实以专用 profile 启动（`--user-data-dir=$HOME/.agentcorp/browser-session-profile`）之后，才会采用一个已在监听的 CDP endpoint；如果端口属于别的浏览器——包括用户带着 `--remote-debugging-port` 启动的日常 Chrome——它会拒绝，并提示你用 `AGENTCORP_BROWSER_PORT` 换一个新端口。你手动 probe CDP 时也要遵守同一条规则：绝不对未验证过 profile 的 endpoint 运行页面 JS（见 Troubleshooting），否则就是在用户的个人会话内部操作，违背下面这条承诺。

如果页面出现登录页，直白地解释：

> 我打开了一个单独的 agent 专用浏览器 profile。请在这里登录；我不会读取你的 cookie 或密码。你确认页面已登录后，我就可以在页面本地运行检查，让浏览器自然带上登录态。

用户确认登录后再继续。

配置项：

```bash
AGENTCORP_BROWSER_PROFILE="$HOME/.agentcorp/browser-session-profile"
AGENTCORP_BROWSER_HOST="127.0.0.1"
AGENTCORP_BROWSER_PORT="9222"
AGENTCORP_BROWSER_BIN="/Applications/Google Chrome.app"
```

端口被占用时换一个端口：

```bash
AGENTCORP_BROWSER_PORT=9333 ./scripts/browser-session.sh 'https://example.com'
```

## 运行页面 JavaScript

用 `page-js.mjs` 在已登录页面中执行 JavaScript：

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'document.title'
```

较大的检查脚本写到任务工作区或 `/tmp` 再运行：

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --file /tmp/auth-check.js
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

先做只读 probe：

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'location.href'
```

任何会写数据、触发流程、发送通知、启动任务或改变远端状态的 page JS 之前，先说明：

- 目标环境和 URL
- 具体 endpoint 或 action
- 具体 payload 或人可读 diff
- 预期结果和证据
- 恢复/清理方案，或为什么不需要清理

除非用户在当前任务里已经明确授权这类写操作，否则不要继续。

不要打印 secrets。保存证据前 redact URL auth 参数、token、临时凭证、cookie 和敏感响应字段。

## 证据形态

用于 verification/debugging 的 artifact 要足以复现：

- 页面 URL、title、environment、账号引用
- 使用的 command 或 script path
- request method/path/body，secrets 要 redact
- response status/content-type/body 摘要
- timestamp 和 trace/request ID
- browser session 不能直接观察什么
- 人工观察点，例如邮件/聊天/push 通知

如果 page-context request 成功，但用户可见结果在浏览器外部，暂停并要求补齐观察，不要自行推断成功。

交付证据前自查：

- 你运行的会话是专用 profile——经过验证，而不是假设。
- 任何保存的 artifact 里都没有凭证材料。
- 你执行的每一次写操作都先经过说明和授权。
- 这份证据能证明什么、不能证明什么，写在结论旁边，而不是留给读者猜。

## Red flags——一旦出现立即停下

| 念头 | 现实 |
| --- | --- |
| “这个端口上已经有 CDP endpoint 了——直接 attach 省一次启动。” | 那可能是用户的日常 Chrome。运行任何页面 JS 之前先验证进程用的是专用 profile，否则换一个新端口。 |
| “`document.cookie` 又不是 cookie database，规则管不到它。” | 铁律禁止的是提取，不只是磁盘上的文件。通过会话读凭证是同一种违约，只是步骤更少。 |
| “把 session token 复制进 curl 用一次，比 page-js 快多了。” | token 离开浏览器的那一刻，隐私承诺就已破坏——而且结果不再证明 browser-session 行为。把请求放回页面里执行。 |
| “fetch 返回 200，功能就是好的。” | 200 只证明请求链路。UI 渲染、通知、下游任务各需要自己的观察——说清哪些未被证明，或者去观察它。 |
| “只是往测试 endpoint 发个小 POST，还要先声明太啰嗦。” | 每一次远端变更都要走先声明再授权。打错环境的“小”写操作正是事故的开端。 |
| “用户现在肯定已经登录完了。” | 只有得到明确确认才能继续。对半登录状态的会话做 probe，得到的是以安静方式出错的证据。 |

## Troubleshooting

检查 CDP 是否可用，用你实际启动时的 host/port：

```bash
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/version"
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/list"
```

常见情况：

- `/json/version` 失败：用 `browser-session.sh` 启动专用 profile。
- CDP 已可用（脚本这样报告，或你自己发现了在监听的 endpoint）：运行任何页面 JS 之前确认 endpoint 属于专用 profile——浏览器进程命令行必须包含 `--user-data-dir=$HOME/.agentcorp/browser-session-profile`（用 `ps ax | grep -- "--remote-debugging-port=9222"` 检查，端口换成你实际用的）。如果端口属于别的浏览器，用 `AGENTCORP_BROWSER_PORT` 换一个新端口，不要 attach。
- 端口有监听但 `/json/version` 不是 Chrome CDP：换端口。
- 出现登录跳转或 SSO：请用户在专用 profile 完成登录。
- Hash-routed SPA：传入包含 `#/route` 的完整 URL。
- 页面出现 browser warning：记录它，但除非 warning 阻断目标行为，否则以被测试行为本身判断。

## 角色集成

- Test Planner：当 live system 需要 authenticated browser state 时，把它写成 execution surface。plan 必须写明页面 URL、账号/环境、允许写操作、恢复方案和证据要求。
- E2E Tester：当 TestPlan 明确允许 page-context API/JS 作为用户旅程或 fallback 的一部分时使用。说明它能证明和不能证明的 UI 行为。
- API Contract Tester：当普通 HTTP client 无法复现浏览器 auth 或 CSRF 行为时，用它做同源 authenticated API 检查。
- Regression Tester 和 Debugging 角色：用它复现登录态行为、比较前后差异、检查 console 输出，并捕获 request/response 证据。
