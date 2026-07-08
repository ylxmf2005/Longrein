---
artifact_type: VerificationReport
task_id: example-task-20260603-120000
author_agent: test-leader
status: approve
source_artifacts:
  - verification/test-results/e2e-tester.md
---

# Verification Report 示例

## Decision

approve | request_changes | needs_more_evidence | blocked

## What This Verification Proved

- 已获得直接证据的结论，每条按路径引用其结果文件。

## Failures and Blocked Checks

- 无则写 "None"。

## Result File Index

- `verification/test-results/<tester-slug>.md` — 每个被指派者一行：状态加最有力的证据句柄。

## Evidence Gaps and Unverified Areas

- 标为 `status=unverified` 的检查（缺环境、凭证、服务或数据）以及从未被执行过的区域；无则写 "None"。

## Residual Risk

- 已接受的风险（如有）。

## Next Owner

- 负责下一步动作的 agent 或人员。
