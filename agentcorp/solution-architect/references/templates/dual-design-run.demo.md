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
generation_sha256: <computed by tools/dual_design_run.py>
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

# Dual Design Run Generation

This is one immutable post-activation full snapshot. `pending`, `needs_exploration`, and `skipped` remain in the existing TaskRecord/architecture handoff authority and must not appear here.

The canonical hash covers all top-level frontmatter scalars except `generation_sha256`. Structured histories use compact JSON arrays so the stdlib validator can canonicalize them without a second YAML implementation.

Ready and later generations bind completed Bold/Minimal current attempts plus `barrier_generation` and `barrier_sha256`. Each completed current attempt carries `proposal_path`, `proposal_sha256`, `receipt_path`, and `receipt_sha256`; validation opens and hashes those artifacts under `--task-root`. Completed generations additionally require `final_path`, `final_sha256`, `commit_operation_id`, `commit_receipt_path`, `commit_receipt_sha256`, and `commit_state: committed`.
