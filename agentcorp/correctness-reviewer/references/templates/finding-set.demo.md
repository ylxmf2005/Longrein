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
- Evidence: <the concrete input or state, and the branch-by-branch path it takes at file:line>
- Impact: <the wrong observable result and who hits it>
- Recommendation: <the fix; when a test is missing, name it — its input and the result it should assert>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a security smell, a perf risk, a shape problem) — never developed, never dropped. Write "none" when there are none.

## Evidence gaps

- Write "none" when there are none.

## Residual risks

- Write "none" when there are none.
- Suppressed low-confidence findings that would be severe if real go here: one line each, marked unconfirmed.
