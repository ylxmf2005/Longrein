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
- 置信度: <数值，按 SKILL.md 中的分档；0.60 是上报下限>
- 证据: <entry point → 无防护路径 → sink，锚定到 file:line，外加你对 middleware / ORM / config 的阅读所显示的内容>
- 影响: <攻击者由此得到什么>
- 建议: <在脆弱边界上的最小改动——不要 wrapper，也不要越界重写>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处功能性 bug、一处 perf 风险、一处 reliability 缺口）——绝不展开，也绝不丢弃。没有就写 "none"。

## 证据缺失

- 没有就写 "none"。

## 残余风险

- 没有就写 "none"。
- 被抑制的低 confidence 发现项中，一旦为真会是 critical 的写在这里：每条一行，标注 unconfirmed。
