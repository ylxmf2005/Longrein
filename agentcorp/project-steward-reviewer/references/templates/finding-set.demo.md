---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: project-steward-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Project Steward Review Findings

## Findings

### Finding 1: <title>

- Severity: <P0 | P1 | P2 | P3>
- Confidence: <high | medium — low-confidence concerns are held, not written>
- Rubric dimension: <the stewardship-rubric dimension this was judged against>
- Long-term health impact: <who bears what future cost>
- Evidence: <file:line where code is involved; repo-wide negatives paste the search command and its result>
- Recommendation:
- Routing: <review-fixer | implementation-planner | solution-architect | release owner | human owner>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a suspected bug, a security smell, a perf risk) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
