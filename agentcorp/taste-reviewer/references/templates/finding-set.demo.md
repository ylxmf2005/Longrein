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

- Severity: <critical | major | minor>
- Confidence: <numeric, per the bands in SKILL.md>
- Evidence: <the hack construct at file:line, plus what your greps of the type / call sites / schema showed>
- Impact: <what leaving the hack costs over time>
- Recommendation: <the honest shape and its price>

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
- Held low-confidence concerns that would be critical if real go here: one line each, marked unconfirmed. Existence concerns ("should this feature exist at all") also go here, one line each.
