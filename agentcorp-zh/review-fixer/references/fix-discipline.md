# Single-group landing: 逐项步骤顺序与返回契约

本文档是 `review-fixer` 的本地参考：分配给你的**单个**组里每个 item 的步骤顺序，以及你交回什么的契约。边界规则和落地纪律本身在 SKILL.md 里 —— 本文档不复述它们。Slicing、parallelism、merge check 以及 cross-group rollup 属于 Delivery Orchestrator。

## 每个 item 的步骤

1. **Drift check** —— 见 SKILL.md"落地纪律"。技术性 mismatch（代码变了、suggestion 不再适用）→ `needs-research`；需要 re-research 无法敲定的产品或优先级决策 → `needs-human`；匹配 → 实施。
2. **忠实落地** —— 按 research 的 fix approach 修改 root cause（partial item 用 **corrected** approach）；不降级，不加没人要求的东西。
3. **回归检查** —— "修复前失败、修复后通过"，放在 `OWNED_FILES` 内的测试文件里，或者放在一个只有你这组会创建的新测试文件里；编辑 `OWNED_FILES` 之外的已有测试文件是一次 spill-over —— 上报。
4. **Focused validation** —— 只跑 assignment 指定的内容；纯 documentation/comment item 可以跳过；永远不跑 full suite。
5. 将组内 item 串行处理，然后 rollup 为该组的记录。

## Return contract

写入 `review/fix-records/<group-slug>.md`，逐 item 记录。对每个 item：

- `verdict`: `fixed-as-suggested`（按照 research 的 fix approach 忠实落地） | `needs-research`（suggestion 与当前代码不匹配，请重新检查） | `needs-human`（spill 出 `OWNED_FILES` / 需要决策 / 三次尝试后仍无法修复） | `not-applicable`（误分配的 false positive 或 pending human confirmation 的 item）
- `fix_item_id`, `severity`
- `files_changed`: 该 item 修改的文件（全部应在 `OWNED_FILES` 内，外加任何只有你这组会创建的新测试文件）
- `regression_check`: 你添加的"修复前失败"的检查是什么（如果没有，说明原因）
- `notes`: drift-check 结论 + 遵循了哪个 suggestion + 任何偏离及原因
- `escalation`: 仅用于 needs-research / needs-human —— 说明 mismatch 在哪里，或者谁需要决定什么

将此记录交回 Orchestrator；待其收集所有组后，运行 merge check 并 rollup 为 `review/fix-result.md`。
