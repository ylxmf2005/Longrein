# Full Handoff Prompt Template

Use this template to create the final copy-paste prompt for the user. Remove sections that do not apply, but keep the source-of-truth and anti-contamination language.

```markdown
You are starting fresh on a coding task. Do not rely on any previous conversation. Treat this prompt and the current repository state as the source of truth.

If anything below conflicts with the repository, tests, or command output, trust the repository/tests and report the mismatch before changing code.

## Objective
[Write the current task as a concrete objective. Avoid mentioning old conversation turns.]

## Definition of done
- [Observable success criterion 1]
- [Observable success criterion 2]
- [Tests/build/manual checks that should pass]

## Repository/workspace stance
[Choose exactly one:]
- START_FROM_CLEAN_BASE: Start from branch `[branch]`. Prior exploratory work is archived in `[branch/stash/path]` and is reference-only.
- CONTINUE_FROM_CURRENT_DIRTY_TREE: Continue from the current working tree. Treat uncommitted changes as candidate work, not verified truth.
- CONTINUE_FROM_CHECKPOINT_BRANCH: Continue from branch `[branch]`, which contains a checkpoint of current changes.
- REFERENCE_ARCHIVE_ONLY: Use archived work only as historical reference; do not copy it without re-validation.

## Relevant files and entry points
- `[path]`: [why relevant]
- `[path]`: [why relevant]

## Commands and validation
```bash
[command 1]
[command 2]
```

## Verified facts
- VERIFIED: [Fact] — Evidence: [file/test/log/user instruction]
- VERIFIED: [Fact] — Evidence: [file/test/log/user instruction]

## User constraints and accepted decisions
- ACCEPTED: [Constraint or decision]
- ACCEPTED: [Constraint or decision]

## Failed attempts / do not repeat blindly
- FAILED: [Approach]. Evidence: [what showed it failed]. Lesson: [what to avoid or re-check].
- FAILED: [Approach]. Evidence: [what showed it failed]. Lesson: [what to avoid or re-check].

## Suspect or unverified assumptions
- UNVERIFIED: [Hypothesis]. How to check: [test/file/log/command]
- UNVERIFIED: [Hypothesis]. How to check: [test/file/log/command]

## Suggested approach
1. Re-read the relevant files and confirm the verified facts.
2. Form a small implementation plan.
3. Make the smallest change that satisfies the definition of done.
4. Run the validation commands.
5. If validation fails, report the exact failure and revise from evidence rather than from old assumptions.

## Guardrails
- Ask before destructive git operations, broad rewrites, dependency upgrades, schema migrations, or deleting files.
- Do not reuse failed exploratory code unless you can explain why the failure no longer applies.
- Keep changes minimal unless the repository evidence justifies a broader refactor.
- If you need missing context, ask a targeted question instead of guessing.

## Final response expected from you
Summarize what changed, list validation results, and call out any remaining risks or assumptions.
```
