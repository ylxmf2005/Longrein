# fresh-start-handoff

A portable Agent Skill for coding agents that detects when a multi-turn coding conversation has become risky to continue, asks the user whether to start a fresh context, and writes a clean handoff prompt.

The skill is designed for situations like long debugging sessions, repeated failed fixes, changed requirements, stale assumptions, and dirty exploratory branches. It converts scattered conversation context into a single full task prompt while separating verified facts from failed attempts.

## Install

Copy this directory to your agent's skills directory, for example:

```bash
mkdir -p ~/.claude/skills
cp -R fresh-start-handoff ~/.claude/skills/fresh-start-handoff
```

Or zip the directory with the folder as the ZIP root and upload/install it in clients that support packaged skills.

## What it does

- Scores whether the current coding context is risky enough to suggest a fresh session.
- Asks the user before switching workflow, unless the user explicitly asks for a handoff prompt.
- Produces a copy-paste prompt for a new coding agent/session.
- Provides git-safe workspace isolation guidance: prompt only, continue from current dirty tree, archive exploratory work, or start from a clean base branch.
- Labels old findings as `VERIFIED`, `ACCEPTED`, `FAILED`, `UNVERIFIED`, or `REFERENCE_ONLY` to reduce contamination.

## Files

- `SKILL.md` — core workflow and trigger behavior.
- `references/activation-matrix.md` — detailed trigger scoring.
- `references/handoff-template.md` — full copy-paste prompt template.
- `references/workspace-isolation.md` — safe git branching/stash/archive patterns.
- `references/prompt-hygiene.md` — how to pass lessons without dragging false starts into the new session.
- `scripts/workspace_snapshot.sh` — optional read-only git snapshot helper.
- `evals/` — starter evals and trigger evals.

## Suggested community description test

Use `evals/trigger-evals.json` to test whether your agent triggers the skill when it should and avoids triggering it on simple coding tasks.

## License

MIT
