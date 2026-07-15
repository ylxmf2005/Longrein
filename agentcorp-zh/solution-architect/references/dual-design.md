# 条件式双设计契约

Dual design 是现有 `architecture` phase 的内部 work-unit pattern，不新增公开 phase、skill、persona、route 或用户参数。

## Activation authority

Activation 前，Delivery Orchestrator 在既有 TaskRecord decision log 与 architecture assignment/receipt evidence 中记录 `pending`、bounded `needs_exploration`、`skipped`、最强 counterfactual 与 re-entry trigger。只有 material structural signal 与两个 full-contract candidate structures 都有证据时，才 exclusive-create `DualDesignRun`。若 task 已有 `dual_design_run_path` 或 dual marker，而 run directory missing、truncated、invalid 或 unreadable，则 blocked；只有从未创建 marker/pointer 的任务可走 legacy single-lane。

## Proposal lanes 与 synthesis

Bold 与 Minimal 是使用同一 frozen input 的 fresh Solution Architect work units；lane、actor、attempt 与 exclusive write root 不同，双方 terminal receipt 通过 barrier 前，sibling proposal/status/receipt handles 不可达。Proposal 始终是 `normative: false` 的 `ArchitectureProposal`。第三个 fresh Solution Architect 只读取 ready immutable snapshot，并产出唯一 normative `ArchitectureDesign`。

Minimal 在满足完整 approved contract 的第一个充分结构停止。LOC、文件数、依赖数、成本与时间不能选 winner。Synthesis 比较 requirement coverage、root-cause fit、change amplification、cognitive load、ownership cost、reversibility 与 verification burden；禁止 majority vote 与默认平均。

## Runtime 与 persistence boundary

Run 使用 schema version 1 与 `dual-design-run-c14n-v1`。Generation 先在 `.staging` 完整 serialize、fsync，再 atomic put-if-absent publish；partial staging object 从不具 authority。Historical generation 不原地改写；unknown version 在 reader 显式注册前 fail closed。

Final commit 用稳定 `commit_operation_id` 绑定 run/input/evidence/barrier/head/final hash，并返回 immutable、queryable receipt。Transport outcome unknown 时，用同一 operation id query 或 idempotent replay；只有 store 证明未提交后才可追加 stale evidence。相同 operation id 携带不同 payload 必须拒绝。

Generation 只保存最小化的 non-secret metadata、hash、status 与 opaque handle。Credential、hidden oracle content、unrestricted payload、proposal body、log 与 attestation body 留在 chain 外并遵守 host/project retention。Archive/expiry 生成 immutable archive/tombstone receipt；缺失 payload handle 不能继续显示 green。

没有真实 host isolation、cleanup、atomic store/final transaction、attestation、vault 与 signing evidence 时，runtime activation 保持 false。禁止 prompt-only isolation。
