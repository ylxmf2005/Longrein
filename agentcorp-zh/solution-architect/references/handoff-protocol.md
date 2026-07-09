# 本地交接协议

本协议是 `solution-architect` 技能的自有参考。任务分配、回执及本角色产出的形状均取自本目录下 `templates/` 中的示例。

协议字段、`artifact_type`、`status` 枚举、路径、代码标识符以及 API/接口契约字段保持原值不变；面向人类的说明性文本使用 zh-CN。

## 读取任务分配

- 当由交付编排器指派时，将任务分配文件视为你的任务输入。
- 将 `output_path` 相对于 `task_root` 解析。
- 如果任务分配没有 `task_root`，则从其文件位置推导：找到父级 `handoffs/` 目录，并取其父目录作为任务根目录。
- 在 `output_path` 撰写本阶段的主要持久化产出；除非本角色的指令明确要求创建测试分配、子结果或验收包，否则不要散布额外产出。
- 返回一个回执；回执的 `artifact_path` 必须与主产出路径一致，或当本角色明确产出多于一个时指向最终聚合产出。

## 本角色可用的模板

- `templates/design-artifact.demo.md`
- `templates/interface-contract.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
