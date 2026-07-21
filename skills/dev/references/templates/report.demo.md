# Dev Report 产物 Demo

这份文件是 `dev/report.md` 的唯一结构来源。它保存一次有意义的 Dev 交接或实现终态：已经交付什么行为，变化传播到哪些代码、契约消费者、文档和生成物，哪些实现判断由现场证据形成，做过什么聚焦验证，以及还剩什么缺口。全部 Phase 的当前状态、结果和证据只维护在任务根目录 `plan.md`，这里不复制进度表。

```markdown
# Dev Report：<任务或变化>

## 交付上下文

- 实现对象：<repo、worktree、revision、未提交差异或构建物>
- Task Context：context r<revision> / scope r<revision> | not-applicable
- Requirements：<实际使用的 `shape/requirements.md` 或 not-applicable>
- Design：<实际使用的 `shape/design.md` 或 not-applicable>
- Plan：<实际使用的 `plan.md` 或 not-applicable>
- 报告状态：partial | blocked | completed | superseded

## 已交付行为

<从用户或调用者可观察入口说明当前已经成立的行为、失败语义和必须保持的结果。不要只列文件。>

## 变化与传播

| 表面 | 实际变化 | 来源与必要性 |
| --- | --- | --- |
| `<代码、接口、调用者、文档、schema、Swagger、生成物或测试路径>` | <修改了什么行为、结构或契约表达> | <REQ-*、AD-*、Plan Phase、finding 或根因> |

## 实现判断

- <现场证据支持的局部实现选择、复用、收缩或保持决定>
- <实现反馈形成或拆分了哪些 AD；只链接修订后的 design、contract、migration 等源产物，不在这里复制决定正文；没有则写 none>

## 当前模型与阶段审查

- 源产物修订：<实际更新的 requirements、design、contract、migration、Plan 及原因；没有则写 none>
- 用户决定：<实现中取得或仍待取得的 UD；讨论、知悉和未反对不能冒充决定；没有则写 none>
- Phase Review：<已经完成的轻量审查对象、裁决和报告/证据入口；并入最终审查时说明>
- 最终 Review：<完整交付审查状态与入口；尚未运行时写 pending>

## 聚焦验证

| 检查 | 对象或环境 | 结果 | 证明边界 |
| --- | --- | --- | --- |
| `<command / check>` | <实际目标> | passed \| partial \| failed | <证明了什么、未证明什么> |

## 剩余缺口与风险

- <尚未实现、未验证、仍需独立 Review/Test 或由其他 Owner 承担的内容；没有则写 none>

## 交接

- 下一位：<dev、review、test、shape、owner 或其他>
- 下一入口：<应读取的 Plan Phase、代码、报告、缺陷重放或验证入口>
```
