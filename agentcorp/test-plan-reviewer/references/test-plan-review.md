# Local TestPlan Review Reference

Use this to review a TestPlan before implementation starts.

## Review Focus

- Requirements alignment: every goal has one or more Must Haves.
- Observability: each Must Have says what input/action proves what output/outcome.
- Boundary clarity: submodules, public surfaces, and non-goals do not overlap.
- Forbidden zones: redlines are concrete enough to stop implementation drift.
- Risk coverage: edge cases, failures, auth, data, contract, and performance risks appear where relevant.
- Execution: the named tester can actually run each check with the stated environment.
- E2E coverage: every user-facing capability appears in at least one E2E goal, or the omission is justified.
- Evidence quality: screenshots, logs, requests, responses, commands, and artifacts are called out where needed.

## Red Flags

- "Test the feature works" without a verifiable assertion.
- Unit-only coverage for user-facing workflow changes.
- API surface changes without request/response checks.
- Migration or persistence changes without before/after data checks.
- Browser/UI work without real interaction or visual evidence.
- Environment assumptions left implicit.
- Coverage summary entries with no E2E goal and no reason.

## Output Shape

Follow `references/templates/review-decision.demo.md`; add coverage gaps, weak assertions, missing risk areas, and execution blockers when relevant.
