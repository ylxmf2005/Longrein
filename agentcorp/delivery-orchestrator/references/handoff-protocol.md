# 本地 Handoff 协议

本协议属于 `delivery-orchestrator` skill 自己的 reference。assignment、receipt 和本角色产物的形态，都从本目录的 `templates/` demo 取用。

协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段保持原值；面向人阅读的说明正文使用 zh-CN。

## 读取 Assignment

- 被 Delivery Orchestrator 指派时，把 assignment 文件当作任务输入。
- 将 `output_path` 相对 `task_root` 解析。
- 如果 assignment 没有 `task_root`，从 assignment 文件位置推导：找到父级 `handoffs/` 目录，并把它的父目录作为 task root。
- 在 `output_path` 写入本 phase 的主要持久产物；除非本角色说明需要创建 tester assignment、子结果或 acceptance package，否则不要额外散落产物。
- 返回一份 receipt；receipt 的 `artifact_path` 必须与主要产物路径一致，或在本角色明确产生多个产物时指向最终汇总产物。

## 校验 receipt（机械,先于质量判断）

收到每份 receipt 后，跑 `scripts/validate-handoff.py` 做 envelope 一致性校验，再做 phase 质量判断：

- 单对：`python3 scripts/validate-handoff.py --pair <assignment> <receipt> --task-root <task_root>`
- 全 task：`python3 scripts/validate-handoff.py --sweep --task-root <task_root>`

它校验 `artifact_path` 真的存在、与 assignment 的 `output_path` 一致、`from_agent`/`phase`/`task_id` 对得上、产物 `author_agent` 与 owner 一致、status 非空。**非 0 退出 = handoff 未完成**，按 `needs_more_evidence` 退回，不计入 gate。机械校验过 ≠ 质量 gate 过。

## 本角色可用模板

- `templates/acceptance-package.demo.md`
- `templates/api-contract.demo.md`
- `templates/decision-artifact.demo.md`
- `templates/design-artifact.demo.md`
- `templates/finding-set.demo.md`
- `templates/implementation-result.demo.md`
- `templates/implementation-story-spec.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/review-decision.demo.md`
- `templates/task-manifest.demo.md`
- `templates/task-record.demo.md`
- `templates/test-plan.demo.md`
- `templates/test-result.demo.md`
- `templates/validated-requirements.demo.md`
- `templates/work-item.demo.md`
