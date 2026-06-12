---
artifact_type: TestingContext
project: example-project
maintained_by: test-planner
updated: 2026-06-03
---

# Example Project 测试上下文

## 入口与访问

- pre 环境：`https://example.local/app`；登录方式：已登录 Chrome 会话（凭据只写引用，不写密文）。

## 页面地图

- 任务列表页 `/app/tasks`——产品主入口；核心操作：新建任务、搜索、进入详情。
  - 任务列表页 --点击「新建」--> 创建对话框
  - 任务列表页 --点击任务行--> 任务详情页 `/app/tasks/<id>`
- 任务详情页——查看执行状态与产物；核心操作：下载产物、重跑。

## 核心用户 flow

- FLOW：从零创建一个任务并拿到产物（`已实走`，2026-06-03）
  - 前置：已登录；无需既有数据。
  - 步骤：任务列表页点「新建」→ 对话框输入 prompt → 提交跳详情页 → 等状态变成功 → 下载产物。
  - 踩坑：prompt 为空时提交按钮置灰，自动化要先断言可点。

## 可观测面

- API：`/api/tasks` 系列；响应统一 BaseResponse（trace_id/code/message/data）。
- DB：MDB 只读；`tasks` 表按 task_id 查。
- 日志：CLS 按 trace_id 检索。

## 测试数据惯例

- 在<需要造测试任务>时 → 用 title 前缀 `e2e-` 创建 → 因为清理脚本按该前缀回收。
- 绝不能动：演示账号 demo@example 下的数据。

## 已知限制

- 测试池路由未切时，执行链路证据只能到 Manager 层。

## 待补缺口

- 设置页未探索（上轮被权限墙挡住）。

## 已废弃

- （过期条目挪到这里，注明废弃原因与日期，不直接删。）
