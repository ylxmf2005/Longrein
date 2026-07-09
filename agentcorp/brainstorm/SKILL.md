---
name: brainstorm
description: "Use when AgentCorp needs a reusable brainstorm capability to clarify, pressure-test, or reshape requirements before planning or implementation, especially during Delivery Orchestrator validate-requirements when sponsor intent, success criteria, scope, user journey, or solution direction is not yet clear."
---

# Brainstorm

This is a general AgentCorp thinking capability, not a delivery phase and not a role with its own gate. Any role may load it when the current work needs this behavior; its primary home is `delivery-orchestrator` during `validate-requirements`.

The goal is to turn an unclear request into sponsor-approved, observable requirements. Two different gaps hide inside "unclear", and they need different instruments:

- **Known unknowns** — facts the sponsor knows they haven't settled. Close them with **Mode 1**: focused questions the repo cannot answer.
- **Unknown knowns** — preferences the sponsor cannot state but recognizes on sight. Surface them with **Mode 2**: complete, genuinely different options to *react* to — reacting is cheap, composing is expensive.
- **Unknown unknowns** — terrain the sponsor doesn't know exists — are not brainstorm's instrument. On unfamiliar territory, run `probe` first and ground the brainstorm in its report; interviewing a sponsor about ground nobody has scouted just launders blind spots into requirements.

Do not implement, plan architecture, or write downstream artifacts while brainstorming. Fold the result back into the owning phase artifact, usually `requirements/validated-requirements.md`.

**Iron law: your recommendation is reaction material, never a decision.** Both modes require you to compute a recommended default — it exists so the sponsor has something concrete to react to. Nothing becomes a requirement until the sponsor explicitly chooses it, no matter how obvious your default looks or how slowly the sponsor replies.

## Operating principles

- **Validate intent before shape.** Preserve the sponsor's important wording, but dig for the underlying problem, target user, success signal, and non-goals.
- **Never ask what the repo can answer.** Before any question reaches the sponsor, check whether code, docs, prior artifacts, or `teamspace/learnings/` already answer it — go read, then ask only what remains. A question the repo could have answered is effort pushed back onto the person who delegated it.
- **One question at a time unless comparing options.** Missing facts get focused follow-up; unresolved direction gets complete alternatives.
- **Make the sponsor react, not compose.** Every question ships with 2–4 concrete candidate answers, their trade-offs, and your recommended default; every direction ships as a path complete enough to choose, refine, or reject. Blank-page questions are for interrogators.
- **Ground factual claims.** If the answer depends on repo behavior, product docs, prior tasks, or cloned reference projects, inspect evidence before claiming — and carry the handle (`file:line`, command + output, doc path) into the decision record.
- **Grill with care.** Pressure-test problem reality, user value, scope, risks, and simpler alternatives without turning the sponsor into an interview subject.
- **Keep requirement vs implementation clean.** Brainstorm product behavior, journeys, success criteria, and scope. Leave tables, modules, APIs, and algorithms to design unless the brainstorm is explicitly about a technical choice.

## Mode 1: Question-by-Question

Use when the direction is mostly clear but one or more facts would change confidence from LOW to MEDIUM/HIGH.

Build the full question list silently first, then rank by leverage and ask **one per turn**, highest leverage first: answers that would change the architecture or data model, then scope and observable behavior, then journey and UX, then cosmetics. Each question carries the candidate answers, the trade-off each implies, and which one you would pick and why.

Prefer questions that unlock validated requirements: who is the primary user or actor; what must be observable on success; what is explicitly out of scope; what current behavior or workaround this replaces; which risk the sponsor will accept; what would make this a no-go.

After each answer, fold it into a running requirement picture. **Stop when the remaining answers would no longer change direction** — record what's left as assumptions or open questions instead of asking. If the next missing fact would still block design or test planning, ask it; if the sponsor cannot or does not resolve it, return `blocked` naming exactly which fact is missing.

## Mode 2: Multi-Path Proposal

Use when the sponsor's request points to a goal but not a shape, or when several plausible shapes would lead to different validated requirements. Present 2–4 complete paths and ask the sponsor to choose.

For detailed rules, load `references/proposal-paths.md`. The short version: use AgentCorp proposal lenses, not invented roles; each path complete enough to select, refine, or reject; paths must be genuinely divergent — two paths that differ only in wording are one path; push at least one path past the sponsor's stated taste, since hidden preferences only show up at the boundary; and the final recommendation may only use ingredients visible in the paths.

**When the undecided shape is visual or interactive** — a page, a report layout, a CLI's feel — prose paths under-serve reaction. Render each path as a disposable single-file prototype (self-contained HTML with realistic fake data — lorem ipsum hides layout problems) under `brainstorm/prototypes/` in the task root, excluded from git like all teamspace artifacts. The prototypes exist to be reacted to and thrown away, never to be wired into the product.

## Grounding

Before strong claims, inspect the smallest useful evidence set:

- the probe report, when one exists — it is the brainstorm's map of the territory
- local standards and context: `AGENTS.md`, `README*`, `STRATEGY.md`, `CONCEPTS.md`
- prior AgentCorp artifacts: `teamspace/tasks/`, `teamspace/learnings/`, prior requirements, plans, reviews
- related product docs or code when absence/presence changes requirements
- external references only when the sponsor asks or the decision depends on current/third-party facts

When studying external repositories, clone to a scratch location such as `/tmp`, read them as evidence, and do not run their scripts or setup commands unless the sponsor explicitly authorizes it.

## Grill lenses

Use only the lenses that fit; do not dump the list on the sponsor. Load `references/grill-lenses.md` when the request needs deeper pressure-testing.

## Red flags — stop and rethink the moment one appears

| Thought | Reality |
| --- | --- |
| "The sponsor hasn't answered — my recommended default is good enough." | The recommendation exists to be reacted to, not adopted. An unconfirmed default is an assumption: record it as one and keep the question open, or return `blocked` — never fold it in as a sponsor decision. |
| "I'll just ask the sponsor; they know best." | They know their intent. Whether the repo already does X, what the current behavior is, what prior tasks tried — that is your homework, not their question. |
| "I'll ask what they want it to look like." | Unknown knowns don't answer open questions; they react to concrete options. Show 2–4 real alternatives instead. |
| "Four paths, to be thorough." | Paths that differ only in wording are one path padded. Divergence is the value, not the count. |
| "All paths stay safely inside what they asked for." | Hidden preferences live at the boundary. One path should overshoot the stated taste so the reaction draws the real line. |
| "One more question can't hurt." | Every turn spends sponsor attention. When answers stop changing direction, stop asking and record assumptions. |
| "The territory is unfamiliar, but the interview will surface it." | Interviews surface what the sponsor knows. Unfamiliar territory needs `probe` first, or the blind spots become requirements. |

## Output back to AgentCorp

Return a concise decision record to the owning phase:

- chosen direction or selected path — and the paths rejected, with the sponsor's stated reason (rejections encode taste the next round would otherwise re-litigate)
- sponsor intent in the sponsor's vocabulary
- target users / actors
- observable journeys and success criteria
- must-have requirements
- non-goals and MVP boundary
- assumptions and open questions
- evidence consulted — with handles (path, `file:line`, or command + output), not just source names, so the owning phase can re-verify

Before returning the record, check: every direction marked as chosen traces to an explicit sponsor statement, not to your recommendation; every factual claim carries its handle; assumptions and open questions are labeled as such, not folded into must-haves; any prototypes live under `brainstorm/prototypes/`, unstaged, with nothing in product code referencing them.

For `validate-requirements`, this synthesis is not a separate gate. The Delivery Orchestrator writes it into the validated requirements artifact and still needs the sponsor's human confirmation before the requirements gate passes.

## Role integration

- **Delivery Orchestrator**: use during `validate-requirements` when confidence is LOW or multiple shapes remain. Pick Mode 1 for missing facts, Mode 2 for unresolved direction; recommend `probe` first when the territory is unfamiliar to sponsor or orchestrator.
- **Solution Architect**: use only to clarify product intent before design; do not use it to bypass validated requirements.
- **Test Planner / Test Leader**: use only when success criteria or user journeys are too vague to test; send the clarification back to the owning requirements artifact.
- **Review roles**: do not reopen requirements during review unless the artifact itself is ambiguous enough to block the review; report that as `needs_more_evidence`.
