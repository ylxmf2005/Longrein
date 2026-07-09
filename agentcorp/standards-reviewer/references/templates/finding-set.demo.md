---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: standards-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Standards Review Findings

## Findings

### Finding 1: <title>

- Severity: <critical | major | minor>
- Confidence: <numeric, per the bands in SKILL.md>
- Violated rule (exact quote, with standards file and section):
- Violation (file path and line(s) in the diff):
- Impact:
- Recommendation:

## Sightings for other lanes

- One line per real problem outside this reviewer's question (unwritten-but-harmful practice, a suspected bug, a rule that itself looks wrong) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
- Pre-existing violations on lines the diff does not touch go here, one line each, tagged `pre_existing`.
