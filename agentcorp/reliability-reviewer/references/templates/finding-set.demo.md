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
- Evidence: <which dependency fails and how, the path the failure travels at file:line, and where the client or resource is constructed>
- Impact: <the observable damage — hang, crash, silent loss, duplicated side effect>
- Recommendation: <the protection tied to the named failure path; retries only on operations confirmed idempotent>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a functional bug, a security smell, a perf cost) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.
- For each entry under Residual risk, name the evidence that would confirm or kill it.

## Residual risk

- Write "None" when there is none.
- Held-back low-confidence architectural concerns go here: one line each, marked unconfirmed.
