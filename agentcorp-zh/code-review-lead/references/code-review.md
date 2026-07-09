# 本地代码审查参考

讲的是怎么给 finding 定级、怎么敲定 decision——Code Review Lead 被追责所依据的标准，不是排版格式。Reviewer 选择（五个始终开启的维度和按风险触发的 specialist）在 SKILL.md「你召集谁」：按改动的实际风险追加 specialist，永远不要默认全开。

## finding 定级

定级依据是「是否存在可操作的失败路径」，而非有多少 reviewer 提出了这个 finding。

- **Must-fix**：可复现的行为 bug；security 或数据丢失风险；contract-breaking 变更；违反明确需求；无法追溯到已审批 source artifacts 的越界语义/合约变更；steward 提出的会在项目核心写入错误长期承诺的 finding；以及任何会阻碍有效 verification 的 review blocker。
- **Suggested fixes**：存在合理失败模式的 maintainability、reliability、performance、coverage 或长期维护风险；或者一个合理的、应当从当前 MR/PR 中拆分出去的 change hygiene finding。
- **Optional**：不阻塞交付的有益清理。
- **Overruled**：style 观点、重复项、与本次变更无关的既有问题、没有可操作路径的猜测。

Specialist 的 `Confidence` 值是 0–1 的自我校准，各角色有不同的报告下限（security 从 0.60 起就会报告；多数其他角色低于 0.60 就压下不报）——把它当 triage 优先级看，永远不要当证据看：定级仍然取决于可操作的失败路径。

合并重复 finding 时，归入证据最强、file:line 最精确的那一条。

## 决策

- `approve`：已无 must-fix finding；可以继续 verification。
- `request_changes`：仍有一条或多条 must-fix finding。
- `needs_more_evidence`：因缺少 diff、requirements、test 或 design 上下文而无法完成 review——且一个点名的证据请求可以解开它。
- `blocked`：review 完全无法推进，且任何证据请求都解不开（例如 diff 或 worktree 不可用，或 phase 本身已被取消）。

高风险改动（安全/权限边界、public/shared contract、数据丢失/不可逆发布）在下结论前取一次跨家族二次意见——完整规则在 SKILL.md「高风险二次意见」；结论仍归 Code Review Lead 自己。

禁止在没有证据的情况下声称某个 reviewer、command 或 test 已经执行过。
