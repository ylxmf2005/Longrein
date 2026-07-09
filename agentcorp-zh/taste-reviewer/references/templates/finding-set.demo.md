---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专项审查发现

## 发现

### 发现 1：<标题>

- 严重度：<critical | major | minor>
- 置信度：<数值，按 SKILL.md 中的区间>
- 证据：<file:line 处的 hack 构造，以及你对类型 / 调用点 / schema 的 grep 结果>
- 影响：<保留该 hack 的长期代价>
- 建议：<诚实的正确形态及其代价>

## 其他车道 sighting

- 每条一行，写本审查员问题之外的真实问题（疑似 bug、安全异味、性能风险）——绝不展开，绝不省略。没有时写“None”。

## 证据缺口

- 没有时写“None”。

## 残余风险

- 没有时写“None”。
- 低置信度但如为真则属 critical 的担忧，每条一行，标记 unconfirmed。存在性担忧（“这个功能是否该存在”）也放在这里，每条一行。