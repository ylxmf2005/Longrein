---
name: precommit-setup
description: "Use when AgentCorp needs to set up or improve repository pre-commit checks, commit-time guardrails, Git hook workflows, staged-file quality checks, or optional slow AI commit review with Codex or Claude. Use when the user asks to setup precommit, add commit constraints, wire local pre-commit hooks, or make AI review an opt-in pre-commit step."
---

# precommit-setup

This is a reusable AgentCorp support capability, not a delivery phase and not a role with its own gate. Use it to add commit-time guardrails to a target repository: a default hook path fast enough that nobody routes around it, plus deeper checks that are deliberate and opt-in.

You exist because hook setups fail in two opposite ways. Too heavy: someone wires the full test suite into pre-commit, every commit stalls, and within a week the team commits with `--no-verify` — the guardrail trained people to bypass guardrails. Too hollow: an agent writes plausible YAML, never executes it, and reports the setup as complete; the hook then breaks on the first real commit over a missing binary or a wrong path. Both failures share one habit — treating the config file, rather than an observed hook run, as the deliverable.

**Iron law: a hook you have not run is a hook you do not have — run it, or report UNVERIFIED.**

## Workflow

1. Inspect the target repository before choosing tools:
   - Existing hook systems: `.pre-commit-config.yaml`, `lefthook.yml`, `.husky/`, `.git/hooks/`, `package.json` hook scripts.
   - Existing quality commands: `Makefile`, `justfile`, `package.json`, `pyproject.toml`, `tox.ini`, `go.mod`, `Cargo.toml`, CI configs.
   - Existing commit rules in `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, or docs.
2. Preserve the repo's current hook tool when one exists — an existing tool always wins.
3. If no hook tool exists, prefer the language-neutral `pre-commit` framework. Use Husky only for Node-first repos or repos already using Husky. Use Lefthook when the repo already uses it or is a multi-language monorepo that benefits from one fast hook runner.
4. Configure fast checks first, inside the latency budget below.
5. Add commit constraints as explicit, readable checks.
6. Add AI commit review only as a slow optional path.
7. Run the hook locally and record exact install/verify commands.

## Fast default checks

Default pre-commit checks are deterministic, local, and quick. Prefer staged-file checks when the tool supports them. **Budget: the whole default hook should finish in under ~5 seconds on a typical commit; any single check that regularly exceeds ~10 seconds belongs in the optional or pre-push path, not the default hook.**

Good default candidates:

- Whitespace, end-of-file, merge-conflict markers, large-file guard.
- Formatters or format checks already used by the repo.
- Linters already used by the repo.
- Type checks only when the repo already has a command that fits the budget.
- Targeted tests only when they are cheap enough to fit the budget and already local.
- Secret scanning when an existing tool is present or easy to add without heavy setup.

Never make full test suites, browser tests, dependency installs, network calls, or AI review mandatory on every commit.

## Commit constraints

Implement commit constraints as local guardrails that are easy to understand and easy to bypass deliberately when needed.

Common constraints:

- Block commits with unresolved merge conflict markers.
- Block commits with obvious secrets or local credential files.
- Block commits that modify generated artifacts without source changes, when the repo has that convention.
- Block commits that include AgentCorp runtime artifacts such as `teamspace/`, unless the user explicitly wants to commit them.
- Block destructive or noisy churn such as whole-file formatting when the task only changed a small area, if the repo has a reliable detector.
- Enforce commit message style in `commit-msg` only when the repo already has a convention or the user asks for one.

Every failure message says what failed, why it matters, and the command to rerun.

## Optional AI commit review

Codex/Claude commit review is useful but slow. Never wire it as an unconditional pre-commit step.

Trigger models:

- **Manual**: a command such as `make ai-commit-review` or `npm run ai:commit-review`.
- **Environment opt-in**: run only when `AI_COMMIT_REVIEW=1` is set.
- **Path/risk based**: run only when staged files touch sensitive areas such as auth, payments, migrations, public APIs, or security policy.
- **Pre-push instead of pre-commit**: run before push when the team wants deeper checks without blocking every local save point.

Default to the environment opt-in model, and pair it with a manual command so the review is also runnable outside commits. Use path/risk or pre-push triggers only when the user names the sensitive areas or asks for push-time review.

The review inspects the staged diff, not the entire working tree by default. It returns a concise pass/fail summary and writes any detailed notes to a local ignored path such as `.agentcorp/commit-review/` — add a `.gitignore` entry for it if one does not exist; review notes contain diff excerpts and must never enter history.

Make the failure behavior explicit:

- Default: warn but do not block, unless the user requests blocking behavior.
- Blocking mode is acceptable for protected or high-risk repos, but must be opt-in.
- Always include a bypass path such as `SKIP=ai-commit-review git commit ...` or the hook tool's standard skip mechanism.

## Config patterns

Before writing any hook config, read `references/config-patterns.md` and copy from it — it carries the copy-ready pre-commit / Husky / Lefthook templates, the AI-review guard script, and the failure-message pattern. Two rules travel with every template:

- The `repo: local` section is for fast repo commands only — a lint or format check, never `make test` or anything that walks the whole project.
- Use only the CLI the user actually has. Never invent flags; check `codex --help`, `claude --help`, or existing project scripts first.

## Verification

After setup, run — actually run, in this environment:

1. The hook installer, such as `pre-commit install` or the repo's equivalent.
2. The full hook once, such as `pre-commit run --all-files`, unless it exceeds the latency budget above. If it does, run a targeted staged-file check and say which checks you skipped and why.
3. The optional AI review command in skip mode and in opt-in mode, when the CLI is available.
4. `git status --short` to confirm only intended setup files changed.

If the hook tool cannot be installed or run in this environment (no network, no binary, sandboxed shell), report the setup as **UNVERIFIED** and list the exact commands the user must run — never present unexecuted config as working. If only part of the verification ran, say precisely what ran and what did not.

Report: the installed tool, added/changed files, commands run with their results, remaining slow checks, how to bypass or opt into AI review, and the verification status (verified / partial / UNVERIFIED).

## Red flags — stop the moment one appears

| Thought | Reality |
| --- | --- |
| "The config is standard YAML; it will work." | Unexecuted hooks fail on paths, missing binaries, and typos. Run it or report UNVERIFIED. |
| "`pre-commit` is the preferred framework, so I'll replace what's here." | An existing hook tool always wins; never migrate without an explicit request. |
| "`make test` in the hook catches more bugs." | It also makes every commit slow until people bypass hooks entirely. Full suites belong to CI and the test phase, never the default hook. |
| "I'll skip `run --all-files`; it's probably slow." | "Probably" is not a measurement. Run it once and time it; skip only with the budget as evidence, and say so in the report. |
| "The notes dir will get ignored eventually." | Nothing ignores it but you. An unignored notes dir stages diff excerpts into history on the next commit. |
| "The user wants strict checks, so blocking AI review is what they meant." | Blocking is opt-in, requested in words. Default to warn plus a documented bypass. |

## Boundaries

- The hooks you install are the target repo's own guardrails, not AgentCorp's review pipeline: `code-review-lead` and the specialist reviewers still review changes at the review phase — an AI commit-review hook never substitutes for that gate.
- Full test suites belong to CI and the test roles (`test-leader`, `regression-tester`); the default hook only borrows checks that fit the latency budget.
- `change-hygiene-reviewer` judges a specific diff after the fact; you install the standing checks that stop the worst commits from forming at all.

## Self-check before reporting

- Existing hook tool preserved, or migration explicitly requested?
- Default hook measured within the budget, or the overage moved to the opt-in/pre-push path?
- Every constraint's failure message says what failed, why it matters, and the rerun command?
- AI review notes path has a `.gitignore` entry?
- A bypass path documented for every blocking check?
- Every command in the report actually executed here — anything else marked UNVERIFIED?
- `git status --short` shows only intended files?

## Operating rules

- Hook configs, scripts, and failure messages follow the target repo's existing language and conventions; any AgentCorp report artifact keeps the standard rule — zh-CN human prose, identifiers, paths, and commands verbatim.
- Never write task artifacts into the skill directory.
- `teamspace/` exists only locally: if it shows as untracked, add it to `.git/info/exclude`; never stage, commit, or push it.

## Referenced files

- `references/config-patterns.md` — copy-ready hook configs for pre-commit, Husky, and Lefthook, the AI-review guard script, and the failure-message pattern. Read it before writing any config.
