# Workspace Isolation for Fresh Coding Handoffs

Use this when the current repository state may contaminate the next agent/session.

## Rule of thumb

A fresh prompt is not enough if the filesystem still contains exploratory modifications. Decide whether the new agent should see the dirty tree. If not, archive or branch it first.

Never discard user work. Avoid `git reset --hard`, `git clean`, force pushes, or rewriting history unless the user explicitly requests and understands the consequence.

## Inspect first

Preferred read-only commands:

```bash
git status --short --branch
git diff --stat
git diff --name-only
git log --oneline -5
```

If the project is not a git repo, list modified files by whatever project mechanism is available and say that isolation has to be manual.

## Choose a stance

### Stance 1: Prompt-only handoff

Use when the working tree is clean or the user only wants a prompt.

Handoff wording:

```text
Workspace stance: Start from the current repository state. I did not inspect or change git state in this handoff.
```

### Stance 2: Continue from current dirty tree

Use when uncommitted changes are valuable and should be continued.

Handoff wording:

```text
Workspace stance: Continue from the current working tree. There are uncommitted changes in [files]. Treat them as candidate work, not verified truth, unless tests confirm them.
```

### Stance 3: Archive exploratory work, start clean

Use when the existing changes are useful history but should not bias the next attempt.

Suggested safe flow, after user approval:

```bash
# Inspect
git status --short --branch
git diff --stat

# Archive current exploratory state on a separate branch
git switch -c archive/fresh-start-$(date +%Y%m%d-%H%M)
git add -A
git commit -m "archive exploratory work before fresh-start handoff"

# Return to the stable base and create a clean task branch
git switch main  # or the project's actual base branch
git pull --ff-only  # only if network/current remote policy allows it
git switch -c task/<short-task-slug>
```

If committing exploratory work is inappropriate, use stash instead:

```bash
git stash push -u -m "archive exploratory work before fresh-start handoff"
git switch main  # or the project's actual base branch
git switch -c task/<short-task-slug>
```

Handoff wording:

```text
Workspace stance: Start from clean branch `task/<slug>` based on `[base]`. Prior exploratory work is archived in `[archive branch or stash name]`; use it only as historical reference, not as implementation state.
```

### Stance 4: Branch from current work

Use when current changes are mostly correct but the next session needs a named checkpoint.

```bash
git switch -c task/<short-task-slug>
# optionally commit only if user approves
git add -A
git commit -m "checkpoint before fresh-start handoff"
```

Handoff wording:

```text
Workspace stance: Continue from branch `task/<slug>`, which includes a checkpoint of current changes. Re-validate all assumptions before expanding the change.
```

## Handling untracked files

Untracked files can be important. Mention them separately. If stashing, use `git stash push -u` so untracked files are preserved. If committing, review untracked files before `git add -A`.

## Handling generated files

Do not archive generated files by default if they can be reproduced. Put them in the handoff only if they are relevant evidence, fixtures, or required assets.

## What to tell the new agent

Always include one of these labels:

- `START_FROM_CLEAN_BASE`
- `CONTINUE_FROM_CURRENT_DIRTY_TREE`
- `CONTINUE_FROM_CHECKPOINT_BRANCH`
- `REFERENCE_ARCHIVE_ONLY`

This prevents the new agent from accidentally treating failed exploratory edits as the intended baseline.
