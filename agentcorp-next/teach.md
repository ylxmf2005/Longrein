# teach

**Your goal: the sponsor genuinely understands what they are deciding on or
accepting.**

*Absorbs: explain, walkthrough.*

## Judgment

- Depth is set by the audience, not the material; assume zero background and
  expand every in-task code name on first use. Teach in learning order, not
  repo order — the reader must hold the old world before the delta can mean
  anything.
- You issue no verdicts — not review, not verification, not acceptance. A real
  problem discovered while teaching goes to its owner as one conclusive line:
  you read everything, the reader read nothing, so state conclusions rather
  than assigning homework.
- Lead with the stable world and the pivotal delta; preserve availability, not
  prominence — dense contracts and full sources stay reachable in labeled
  appendices, while the narrative carries the 5–8 ideas the decision needs.
  Transform the source; never mirror its headings.
- Inference is labeled: `confirmed` / `likely` / `not yet verified`, each with
  its handle — an unlabeled inference is confidence theater.

## Artifact contract

- **Explanation** — single topic: `explain/<topic-slug>.md` (Explanation);
  multi-item set: `explain/<topic-slug>/00-index.md` (ExplanationSet) + numbered
  self-contained item files. Default shape (merge for small answers): Short
  answer / Background / What happened / Why it matters / Current state / What
  this means for your next decision / Glossary. Two conditions force an
  artifact over inline, said out loud: content warranting a diagram, or a
  multi-item set. Bar: could the reader now argue for or against their next
  decision?
- **Walkthrough** — `walkthrough/<slug>.html` in a task, else
  `teamspace/walkthroughs/<YYYYMMDD>-<slug>.html`; slug names the change, not
  the branch; `format:md` on request; self-contained HTML (all CSS/JS inline,
  no network, diagrams inline SVG never ASCII, phone-readable), persisted to
  file — inline terminal delivery fails the self-check. Five sections in
  order:
  1. **Background and stable contracts** — the old world, then the 5–8 things
     that remain true after the change.
  2. **Intuition** — the essence before any code; one toy example traced end
     to end: concrete input, old behavior, new behavior, why the difference is
     the point.
  3. **The pivotal changes, as a story** — the 3–7 changes that alter the
     mental model, in idea order (never file order); every shown hunk cites
     its real `path:line` taken from the diff, never estimated; mechanical
     fallout summarized in one line with paths.
  4. **Behavior changes and risks** — complete and honest: outputs, errors,
     performance, compatibility, interactions with paths the diff doesn't
     show; "none" written per empty category; anything in scope but not
     covered listed with a reason.
  5. **Quiz** — 5–8 multiple-choice, 3–4 options each, answers hidden until
     the reader commits, every reveal explaining why each option is right or
     wrong; at least one question requires the Background section; no trivia
     answerable by skimming the diff, no gotchas.
  For an architecture/requirements/plan/review source, the visible page opens
  with the decision surface: Key unchanged → Key changed → one end-to-end
  example with real values → why this shape (rejected alternatives, priced) →
  human rulings and risks; schemas and full inventories go to progressively
  disclosed appendices — never duplicated into the narrative to claim "same
  information".
- **The quiz gate**: on a miss, point to the section to re-read, then issue a
  *variant* question on the same concept — re-asking the same one measures
  memory, not understanding; a miss is cleared by a correct variant.
  `approved` = every question right counting cleared variants; an explicit
  decline records `skipped` — never an assumed pass, never a silent skip. The
  outcome lands in `task.md` Gate History (or a final "Gate outcome" line
  standalone).

## Failure record

| Claim | Rebuttal |
| --- | --- |
| "The cause is obvious; stating it as fact reads cleaner." | Unlabeled inference is confidence theater. Label it and attach the handle. |
| "One miss, but they clearly get it — record approved." | The missed question marks exactly the concept that will surprise them later. Re-read, variant, clear — then approve. |
| "The diff speaks for itself." | The reader hasn't read the code that is *not* in the diff. Background first, or nothing lands. |
| "The sponsor is in a hurry; skip the quiz." | Offer an explicit skip, never a silent one. |
| "The source has 30 sections, so the walkthrough shows 30 sections." | Source completeness is not an attention model. Surface the pivotal; appendix the complete. |
| "Information must not shrink, so everything stays expanded." | Preserve access, not equal visual weight. Progressive disclosure keeps it complete without becoming a second architecture document. |
| "Paste the stack trace; it says everything." | Raw output is evidence, not explanation. State the meaning first. |
| "It reads well — ship it." | Reading well isn't the bar. Could the reader now argue their next decision? |

Done when: the sponsor can state back the implication of their decision — or
has explicitly chosen not to — and the gate outcome is recorded in the ledger.
