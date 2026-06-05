# Local Acceptance Reference

Use this after verification has run and before delivery.

## Acceptance Inputs

- Acceptance package from Delivery Orchestrator.
- Validated requirements.
- TestPlan.
- Implementation notes and changed-file list.
- Code Review Lead decision.
- Verification commands, requests, flows, screenshots, logs, artifacts.
- Known failures, untested areas, and residual risks.

## Acceptance Checks

- Every Must Have has direct evidence.
- Capability, integration/API, and E2E levels ran in the required order when applicable.
- Real endpoints, commands, or user-facing environments were used when required.
- Contract, data, security, performance, or reliability evidence exists for scoped risks.
- Failures were reproduced and fixed, or explicitly accepted as residual risk.
- No result depends on hidden fallback, mock-only success, or source-code-only inference.

## Decisions

- `accept`: evidence supports delivery and residual risks are acceptable.
- `reject`: required behavior failed or risk is unacceptable.
- `needs_more_evidence`: work may be correct but evidence is missing, indirect, or incomplete.

Do not accept a delivery because reviewers were numerous. Accept only because the evidence proves the requirements.
