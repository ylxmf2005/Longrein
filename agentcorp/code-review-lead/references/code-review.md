# Local Code Review Reference

Use this to coordinate implementation review and produce one accountable decision.

## Review Layers

Always consider:

- Correctness: logic, state, edge cases, error propagation.
- Standards: explicit repository instructions and local conventions.
- Simplicity: unnecessary abstraction, scope creep, avoidable complexity.

Conditionally add:

- Security for auth, permissions, public endpoints, untrusted input, secrets.
- Reliability for retries, timeouts, I/O, async jobs, health, recovery.
- Performance for hot paths, queries, loops, memory, scale.
- API Contract for routes, JSON-RPC/A2A, CLI, schemas, exported interfaces.
- Adversarial for high-risk, large, multi-actor, timing-sensitive, or abuse-prone changes.
- Test Planner or Test Plan Reviewer when implementation changes risk or coverage assumptions.

## Findings Triage

Must-fix:

- Reproducible behavior bug.
- Security or data-loss risk.
- Contract-breaking change.
- Explicit requirement violation.
- Review blocker that prevents meaningful verification.

Should-fix:

- Clear maintainability, reliability, performance, or coverage risk with a plausible failure mode.

Optional:

- Useful cleanup that does not block delivery.

Dismiss:

- Style opinion, duplicate, pre-existing unrelated issue, or speculation without an actionable path.

## Decision Gate

- `approve`: no must-fix findings remain and verification can proceed.
- `request_changes`: one or more must-fix findings remain.
- `needs_more_evidence`: review cannot be completed because diff, requirements, tests, or design context is missing.

Never claim a reviewer, command, or test ran unless there is evidence.
