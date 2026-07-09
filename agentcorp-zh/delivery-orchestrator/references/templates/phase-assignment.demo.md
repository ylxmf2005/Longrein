---
artifact_type: PhaseAssignment
task_id: 20260603-120000-example-task
task_root: teamspace/tasks/20260603-120000-example-task/
from_agent: delivery-orchestrator
to_agent: example-agent
phase: example-phase
status: assigned
output_path: review/example-output.md
---

# 分配：example-phase

## 目标

陈述此阶段的目标。

## 输入

- 所需的输入制品或证据。

## 来源制品

- requirements/validated-requirements.md

## 约束

- 语言、范围、环境和风险约束。

## 要求输出

- 将阶段制品写入 `output_path`。
- 返回符合 `templates/phase-receipt.demo.md` 的回执。

## 停止条件

- 所需输入缺失、目标不明确、环境不可用或风险不安全。
