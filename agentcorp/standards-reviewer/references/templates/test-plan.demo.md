---
artifact_type: TestPlan
task_id: example-task-20260603-120000
author_agent: test-planner
status: ready_for_review
source_artifacts:
  - requirements/validated-requirements.md
confidence: HIGH
---

# TestPlan: Example Title

## Requirements Covered

- FR-1 / AC-1: covered by checks below.

## Must-Have Checks

- MH-1: behavior to prove, layer, and evidence.

## Forbidden Zones

- Area that must not change.

## Capability Checks

- Capability scenario and expected result.

## Integration/API Checks

- Contract or cross-module flow, success path, and error path.

## E2E User Flows

- Full user goal with happy and error paths.

## Regression Checks

- Bugfix or preserved behavior check.

## Data And Migration Checks

- Persistence, migration, rollback, privacy, or retention check.

## Failure And Edge Cases

- Failure mode and expected behavior.

## Audit And Logs

- Required log/audit signal and prohibited sensitive output.

## Security And Token Constraints

- Auth, permission, sandbox, token, or rate-limit check.

## Coverage Summary

- requirement/capability: check ids and layers.

## Environment Spec

- Environment kind, workdir, commands, URLs, ports, credentials references, and blockers.

## Recommended Tester Roles

- API Contract Tester, E2E Tester, Regression Tester, or specialist role.

## Residual Risks

- Empty when none.

## Open Questions

- Empty when none.
