# Requirements 产物 Demo

这份文件是 `shape/requirements.md` 的唯一结构来源。它把 Task 的用户承诺展开成可设计、可实现和可验证的详细需求；引用 `task.md` 中的 Goal、Scope、`UD-*` 与 Completion Evidence，不复制它们。

```markdown
# Requirements：<任务或能力>

## 来源与可信状态

- 对象与版本：<实际检查的产品、系统、代码或运行现场>
- Task Context：context r<revision> / scope r<revision> | not-applicable
- 用户承诺：<引用相关 UD-*、Goal、Scope 和 Completion Evidence>
- 需求状态：ready_for_design | needs_evidence | needs_decision

## 用户结果与当前问题

<谁在什么情境下遇到什么问题，准备取得什么可观察结果；说明当前行为与目标结果之间的差距。>

## 详细需求

| Requirement | 必须成立的行为 | 来源 | 可观察结果 |
| --- | --- | --- | --- |
| REQ-001 | <精确行为、规则或限制> | <UD-*、事实或证据> | <从哪个入口判断成立> |

## 场景与边界

- 正常路径：<关键用户或系统场景>
- 可信边界：<Task Operating Envelope 中真正需要成立的范围>
- 必须保持：<引用 Must Preserve 或现有契约>
- 明确不做：<引用 Non-goals；不在这里发明新范围>

## 需求关系与冲突

- 相互依赖：<哪些 REQ 必须共同成立>
- 真实冲突：<需求、现状、成本或既有契约之间的冲突；没有则写 none>
- 用户决定：<已确认的 UD-*；候选和推荐不能冒充决定>

## 开放问题与证据缺口

- <会改变需求或设计方向的问题、所需证据和 Owner；没有则写 none>

## 设计交接

- 设计是否仍需猜测用户结果或边界：yes | no
- 下一步：<应补决定、调查或在 `design.md` 中确定的系统关系>
```
