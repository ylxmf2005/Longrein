# Local handoff protocol

本协议是 `test-leader` skill 的自用参考。assignment、receipt 以及本 role 各 artifact 的格式，均取自本目录 `templates/` 中的示例。

demo 给出的是形状，不是取值：protocol 字段名、`status` 枚举和 frontmatter key 严格按 template 的定义保留，并把每个 `example-*` 占位符替换成本次任务的真实值；面向人的说明正文用 zh-CN 书写。

## Reading the assignment

- 被 Delivery Orchestrator 指派时，将 assignment 文件作为你的任务输入。
- `output_path` 以 `task_root` 为基准解析。
- 若 assignment 没有 `task_root`，则从 assignment 文件所在位置推导：找到上级 `handoffs/` 目录，再取其上级目录作为 task root。
- 将本 phase 的主持久 artifact 写入 `output_path`；除非本 role 的指令要求创建 tester assignment、sub-result 或 acceptance package，否则不要额外散落其他 artifact。
- 返回一份 receipt；receipt 的 `artifact_path` 必须与主 artifact 路径一致，若本 role 明确产出多个 artifact，则指向最终的汇总 artifact。

## Writing tester assignments

- 复制 `templates/phase-assignment.demo.md`，并设置 `from_agent: test-leader`、`to_agent: <tester-slug>`、`phase: verify`、`status: assigned`，以及本次任务的真实 `task_id`。
- 必须显式设置 `task_root`。tester 无法从 `verification/assignments/` 推导出它——fallback 推导规则期望存在一个上级 `handoffs/` 目录，而这条路径没有。
- 设置 `output_path: verification/test-results/<tester-slug>.md`，并在 Inputs 里写明对应的执行 playbook 路径。
- verify 期间指派的 specialist reviewer 用同样的形状；他们自己的 skill 默认把输出放在 `review/specialist-findings/` 下，所以 assignment 必须显式设置 `output_path`。

## 本 role 可用的模板

- `templates/phase-assignment.demo.md`
- `templates/phase-receipt.demo.md`
- `templates/verification-report.demo.md`
- `templates/test-result.demo.md`
