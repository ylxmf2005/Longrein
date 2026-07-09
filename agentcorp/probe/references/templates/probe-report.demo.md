---
artifact_type: ProbeReport
task_id: 20260603-120000-example-task
author_agent: probe
status: in_progress
source_artifacts:
  - none
---

# Probe Report — <topic>

<!--
The frontmatter above is the artifact contract. The sections below are a starting skeleton, not a fixed form:
keep what serves the terrain, delete what does not, add what is missing — but never drop the Unknowns Ledger,
"What you asked vs what the territory says", or "How to instruct better" — that last section is the handoff
feed for `brainstorm` and `validate-requirements`. This is a living document: update it in place as entries
resolve; keep resolved entries visible with their evidence. status stays in_progress until the sponsor
confirms the terrain is settled, then completed.
-->

## What you asked vs what the territory says

- You assumed <assumption from the sponsor's request>; the territory shows <corrected fact> (`path/to/file.py:120`).
- (At most five corrections. Each anchored. This section earns the read.)
- (If the map genuinely holds: say so, and name what you checked to conclude that.)

## The terrain

(Teach broad to narrow: the concepts the sponsor needs, the moving parts and what each owns, the flow end to
end. Intuition before mechanism. Anchor every claim — `file:line`, command + output excerpt, commit, doc path,
dated URL. Separate fact / inference / assumption.)

## What would have surprised you

- <History, potholes, intentional designs that look wrong, hidden constraints, in-repo prior art — anchored.>
- (If genuinely nothing: state why this terrain is simple, and what you checked to conclude that.)

## What "good" looks like here

- <Local conventions, exemplar files to imitate, the shape a change is expected to take.>

## Unknowns Ledger

| ID | Unknown | Blocks | Tried | Best hypothesis | Owner | How to resolve | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| U-1 | <what is unknown> | <which decision it blocks> | <what I already did> | <hypothesis, marked as such> | probe / sponsor / together | <concrete next step> | open |
| U-2 | <resolved example> | <decision> | <tried> | <hypothesis> | sponsor | <step> | resolved: <evidence> |

Write "none" when there are none.

## How to instruct better

- <Three to six concrete things the sponsor can now specify that they could not before the probe.>

---

Pre-delivery self-check — if any item hits, go back and rewrite:

- A key claim carries no anchor (file:line, command output, commit, doc, dated URL).
- A ledger entry is a bare question — no "tried", no hypothesis, no owner.
- "What would have surprised you" is empty without an explicit "genuinely simple, because..." defense.
- The report answers only the literal request and adds nothing the sponsor did not know to ask.
- A "correction" in section 1 is manufactured — a nitpick inflated into a headline instead of an honest "the map holds".
- A sweep source deliberately skipped is not named as unswept in the ledger.
- A section a zero-context reader needs (what a term means, what a component is for) assumes repo knowledge.
- The file was rewritten from scratch instead of updated in place while entries were still open.
