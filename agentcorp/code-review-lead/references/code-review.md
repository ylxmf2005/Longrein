# Local code review reference

How to grade findings and settle the decision — the criteria the Code Review Lead is held to, not the layout format. Reviewer selection (the five always-on dimensions and the risk-triggered specialists) lives in SKILL.md "Who you convene": add specialists by the change's actual risk, never all-on by default.

## Grading findings

The grading basis is "whether there is an actionable failure path," not how many reviewers a finding came from.

- **Must-fix**: reproducible behavior bugs; security or data-loss risks; contract-breaking changes; violations of explicit requirements; out-of-scope semantic/contract changes that cannot be traced to approved source artifacts; steward findings that would write a wrong long-term commitment into the project's core; and any review blocker that would prevent meaningful verification.
- **Suggested fixes**: maintainability, reliability, performance, coverage, or long-term maintenance risks with a plausible failure mode; or a sound change hygiene finding that should be split out of this MR/PR.
- **Optional**: useful cleanups that do not block delivery.
- **Overruled**: style opinions, duplicates, pre-existing problems unrelated to this change, and speculation with no actionable path.

Specialist `Confidence` values are 0–1 self-calibrations with role-specific reporting floors (security reports from 0.60 up; most other roles hold anything below 0.60) — read them as triage priority, never as evidence: grading still turns on the actionable failure path.

When merging duplicate findings, file them under the one with the strongest evidence and the most precise file:line.

## Decision

- `approve`: no must-fix findings remain; verification can proceed.
- `request_changes`: one or more must-fix findings remain.
- `needs_more_evidence`: the review cannot be completed because the diff, requirements, test, or design context is missing — and a named evidence request could unblock it.
- `blocked`: the review cannot proceed at all and no evidence request would unblock it (for example, the diff or worktree is unavailable, or the phase itself is cancelled).

High-stakes changes (security/permission boundary, public/shared contract, data-loss/irreversible release) take one cross-family second opinion before the decision — the full rule is in SKILL.md "Your output"; the conclusion stays the Code Review Lead's own.

Never claim a reviewer, command, or test ran without evidence.
