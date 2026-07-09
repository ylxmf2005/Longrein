---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Specialist Review Findings

## Findings

### Finding 1: <title>

- Severity:
- Confidence: <numeric, per the bands in SKILL.md>
- Evidence: <the comment text (or the unprotected boundary) at file:line, checked against the code as changed>
- Impact:
- Recommendation: <the tighter version, the correction, or the proposed one-line why — apply-ready>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a suspected bug, a security smell, a perf risk) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
