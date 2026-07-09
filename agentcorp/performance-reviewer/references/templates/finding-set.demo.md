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
- Confidence: <numeric, per the bands in SKILL.md; a medium finding names the scale assumption it depends on>
- Evidence: <the construct at file:line, plus the sourced scale handle — constraint, schema, migration, or named document>
- Impact: <the cost at the sourced scale — latency, memory, throughput, resource exhaustion>
- Recommendation: <the fix; recommend caching only with evidence the uncached path is hot or slow>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a functional bug, a security smell, a reliability gap) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
- Suppressed low-confidence findings that would be an outage if real go here: one line each, marked unconfirmed.
