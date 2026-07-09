---
artifact_type: VerificationReport
task_id: 20260603-120000-example-task
author_agent: test-leader
status: approve
source_artifacts:
  - verification/test-results/e2e-tester.md
---

# 验证报告示例

## 决定

approve | request_changes | needs_more_evidence | blocked

## 本次验证证明了什么

- 现在有直接证据的声明，每条都引用其结果文件路径。

## 失败和被阻塞的检查

- 没有时写“None”。

## 结果文件索引

- `verification/test-results/<tester-slug>.md` —— 每个被指派者一行：状态加上最强证据 handle。列出的每个文件都存在于其路径，已被打开，其 handle 可解析；每个背后的指派都设置了 `task_root`、`output_path`，以及（当测试计划有时）其执行手册路径。

## 证据缺口和未验证区域

- 标记为 `status=unverified` 的检查（缺少环境、凭证、服务或数据）以及从未被演练的区域；没有时写“None”。

## 残余风险

- 已接受的风险，如有。

## 下一个所有者

- 负责下一步行动的智能体或人。