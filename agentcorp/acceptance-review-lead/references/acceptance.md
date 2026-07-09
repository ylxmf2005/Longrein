# Local Acceptance Reference

Use this after verification has run and before delivery. It refines the judgment dimensions in SKILL.md into pass/fail confirmations; it does not replace them.

## The evidence you have

An acceptance judgment is built on a full body of evidence: the acceptance package from the Delivery Orchestrator, the validated requirements, the TestPlan, the implementation notes and changed-file list, the Code Review Lead's decision, plus the commands, requests, flows, screenshots, logs, and artifacts left behind by verification, together with the known failures, untested areas, and residual risks. These together form the basis for your judgment — the more direct and traceable the evidence, the more your conclusion holds up.

## What counts as evidence

- An inspectable handle: the command that ran plus its output, a log path, a screenshot, a result file under `verification/test-results/`. A status word (`passed`, `fixed`, `done`) with no handle is a claim, not evidence.
- Direct over indirect: a run that exercised the required behavior beats a test of a nearby helper; a real endpoint beats a mock wherever the TestPlan required the real one.
- Traceable: you can follow the handle from the Must Have to the artifact without inferring any intermediate step.

## What you must confirm

There is one core question: does the evidence truly prove that this delivery satisfies the requirements. To answer yes, confirm each of these:

- Every Must Have has direct evidence — a handle you opened, not a checkbox next to a path.
- Where layering was required, capability, integration/API, and E2E ran in the required order; a later layer passing does not excuse a skipped earlier layer the TestPlan required.
- Wherever the TestPlan required a real endpoint, command, or user-facing environment, the evidence shows the real one was used — look for the actual URL, host, or environment marker in the output, not the word "real".
- For the risks falling in scope, the contract, data, security, performance, or reliability evidence is in place.
- Failures were reproduced and fixed, or honestly accepted as residual risk; for defect-class tasks, the fix was re-run against the original failing input and produced correct output — proxy samples alone do not close a defect.
- No conclusion rests on an implicit fallback, a mock-only success, or pure inference from source code.

## The conclusions

- `accept`: the evidence supports the delivery, and residual risk is acceptable.
- `reject`: required behavior fails, or risk is unacceptable.
- `needs_more_evidence`: the work itself may be correct, but the evidence is missing, indirect, or incomplete — name the missing handle.
- `blocked`: too ambiguous to judge honestly; name exactly what is missing rather than inventing it.

High-stakes releases additionally follow the cross-family second-opinion rule in SKILL.md.
