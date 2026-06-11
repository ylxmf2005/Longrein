# 本地 Handoff 协议

本协议属于 `solution-architect` skill 自己的 reference。assignment、receipt 和本角色产物的形态，都从本目录的 `templates/` demo 取用。

协议字段、`artifact_type`、`status` 枚举、路径、代码标识符和 API/接口契约字段保持原值；面向人阅读的说明正文使用 zh-CN。

## 读取 Assignment

- 被 Delivery Orchestrator 指派时，把 assignment 文件当作任务输入。
- 将 `output_path` 相对 `task_root` 解析。
- 如果 assignment 没有 `task_root`，从 assignment 文件位置推导：找到父级 `handoffs/` 目录，并把它的父目录作为 task root。
- 在 `output_path` 写入本 phase 产物。若本次设计需要多份产物，assignment 的 `output_path` 应指向 `design/` 目录；在该目录下按需要创建 `architecture.md`、`impact-analysis.md`、`diagnosis.md`、`api-contract.md`。
- 返回一份 receipt；receipt 的 `artifact_path` 必须与 assignment 的 `output_path` 一致，或在 `output_path` 是目录时指向该目录下的一份实际设计产物。若产生多份设计产物，在 receipt 正文的「说明」里列出全部路径。

## 本角色可用模板

- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/design-artifact.demo.md`
- `templates/api-contract.demo.md`
