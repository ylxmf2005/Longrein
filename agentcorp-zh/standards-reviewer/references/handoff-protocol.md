# 本地交接协议

本协议是 `standards-reviewer` 技能自身的参考文件。指派、回执以及本角色的产物形状，均取自本目录下 `templates/` 中的演示文件。

保持协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段保持原值；面向人类的解释性正文使用 zh-CN。

## 阅读指派文件

- 由交付编排器指派时，将指派文件视为你的任务输入。
- 相对于 `task_root` 解析 `output_path`。
- 如果指派文件没有 `task_root`，从其所在位置推导：找到父目录 `handoffs/` 并取其父目录作为任务根目录。
- 在 `output_path` 写入本阶段的主要持久产物；除非本角色的指令要求创建测试员指派、子结果或验收包，否则不要散落额外产物。
- 返回回执；回执的 `artifact_path` 必须与主产物路径匹配，或者当本角色明确产出多个产物时，指向最终汇总产物。

## 本角色可用的模板

- `templates/finding-set.demo.md`
- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`