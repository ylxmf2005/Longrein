---
artifact_type: ScopeChallengeReport
task_id: 20260603-120000-example-task
author_agent: scope-challenger
status: completed
disposition: stay-course
source_artifacts:
  - task.md
  - requirements/validated-requirements.md
---

# Scope Challenge — <topic>

## Trigger claim

- The Delivery Orchestrator considered changing course because: <specific, falsifiable claim>.
- Affected transition: <phase/action that would change or pause>.

## Sponsor goal vs current route

- Observable goal: <what the sponsor needs to be true>.
- Current/requested route: <the mechanism or scope currently planned>.
- Approved boundary: <relevant requirement, Non-Goal, contract, or gate entry>.

## Evidence

| Claim | State | Evidence |
| --- | --- | --- |
| <claim> | fact / inference / assumption | `<file:line>`, command output, commit, or artifact path |

## Counterfactuals

| Route | Goal fit | Scope and compatibility | Migration and verification cost | Residual risk | Reversibility |
| --- | --- | --- | --- | --- | --- |
| Stay on the current route | <assessment> | <price> | <price> | <risk> | <assessment> |
| Smallest structurally honest alternative | <assessment> | <price> | <price> | <risk> | <assessment> |
| Separate refactor/spin-off, when genuinely distinct | <assessment or not applicable> | <price> | <price> | <risk> | <assessment> |

## Disposition

Exactly one: `stay-course` | `surface-choice` | `reframe-required` | `needs-more-evidence`.

Reason: <why the evidence earns this disposition rather than expressing architectural taste>.

## Sponsor briefing

For `stay-course`: `None — record in the Scope Challenge Ledger without interrupting the sponsor.`

Otherwise provide only what the Delivery Orchestrator needs to present:

- What the evidence changes.
- Recommended route and its price.
- Other viable options and their prices.
- The exact affected transition that waits for the sponsor.

## Evidence gaps and independent work

- Missing evidence: None | <what remains unknown and what was tried>.
- Continueable reversible work: <work that does not depend on the route decision>.

---

Pre-delivery self-check:

- The report separates the sponsor's goal from the proposed mechanism.
- Every load-bearing fact has an inspectable handle; inference and assumption are labeled.
- No product code, requirements, design, or task scope was edited.
- `stay-course` does not manufacture sponsor noise; every other decision-relevant disposition includes a concise sponsor briefing.
- The recommendation is priced and remains reaction material, not a decision.
