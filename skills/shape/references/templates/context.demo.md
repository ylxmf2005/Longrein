# Context 产物 Demo

`context.md` 是显式 Task 的任务承诺与当前入口，由 Shape 在新 Task 开始时直接创建，并在方向或承诺变化时修订。Original Request 保留输入；Reality Coordinates 保存已查明的现实；Goal、Scope、Non-goals 与 Acceptance Evidence 只表达用户当前同意承担的结果、边界和验收证据边界。Current Artifacts 只列当前有效路径，专业产物不能反向改写任务承诺。

Acceptance Evidence 固定要证明的可观察结果、终态和最低证据边界；Test 根据真实对象选择具体取证方法。操作授权遵循当前对话与 `AGENTS.md`，不把任务记录当作新增授权。

没有 Git 对象时省略对应 ref；三个 ref 都不适用时连同 YAML frontmatter 一并省略，不保留空的 `---`。涉及 Git 时，`source_ref` 和 `working_branch` 记录实际起点与现场，`target_ref` 记录用户意图中的目的地；不能从当前 checkout 反推承诺。依据用户请求和调查填写，尚不能确定的内容写 `unresolved`。恢复 Task 时核验环境和权限，不把旧现场当作当前事实。

```markdown
---
source_ref: <调查与比较的起点>
target_ref: <结果准备进入的目标>
working_branch: <当前工作分支>
---

# Context：<任务>

## Original Request

<在不增加意图的前提下，忠实保留或整理用户当前请求。>

来源：<原始消息或 transcript 位置>

## Reality Coordinates

- 实际对象：<代码、系统、数据、用户现场或其他真实对象>
- 基线与当前状态：<版本、ref、工作树、运行状态或已观察行为>
- 环境、权限与约束：<会影响方向或验证的事实；尚未查明时写 unresolved>

## Goal

<依据用户请求确定的可观察结果；尚不能确定时写 unresolved。>

## Scope

<本任务负责的行为、对象、约束与保持边界；尚不能确定时写 unresolved。>

## Non-goals

<本任务不负责的内容；尚不能确定时写 unresolved。>

## Acceptance Evidence

<要观察到的结果与终态、最低证据需要支持到哪里；具体入口和取证方法由 Test 根据真实对象选择。尚不能确定时写 unresolved。>

## Current Artifacts

<只列当前有效的产物路径；没有时留空。>
```
