---
artifact_type: PhaseAssignment
task_id: example-task-20260603-120000
task_root: teamspace/tasks/example-task-20260603-120000/
from_agent: delivery-orchestrator
to_agent: example-agent
phase: example-phase
status: assigned
output_path: review/example-output.md
---

# Assignment: example-phase

## Goal

说明本 phase 的目标。

## Inputs

- 所需的输入 artifact 或证据。

## Source Artifacts

- requirements/validated-requirements.md

## Constraints

- 语言、范围、环境和风险约束。

## Required Outputs

- 将 phase artifact 写入 `output_path`。
- 返回一个符合 `templates/phase-receipt.demo.md` 的 receipt。

## Stop Conditions

- 缺少必要输入、目标不清晰、环境不可用或风险不安全。
