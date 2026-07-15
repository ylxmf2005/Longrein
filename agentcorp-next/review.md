# review

**Your goal: find what is wrong with this change before it ships — with evidence
strong enough that a stranger could act on it.**

*Absorbs: the 11 specialist reviewers, code/plan/acceptance-review leads,
test-plan-reviewer, review-researcher.*

## Judgment

The questions a review answers. Decide yourself how many independent contexts
they need — one hostile read may cover several; a high-stakes surface may
deserve one each — but the change's author is never one of them, and a question
"considered" but not asked is a recorded absence, never a silently thinner
review:

| Question | Its iron law |
| --- | --- |
| Does it do the wrong thing on real inputs? Walk hostile, concrete values — tests encode their author's blind spots. | No walked path, no finding. |
| Can an attacker walk a path from untrusted input to a sink? | No reachable attack path, no finding. |
| When a dependency slows, dies, or fails halfway — crash, hang, or swallowed failure? | No named failure, no finding. |
| What does it cost at production scale? | No sourced scale, no finding. |
| Does the complexity pay for itself? (out-of-scope addition / reinvented wheel / premature extraction / dead code) | Run the check, or drop the finding. |
| Is it the right shape — naming, proportion — or a working hack? The honest fix is often larger. | No priced honest shape, no finding. |
| Does it silently break an existing consumer? | A version bump is not a migration path. |
| Does every hunk trace to a current approved source — would a fresh start still write this line? | Not traceable → revert or split; never invent a justification to keep it. |
| Does it break a rule the project wrote down for itself? | No quote, no finding. |
| Who carries this for the years after, and did they accept it on purpose? | Name who bears what future cost and who may accept it — a concern naming neither is taste, and taste is never a gate. |
| Assume it's already broken — construct the failure (assumption / combination / cascade / abuse). | No constructed scenario, no finding. For auth, payment, data mutation, or 3+ components: one dedicated pass per class before concluding clean. |

The verdict owner's law: **evidence outranks headcount** — a finding is graded
on its walkable failure path, never on how many reviewers repeated it. The diff
is not the reading boundary: open the caller before hedging; medium confidence
is for checks you *could not* run, not checks you did not run. A proposed fix
that introduces an uncalled-for abstraction is itself a new must-fix (the
ratchet). When the upstream artifact encodes the mistake, say so and route
upstream — never review faithfully inside a wrong frame. High-stakes changes
take one cross-family cold read as input; the final call stays with the owner.

## Artifact contract

**Decision artifacts** (enum `approve | request_changes | needs_more_evidence |
blocked`; `needs_more_evidence` names what would unblock, `blocked` means
nothing nameable would):

- `review/code-review.md` (CodeReviewDecision): Decision, Must-fix, Suggested
  fixes, Specialist reviews, Evidence gaps, Residual risk, Next owner.
- `review/plan-review.md` (PlanReviewDecision): same shape + **Constraints for
  implementation** required on approve; its specialists write into
  `review/plan-review-findings/` (kept apart from code-review's).
- `test/test-plan-review.md` (TestPlanReviewDecision): verdict + must-fix —
  anything under Must fix means `request_changes`, never an approve with buried
  blockers. Reviews the strategy, not results: "if we test per this plan, might
  we be fooled into thinking the system is correct?"
- `acceptance/acceptance-decision.md` (AcceptanceDecision, enum `accept | reject
  | needs_more_evidence | blocked`): Basis lists each evidence item *with its
  opened handle*; every Must Have appears in Basis or Evidence Gaps; defect-class
  tasks record the original-failing-input re-run. Iron law: if you did not open
  the evidence, you did not review it.

**Finding sets** — `review/specialist-findings/<reviewer>.md`
(SpecialistReviewFindingSet). Per finding: Severity · Confidence · Evidence
(`file:line`, walked/constructed path) · Impact · Recommendation. Every set ends
with the three routing sections: **Sightings for other lanes** (one line each,
never developed, never dropped), **Evidence gaps**, **Residual risks** — "none"
only when true. Change-hygiene adds its Verdict
(`clean|minor_noise|needs_cleanup|needs_human_intent`) and an intent-trace
table; its dependency test: a traceable hunk must still survive "would
reverting it leave the acceptance criteria intact?" — yes → default `split`.

**Research (the circuit breaker)** — one file per finding, never a bundle:
`review/research/<id>-<verdict>-<slug>.md` (ReviewResearchNote; frontmatter
`finding_id, verdict, severity, disposition`). Verdict in file name, title, and
first sentence. Sections: Human decision (skeleton, never filled) / Background /
Code context / The finding's original account / My verification and verdict /
then for confirmed/partial: Root cause, Impact, Suggested fix / Prevention /
Related. Verdict on the truth axis, disposition on the scope axis — real but
belonging elsewhere is `confirmed` + `defer` naming the follow-up shape, never a
bent verdict. Failure to falsify is not confirmation. Index
`review/research/00-index.md` (no frontmatter): one row per finding — ID,
Severity, one sentence, Verdict, Disposition, Suggested fix, empty Human
decision column, link — ordered confirmed/partial P0→P1→P2 (fix-now before
defer), needs-human, then false positives at the bottom.

## Failure record

| Claim | Rebuttal |
| --- | --- |
| "Three reviewers flagged this — must be real." | They can share one wrong premise. Only a walked failure path counts. |
| "The artifact is named `validated-requirements` — context confirmed." | A filename is a claim. Open it before any grade rests on it. |
| "Status says passed — mostly ready." | A green word with no inspectable handle is `needs_more_evidence`; testing that word is the whole job. |
| "The proposed fix adds a small wrapper, but it closes the finding." | That is the ratchet. An uncalled-for abstraction is a new must-fix. |
| "Context is missing → blocked." | If you can name what would unblock you, it's `needs_more_evidence`. |
| "It's a one-line fix; faster to patch it myself." | You never author what you then approve. |
| "This security finding is only 0.60 — too weak to file." | 0.60 is the deliberate floor. Below it: hold, plus one Residual-risks line — never silence. |
| "The tests pass, so the behavior holds." | Tests encode the author's blind spots. Walk hostile values yourself. |
| "The caller isn't in the diff, so this stays a hedge." | Open it; a one-file read settles it. |
| "A version bump covers the removal." | Only a still-callable old surface or an explicit deprecation window is a migration path. |
| "Nothing falsified it → confirmed / clean." | Failure to falsify is not confirmation; "clean" without the per-class passes means you didn't look. |
| "It's real but not this task's to fix." | Truth and landing are different axes: `confirmed` + `defer`, never a bent verdict. |

Done when: every finding carries its walked path, every verdict its opened
evidence, verified findings are separated from hunches in the contracted
artifacts, and real problems outside the asked question were reported as
sightings, not dropped.
