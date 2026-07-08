---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现项

## 发现项

### 发现项 1: <title>

- 严重等级: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据:
- 影响:
- 建议:

## 证据缺失

- 没有就写 "none"。

## 残余风险

- 没有就写 "none"。
- 被抑制的低 confidence 发现项中，一旦为真会非常严重的写在这里：每条一行，标注 unconfirmed。
