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
- 证据: <具体的输入或状态，以及它在 file:line 处逐分支走过的路径>
- 影响: <错误的可观测结果，以及谁会遇到它>
- 建议: <修复方案；当缺少测试时，写明它——它的输入以及它应断言的结果>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处 security smell、一处 perf 风险、一处形状问题）——绝不展开，也绝不丢弃。没有就写 "none"。

## 证据缺失

- 没有就写 "none"。

## 残余风险

- 没有就写 "none"。
- 被抑制的低 confidence 发现项中，一旦为真会非常严重的写在这里：每条一行，标注 unconfirmed。
