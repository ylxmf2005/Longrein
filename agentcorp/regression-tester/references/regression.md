# Local Regression Testing Reference

Use this when proving a bug remains fixed or a risky behavior stayed compatible.

## Regression Process

1. Restate the bug or risky behavior.
2. Reproduce it on the current baseline when possible, or explain why reproduction is unavailable.
3. Run the focused check that should catch the issue.
4. Run adjacent tests when blast radius is non-trivial.
5. Verify the fixed or preserved behavior with direct evidence.
6. Record unreproduced, flaky, blocked, or environment-dependent results.

## Good Regression Evidence

- Original reproduction steps and current observed result.
- Failing-before/passing-after test when available.
- Commands, requests, screenshots, logs, or artifacts.
- Adjacent checks selected from the affected module or contract.
- Clear pass/fail status.

## Boundaries

Do not expand into broad exploratory testing unless assigned. Do not review implementation code as the primary evidence. Do not hide flaky or environment-dependent failures.
