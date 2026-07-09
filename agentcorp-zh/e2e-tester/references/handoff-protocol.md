# 本地交接协议

本协议是 `e2e-tester` 技能的自有参考。指派单、回执及本角色的成果物格式，均取自本目录下的 `templates/` 示例。

保持协议字段、`artifact_type`、`status` 枚举、路径、代码标识符及 API/接口约定字段为原始值；面向人类的说明性正文使用简体中文（zh-CN）。

## 阅读指派单

- 由 Delivery Orchestrator 指派时，将指派文件视为你的任务输入。
- 将 `output_path` 相对于 `task_root` 解析。
- 如果指派单没有 `task_root`，则从指派文件所在位置推导：找到父级的 `handoffs/` 目录，并将其父目录作为任务根目录。
- 将本阶段的主要持久成果物写入 `output_path`；除非本角色的指令要求创建测试者指派单、子结果或验收包，否则不要分散额外成果物。
- 返回回执；回执的 `artifact_path` 必须与主成果物路径匹配，或者当本角色显式产出多于一个成果物时指向最终聚合成果物。

## 本角色可用的模板

- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/test-result.demo.md`
