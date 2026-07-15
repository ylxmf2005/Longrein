# compound

**Your goal: this task changes how future tasks go.**

*Absorbs: compound (skill and phase), skill-evolution.*

## Judgment

- Every finished task leaves an asset that changes future behavior — or an
  honest "无可沉淀" with its one-line reason. The honest nothing is a valid
  result; a manufactured lesson is theater, worse than silence. The single
  capture criterion: would an agent on a different future task, reading this,
  avoid a wrong turn?
- Every claim points into evidence — a task claim into the round's artifacts, a
  session claim into the transcript. Memory is a hypothesis: extract before you
  interpret, and the paying findings are the embarrassing ones.
- **Landing rights follow blast radius**: regression tests and repo rules land
  directly (after the Baseline checkout check — mismatch returns `blocked`);
  anything that changes how the system itself behaves — skills, charters, this
  tree — is a sponsor-gated proposal, no size threshold, and being invoked is
  not approval.
- Improvements are deltas against a failing trajectory, never wholesale
  rewrites: regeneration loses the boundary details that carry the value.

## Artifact contract

- **Phase result** — `compound/compound-result.md` (CompoundResult). Sections:
  regression tests landed (target repo test suite, fails-before/passes-after) /
  rules landed (target repo `CLAUDE.md`/`AGENTS.md`) / reviewer-or-skill
  proposals (proposal-only, with their `pending/` path) / persistent entries —
  each asset naming its landing path — or the honest 无可沉淀. Soft phase: sits
  between acceptance-review and deliver, never hard-gates it, and the delivery
  report carries its one-line summary. The `sweep:` value arrives compiled
  (`line` — one honest line suffices; `core` — the regression-test question is
  always asked; `full` — all three asset questions plus mid-task scraps); the
  workflow profile name is never re-derived. Two standing touchpoints outside the phase:
  search `teamspace/compound/` by keyword at intake and feed hits by path
  downstream; jot compoundable moments mid-task when they happen — the phase
  collects scraps, it does not rely on end-of-task memory.
- **Persistent store** — `teamspace/compound/<slug>.md`, one entry per file;
  frontmatter `slug / date / task_id / type / applies_when / tags`, `type` ∈
  `repo-trap | root-cause | process | convention | failed-approach`; body ≤4
  paragraphs: triggering situation → root cause → what to do → how to be
  faster next time. Grep the store before writing; heavy overlap updates the
  old entry rather than duplicating it.
- **Session replay** — `teamspace/replays/<YYYYMMDD>-<slug>.md` (ReplayReport):
  leads with the three findings that would have bought the most, each with a
  trajectory anchor and routed channel; never pastes raw transcript bulk —
  smallest redacted fragment, entry-index citations, redaction placeholders
  never restored.
- **Self-modification proposals** — one file per session in
  `teamspace/skill-evolution/pending/` (SkillEvolutionProposal). Per proposal:
  target, trigger, signal, **failing trajectory (required — none means
  rejected at triage)**, proposed change, blast radius
  (`wording|behavior|structural|new-skill`), lane, confidence. Lifecycle is
  per-proposal: the file moves to `landed/`/`rejected/` only when *every*
  proposal in it has an `## Outcome`. Landing runs the corpus's own validators
  and updates every consumer in the same landing — a contract changes the way
  contracts change, deliberately, never by drift.

## Failure record

| Claim | Rebuttal |
| --- | --- |
| "I found a skill defect — I'll fix the skill." | You write proposals into `pending/`, never landings. Humans own self-modification. |
| "Nothing dramatic — I'll pad it so it doesn't look empty." | Forced compound is theater. 无可沉淀 + reason. |
| "This lesson is obvious, not worth writing." | The criterion is future-avoided-wrong-turn, not obviousness. |
| "I lived this session; I can write the replay from memory." | Memory drops the failed attempts and the costs. Extract, then anchor every claim. |
| "The round went well; keep the report positive." | The paying findings are the embarrassing ones. |
| "Proposal 1 landed — move the file to landed/." | Proposals 2 and 3 would vanish unseen. The file moves only when every proposal has an outcome. |
| "The analyzer's signal cites the session, so it's real." | Analyzers hallucinate. Re-read the evidence yourself before drafting. |
| "Quote the whole exchange for context." | Transcripts carry paths, names, secrets. Smallest redacted fragment. |

Done when: the asset exists where future work will actually hit it — with its
evidence anchor — or the honest nothing is recorded in the result and the
delivery report's compound line.
