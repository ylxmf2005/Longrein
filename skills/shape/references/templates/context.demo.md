# Context 产物 Demo

`context.md` 是当前任务承诺与产物入口的唯一来源，由 Shape 直接创建和修订。Original Request 保留输入，Goal、Scope 和 Non-goals 表达用户当前同意承担的结果与边界；Current Artifacts 只列当前有效的专业产物，专业产物不能反向改写任务承诺。

没有 Git 对象时省略对应 ref。尚未取得用户承诺的内容保持 `unresolved`，不根据 Agent 的理解补齐。

```markdown
---
source_ref: <调查与比较的起点>
target_ref: <结果准备进入的目标>
working_branch: <当前工作分支>
---

# Context：<任务>

## Original Request

<在不增加意图的前提下，用用户原话忠实组成当前请求。>

来源：<原始消息或 transcript 位置>

## Goal

<用户已经明确或确认的可观察结果；尚未成立时写 unresolved。>

## Scope

<用户已经明确或确认由本任务负责的行为、对象、约束与保持边界；尚未成立时写 unresolved。>

## Non-goals

<用户已经明确或确认不由本任务负责的内容；尚未成立时写 unresolved。>

## Current Artifacts

- `<当前有效产物的路径>`
```
