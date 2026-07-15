---
artifact_type: DualDesignRun
task_id: 20260715-120000-example
author_agent: delivery-orchestrator
status: active
schema_version: 1
canonicalization_version: dual-design-run-c14n-v1
run_id: dual-001
dual_marker: true
generation: 0
previous_generation_sha256: none
generation_sha256: <由 tools/dual_design_run.py 计算>
state: active
input_sha256: <sha256>
evidence_sha256: <sha256>
frozen_input_handle: design/input-package.md
bold_current_attempt: none
minimal_current_attempt: none
barrier_generation: none
barrier_sha256: none
attempts_json: []
events_json: []
---

# 双设计运行 Generation

这是 activation 后的 immutable full snapshot。`pending`、`needs_exploration` 与 `skipped` 留在既有 TaskRecord/architecture handoff authority，不得写入此类型。

Canonical hash 覆盖除 `generation_sha256` 外的全部顶层 frontmatter scalar。结构化 history 使用 compact JSON array，使 stdlib validator 无需复制第二套 YAML 实现即可 canonicalize。

Ready 及其后 generation 必须绑定已完成的 Bold/Minimal current attempts，以及 `barrier_generation`、`barrier_sha256`。每个 completed current attempt 都携带 `proposal_path`、`proposal_sha256`、`receipt_path` 与 `receipt_sha256`，validator 通过 `--task-root` 打开并核验。Completed generation 还必须包含 `final_path`、`final_sha256`、`commit_operation_id`、`commit_receipt_path`、`commit_receipt_sha256` 与 `commit_state: committed`。
