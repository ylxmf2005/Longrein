---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: adversarial-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Specialist Review Findings

## Findings

### Finding 1: <title — name the scenario>

- Severity: <critical | major | minor>
- Confidence: <numeric, per the bands in SKILL.md>
- Evidence: <trigger → path → failure state; anchored to file:line for code, or a section heading / requirement ID for a plan or design>
- Impact: <what the failure costs when it lands>
- Recommendation: <one line; the fix belongs to its owner>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a single-component bug, a known vulnerability pattern, a missing timeout) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Write "None" when there are none.

## Residual risks

- What was deliberately not stressed, plus held severe-if-real concerns (one line each, marked unconfirmed). Write "None" when there are none.
