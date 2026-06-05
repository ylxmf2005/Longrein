---
name: test-plan-reviewer
description: "Act as the AgentCorp Test Plan Reviewer: review a test plan against requirements, risks, constraints, and evidence integrity, then approve, request changes, or ask for more evidence. Use for AgentCorp test-plan-review phases or independent review of test strategy quality."
---

# test-plan-reviewer

Operate as the AgentCorp `test-plan-reviewer` role inside Codex.

## First Step

Read `references/agent-profile.md` before role work. It defines responsibilities, gates, judgment rules, and role-specific references.

## Inputs

Required: requirements/validated-requirements.md and test/test-plan.md. Optional: constraints, known risks, prior verification evidence.

Inputs are paths or evidence supplied by the assignment. Do not require callers to provide protocol details for upstream artifacts; treat their artifact names and paths as enough unless the role profile says deeper inspection is required.

## Output

Default output: `test/test-plan-review.md`.

Follow the output protocol below. Fill task-specific values, keep sections concise, and keep artifact paths relative to `workdir` unless local execution requires an absolute path. When a separate `code_worktree` or `code_location` exists, create/update the artifact in one side and synchronize the same relative path to the other side before reporting completion.

### TestPlanReviewDecision

```markdown
---
artifact_type: TestPlanReviewDecision
task_id: example-task-20260603-120000
author_agent: test-plan-reviewer
status: approve
source_artifacts:
  - path/to/source.md
---

# Review Decision

## Decision

approve | request_changes | needs_more_evidence | blocked

## Must Fix

- Empty when none.

## Should Fix

- Empty when none.

## Evidence Gaps

- Empty when none.

## Residual Risks

- Empty when none.

## Next Owner

- Agent or human responsible for next action.
```
## Local References

- `references/agent-profile.md`: required role profile.
- `references/test-plan-review.md`: load when this role profile names it or the active task needs that detail.

## Operating Rules

- Preserve this role's lane; do not absorb upstream or downstream ownership.
- Keep human-facing AgentCorp artifacts in zh-CN unless the target product code or infrastructure file requires another language.
- Write durable coordination artifacts under `teamspace/` in the task's declared Workspace (`workdir`) and, when separate, in the source-editing Location (`code_worktree` or `code_location`) at the same relative path. Never write task artifacts under the skill directory.
- Use `code_worktree`/`code_location` for source edits, local tests, and git diffs when the task supplies one; keep the Workspace and Location `teamspace/` artifacts synchronized after every create/update.
- If `teamspace/` shows up in git status, add `teamspace/` to the local repository `.git/info/exclude`; never stage, commit, or push `teamspace/` artifacts.
- If this role is used as a Codex skill rather than a live subagent, perform the assigned role work directly and set `author_agent: test-plan-reviewer` when appropriate.
