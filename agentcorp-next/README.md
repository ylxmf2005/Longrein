# agentcorp-next

**A software-delivery organization written as goals and contracts, not scripts.**

agentcorp-next runs the same trusted delivery pipeline as
[AgentCorp](../README.md) — requirements → test plan → design → implementation →
independent review → verification → acceptance → delivery — but says as little
as possible about *how* any of it is done. It is built for models strong enough
that a hand-written procedure competes with the model's own planning and loses.
What remains is what no model strength can replace: why the work matters, what
counts as done, and the exact coordinates everyone — agents, validators, and the
human sponsor — has agreed to meet at.

## The idea

Instruction corpora for agents contain three kinds of content, and they age
differently as models improve:

| Kind | Example | Fate here |
| --- | --- | --- |
| **Process** — how to do the work | step sequences, hunt-lists, role taxonomies as capability crutches | **deleted** — the model plans better than the script |
| **Judgment** — what counts as good | intent, values, invariants, acceptance philosophy | **kept, compressed** — goals and boundaries, not methods |
| **Contract** — agreed coordinates | artifact paths and shapes, enums, quantified bars, gate mechanics, failure records | **kept verbatim** — a convention's value *is* that it is shared and stable |

The test for the third row: would an equally strong model, working alone,
independently produce the same answer? A better implementation plan — yes, so no
plan is prescribed. The path `review/research/00-index.md`, the gate vocabulary
`approved | skipped | revised | blocked`, the bar "5–8 quiz questions, one
requiring the Background section" — no. Those are arbitrary choices whose value
is that every agent, every run, and the sponsor's muscle memory agree on them.
Drop them and each run invents *a* reasonable format instead of *the* format the
rest of the system expects.

Failure records — each charter's table of rationalizations and their rebuttals —
are contracts too: they are falsified hypotheses, facts about where this
workflow has actually broken. No model can infer a system's history.

**The prime directive: user-visible effect is invariant.** The sponsor sees the
same key artifacts at the same paths in the same shapes, the same gates with the
same vocabulary, the same evidence discipline — regardless of which model
generation is doing the work. Everything the sponsor never sees — planning,
decomposition, reasoning — is the model's own business.

## How a task flows

**deliver** owns the pipeline: it pins "done" with the sponsor (success
criteria, must-never-break, Baseline), classifies the task into one of four
paradigms, and walks the phase sequence — raising every human gate, compiling
the effort budget into concrete counts, and never approving its own artifacts.
Along the way it convenes the other charters:

- **research** maps unknown territory before requirements harden;
  **facilitate** turns open direction into a decision the sponsor actually
  means.
- **build** produces design, plan, and code — the smallest change in the right
  shape, every line traceable to approved intent.
- **review** attacks the result from eleven angles in fresh contexts, then a
  circuit-breaker research pass adversarially verifies every finding before any
  fix lands.
- **verify** proves the changed behavior against a test plan written before the
  code existed, in the environment the claim requires.
- **teach** makes sure the sponsor understands what they are approving — up to
  a quiz-gated walkthrough for changes that matter.
- **compound** turns the finished round into assets that change future tasks:
  regression tests and repo rules land directly; changes to the system itself
  are sponsor-gated proposals.

Fan-out, ordering, and tooling inside each charter are the model's call. The
separation invariants are not: the author of a change never adjudicates its
review, evidence travels as openable handles, and no gate passes silently.

## Reading order

| File | What it holds |
| --- | --- |
| `constitution.md` | Invariants that survive model generations — evidence, separation, consent, truth, contract, scope, record |
| `artifacts.md` | The shared coordinate system: task layout, Baseline, frontmatter, every closed vocabulary, handoff fidelity |
| `deliver.md` | Pipeline ownership: paradigms, gates, effort compilation, parallel orchestration, the delivery report |
| `review.md` `build.md` `verify.md` | The heavy phase charters |
| `research.md` `facilitate.md` `teach.md` `compound.md` | The supporting charters |

Every charter has the same shape: **goal** (one bold sentence) → **judgment**
(the questions and values it owns — no method) → **artifact contract** (key
artifacts: path, required shape, quantified bar) → **failure record** (claim →
rebuttal, from real breakage) → **done when** (testable).

## Governing rules

- **Deletion.** Process may be deleted freely. Judgment may be compressed but
  not dropped. Contracts and failure records are never deleted by rewrite — a
  contract changes only deliberately, with every consumer updated in the same
  landing.
- **Re-add.** Scaffolding returns only against a failing trajectory of a strong
  model running without it. "The model might need this" is not a trajectory.
  Anything re-added carries its trajectory next to it, so it can be deleted
  again with cause.
- **Equivalence.** The corpus is validated by effect, not length: run completed
  historical tasks through it and diff the artifact sets against the shipping
  corpus — same key paths, same section shapes, same enum values, same gates.
  Prose may differ; coordinates may not.

## Lineage

agentcorp-next condenses the 37-skill AgentCorp corpus (~10.6k lines) into
eleven files (~1k lines):

| Here | Absorbs from agentcorp/ |
| --- | --- |
| constitution.md | The iron laws + "How this organization thinks" maxims |
| artifacts.md | workflow.md's artifact layout, enums, Baseline, handoff rules |
| deliver.md | delivery-orchestrator, workflow.md, intake, fresh-start-handoff |
| review.md | 11 specialist reviewers, code/plan/acceptance-review leads, test-plan-reviewer, review-researcher |
| build.md | solution-architect, implementation-planner, implementation-engineer, review-fixer, comment-optimizer |
| verify.md | test-planner, test-leader, api-contract-tester, e2e-tester, regression-tester |
| research.md | probe, parallel-researcher |
| facilitate.md | brainstorm, grill |
| teach.md | explain, walkthrough |
| compound.md | compound, skill-evolution |
| (not carried) | precommit-setup, authenticated-browser-session, semantic-core-translation — operational tools; they transfer as-is when needed |

Status: a lab. Single English tree (Chinese counterpart in
`../agentcorp-next-zh/`), outside the shipping corpus's dual-tree mirror,
router, and validators; the shipping corpus remains `agentcorp/` +
`agentcorp-zh/`.
