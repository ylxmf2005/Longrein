---
id: impact-analysis
name: Impact Analysis (Delta Design)
inputs: [validated requirements, existing codebase]
outputs: [impact doc with change summary, affected modules, interface changes, integration points, risk]
optional: false
---

# Phase: Impact Analysis (Delta Design)

## Purpose

The precise delta record for a change to an existing codebase: map what exists, design the delta, and document the impact — affected modules, interface changes, integration points, preserved behavior, and risk. No full architecture rewrite.

## Process

### Step 1 — Map Existing Structure

Read relevant modules, interfaces, and data flows. Understand:
- What modules exist and what they own
- Current interfaces and contracts
- Data flow through the affected area
- Test coverage of the affected area

### Step 2 — Design the Delta

For each change:
- What module does it affect?
- What interface changes are needed (if any)?
- What existing behavior must be preserved?
- What new behavior is introduced?

### Step 3 — Write Impact Doc

Write the impact analysis to the assignment's `output_path`, normally `design/impact-analysis.md`.

Keep it precise and scannable. It should answer what changes, where, what must not break, and what risk remains.

**Required sections:**
1. Change summary (one paragraph).
2. Affected modules/files (cite real paths; line numbers only where they prevent ambiguity).
3. Interface/data changes (list each change; `none` is valid).
4. Integration points (where new code touches existing code).
5. Existing behavior to preserve.
6. Risk assessment (what could break).
7. Complexity estimate (S / M).
8. Delta diagrams: at least two complete Mermaid fenced code blocks with the `mermaid` info string, with at least one explicit before/after diagram. This is a lower bound; add or split diagrams when multiple views are clearer.

If complexity is L or above → escalate to `dev/architecture-first` paradigm.

Mermaid diagrams are mandatory for delta design. Make them complete enough to inspect the change: show real affected modules/files or services, current path, target path, interface/data/state changes, preserved behavior, and relevant failure/success outcomes. Keep each diagram human-readable in Markdown: target at most 8 nodes for flowcharts or 6 participants and 12 messages for sequence diagrams, split larger views, and move long call-chain detail to adjacent bullets. Do not use rough placeholder diagrams such as `User --> System --> DB`, and do not leave generic example labels in the final artifact. Validate the fenced Mermaid blocks with `mmdc`/Mermaid tooling when available; otherwise record manual validation evidence covering block count, before/after presence, diagram declaration, task-specific labels, placeholder replacement, edge syntax, and readability budget. Do not generate separate rendered files unless the sponsor explicitly asks for them.

## Principles

- `principles/information-hiding.md` — Don't break existing encapsulation
- `principles/cohesion-separation.md` — New code goes in the right module
- `principles/module-depth.md` — Don't make interfaces wider than necessary

## Outputs
- Markdown impact analysis at the assigned `output_path`.

## Quality Gate
- All affected modules identified
- Interface changes are explicit (or explicitly "none")
- Integration points documented
- Risk assessment present
- At least two complete Mermaid diagrams are present, including one before/after diagram; more are present when needed for readability
- Mermaid validation evidence is recorded
- Complexity is S or M (otherwise escalate)

## Skip Conditions
Used for enhancement work. Greenfield and major redesigns use `architecture`; bugfixes use `diagnose`; small additions use `lightweight-design-note`.
