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
- 置信度: <数值，按 SKILL.md 中的分档；一条 medium 发现项要写明它所依赖的规模假设>
- 证据: <file:line 处的那段构造，外加可溯源的规模依据——constraint、schema、migration 或点名的文档>
- 影响: <在可溯源规模下的代价——latency、内存、throughput、资源耗尽>
- 建议: <修复方案；只有在有证据表明未缓存路径确实热或确实慢时才推荐 caching>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处功能性 bug、一处 security smell、一处 reliability 缺口）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 没有就写 "None"。

## 残余风险

- 没有就写 "None"。
- 被抑制的低 confidence 发现项中，一旦为真会是一次事故的写在这里：每条一行，标注 unconfirmed。
