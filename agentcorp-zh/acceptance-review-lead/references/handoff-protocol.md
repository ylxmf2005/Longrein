# 本地交接协议

本协议是 `acceptance-review-lead` 技能的参考文档。任务指派、回执以及本角色工件的格式均取自本目录下的 `templates/` 示例。

保持协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段为原始值；面向人类的说明文字使用 zh-CN 书写。

## 读取任务指派

- 当由 Delivery Orchestrator 指派时，将任务指派文件视为任务输入。
- 相对于 `task_root` 解析 `output_path`。
- 如果指派中没有 `task_root`，从指派文件的位置推导：找到父级 `handoffs/` 目录，取其父目录作为任务根目录。
- 将本阶段的主要持久化工件写入 `output_path`；除非本角色指令要求创建测试员指派、子结果或验收包，否则不要散落额外工件。
- 返回回执；回执的 `artifact_path` 必须与主要工件路径匹配，或当本角色明确产出多个工件时指向最终的聚合工件。

## 本角色可用的模板

- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/review-decision.demo.md`
