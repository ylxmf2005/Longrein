---
artifact_type: TestPlan
component: regression
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# 回归测试手册：示例标题

## 爆炸半径

- 此变更影响的模块和契约，以及为什么。

## 要运行的现有套件

- 逐字命令和通过标准：

  ```bash
  pytest tests/example -k "affected_area"
  ```

## 相邻检查

- REG-1 (P1)：从受影响模块选出的已有行为——纳入理由、运行方式和通过标准。

## 新回归检查

- 理想形式为“变更之前失败，变更之后通过”；说明如何构造以及在哪里运行。

## 证据

- 输出、退出码、产物路径。