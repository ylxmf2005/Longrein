---
artifact_type: CodeReviewDecision
task_id: 20260603-120000-example-task
author_agent: code-review-lead
status: approve
source_artifacts:
  - path/to/source.md
---

# Review decision

## Decision

approve | request_changes | needs_more_evidence | blocked

## Must-fix

- Each must-fix carries its failure path, the file:line, and why it matters; duplicates merged under the strongest evidence. Write "none" when there are none.

## Suggested fixes

- Write "none" when there are none.

## Specialist reviews

- One line per lane convened: name + finding-set path (e.g. Correctness Reviewer — review/specialist-findings/correctness-reviewer.md).
- For each always-on lane skipped: the reason, recorded as an accepted residual risk.

## Evidence gaps

- Write "none" when there are none.

## Residual risk

- Write "none" when there are none.

## Next owner

- The agent or human responsible for the next action.
