# 本地交接协议

本协议是 `correctness-reviewer` 技能自身的参考文档。任务分配、回执以及本角色制品的结构均取自本目录下 `templates/` 中的示例。

协议字段、`artifact_type`、`status` 枚举、路径、代码标识符以及 API/接口契约字段保持原值不变；面向人类的说明性文字使用 zh-CN 编写。

## 阅读任务分配

- 当由交付编排器分配时，将任务分配文件视为你的任务输入。
- 将 `output_path` 相对于 `task_root` 解析。
- 如果分配文件没有 `task_root`，从分配文件的位置推导：找到父级 `handoffs/` 目录，取其父目录作为任务根目录。
- 将本阶段的主要持久化制品写入 `output_path`；除非本角色的指令要求创建测试分配、子结果或验收包，否则不要散落额外制品。
- 返回一份回执；回执的 `artifact_path` 必须与主要制品路径一致，或者当本角色明确产出多个制品时，指向最终的聚合制品。

## 本角色可用的模板

- `templates/finding-set.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
