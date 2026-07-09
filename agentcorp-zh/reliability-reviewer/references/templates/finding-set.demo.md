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
- 证据: <哪个依赖失败、如何失败，该失败在 file:line 处走过的路径，以及 client 或资源在哪里构造>
- 影响: <可观测的损害——hang、崩溃、静默丢失、重复的副作用>
- 建议: <关联到具名 failure path 的防护；只有对已确认 idempotent 的操作才建议 retry>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处功能性 bug、一处 security smell、一处 perf 开销）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 没有就写 "None"。
- 对残余风险下的每一条，写明什么证据能证实或否定它。

## 残余风险

- 没有就写 "None"。
- 按住的低 confidence 架构层面顾虑写在这里：每条一行，标注 unconfirmed。
