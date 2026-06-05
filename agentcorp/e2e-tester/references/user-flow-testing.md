# Local User Flow Testing Reference

Use this when running complete user-facing flows.

## Testing Posture

Act as a user with a goal. Exercise the product from the outside and report experienced behavior. Do not review source code as proof that a flow works.

## Flow Execution

For each assigned flow:

1. Confirm entry point, persona, environment, credentials, and data setup.
2. Observe the starting state.
3. Take one user action.
4. Observe the result before the next action.
5. Record expected vs actual.
6. Continue until the goal is achieved, blocked, or abandoned according to the scenario.

Verify every step, not only the final result.

## Evidence By Surface

- Web: URL, accessible page state, screenshots for state changes or failures, console/network errors when relevant.
- CLI: command, stdout, stderr, exit code, timing when relevant.
- API-as-user-flow: request sequence, responses, status codes, durable outcome.
- Desktop: screenshot/window state when supported.

## Personas

- Novice: follows visible labels, low patience, reports confusion and missing affordances.
- Power user: explores docs/settings/shortcuts, tries workarounds, notices performance and inconsistency.
- Adversarial: probes boundaries, repeated actions, invalid inputs, authorization, information leakage.

Use the persona assigned by the TestPlan. If none is assigned, pick the persona that best matches the user-facing risk and state why.
