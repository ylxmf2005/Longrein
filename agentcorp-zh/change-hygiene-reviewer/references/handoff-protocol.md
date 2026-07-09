# 本地交接协议

本协议是 `change-hygiene-reviewer` skill 自身的参考文档。任务分配、回执以及本角色产物的结构均取自本目录 `templates/` 中的示例。

保持协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段为原始值；面向人的解释性散文使用 zh-CN。

## 阅读任务分配

- 由交付编排者指派时，将任务分配文件作为你的任务输入。
- 相对于 `task_root` 解析 `output_path`。
- 如果分配没有 `task_root`，从分配文件的位置推导：找到父级 `handoffs/` 目录，取其父目录作为 task root。
- 将本阶段的主要持久产物写入 `output_path`；不要散布额外产物，除非本角色的说明要求创建测试分配、子结果或验收包。
- 返回回执；回执的 `artifact_path` 必须与主要产物路径一致，或在本角色明确产出多个产物时指向最终汇总产物。

## 本角色可用的模板

- `templates/finding-set.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
