---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: api-contract-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专业审查发现

## 发现

### 发现 1：<标题>

- Severity: <critical | major | minor>
- Confidence: <数值，按 SKILL.md 中的置信度区间>
- Evidence: <发生变化的调用方可感知的承诺，位于 file:line，以及你对其调用方所做的检查>
- Impact: <哪些消费者会崩溃，以及崩溃的隐蔽性>
- Recommendation: <缺失的迁移路径，或需要固定的形状/语义>

## 其他车道目击

- 每条本审查范围之外的真实问题一行（边界后的实现 bug、安全味道、性能风险）——绝不展开，绝不遗漏。没有时填写“无”。

## 证据缺口

- 你未能验证的所有内容，逐项列名（外部调用方、序列化映射、缺失的测试员证据）。当缺口阻碍兼容性判断时，回执状态为 `needs_more_evidence`。没有时填写“无”。

## 剩余风险

- 没有时填写“无”。