---
artifact_type: TestPlan
component: regression
task_id: 20260603-120000-example-task
author_agent: test-planner
parent: test/test-plan.md
---

# 回归测试手册：示例标题

## 爆炸半径

- 此变更影响哪些模块和契约，以及原因。

## 需要运行的现有套件

- 逐字命令和通过标准：

  ```bash
  pytest tests/example -k "affected_area"
  ```

## 邻近检查

- REG-1 (P1): 从受影响模块中选择的现有行为、选择原因、运行方式和通过标准。

## 新增回归检查

- 理想形态为"变更前失败、变更后通过"；说明如何构造及在何处运行。

## 证据

- 输出、退出码、制品路径。
