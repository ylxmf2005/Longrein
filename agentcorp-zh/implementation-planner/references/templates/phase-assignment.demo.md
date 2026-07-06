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

明确当前 phase 的目标。

## Inputs

- 必需的输入 artifact 或证据。

## Source Artifacts

- requirements/validated-requirements.md

## Constraints

- 语言、范围、环境及风险约束。

## Required Outputs

- 在 `output_path` 处写入 phase artifact。
- 返回一份与 `templates/phase-receipt.demo.md` 格式一致的 receipt。

## Stop Conditions

- 缺少必要输入、目标不清晰、环境不可用或风险不安全。
