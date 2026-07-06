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

## Source artifacts

- requirements/validated-requirements.md

## Constraints

- 语言、scope、环境、风险等约束。

## Required output

- 在 `output_path` 下编写 phase artifact。
- 返回一份与 `templates/phase-receipt.demo.md` 格式一致的 receipt。

## Stop conditions

- 缺少必需的输入、目标不清晰、环境不可用，或风险不安全。
