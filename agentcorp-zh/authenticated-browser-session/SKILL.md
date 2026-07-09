---
name: authenticated-browser-session
description: "当任务需要真实的已登录浏览器状态时使用：设置一个专用的 Chrome/Chromium 配置文件，通过 DevTools Protocol 运行，让用户登录一次，然后在页面上下文中运行 JavaScript/fetch，使 cookie、SSO、CSRF 和同源行为保持真实。适用于调试、API 探针、E2E 或回归验证、内部 Web 应用、认证冒烟测试——任何若不使用此技能就会诱使 Agent 索要 token 或读取 cookie 的检查。"
---

# Authenticated Browser Session

这是一个可复用的 AgentCorp 操作面，而非测试员角色：任何角色——E2E、API 契约、回归、调试、事件排查、探索性验证——在任务需要真实已登录浏览器状态时均可加载，且所属计划或任务应指定页面 URL、账户/环境、允许的写操作和证据要求。

你的存在源于一种失败模式：Agent 遇到登录墙后，要么试图获取凭据本身，要么悄悄降级为未经认证的探针并声称这就是真实结果。两者都以用户无法察觉的方式破坏了信任。第三条路就是本技能：在专用浏览器配置文件的页面内操作，让浏览器自然地附加凭据，从而确保证据保持真实，而凭据永远不会经过你手。

## 铁律

```
凭据留在浏览器内——使用会话，绝不要从中提取。
```

该禁令双向生效。绝不读取磁盘上的凭据工件：cookie 数据库、密码存储、local storage 转储、会话文件。也绝不要通过实时会话导出凭据：禁止 `document.cookie` 转储、禁止 CDP cookie/storage API（`Network.getCookies` 及其同类）、禁止从页面上下文响应中复制会话 token、cookie 或认证头以在 curl 或其他客户端中复用。如果某个检查似乎需要原始凭据，那检查本身就是错的——将其重塑为在页面内运行的形式。

## 这能证明什么

- 页面上下文中的 `fetch` 证明了该会话的同源认证请求行为。
- DOM 检查或截图证明了加载页面的实际渲染结果。
- 控制台/网络观察在 DevTools 语义重要时支持调试。

在必要时说明限制：仅 API 的页面上下文检查不能证明 UI 布局、完整用户交互或外部通知，除非这些被单独观察。当页面上下文请求成功但用户可见结果在浏览器之外（邮件、聊天、推送）时，暂停并索要缺失的观察，而非推断成功。

## 设置

使用一个专用配置文件，与用户的日常浏览器隔离。该配置在任务间持久化，因此用户通常只需每台机器/账户登录一次。

```bash
./scripts/browser-session.sh 'https://example.com'
```

从其他目录调用脚本（`browser-session.sh`，以及下面的 `page-js.mjs`）时，请使用本技能文件夹的绝对路径。

该脚本仅在验证拥有浏览器进程确实使用专用配置文件启动（`--user-data-dir=$HOME/.agentcorp/browser-session-profile`）后，才会采用已监听的 CDP 端点；如果另一个浏览器占用了该端口——包括用户日常启动的带 `--remote-debugging-port` 的 Chrome——它会拒绝并提示你通过 `AGENTCORP_BROWSER_PORT` 换一个端口。在手动探测 CDP 时，你也应遵守同样的规则：绝不要对配置文件未经核实的端点运行页面 JS（见故障排查）。

如果网站显示登录页面，请清晰地解释：

> 我已打开一个用于 Agent 工作的独立浏览器配置文件。请在那里登录；我不会读取你的 cookie 或密码。在你确认页面已登录后，我可以运行使用浏览器会话的页面内检查。

仅在用户确认登录后继续。

配置参数（不同端口：`AGENTCORP_BROWSER_PORT=9333 ./scripts/browser-session.sh ...`；旧版 `CHROME_COOKIE_JS_PROFILE/HOST/PORT` 变量仍可作为旧本地设置的回退）：

```bash
AGENTCORP_BROWSER_PROFILE="$HOME/.agentcorp/browser-session-profile"
AGENTCORP_BROWSER_HOST="127.0.0.1"
AGENTCORP_BROWSER_PORT="9222"
AGENTCORP_BROWSER_BIN="/Applications/Google Chrome.app"
```

## 运行页面 JavaScript

```bash
node ./scripts/page-js.mjs --url 'https://example.com/app' --eval 'document.title'
node ./scripts/page-js.mjs --url 'https://example.com/app' --file /tmp/auth-check.js   # 较大检查：任务本地脚本
```

对请求探针使用异步 IIFE：

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

优先使用只读探针（`--eval 'location.href'`）。在任何会写入数据、触发工作流、发送通知、启动任务或修改远程状态的页面 JS 之前，声明：目标环境和 URL；确切的端点或操作；确切的载荷或人类可读 diff；预期结果和证据；恢复/清理计划（或为什么不需要）。除非用户在当前任务中明确授权此类操作，否则不要继续。

绝不要打印秘密。在保存证据前，对 URL 认证参数、token、临时凭据、cookie 和敏感响应字段进行脱敏。

## 证据格式

记录足够用于重放的信息：页面 URL、标题、环境、账户（引用方式）；命令或脚本路径；请求方法/路径/主体（脱敏后的秘密）；响应状态码/内容类型/主体摘要；时间戳和追踪/请求 ID（如有）；会话无法直接观察的内容，以及手动观察点（邮件/聊天/推送）。

在呈示证据前自查：会话属于专用配置文件——已验证，非假设；任何保存的工件中不存在凭据材料；每次写入均已声明并授权；证据所能证明的范围与声明并列。

## 红旗——当你察觉自己这样想时立即停下

| 想法 | 现实 |
| --- | --- |
| "这个端口上已有 CDP 端点——附加过去能省一次启动。" | 它可能是用户的日常 Chrome。先验证进程是否运行专用配置文件，或换一个端口。 |
| "`document.cookie` 不是 cookie 数据库，所以规则不适用。" | 该禁令禁止的是提取，不只是磁盘文件。通过会话读取凭据是同样性质的违规，只是步骤更少。 |
| "把 token 复制到 curl 里会更快。" | 一旦 token 离开浏览器，承诺即告破裂——而且结果也不再证明浏览器会话行为。 |
| "fetch 返回了 200，所以功能正常。" | 200 只证明请求路径。UI 渲染、通知和下游任务需要各自的观察。 |
| "只是一个测试端点的小 POST；声明是多余的。" | 每一次远程变更都需要声明和授权。针对错误环境的小写入正是事故的开端。 |
| "用户肯定已经登录完了。" | 仅在用户明确确认后继续。半登录会话会以安静的方式产生错误的证据。 |

## 故障排查

对你实际启动时使用的主机/端口检查 CDP 可用性：

```bash
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/version"
curl -sS --max-time 3 "http://${AGENTCORP_BROWSER_HOST:-127.0.0.1}:${AGENTCORP_BROWSER_PORT:-9222}/json/list"
```

- `/json/version` 失败：使用 `browser-session.sh` 启动专用配置文件。
- CDP 已可用：在运行任何页面 JS 前确认端点属于专用配置文件——浏览器进程命令行必须包含 `--user-data-dir=$HOME/.agentcorp/browser-session-profile`（`ps ax | grep -- "--remote-debugging-port=9222"`，替换为你的端口）。如果另一个浏览器占用了该端口，请换端口而非附加。
- 端口在监听但不是 Chrome CDP：换一个端口。
- 登录重定向或 SSO 出现：请用户在专用配置文件中完成登录。
- 哈希路由 SPA：传递包含 `#/route` 的完整 URL。
- 浏览器警告：捕获它们，但除非警告阻止了请求行为，否则从请求行为判断成功与否。