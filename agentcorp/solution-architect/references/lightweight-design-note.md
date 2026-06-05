# Lightweight Design Note Reference

Use this for small additions where the target modules and existing architecture are mostly obvious, but implementation still needs a short design record.

## Purpose

Capture the minimum design context needed before Implementation Planner writes a Story Spec. This is not a full architecture document and not an implementation checklist.

## Output Shape

Follow `references/templates/lightweight-design-note.demo.md`.

## Mermaid Diagrams

- If the note describes any behavior, interface, data-flow, or workflow change, include at least two complete Mermaid diagrams, with at least one explicit before/after diagram.
- If the note records context without a system behavior change, include at least one complete Mermaid diagram.
- These counts are lower bounds. Add or split diagrams when multiple views make the note easier to inspect.
- Diagrams must identify real target modules/components, boundaries, current/target flow, preserved behavior, and success/failure outcomes where relevant. Do not use rough placeholder diagrams such as `User --> System --> DB`, and do not leave generic example labels in the final artifact.
- Record Mermaid validation evidence covering block count, before/after presence when required, diagram declaration, task-specific labels, placeholder replacement, edge syntax, and human readability. Keep each diagram focused and readable in Markdown; split larger views instead of relying on generated HTML, SVG, PNG, or screenshots. Do not generate separate rendered files unless the sponsor explicitly asks for them.

## Quality Gate

- Target modules are named.
- Interface changes are explicit, or `none`.
- Existing behavior to preserve is clear.
- Implementation constraints are enough to prevent architecture guessing.
- Risk is low enough that full impact analysis is unnecessary.
- Mermaid coverage matches whether the note changes behavior or only records context, with extra or split diagrams when needed for readability.
- Mermaid validation evidence is recorded.
