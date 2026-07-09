---
artifact_type: CodeReviewDecision
task_id: 20260603-120000-example-task
author_agent: code-review-lead
status: approve
source_artifacts:
  - path/to/source.md
---

# 审查决定

## 决定

approve | request_changes | needs_more_evidence | blocked

## 必须修复

- 每条必须修复项都附带失败路径、file:line 位置以及为什么重要；重复项以最强证据合并。若无则写“无”。

## 建议修复

- 若无则写“无”。

## 专家审查

- 每 convened 车道一行：名称 + 发现集路径（如 正确性审查者 — review/specialist-findings/correctness-reviewer.md）。
- 对跳过的 always-on 车道：记录原因，作为已接受的残留风险。

## 证据缺口

- 若无则写“无”。

## 残留风险

- 若无则写“无”。

## 下一负责人

- 负责下一步行动的代理或人员。
