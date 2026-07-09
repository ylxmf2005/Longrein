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

- 场景、预期 vs 实际行为，以及 pass/fail。每一条都能追溯到"已执行的命令"下、你在本会话中对真实目标执行过的某个请求或命令——没有推断出来的，没有来自 stub 的。

## 已执行的命令

- 命令、环境、它对着跑的真实目标，以及结果。

## 佐证材料

- 示例句柄（替换为真实值）：运行日志 `verification/test-results/run.log`，或下方代码块中的输出片段。
- 日志、请求/响应片段或 artifact 路径。每个句柄都必须能解析；任何地方都不出现 secret。

## 失败项

- 没有就写 "None"。

## 被阻塞的检查

- 每一项未跑或跑不了的检查，连同究竟缺什么。没有就写 "None"。

## Sightings and plan corrections

- 在指派检查之外观察到的真实问题，以及计划或文档与疆域不符之处（endpoint 缺失、请求无法构建）——每条一行。没有就写 "None"。

## 残余风险

- 没有就写 "None"。
