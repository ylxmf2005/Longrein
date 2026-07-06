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

- 必要的输入 artifact 或 evidence。

## Source artifacts

- requirements/validated-requirements.md

## Constraints

- 语言、范围、环境及风险约束。

## Required outputs

- 将 phase artifact 写入 `output_path`。
- 返回一份与 `templates/phase-receipt.demo.md` 格式一致的 receipt。

## Stop conditions

- 必要输入缺失、目标不清晰、环境不可用，或风险不安全。
