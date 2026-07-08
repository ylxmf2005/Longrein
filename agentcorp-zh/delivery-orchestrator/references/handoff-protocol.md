# 本地 Handoff 协议

本协议是 `delivery-orchestrator` skill 自用的参考。assignment、receipt 以及该 role 的 artifact 的格式，均取自本目录 `templates/` 下的 demo。

protocol 字段、`artifact_type`、`status` 枚举、路径、代码标识符以及 API/interface 合约字段保持原值；人类可读的解释性正文使用简体中文。

## Assignee 拿到你的 Assignment 后会怎么做

每个被委派的 owner 都会把你的 assignment 文件当作它的 task 输入，并按以下规则解析——撰写 assignment 时要保证这些规则成立：

- Owner 将 assignment 文件视为 task 的输入。
- Owner 以 `task_root` 为基准解析 `output_path`。
- 若 assignment 中没有 `task_root`，owner 会从其文件所在位置推导：找到包裹它的 `handoffs/` 目录，取其父目录作为 task root。
- Owner 将该 phase 的主要持久化 artifact 写入 `output_path`；除非该 role 的 instructions 明确要求创建 tester assignment、sub-results 或 acceptance package，否则不会额外散落 artifact。
- Owner 返回一个 receipt；receipt 中的 `artifact_path` 必须与主 artifact 路径一致，或者在该 role 显式产出多个 artifact 时，指向最终的聚合 artifact。

## 校验 Receipt（机械性检查，质量判定之前）

每收到一个 receipt 后，先运行 `scripts/validate-handoff.py` 做 envelope-consistency validation，再进行 phase 质量判定：

- 单对校验：`python3 scripts/validate-handoff.py --pair <assignment> <receipt> --task-root <task_root>`
- 全量扫描：`python3 scripts/validate-handoff.py --sweep --task-root <task_root>`

它会验证 `artifact_path` 是否真实存在、是否与 assignment 的 `output_path` 一致、`from_agent`/`phase`/`task_id` 是否对得上、artifact 的 `author_agent` 是否与执行者一致，以及 `status` 是否非空。**非零退出码 = handoff 未完成**：将其退回为 `needs_more_evidence`，且不计入 gate。通过机械性检查 ≠ 通过质量 gate。

## 该 Role 可用的 Templates

这份清单是完整的——`templates/` 中随附的每个 demo 都出现在这里。artifact 形态从这些 demo 来，不要自己发明。

- `templates/acceptance-package.demo.md`
- `templates/interface-contract.demo.md`
- `templates/decision-artifact.demo.md` —— 面向其他 decision 的通用 decision 形态，例如 `acceptance-decision`（`AcceptanceDecision`，status 为 `accept|reject|needs_more_evidence`）
- `templates/design-artifact.demo.md`
- `templates/finding-set.demo.md`
- `templates/implementation-result.demo.md`
- `templates/implementation-story-spec.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/review-decision.demo.md` —— 支撑 `code-review`（`CodeReviewDecision`）；`plan-review` 和 `test-plan-review` 用同一形态，`artifact_type` 分别换成 `PlanReviewDecision` / `TestPlanReviewDecision`
- `templates/task-manifest.demo.md`
- `templates/task-record.demo.md`
- `templates/test-plan.demo.md`
- `templates/api-test-plan.demo.md`、`templates/e2e-test-plan.demo.md`、`templates/regression-test-plan.demo.md` —— TestPlan playbooks，是 `test/test-plan.md` 的子文件
- `templates/testing-context.demo.md` —— 项目级的 `teamspace/testing-context.md`
- `templates/test-result.demo.md`
- `templates/validated-requirements.demo.md`
- `templates/work-item.demo.md`
- `templates/exploration-frontier.demo.md`、`templates/exploration-charters.demo.md`、`templates/exploration-journal.demo.md` —— 用于填充 testing-context 的探索工作笔记；刻意不带 YAML frontmatter，永远不会被 receipt 指名，因此 `validate-handoff.py` 永远不会看到它们
