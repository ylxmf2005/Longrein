---
artifact_type: TestPlan
component: api
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# API 测试手册：示例标题

编写每条检查使其可直接执行：逐字的请求/SQL、预期结果、证据和失败处理。

## API-1 (P0)：检查名称

- 目的：要证明的契约行为，对应 FR-x / AC-y。
- 环境和前置条件：在哪里运行、需要什么数据。
- 执行：

  ```bash
  curl -sS -X POST 'https://example.local/api/items' -H 'Content-Type: application/json' -d '{"name": "demo"}'
  ```

- 预期：状态、响应形态、关键断言。
- 证据：要保留的内容（请求/响应摘要、日志位置、产物路径）。
- 失败处理：停止 / 标记阻塞 / 继续并记录。

## 数据和迁移检查

- DATA-1 (P0)：逐字的验证 SQL、前后对比、回滚或重新进入标准、证据。