---
artifact_type: TestPlan
component: api
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# API 测试手册：示例标题

编写每项检查使其可直接执行：字面请求/SQL、期望结果、证据，以及失败时的处理方式。

## API-1 (P0): 检查名称

- 目的：需要证明的契约行为，映射到 FR-x / AC-y。
- 环境与前置条件：在哪里运行、需要什么数据。
- 执行：

  ```bash
  curl -sS -X POST 'https://example.local/api/items' -H 'Content-Type: application/json' -d '{"name": "demo"}'
  ```

- 期望结果：状态码、响应结构、关键断言。
- 证据：需要保留的内容（请求/响应摘要、日志位置、制品路径）。
- 失败处理：停止 / 标记为阻塞 / 继续并记录。

## 数据与迁移检查

- DATA-1 (P0): 字面验证 SQL、前后对比、回滚或可重入标准，以及证据。
