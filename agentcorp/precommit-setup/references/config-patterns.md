# Config patterns

Copy-ready templates. Adapt names and commands to what the target repo already has; never add a check the repo has no tool for. Every template obeys the SKILL.md latency budget: the default hook finishes in under ~5 seconds on a typical commit.

## pre-commit — `.pre-commit-config.yaml`

Start small: universal checks plus at most a couple of fast repo-local commands.

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
      - id: check-added-large-files
  - repo: local
    hooks:
      - id: quick-lint
        name: quick lint
        entry: make lint   # fast checks only here — never `make test` or the full suite
        language: system
        pass_filenames: false
```

Install and verify:

```sh
pre-commit install
pre-commit run --all-files
```

## Husky — `.husky/pre-commit` (Node-first repos)

```sh
npx lint-staged
```

With staged-file checks in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,ts,tsx}": "eslint --max-warnings 0"
  }
}
```

## Lefthook — `lefthook.yml` (multi-language monorepos)

```yaml
pre-commit:
  parallel: true
  commands:
    lint-py:
      glob: "*.py"
      run: ruff check {staged_files}
    format-js:
      glob: "*.{js,ts}"
      run: npx prettier --check {staged_files}
```

## Optional AI review guard script

Wire the hook to a script; keep the guard explicit, review the staged diff only, and keep the notes out of history:

```sh
#!/bin/sh
# Optional AI commit review — opt-in via AI_COMMIT_REVIEW=1.
# Bypass: SKIP=ai-commit-review git commit ...
if [ "${AI_COMMIT_REVIEW:-0}" != "1" ]; then
  echo "AI commit review skipped; set AI_COMMIT_REVIEW=1 to run it."
  exit 0
fi

notes_dir=".agentcorp/commit-review"
mkdir -p "$notes_dir"
grep -qxF "$notes_dir/" .gitignore 2>/dev/null || echo "$notes_dir/" >> .gitignore

git diff --cached > "$notes_dir/staged.diff"
# Invoke the CLI the user actually has — check `codex --help` / `claude --help` first.
# Print a one-line pass/fail summary to the terminal; write details under "$notes_dir/".
```

## Failure message pattern

Every constraint prints what failed, why it matters, and how to rerun:

```
merge-conflict-markers: found "<<<<<<<" in src/app.py.
Unresolved conflicts must never be committed. Fix the markers, then rerun:
  pre-commit run check-merge-conflict --all-files
```
