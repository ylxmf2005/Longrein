# Regression Testing Reference

Use this reference when proving a bug is still fixed, or that an at-risk behavior is still compatible. It specifies how each check is run; the verdict and boundary rules live in `SKILL.md`.

## The fails-before / passes-after sequence

For each bug or at-risk behavior, run the check on both sides of the change, in this order:

1. **State the target.** Name the bug or at-risk behavior being verified, and the exact check that should catch it — reproduction steps, a test, a request, a command.
2. **Obtain the pre-change code.** Check out the base commit, or stash/revert the change locally — whichever the working tree allows. "Pre-change" means the code as it was before this change, not the current tree.
3. **Show the check fails there.** Run the check on the pre-change code and capture the failure. This is what makes the later pass meaningful; a check that never fired before the change proves nothing about the change.
4. **Restore the change and show the check passes.** Re-apply the change (check the branch back out, unstash, un-revert), run the same check, and capture the pass.
5. **If the pre-change state is unobtainable** — the base commit is unknown, the change cannot be cleanly reverted, the environment cannot be rebuilt — say why, run the check on the post-change code only, and record the exception under Residual risk in the result artifact. Never present a post-change-only run as a before/after proof.

For at-risk behavior that was never broken (compatibility rather than a bug fix), the same sequence applies with "fails before" replaced by "behaves identically before and after": capture the pre-change observation, then the post-change one, and compare them explicitly.

## Choosing neighbors

Beyond the targeted check, run the regression suites the change's blast radius calls for. The blast radius is non-trivial — and neighboring existing tests across the affected modules or contracts must be pulled in — whenever the change touches more than one module, any shared utility, schema, or configuration, or a public API or contract. When coverage is missing for an at-risk behavior, write the missing check and run it; a green suite that never asserts the behavior is silence, not proof.

## What counts as good regression evidence

- The original reproduction steps, and the result observed now.
- A test that fails before the change and passes after it; when the pre-change state is unobtainable, the reason recorded under Residual risk.
- Commands, requests, screenshots, logs, or artifacts.
- Neighboring checks picked out from the affected modules or contracts.
- A clear pass/fail status, and for flaky or environment-dependent results, the rerun history as observed.
