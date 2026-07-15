---
artifact_type: ScopeChallengeReport
task_id: 20260603-120000-example-task
author_agent: scope-challenger
status: completed
disposition: stay-course
source_artifacts:
  - task.md
  - requirements/validated-requirements.md
---

# Scope Challenge — <主题>

## 触发声称

- Delivery Orchestrator 考虑改道，因为：<具体、可证伪的声称>。
- 受影响转换：<将改变或暂停的 phase/action>。

## 发起人目标与当前路线

- 可观测目标：<发起人需要成真的结果>。
- 当前/用户指定路线：<当前计划采用的机制或范围>。
- 已批准边界：<相关需求、Non-Goal、契约或 gate 记录>。

## 证据

| 声称 | 状态 | 证据 |
| --- | --- | --- |
| <声称> | 事实 / 推断 / 假设 | `<file:line>`、命令输出、commit 或 artifact 路径 |

## 反事实路线

| 路线 | 目标匹配度 | 范围与兼容性 | 迁移与验证成本 | 残余风险 | 可逆性 |
| --- | --- | --- | --- | --- | --- |
| 维持当前路线 | <判断> | <代价> | <代价> | <风险> | <判断> |
| 最小且结构上诚实的替代方案 | <判断> | <代价> | <代价> | <风险> | <判断> |
| 确有本质差异时的独立重构/spin-off | <判断或不适用> | <代价> | <代价> | <风险> | <判断> |

## 处置

恰好一种：`stay-course` | `surface-choice` | `reframe-required` | `needs-more-evidence`。

原因：<为什么证据值得这项处置，而不是只表达架构偏好>。

## 发起人简报

`stay-course` 时写：`None — 只记入 Scope Challenge Ledger，不打扰发起人。`

其它情况只提供 Delivery Orchestrator 需要呈现的内容：

- 证据改变了什么。
- 推荐路线及其代价。
- 其它可行选项及其代价。
- 等待发起人决定的确切转换。

## 证据缺口与独立工作

- 缺失证据：None | <仍未知的内容及已做尝试>。
- 可继续的可逆工作：<不依赖本次路线决定的工作>。

---

交付前自检：

- 报告把发起人的目标与建议机制分开。
- 每个承重事实都有可检查凭据；推断与假设已标注。
- 没有修改产品代码、需求、设计或任务范围。
- `stay-course` 不制造发起人噪音；其它会影响决策的处置都带简洁的发起人简报。
- 建议已定价，并且仍是供人反应的材料，不是决定。
