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

- 每个 scenario 一条人类 tester 颗粒度的执行记录，按 `references/user-flow-testing.md` 里的 checklist——背景、精确的操作和逐字输入、requests/responses、亲眼观察到的东西、带 read-back 证明的清理、证据边界——绝不写只有 verdict 的一行。

## 已执行的命令

- 命令、环境和结果。

## 佐证材料

- 示例句柄（替换为真实值）：运行日志 `verification/test-results/run.log`，或下方代码块中的输出片段。
- 日志、screenshots、请求/响应片段或 artifact 路径。每个句柄都必须能解析。

## 失败项

- 失败的步骤和触发它的输入。没有就写 "None"。

## 被阻塞的检查

- 每一条未被驱动到 verdict 的被指派 flow，连同究竟缺什么；标为 `needs_more_evidence` 的 check 也放这里，并写明缺失的观察。没有就写 "None"。

## Sightings and plan corrections

- 在被指派 flow 之外观察到的 regression 或缺陷，以及手册与疆域不符之处（页面缺失、前置条件未指定、步骤无法执行）——每条一行。没有就写 "None"。

## 残余风险

- 没有就写 "None"。
