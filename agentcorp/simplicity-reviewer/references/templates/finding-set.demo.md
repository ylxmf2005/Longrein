---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: simplicity-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Specialist Review Findings

## Findings

### Finding 1: <title — include the four-question label when one applies: `out-of-scope addition` | `reinventing the wheel` | `premature extraction` | `dead code` | `out-of-scope complexity`>

- Severity: <critical | major | minor>
- Confidence: <numeric, per the bands in SKILL.md>
- Evidence: <file:line, plus the exact commands you ran (grep for callers / existing implementations) and what they returned>
- Impact: <who pays for this complexity, and when>
- Recommendation: <the simpler structure, and why the required behavior and acceptance criteria survive it>

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a suspected bug, formatting/history residue, a security smell) — never developed, never dropped. Write "None" when there are none.

## Evidence gaps

- Name each check that was genuinely impossible to run from here. Write "None" when there are none.

## Residual risks

- Write "None" when there are none.
