# 本地交接协议

本协议是 `reliability-reviewer` 技能自身的参考。分配、回执及本角色的工件形态均取自本目录下 `templates/` 中的示例。

协议字段、`artifact_type`、`status` 枚举、路径、代码标识符及 API/接口契约字段保持原始值；面向人类的说明性行文使用 zh-CN。

## 阅读分配任务

- 由交付调度器分配时，将分配文件视为你的任务输入。
- 相对于 `task_root` 解析 `output_path`。
- 若分配任务没有 `task_root`，则从其文件位置推导：找到父级 `handoffs/` 目录，取其父目录作为任务根目录。
- 将本阶段的主要持久化工件写入 `output_path`；除非本角色指令要求创建测试员分配、子结果或验收包，否则不要散落额外工件。
- 返回回执；回执的 `artifact_path` 必须与主要工件路径一致，或在本角色明确产出多个工件时指向最终聚合工件。

## 本角色可用的模板

- `templates/finding-set.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
