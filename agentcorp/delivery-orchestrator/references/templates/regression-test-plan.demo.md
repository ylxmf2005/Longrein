---
artifact_type: TestPlan
component: regression
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# 回归测试手册：Example Title

## Blast radius

- 这次改动影响哪些模块与契约，为什么。

## 要跑的既有 suite

- 命令原文与通过标准：

  ```bash
  pytest tests/example -k "affected_area"
  ```

## 相邻检查

- REG-1（P1）：从受影响模块挑出的既有行为，入选理由、执行方式、通过标准。

## 新增回归检查

- 理想形态「改前失败、改后通过」；写明怎么构造、跑在哪。

## 证据

- 输出、exit code、产物路径。
