---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现

## 发现

### 发现 1: <title>

- 严重程度:
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据: <注释原文（或那个没被护住的边界）在 file:line，并拿改动之后的代码核过>
- 影响:
- 建议: <更紧的版本、修正、或建议的那句一行 why——可直接动手>

## 给其它 lane 的旁见

- 落在本 reviewer 问题之外的每一个真实问题各写一行（一个疑似 bug、一处 security 苗头、一个 perf 风险）——永不展开、也永不丢弃。没有时写 "None"。

## 证据缺口

- 没有时写 "None"。

## 残余风险

- 没有时写 "None"。
