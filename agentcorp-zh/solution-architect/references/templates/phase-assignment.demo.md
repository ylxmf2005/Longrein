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

阐明本 phase 的目标。

## Inputs

- 必需的输入 artifact 或证据。

## Source artifacts

- requirements/validated-requirements.md

## Constraints

- 语言、范围、环境及风险约束。

## Required outputs

- 在 `output_path` 路径下编写 phase artifact。
- 返回一份符合 `templates/phase-receipt.demo.md` 格式的 receipt。

## Stop conditions

- 缺少必需输入、目标不清晰、环境不可用，或风险不可接受。
