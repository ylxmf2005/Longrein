---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: adversarial-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现项

## 发现项

### 发现项 1: <title — 写明场景>

- 严重等级: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据: <触发条件 → 路径 → 失效状态；代码锚定到 file:line，计划或设计锚定到章节标题 / 需求 ID>
- 影响: <失效落地时的代价>
- 建议: <一行；修复归它的 owner>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处单组件 bug、一个已知漏洞模式、一处缺失的 timeout）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 没有就写 "None"。

## 残余风险

- 刻意没有施压的部分，加上按住的一旦为真会非常严重的顾虑（每条一行，标注 unconfirmed）。没有就写 "None"。
