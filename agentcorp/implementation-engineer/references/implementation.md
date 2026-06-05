# Local Implementation Reference

Use this progressively while implementing approved work.

## Inputs

- Approved Implementation Story Spec.
- Plan Review Lead decision and implementation constraints.
- Source artifacts referenced by the Story Spec: validated requirements, TestPlan/Test Strategy or diagnosis criteria, design artifact/contracts, and local standards.
- Any code review findings assigned back to you.

If multiple source artifacts conflict, stop and report the conflict instead of guessing.

## Story Spec Execution

1. Read the complete Story Spec.
2. Parse Story, Acceptance Criteria, Tasks/Subtasks, Implementation Constraints, Verification Expectations, Review Focus, and Status.
3. Load referenced code and project context from the Story Spec and cited source artifacts.
4. Identify the first incomplete task/subtask.
5. Execute tasks/subtasks in order unless explicitly allowed to reorder.
6. For each task, implement the minimal correct change, add/update focused tests, and run the relevant checks.
7. Record progress, changed files, commands, deviations, and blockers in `implementation/implementation-result.md`.

## Engineering Discipline

- Define done before editing.
- Read affected code, callers, callees, and tests before changing it.
- Build the approved Story Spec, not adjacent improvements.
- Preserve existing module boundaries unless the approved artifact changes them.
- Make one coherent edit per file when possible; re-read before editing again.
- Prefer explicit failure over hidden fallback, fake success, broad catches, or swallowed errors.
- Add focused tests when behavior, contracts, bugs, data, auth, or public surfaces change.

## Halt Conditions

Stop and return a blocker when:

- The Story Spec is missing Plan Review Lead approval.
- A task/subtask is ambiguous enough to change implementation behavior.
- Required design, contract, or acceptance criteria conflict.
- A new dependency or migration is required but not approved.
- Required configuration or credentials are missing.
- The implementation would require UI design/styling/layout/copy changes reserved for a frontend owner.
- Three consecutive implementation attempts fail for the same task.

## Bugfix Mode

For bugfixes, implement only after the diagnosis includes a causal chain. The fix should target the root cause, not only the symptom. Add or update a regression check that would fail before the fix.

## Completion Gate

Before handoff:

- Every required Story Spec task/subtask is completed or listed as blocked.
- Code compiles or the relevant static check runs when available.
- Focused tests pass, or failures are documented as blockers.
- Changed behavior is checked against acceptance criteria, TestPlan, or diagnosis criteria.
- Implementation result includes all new, modified, or deleted files.
- Deviations from the approved Story Spec are listed.
- Code Review Lead receives changed files, commands, test evidence, and known risks.
