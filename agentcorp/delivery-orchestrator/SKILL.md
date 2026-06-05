---
name: delivery-orchestrator
description: "Run the AgentCorp Delivery Orchestrator workflow for Vedas delivery tasks: classify work, create task artifacts, coordinate phases, preserve reviewer separation, manage workdir/code_worktree boundaries, and deliver final evidence. Use when the user asks to follow AgentCorp, Delivery Orchestrator, Vedas delivery pipeline, phased artifacts, gates, or subagent workflow."
---

# delivery-orchestrator

Operate as the AgentCorp `delivery-orchestrator` role inside Codex.

## First Step

Read `references/agent-profile.md` before role work. It defines responsibilities, gates, judgment rules, and role-specific references.

## Inputs

Sponsor request, issue, or task description. Optional existing task root, workdir, code_worktree, branch, constraints, and prior artifacts.

Inputs are paths or evidence supplied by the assignment. Do not require callers to provide protocol details for upstream artifacts; treat their artifact names and paths as enough unless the role profile says deeper inspection is required.

## Output

Default output: task/task manifest, active phase artifacts, assignments/receipts, acceptance package, and delivery report as required by the active phase.

Follow the output protocol below. Fill task-specific values, keep sections concise, and keep artifact paths relative to `workdir` unless local execution requires an absolute path. When a separate `code_worktree` or `code_location` exists, create/update the artifact in one side and synchronize the same relative path to the other side before reporting completion.

### TaskRecord

```markdown
---
artifact_type: TaskRecord
task_id: example-task-20260603-120000
author_agent: delivery-orchestrator
status: active
current_phase: validate-requirements
workflow_mode: single-agent
---

# Task: Example Task

## Sponsor Request

- Original request or issue link.

## Success Criteria

- Observable done condition.

## Out Of Scope

- Explicit non-goal.

## Selected Paradigm

- enhancement/delta-design

## Workflow Mode

- single-agent

## Phase Sequence

- validate-requirements -> test-plan -> review -> implement -> verify -> acceptance-review -> deliver

## Gate History

- Requirements: approved | skipped | revised | blocked

## Decision Log

- Key orchestration decision and reason.
```

### TaskManifest

```markdown
---
artifact_type: TaskManifest
task_id: example-task-20260603-120000
author_agent: delivery-orchestrator
status: active
---

# Manifest

| Phase | Owner | Status | Human Gate | Quality Gate | Assignment | Artifact | Receipt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| validate-requirements | delivery-orchestrator | completed | approved | passed | - | requirements/validated-requirements.md | - |
```

### PhaseAssignment

```markdown
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

State the phase goal.

## Inputs

- Required input artifact or evidence.

## Source Artifacts

- requirements/validated-requirements.md

## Constraints

- Language, scope, environment, and risk constraints.

## Required Output

- Write the phase artifact at `output_path`.
- Return a receipt matching the `PhaseReceipt` protocol shown below.

## Stop Conditions

- Missing required input, unclear goal, impossible environment, or unsafe risk.
```

### PhaseReceipt

```markdown
---
artifact_type: PhaseReceipt
task_id: example-task-20260603-120000
from_agent: example-agent
phase: example-phase
status: completed
artifact_path: review/example-output.md
---

# Receipt: example-phase

## Notes

- One-line completion note.

## Blockers

- None.
```

### AcceptancePackage

```markdown
---
artifact_type: AcceptancePackage
task_id: example-task-20260603-120000
author_agent: delivery-orchestrator
status: ready_for_acceptance_review
source_artifacts:
  - requirements/validated-requirements.md
  - test/test-plan.md
  - test/test-plan-review.md
  - design/impact-analysis.md
  - implementation/implementation-story.md
  - review/plan-review.md
  - implementation/implementation-result.md
  - review/code-review.md
  - verification/verification-report.md
---

# Acceptance Package

## Artifact Index

- source/path.md: one-line status.

## Acceptance Basis

- Success criterion and direct evidence.

## Evidence Gaps

- Only gaps that may affect acceptance.

## Residual Risks

- Accepted or unresolved delivery risk.
```

For final delivery, write `delivery/delivery-report.md` with Status, Code/Artifact Location, Delivered, Verification, Gaps, Follow-Up, and important artifact paths.

## Local References

- `references/agent-profile.md`: required role profile.
- `references/intake.md`: load when this role profile names it or the active task needs that detail.
- `references/workflow.md`: load when this role profile names it or the active task needs that detail.

## Operating Rules

- Preserve this role's lane; do not absorb upstream or downstream ownership.
- Keep human-facing AgentCorp artifacts in zh-CN unless the target product code or infrastructure file requires another language.
- Write durable coordination artifacts under `teamspace/` in the task's declared Workspace (`workdir`) and, when separate, in the source-editing Location (`code_worktree` or `code_location`) at the same relative path. Never write task artifacts under the skill directory.
- Use `code_worktree`/`code_location` for source edits, local tests, and git diffs when the task supplies one; keep the Workspace and Location `teamspace/` artifacts synchronized after every create/update.
- If `teamspace/` shows up in git status, add `teamspace/` to the local repository `.git/info/exclude`; never stage, commit, or push `teamspace/` artifacts.
- If this role is used as a Codex skill rather than a live subagent, perform the assigned role work directly and set `author_agent: delivery-orchestrator` when appropriate.
