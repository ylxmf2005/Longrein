---
artifact_type: TestPlan
component: api
task_id: example-task-20260603-120000
author_agent: test-planner
parent: test/test-plan.md
---

# API 测试手册：Example Title

每条检查写到可直接执行：请求/SQL 原文、预期、证据、失败处理。

## API-1（P0）：检查名

- 目的：要证明的契约行为，对应 FR-x / AC-y。
- 环境与前置：在哪跑、需要什么数据。
- 执行：

  ```bash
  curl -sS -X POST 'https://example.local/api/items' -H 'Content-Type: application/json' -d '{"name": "demo"}'
  ```

- 预期：status、响应形态、关键断言。
- 证据：要留什么（请求/响应摘要、日志位置、产物路径）。
- 失败处理：停止 / 标 blocked / 继续并记录。

## 数据与迁移检查

- DATA-1（P0）：核验 SQL 原文、before/after 对比、回滚或重入判据、证据。
