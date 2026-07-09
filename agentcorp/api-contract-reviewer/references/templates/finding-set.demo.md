---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: api-contract-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Specialist Review Findings

## Findings

### Finding 1: <title>

- Severity: <critical | major | minor>
- Confidence: <numeric, per the bands in SKILL.md>
- Evidence: <the caller-visible promise that changed, at file:line, and what you checked about its callers>
- Impact: <which consumers break, and how silently>
- Recommendation: <the missing migration path, or the shape/semantics to pin down>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (an implementation bug behind the boundary, a security smell, a perf risk) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Everything you could not verify, by name (external callers, serialization mapping, missing tester evidence). When a gap blocks the compatibility call, the receipt status is `needs_more_evidence`. Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
