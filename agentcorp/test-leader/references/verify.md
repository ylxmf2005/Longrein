# Local Verification Coordination Reference

Use this to coordinate testers after implementation and code review.

## Verification Hierarchy

Level 1: Capability verification.

- Every Must Have has direct evidence.
- Automated tests are run when available.
- Manual checks are allowed when the TestPlan calls for them.

Level 2: Integration/API verification.

- Cross-module data flows are exercised.
- Error propagation across boundaries is checked.
- Public contracts use real requests, responses, schemas, or CLI outputs.

Level 3: E2E verification.

- Every user-facing capability has at least one passing full user goal.
- Happy and error paths are executed when applicable.
- Each step records action, expected result, actual result, and evidence.

Do not proceed to a higher level while lower-level required checks are failing.

## Environment Handling

Use the TestPlan environment spec when present. If an environment is unavailable, report exactly which checks are blocked or downgraded. Do not invent evidence from source inspection.

## Assignment

- API Contract Tester: HTTP, JSON-RPC, A2A, CLI, SDK, schemas, exported interface contracts.
- E2E Tester: real user-facing flows through browser, CLI, API, or product UI.
- Regression Tester: bug reproduction, fix proof, adjacent regression suites.
- Specialist reviewers: evidence interpretation in their domain when needed.

## Evidence Quality

Good evidence includes commands, requests, responses, screenshots, logs, artifacts, environment, timestamps, and pass/fail status. Weak evidence is "looks good", "should pass", or source-code-only inference for behavior that should be executed.
