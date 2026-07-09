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

- 场景、期望行为 vs 实际行为及通过/失败。每项都必须追溯到本会话中在真实目标上执行的请求或命令——不得推断，不得使用 stub。

## 已执行的命令

- 命令、环境、运行时的真实目标及结果。

## 证据

- 示例凭据（替换为真实凭据）：运行日志位于 `verification/test-results/run.log`，或下面的围栏输出摘录。
- 日志、请求/响应摘录或工件路径。每个凭据都必须可解析；不得在任何地方出现秘密。

## 失败

- 没有时填写“无”。

## 被阻塞的检查

- 每项未执行或无法执行的检查，附带具体缺少的内容。没有时填写“无”。

## 目击与计划修正

- 在指派检查范围之外观察到的实际问题，以及计划/文档与现实不符的地方（缺失端点、无法构建的请求）——每项一行。没有时填写“无”。

## 剩余风险

- 没有时填写“无”。