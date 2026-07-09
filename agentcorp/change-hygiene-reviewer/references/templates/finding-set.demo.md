---
artifact_type: SpecialistReviewFindingSet
task_id: 20260611-120000-example-task
author_agent: change-hygiene-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-diff.md
---

# Change Hygiene Review Findings

## Conclusion

- Verdict: clean | minor_noise | needs_cleanup | needs_human_intent
- Summary:

## Review scope

- Diff:
- Source artifacts:
- Reference loaded: diff-noise.md | scope-residue.md | neither loaded (state why)

## Mechanical scan

- Command:
- Verdict:
- Noise ratio:
- Categories:
- Write "not run" plus the reason when `diff-noise.md` was not loaded.

## Intent trace

| Change | Source artifact | Necessity | Compatibility impact | Verdict |
| --- | --- | --- | --- | --- |
| path/to/file:line | requirements / story / contract / diagnosis / review finding / test failure / user instruction / tool-required / none | required / optional / unknown | none / changed / unknown | keep / remove / split / ask-human |

## Findings

### Finding 1: <title>

- Severity:
- Confidence:
- Category: diff-noise | scope-residue | intent-trace-gap | contract-drift | mixed
- Evidence:
- Impact:
- Recommendation:

## Sightings for other lanes

- One line per real problem outside this reviewer's question (a suspected bug, a security smell, a perf risk) — never developed, never dropped. Write "none" if there are none.

## Mechanical changes worth keeping

- Write "none" if there are none.

## Intent needing originator confirmation

- Write "none" if there are none.

## Evidence gaps

- Write "none" if there are none.

## Residual risk

- Write "none" if there are none.
