---
artifact_type: TaskContext
task_id: 20260720-example-task
status: active
context_revision: 3
scope_revision: 1
workspace: /workspace/app/studio/tasks/20260720-example-task
repository: /workspace/app
source_ref: origin/main
working_branch: fix/example-task
target_ref: main
---

# Task Context: Example Task

新 Task 在 `status: shaping` 时可以把尚未确认的 Goal、Scope 或完成条件写成 `unresolved`，并在 Current Work 说明 Shape 正在调查什么；不要为了套用完整 demo 提前制造承诺。

## Goal

- 写出用户最终能够观察到的结果，不写实现动作。

## Scope

- 列出本次任务负责的行为、对象或边界。

## Non-goals

- 列出容易被顺手做掉、但本次明确不负责的内容。

## Completion Evidence

- [ ] 每一项都是可以检查的完成证据，而不是“代码已完成”。
- [ ] 需要评审或真实测试时，写明对应产物和通过条件。

## Must Preserve

- 写出不能破坏的现有行为、数据、接口或用户资产。

## Task Operating Envelope

| Dimension | Normal range | Credible edge | Explicit exclusion | Evidence |
| --- | --- | --- | --- | --- |
| 使用者与入口 | 已确认的正常调用者和入口 | 平台重试、多个 worker 等真实可达边界 | 没有可达路径的理论情况 | 代码、配置、运行记录或用户确认 |

只保留会改变本任务判断的 dimensions；不要为了填表制造并发、规模、安全或兼容问题。

## Assumptions And Evidence Gaps

- 写出会影响后续判断但尚未确认的事实，以及准备从哪里取得证据。

## Current Work

- Now: 当前正在完成的工作单元。
- Next: 下一位应读取哪些文件、完成什么判断。
- Waiting on: none；需要决定时写明由谁决定什么。

## Artifact Map

| Artifact | Status | What it establishes | Next consumer |
| --- | --- | --- | --- |
| `task.md` | active | 当前任务承诺、状态和产物入口 | all |
| `shape/shape.md` | approved | 方向、范围和用户决定 | design |
| `design/design.md` | ready | 架构、契约和实现路线 | dev, review |

只列真实存在或已经确定要创建的产物。专业正文留在对应产物中，这里只记录路径、可信状态、它确定了什么和下一位读者。

## Context Change Ledger

| Context revision | Scope revision | Kind | Source | Change | Approval | Invalidated artifacts |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | commitment | User request | 建立任务目标和初始边界 | explicit | none |
| 2 | 1 | fact | Repository evidence | 修正会改变后续判断的项目事实 | not required | affected artifact paths |
| 3 | 1 | status | Completed work unit | 更新当前工作和产物状态 | not required | none |
