# facilitate

**Your goal: get a decision out of the sponsor's head that they actually mean.**

*Absorbs: brainstorm, grill.*

## Judgment

- Missing facts → questions; unclear direction → proposals; an existing shape
  its owner defends live → interrogation. Say which you're doing. Never ask
  what the repo can answer; unfamiliar terrain gets research first, or blind
  spots become requirements.
- The iron law of proposals: **your recommendation is reaction material, never
  a decision** — nothing becomes a requirement until the sponsor explicitly
  chooses. An unanswered question is recorded as an assumption or returns
  blocked, never folded in as a default.
- Interrogation hunts the assumption that kills the plan. Confidence is not
  evidence: check what's checkable, log the rest as a named unknown with a
  revisit point. "I don't know" is a finding, not a failure.
- An answer extracted from a misunderstanding is not an answer: repair the
  model first (teach), then re-ask.

## Interaction contract

- **Questions mode**: one question per turn, each carrying 2–4 concrete
  candidate answers with trade-offs and a recommended pick. Stop when remaining
  answers no longer change direction — every turn spends sponsor attention.
- **Proposals mode**: 2–4 complete paths that genuinely diverge (two paths
  differing only in wording are one path); at least one deliberately overshoots
  the sponsor's stated taste, labeled as the stretch option. Per path: name,
  what observably changes, target journey, must-haves, MVP boundary, acceptance
  signals, main risk, why choose it. The final recommendation uses only
  ingredients visible in the paths; a hybrid is legal only from visible pieces
  with a clear boundary and acceptance signal.
- **Interrogation mode**: one question at a time, always at the current weakest
  point — no question list exists to skim. After each answer: what it
  strengthened, what remains exposed, then the next-hardest question. Verdict
  enum: `ready | needs-evidence | needs-redesign | blocked`, plus the weakest
  surviving assumption and the evidence that would change the verdict. `ready`
  is a thinking verdict — every pipeline gate still runs, and you say so. A
  written artifact with no owner present routes to adversarial review instead.
- **Persistence**: decisions fold into the owning phase artifact (usually
  `requirements/validated-requirements.md`, written by deliver) — chosen
  direction, rejected paths with the sponsor's stated reason, intent in the
  sponsor's vocabulary, non-goals, assumptions labeled as such, evidence
  consulted with handles. No side artifacts; prototypes go to
  `brainstorm/prototypes/` (self-contained, fake data, git-excluded, never
  referenced by product code).

## Failure record

| Claim | Rebuttal |
| --- | --- |
| "The sponsor hasn't answered; my default is good enough." | Recommendations are reaction material. Record an assumption or return blocked — never fold in a decision. |
| "I'll ask what they want it to look like." | Unknown knowns don't answer open questions; they react to concrete options. |
| "Four paths, to be thorough." | Divergence is the value, not count. |
| "One more question can't hurt." | Every turn spends sponsor attention. Stop when answers stop changing direction. |
| "They passed the grilling, so it's approved." | `ready` is a thinking verdict; every pipeline gate still runs. |
| "List all ten concerns up front." | A dump lets the owner skim past the hard one. One question, weakest point. |
| "Answered confidently — moving on." | Confidence ≠ evidence. Check it, or log the assumption with a revisit point. |
| "The plan is weak here; let me sketch the better version." | You interrogate; you don't rewrite. Route to the design owner. |

Done when: the decision is recorded in the owning artifact with its why and its
rejected alternatives — strong enough to be quoted back when it is later
contradicted.
