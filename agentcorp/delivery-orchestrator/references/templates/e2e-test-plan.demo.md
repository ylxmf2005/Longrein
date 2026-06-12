---
artifact_type: TestPlan
component: e2e
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# E2E 测试手册：Example Title

## 执行形态

- 默认：浏览器操作为主证（真实浏览器、已登录会话），截图与页面状态是主证据，API/DB/日志为辅证。
- 降级：仅当此处显式声明；写明降级后哪些东西证明不了。

## 前置

- 入口 URL、登录方式（凭据只给引用）、测试数据准备（具体到对象 ID；上下文文档查不到的在此补）。

## FLOW-1（P1）：用户目标名

- Persona：Power user。覆盖：FR-x / AC-y。

| # | 页面/位置 | 操作（输入给原文） | 预期表现 | 取证 |
|---|---|---|---|---|
| 1 | 任务列表页 `<URL>` | 点击「新建任务」 | 弹出创建对话框 | 截图 |
| 2 | 创建对话框 | 在 prompt 输入框输入：`帮我把 README 翻译成英文` | 提交后跳转任务详情页 | 截图、记录 task_id |
| 3 | 任务详情页 | 等待执行完成 | 状态变为成功，产物可下载 | 截图；辅证 `GET /api/task/<id>` |

- Error path（同样逐步写）：

| # | 页面/位置 | 操作 | 预期表现 | 取证 |
|---|---|---|---|---|
| 1 | 创建对话框 | prompt 留空提交 | 行内报错，不发请求 | 截图、network 面板 |

- Blocked 条件：环境/路由/数据缺什么时，此 flow 标 blocked 并写明缺口。
