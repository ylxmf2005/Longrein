---
artifact_type: TestExecutionResult
task_id: 20260603-120000-example-task
author_agent: example-tester
status: passed
source_artifacts:
  - verification/assignments/example-tester.md
---

# 测试结果

## 状态

passed | failed | blocked | partial

## 已执行的检查

- scenario 和结果，每一条 fixed-bug 或 at-risk-behavior 的 check 都附 before/after 观察——在 pre-change 代码上失败，在 post-change 代码上通过，或者把例外记在 Residual risk 下。

## 已执行的命令

- 命令、环境和结果——按原文可重放。

## 佐证材料

- 示例句柄（替换为真实值）：运行日志 `verification/test-results/run.log`，或下方代码块中的输出片段。
- 日志、screenshots、请求/响应片段或 artifact 路径。每个句柄都必须能解析。flaky 或依赖环境的结果要如实附上它们的重跑历史。

## 失败项

- 是哪条 check、什么输入、以及 before/after 观察。没有就写 "None"。

## 被阻塞的检查

- 每一条无法运行的被指派 check，连同究竟缺什么。没有就写 "None"。

## Sightings and plan corrections

- 在被指派 check 之外观察到的破损，以及 assignment 与疆域不符之处（repro 无法执行、flow 已消失、base commit 不对）——每条一行。没有就写 "None"。

## 残余风险

- 每一条 pre-change-state 例外，附上原因。没有就写 "None"。
