# Design 产物 Demo

这份文件是 `shape/design.md` 的唯一结构来源。它把 `requirements.md` 中已经成立的需求变成可实现的系统模型，不承担实施排期；没有相应变化面时删去不适用章节，并说明检查依据，不为形式完整填满文档。

```markdown
# Design：<系统变化>

## 来源与设计状态

- 对象与版本：<实际检查的系统、代码、数据或接口>
- Task Context：context r<revision> / scope r<revision> | not-applicable
- Requirements：[`requirements.md`](requirements.md)
- 设计状态：ready_for_plan | needs_evidence | needs_decision | diagnosis_only

## 当前与目标模型

- 当前模型：<现状、根因或约束>
- 目标模型：<准备建立的系统形态；未授权实施时说明仍未决定的部分>
- 变化链：<当前模型怎样过渡到目标模型>

## 架构决定

### AD-001 — <决定标题>

- Decision：<关键专业判断>
- Based on：<UD-*、事实或证据>
- Rationale：<推荐理由>
- Alternatives：<真实替代及代价>
- Consequences：<实现、兼容、运维或长期影响>
- Status：active | supersedes AD-*

## 必须保持的契约

- 外部行为：<保持不变或明确改变的承诺>
- 所有权与权限：<事实归属和控制边界>
- 数据与状态：<字段、状态、转换、默认值和空值语义>
- 接口与错误：<输入、输出、失败、拒绝、冲突和重试语义>
- 兼容与安全：<旧调用者、身份、资源所有权和敏感数据边界>

## 精确系统形态

<按实际需要使用 schema、DDL、接口、状态机、权限表、时序或连续叙述。>

## 消费者、迁移与恢复

- 受影响消费者：<调用者、下游、运维或用户入口>
- 迁移与混合版本：<新旧形态怎样共存和退出；不适用时写检查依据>
- 失败恢复：<超时、半成功、重试、补偿和人工恢复>
- 回滚与发布：<撤回条件、数据影响和运行要求>

## 独立承重产物

- Contract：[`contract.md`](contract.md) | not-created
- Migration：[`migration.md`](migration.md) | not-created
- Diagnosis：[`diagnosis.md`](diagnosis.md) | not-created
- Evidence：[`evidence/`](evidence/) | not-created

## 可观察性与验证界面

- 实现可观察面：<日志、状态、接口、数据或用户入口>
- Dev 聚焦检查入口：<实现期间能够验证结构与局部行为的表面>
- Test 外部证明入口：<需要独立验证的用户结果、失败和终态>

## 开放问题与证据边界

- <会推翻模型的问题、所需证据及受影响的 AD 或 Plan Phase；没有则写 none>

## 交接

- 实现是否仍需猜测关键结构：yes | no
- 下一位：<owner、shape、grill、dev、review、test 或其他>
- 下一步：<应补决定、形成或修订 `plan.md`、执行、评审或验证什么>
```
