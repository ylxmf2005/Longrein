# Conditional dual-design contract

Dual design is an internal work-unit pattern of the existing `architecture` phase. It creates no public phase, skill, persona, route, or user parameter.

## Activation authority

Before activation, the Delivery Orchestrator records `pending`, bounded `needs_exploration`, `skipped`, the strongest counterfactual, and the re-entry trigger in the existing TaskRecord decision log and architecture assignment/receipt evidence. A `DualDesignRun` is exclusive-created only after a material structural signal and two full-contract candidate structures are both evidenced. A task with a `dual_design_run_path` or dual marker whose run directory is missing, truncated, invalid, or unreadable is blocked; legacy single-lane applies only when no marker or pointer was ever created.

## Proposal lanes and synthesis

Bold and Minimal are fresh Solution Architect work units with the same frozen input. Their lane, actor, attempt, and exclusive write roots differ; sibling proposal/status/receipt handles are unavailable until both terminal receipts pass the barrier. Proposals are always `ArchitectureProposal` with `normative: false`. A third fresh Solution Architect synthesizes only from a ready immutable snapshot and produces the sole normative `ArchitectureDesign`.

Minimal chooses the first structure that satisfies the complete approved contract. LOC, file count, dependency count, cost, and time never elect a winner. Synthesis compares requirement coverage, root-cause fit, change amplification, cognitive load, ownership cost, reversibility, and verification burden; it does not use majority vote or default averaging.

## Runtime and persistence boundary

The run uses schema version 1 and `dual-design-run-c14n-v1`. Generations are fully serialized and fsynced in `.staging`, then atomically published put-if-absent; partial staging objects are never authoritative. Historical generations are never rewritten. Unknown versions fail closed until a reader is explicitly registered.

Final commit binds a stable `commit_operation_id` to run/input/evidence/barrier/head/final hash and returns an immutable queryable receipt. A transport-unknown result is queried or idempotently replayed with the same operation id; stale evidence is appended only after the store proves the operation uncommitted. Reusing an operation id with a different payload is rejected.

Generations contain only minimized non-secret metadata, hashes, statuses, and opaque handles. Credentials, hidden oracle content, unrestricted payloads, proposal bodies, logs, and attestation bodies stay outside the chain under host/project retention. Archive or expiry creates an immutable archive/tombstone receipt; a missing payload handle cannot remain green.

Without real host isolation, cleanup, atomic-store/final-transaction, attestation, vault, and signing evidence, runtime activation stays false. Prompt-only isolation is forbidden.
