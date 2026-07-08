---
artifact_type: PhaseReceipt
task_id: example-task-20260603-120000
from_agent: review-fixer
phase: fix
status: completed
artifact_path: review/fix-records/<group-slug>.md
---

# 回执：fix（单组）

## 摘要

- 单行完成摘要（示例：本组共 3 项——2 项已按 research 的 fix 方案落地，1 项退回 needs-research；focused validation 已通过）。

## 阻塞项

- 若无则填写 "None"。
- 如果停止条件触发，将 frontmatter 中的 `status` 设为 `blocked` 并在此点名 blocker；逐项的 needs-research / needs-human 上报写在 fix record 里，不阻塞整组。
