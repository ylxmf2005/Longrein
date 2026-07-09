---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: standards-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Standards Review 发现项

## 发现项

### 发现项 1: <title>

- 严重等级: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 被违反的规则（逐字引用，注明 standards 文件与章节）:
- 违规位置（diff 中的文件路径与行号）:
- 影响:
- 建议:

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（未成文但有害的做法、一处疑似 bug、一条本身看起来就有问题的规则）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 没有就写 "None"。

## 残余风险

- 没有就写 "None"。
- diff 未触及的行上的既有违规写在这里：每条一行，标注 `pre_existing`。
