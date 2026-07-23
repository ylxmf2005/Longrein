# Plan 产物 Demo

这份文件是任务根目录 `plan.md` 的唯一结构来源。它是 Shape 与 Dev 共享的当前路线：把已经成立的需求和设计组织成可执行、可独立判断的工作阶段，并持续保存全部 Phase 的状态、当前结果和证据。它不复制 `shape/requirements.md`、`shape/design.md`、专业报告或 Task Current Work，也不把已经失效的路线留作历史。

```markdown
# Plan：<任务或变化>

## 来源与可执行性

- Task Context：context r<revision> / scope r<revision> | not-applicable
- Requirements：[`shape/requirements.md`](shape/requirements.md)
- Design：[`shape/design.md`](shape/design.md)
- Supporting artifacts：<实际依赖的 contract、migration、diagnosis 或 evidence；没有则写 none>
- 计划状态：active | blocked | completed | superseded
- 未决条件：<会迫使执行者自造范围、设计或判断标准的证据、决定或阻塞；没有则写 none>

## 推进策略

<说明怎样以最早反馈、较小传播面和真实依赖推进。指出研究、实现、评审或验证之间的关系，可以并行的工作、必须串行的边界以及高风险未知何时接触现实。>

## Phase P1 — <阶段名称>

- 状态：pending | in_progress | blocked | completed | superseded
- 目标结果：<完成后独立成立的事实、决定、能力、产物或验证结论>
- 追溯：<REQ-*、AD-*、Completion Evidence 或根因>
- Owner / Skill：<shape、dev、review、test、owner 或其他>
- 依赖：<前置 Phase、契约、迁移、环境或 none>
- 可并行：<可并行的 Phase 或 none>
- 输入与落点：<需要读取的产物、对象、模块、接口、数据边界或运行现场>
- 工作：<取得本阶段结果所需的调查、实现、评审或验证>
- 约束与保持：<引用必须稳定的契约、禁止区域和兼容要求>
- 完成检查：<本阶段 Owner 在结束时执行的检查及通过边界>
- 阶段审查：<包含实质实现时，Review 的实际对象、风险重点和结果入口；不适用或并入最终审查时说明依据>
- 下游证明入口：<交给后续 Skill、用户入口或终态观察>
- 反馈作用：<什么结果会确认、修订或阻塞后续 Phase>
- 当前结果与证据：<足以判断当前状态的简短结果和证据入口；详细结论链接所属专业产物；没有则写 none>

<保留全部当前有效 Phase。没有依赖冲突时可以同时有多个 `in_progress`。>

## 跨阶段风险与协调

- 新依赖：<影响及审查入口；没有则写 none>
- 数据迁移：<影响及退出路线；没有则写 none>
- 权限或认证：<影响及审查入口；没有则写 none>
- 公共或跨模块契约：<影响、消费者和传播工作；没有则写 none>
- 用户界面：<行为或设计影响；没有则写 none>

## 开放问题与失效条件

- <会改变阶段目标、边界、顺序、Owner、关键依赖或工作方向的问题；没有则写 none>

## 当前交接

- 可开始或继续的 Phase：<一个或多个没有未决依赖的 Phase>
- 各 Owner 应先读取：<具体路径和章节>
- 下一次判断入口：<最接近的反馈、检查、评审或用户决定>
```
