# Local Plan And Design Review Reference

Use this when reviewing architecture, impact analysis, diagnosis, or extracted contracts before implementation.

## Architecture Artifact

Required for greenfield or major subsystem work:

- Problem statement.
- Component breakdown and ownership.
- Data flow.
- Technology choices and rationale.
- Complexity estimate.
- Complexity analysis: change amplification, cognitive load, unknown unknowns.
- Test strategy.
- Design intent: 3-5 bullets naming key modules, interfaces, and hiding decisions.
- Mermaid coverage:
  - Change-bearing architecture (enhancement/delta, bugfix/fix, redesign, interface/data-flow/behavior change): at least two complete Mermaid diagrams, including one explicit before/after diagram.
  - No-change architecture record: at least one complete Mermaid diagram.
- Mermaid counts are lower bounds, not exact targets; large or multi-view designs should add diagrams or split oversized diagrams for readability.
- Mermaid validation evidence, either tool-based or manual, covering block count, before/after presence when required, diagram declaration, task-specific labels, placeholder replacement, edge syntax, and human readability within the size budget.
- Diagram fit: architecture uses the Mermaid view that best explains the design question, such as flowchart, sequence diagram, class/UML-style diagram, or state diagram; direct vertical flow is acceptable when clearest.
- Diagram completeness: diagrams identify real affected modules/components, boundaries, interfaces, data/state flow, decision points, preserved paths, and success/failure outcomes where relevant. Each architecture step says what happens, what is produced/validated/handed off, or what boundary is protected; function/class names alone fail review. Rough placeholder diagrams such as `User --> System --> DB` fail review.

Quality gate: modules have clear responsibilities, interfaces hide implementation detail, Mermaid diagrams meet or exceed the work-type count and before/after requirements, diagrams make structure/flow inspectable in Markdown with recorded validation evidence and step-level meaning, verification-relevant risks are visible, complexity is acknowledged rather than pushed to callers, and the architecture remains concrete without repeating itself.

## Impact Analysis Artifact

Required for enhancements to an existing codebase:

- Change summary.
- Affected modules/files.
- Interface changes, or explicit `none`.
- Integration points.
- Existing behavior that must be preserved.
- New behavior introduced.
- Risk assessment.
- Complexity estimate.
- At least two complete Mermaid diagrams, including one explicit before/after diagram; more or split diagrams when needed for readability.
- Mermaid validation evidence covering block count, before/after presence, declaration, task-specific labels, placeholder replacement, edge syntax, and human readability within the size budget.

Quality gate: all affected modules are identified, interface changes are explicit, risk is concrete, Mermaid diagrams meet or exceed the lower bound and make the delta inspectable with one before/after view, and complexity is S/M. Escalate L+ work to architecture.

## Diagnosis Artifact

Required for bugfixes:

- Reported symptom and expected behavior.
- Reproduction or reason reproduction is unavailable.
- Hypotheses tested and evidence for each.
- Confirmed root cause with causal chain.
- Proposed minimal fix.
- Affected files/modules.
- Regression tests or verification criteria.
- At least two complete Mermaid diagrams, including one explicit before/after diagram showing the failing path before and the corrected path after; more or split diagrams when needed for readability.
- Mermaid validation evidence covering block count, before/after presence, declaration, task-specific labels, placeholder replacement, edge syntax, and human readability within the size budget.
- Diagram completeness: diagrams identify the actor/trigger, entry point, failing component, root-cause state or decision, corrected path, preserved behavior, and success/failure outcomes where relevant. Rough placeholder diagrams such as `User --> System --> DB` fail review.

Quality gate: no fix proceeds without an evidence-backed root cause unless the coordinator explicitly accepts residual uncertainty; bugfix Mermaid diagrams must make the before/after behavior change inspectable and include recorded validation evidence.

## Lightweight Design Note

Required for small additions when target modules or constraints are not obvious:

- Target modules are named.
- Interface changes are explicit, or `none`.
- Existing behavior to preserve is clear.
- Implementation constraints are enough to prevent architecture guessing.
- Risk is low enough that full impact analysis is unnecessary.
- Mermaid coverage:
  - If the note describes behavior, interface, data-flow, or workflow change: at least two complete Mermaid diagrams, including one explicit before/after diagram.
  - If the note records context without a system behavior change: at least one complete Mermaid diagram.
- Mermaid counts are lower bounds; add or split diagrams when needed for readability.
- Mermaid validation evidence covering block count, before/after presence when required, declaration, task-specific labels, placeholder replacement, edge syntax, and human readability within the size budget.
- Diagram completeness: diagrams identify real target modules/components, boundaries, current/target flow, preserved behavior, and success/failure outcomes where relevant. Rough placeholder diagrams such as `User --> System --> DB` fail review.

Quality gate: the note is small enough to stay lightweight, but its Mermaid diagrams still meet the change/no-change count rule and are complete enough for Implementation Planner to proceed without inventing structure.

## Extracted Contracts

Required when parallel implementation or public/shared interfaces are involved:

- One contract per submodule/interface.
- Shared types/schemas in one shared contract.
- Signatures, types, schemas, or protocol shapes only.
- No implementation bodies.

Quality gate: every planned submodule has a contract, contracts expose only what callers need, and shared types are not duplicated.

## Review Decision

Approve only when the selected artifact gives Implementation Engineer enough context to build without inventing architecture. Request changes for concrete defects. Use `needs_more_evidence` when the artifact may be right but lacks proof or source context.
