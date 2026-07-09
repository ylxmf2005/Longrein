---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家评审发现

## 发现

### 发现 1：<标题>

- 严重程度：<critical | major | minor>
- 置信度：<数值，按 SKILL.md 中的区间>
- 证据：<哪个依赖以何种方式失败、失败在 file:line 的传播路径、以及客户端或资源在何处构建>
- 影响：<可观察到的损害——挂起、崩溃、静默丢失、重复副作用>
- 建议：<绑定到具名失败路径的保护措施；仅在确认幂等后才建议重试>

## 其他通道的观察

- 本评审员问题之外的真实问题（功能 bug、安全气味、性能成本）每行一条——绝不展开，绝不丢弃。无则写 "None"。

## 证据缺口

- 无则写 "None"。
- Residual risk 下的每条记录，写下能确认或否定它的证据。

## 残余风险

- 无则写 "None"。
- 保留的低置信度架构顾虑：每行一条，标注为未确认。
