# Skill Evolution Proposal — format

The `session-end-capture` hook (registered as a `SessionEnd` hook) writes one file per session into `teamspace/skill-evolution/pending/<ts>-<session>.md`, containing zero or more proposals. If a session yields nothing, no file is written (the analyzer emits `NO_PROPOSALS`).

## Frontmatter

- `artifact_type: SkillEvolutionProposal`
- `session_id: <id>`
- `status: pending`

## Each proposal block

- **target**: an existing skill name (e.g. `delivery-orchestrator`) or `NEW: <topic>` for a skill to build.
- **trigger**: `user-noticed` | `agent-trial-and-error` | `external-research`.
- **signal**: concrete evidence from the session — what actually happened.
- **proposed change**: a concrete edit, or research to run; prefer enforcement/structure over prose that will be ignored.
- **blast radius**: `wording` | `behavior` | `structural` | `new-skill`.
- **suggested lane**: `fast` (one-file wording/enforcement) | `full` (delivery pipeline).
- **confidence**: `high` | `medium` | `low`.

## Lifecycle

`pending/` → the `skill-evolution` skill verifies the signal, picks a lane, drafts, gates (standards + human), and lands → then moves the file to `landed/` or `rejected/` with the outcome and resulting paths. Proposals never edit a skill on their own; landing always passes a human gate.
