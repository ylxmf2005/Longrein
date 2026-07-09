---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: api-contract-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现项

## 发现项

### 发现项 1: <title>

- 严重等级: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据: <变化的 caller 可见承诺，锚定到 file:line，以及你对其 caller 核实过什么>
- 影响: <哪些 consumer 会破坏，以及破坏得有多悄无声息>
- 建议: <缺失的迁移路径，或需要敲定的 shape/语义>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（边界背后的一处实现 bug、一处 security smell、一处 perf 风险）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 逐一写明你无法核实的一切（外部 caller、serialization 映射、缺失的 tester 证据）。当某个缺口阻断兼容性判断时，receipt status 为 `needs_more_evidence`。没有就写 "None"。

## 残余风险

- 没有就写 "None"。
