# 本地交接协议

本协议是 `code-review-lead` 技能自身的参考文档。任务分配、回执及本角色制品的结构均取自本目录中 `templates/` 的示例文件。

保持协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段为其原始值；面向人的解释性文字使用 zh-CN。

## 读取任务分配

- 当由交付编排器分配时，将任务分配文件视为你的任务输入。
- 将 `output_path` 相对于 `task_root` 进行解析。
- 如果任务分配中没有 `task_root`，则从分配文件所在位置推导：找到父级 `handoffs/` 目录，取其父目录作为任务根目录。
- 将本阶段的主要持久化制品写在 `output_path`；除非本角色的指令要求创建测试人员分配、子结果或验收包，否则不要散布额外制品。
- 返回一个回执；回执的 `artifact_path` 必须与主要制品路径匹配，或在本角色明确产出多个制品时指向最终的聚合制品。

## 本角色可用的模板

- `templates/finding-set.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/review-decision.demo.md`
