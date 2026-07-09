---
artifact_type: SpecialistReviewFindingSet
task_id: 20260611-120000-example-task
author_agent: change-hygiene-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-diff.md
---

# Change Hygiene Review 发现

## 结论

- Verdict: clean | minor_noise | needs_cleanup | needs_human_intent
- 概述：

## Review 范围

- Diff:
- Source artifacts:
- Reference loaded: diff-noise.md | scope-residue.md | neither loaded（说明原因）

## Mechanical scan

- Command:
- Verdict:
- Noise ratio:
- Categories:
- 未加载 `diff-noise.md` 时写 "not run" 并说明原因。

## Intent trace

| Change | Source artifact | Necessity | Compatibility impact | Verdict |
| --- | --- | --- | --- | --- |
| path/to/file:line | requirements / story / contract / diagnosis / review finding / test failure / user instruction / tool-required / none | required / optional / unknown | none / changed / unknown | keep / remove / split / ask-human |

## 发现

### Finding 1: <title>

- Severity:
- Confidence:
- Category: diff-noise | scope-residue | intent-trace-gap | contract-drift | mixed
- Evidence:
- Impact:
- Recommendation:

## 给其它 lane 的旁见

- 落在本 reviewer 问题之外的每一个真实问题各写一行（一个疑似 bug、一处 security 苗头、一个 perf 风险）——永不展开、也永不丢弃。没有则写 none。

## 值得保留的 Mechanical changes

- 没有则写 none。

## 需要原作者确认的 Intent

- 没有则写 none。

## Evidence gaps

- 没有则写 none。

## Residual risk

- 没有则写 none。
