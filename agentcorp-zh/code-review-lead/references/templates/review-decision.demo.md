---
artifact_type: CodeReviewDecision
task_id: 20260603-120000-example-task
author_agent: code-review-lead
status: approve
source_artifacts:
  - path/to/source.md
---

# Review 结论

## 结论

approve | request_changes | needs_more_evidence | blocked

## 必须修复

- 每条 must-fix 都带上它的 failure path、file:line 和为什么重要；重复项合并到证据最强的那条之下。没有就写 "none"。

## 建议修复

- 没有就写 "none"。

## Specialist reviews

- 每条召集过的 lane 一行：名称 + finding-set 路径（例如 Correctness Reviewer — review/specialist-findings/correctness-reviewer.md）。
- 每条被跳过的 always-on lane：跳过原因，作为已接受的 residual risk 记录下来。

## 证据不足

- 没有就写 "none"。

## 残留风险

- 没有就写 "none"。

## 下一负责人

- 负责下一步行动的 agent 或真人。
