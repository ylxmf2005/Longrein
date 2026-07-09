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
- Confidence: <numeric, per the bands in SKILL.md; 0.60 is the reporting floor>
- Evidence: <entry point → unguarded path → sink at file:line, plus what your reading of the middleware / ORM / config showed>
- Impact: <what the attacker gains>
- Recommendation: <the minimal change at the vulnerable boundary — no wrappers or out-of-scope rewrites>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a functional bug, a perf risk, a reliability gap) — never developed, never dropped. Write "none" when there are none.

## Evidence gaps

- Write "none" when there are none.

## Residual risks

- Write "none" when there are none.
- Suppressed low-confidence findings that would be critical if real go here: one line each, marked unconfirmed.
