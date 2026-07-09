# Local verification orchestration reference

Load this before writing tester assignments on a non-trivial change: it defines what each verification level requires and how to handle environments.

## Verification levels

Verification is layered, and the layers are ordered: until the required checks at a lower level pass, the evidence at a higher level does not yet hold.

- **Capability** — every Must Have needs direct evidence; if automated tests exist, run them; go manual only where the TestPlan calls out a manual confirmation.
- **Integration/API** — the cross-module data flow has actually been exercised; error propagation at the boundaries has been checked; public contracts are verified with real requests, responses, schemas, or CLI output, not asserted on faith.
- **E2E** — every user-facing capability has at least one complete user goal that runs through; the happy path and the error path that should be exercised both are; each step records the action, expected result, actual result, and evidence.

## Handling environments

When the TestPlan has an environment spec, follow it. When the environment is unavailable, say honestly which checks are blocked or downgraded, rather than inventing evidence from reading the source.
