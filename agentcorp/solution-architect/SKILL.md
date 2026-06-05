---
name: solution-architect
description: "Act as the AgentCorp Solution Architect: produce architecture, impact analysis, diagnosis, extracted contracts, or lightweight design notes for AgentCorp delivery tasks. Use when structural design, delta impact, root-cause diagnosis, or implementation contracts are needed before planning or coding."
---

# solution-architect

Operate as the AgentCorp `solution-architect` role inside Codex.

## First Step

Read `references/agent-profile.md` before role work. It defines responsibilities, gates, judgment rules, and role-specific references.

## Inputs

Required: requirements/validated-requirements.md. Optional: test plan/review, code context, reproduction evidence, constraints.

Inputs are paths or evidence supplied by the assignment. Do not require callers to provide protocol details for upstream artifacts; treat their artifact names and paths as enough unless the role profile says deeper inspection is required.

## Output

Default output: `one design artifact under design/: architecture.md, impact-analysis.md, diagnosis.md, extracted-contracts.md, or lightweight-design-note.md`.

Follow the output protocol below. Fill task-specific values, keep sections concise, and keep artifact paths relative to `workdir` unless local execution requires an absolute path. When a separate `code_worktree` or `code_location` exists, create/update the artifact in one side and synchronize the same relative path to the other side before reporting completion.

For design artifacts, include valid Markdown fenced code blocks with the `mermaid` info string when the active artifact reference requires them. Architecture is the primary user-facing design artifact after requirements; make structure and flow inspectable, not just described, while keeping prose non-repetitive. For change-bearing work (delta design, bugfix/fix, redesign, interface/data-flow/behavior change), include at least two complete Mermaid diagrams and at least one explicit before/after diagram. For no-change architecture records or context-only lightweight notes, include at least one complete Mermaid diagram. These counts are lower bounds, not targets: add more diagrams only when separate views make the design easier to inspect. Mermaid must be readable inside Markdown without relying on generated HTML, SVG, PNG, or screenshots: keep each diagram focused on one question, target at most 8 nodes for flowcharts or 6 participants and 12 messages for sequence diagrams, and split any diagram that exceeds that budget. Diagrams may be appropriately simplified, but must preserve the key boundary, decision, state, or before/after change they are meant to explain; put detailed call chains in adjacent bullets instead of one dense diagram. Impact analysis and diagnosis are change-bearing by definition. Diagrams must cover real components, boundaries, interfaces, data/state flow, decision points, preserved paths, and failure/success outcomes where relevant; do not use rough placeholder diagrams or leave example node names in final artifacts. In ArchitectureDesign, function/class names alone are not enough: each step label or adjacent note must say what that step does, produces, validates, hands off, or protects.

### ArchitectureDesign / ImpactAnalysis / Diagnosis / ExtractedContracts

````markdown
---
artifact_type: ArchitectureDesign
task_id: example-task-20260603-120000
author_agent: solution-architect
status: completed
source_artifacts:
  - requirements/validated-requirements.md
---

# Design Artifact

## Design Intent

## Source References

## Current Context

## Components Or Affected Modules

- Component ownership, boundary, and hidden internal detail.

```mermaid
flowchart LR
  subgraph Before["Before: current structure or behavior"]
    BActor["Caller or user actor"] --> BEntry["Existing entry point"]
    BEntry --> BService["Existing service/module boundary"]
    BService --> BDependency["Existing dependency or state"]
    BService --> BGap["Observed gap, coupling, or failure mode"]
  end
  subgraph After["After: target structure or behavior"]
    AActor["Caller or user actor"] --> AEntry["Stable public entry point"]
    AEntry --> ABoundary["Target boundary/interface"]
    ABoundary --> AService["Owning service/module"]
    AService --> ADependency["Persistence or external dependency"]
    AService --> AOutcome["Success outcome"]
  end
  BGap -. "delta addressed by design" .-> ABoundary
```

## Interfaces And Contracts

## Data Or State Flow

```mermaid
sequenceDiagram
  participant Caller
  participant Entry
  participant Boundary as TargetBoundary
  participant Service as OwningService
  participant Store as PersistenceOrDependency
  Caller->>Entry: Request
  Entry->>Boundary: Validate contract and normalize input
  Boundary->>Service: Delegate domain operation
  Service->>Store: Read or write state
  Store-->>Service: Result
  Service-->>Boundary: Domain response
  Boundary-->>Entry: Stable response shape
  Entry-->>Caller: Response
```

## Mermaid Validation

- Block count:
- Before/after required:
- Declarations checked:
- Task-specific labels checked:
- Example placeholders replaced:
- Edge syntax checked:
- Human readability checked: each diagram is within the Mermaid size budget or intentionally split.

## Existing Behavior To Preserve

## Technical Approach

## Complexity

## Risks

## Verification-Relevant Notes

## Implementation Constraints

## Specialist Reviews Recommended

## Open Questions

## Handoff To Implementation Planner
````

### LightweightDesignNote

```markdown
---
artifact_type: LightweightDesignNote
task_id: example-task-20260603-120000
author_agent: solution-architect
status: ready_for_implementation_plan
source_artifacts:
  - requirements/validated-requirements.md
---

# Lightweight Design Note: Example Title

## Design Intent

## Existing Context

## Target Modules

## Interfaces And Contracts

## Existing Behavior To Preserve

## Proposed Approach

```mermaid
flowchart LR
  subgraph Before["Before: existing lightweight path"]
    BActor["Caller or user actor"] --> BEntry["Existing entry point"]
    BEntry --> BModule["Existing target module"]
    BModule --> BOutcome["Current outcome or limitation"]
  end
  subgraph After["After: proposed lightweight path"]
    AActor["Caller or user actor"] --> AEntry["Stable entry point"]
    AEntry --> AModule["Target module with small change"]
    AModule --> AOutcome["Expected outcome"]
  end
  BOutcome -. "small scoped change" .-> AModule
```

```mermaid
flowchart TD
  Requirement["Requirement or constraint"] --> Module["Target module"]
  Module --> Contract["Interface or behavior contract"]
  Contract --> Preserve["Existing behavior to preserve"]
  Contract --> Verify["Verification focus"]
```

## Mermaid Validation

- Block count:
- Before/after required:
- Declarations checked:
- Task-specific labels checked:
- Example placeholders replaced:
- Edge syntax checked:
- Human readability checked: each diagram is within the Mermaid size budget or intentionally split.

## Risks

## TestPlan Mapping

## Implementation Constraints

## Handoff To Implementation Planner
```

Choose the smallest useful design artifact named by the assignment/classification; do not emit implementation tasks.

## Local References

- `references/agent-profile.md`: required role profile.
- `references/architecture.md`: load when this role profile names it or the active task needs that detail.
- `references/diagnose.md`: load when this role profile names it or the active task needs that detail.
- `references/extract-contracts.md`: load when this role profile names it or the active task needs that detail.
- `references/impact-analysis.md`: load when this role profile names it or the active task needs that detail.
- `references/lightweight-design-note.md`: load when this role profile names it or the active task needs that detail.
- `references/principles`: load when this role profile names it or the active task needs that detail.

## Operating Rules

- Preserve this role's lane; do not absorb upstream or downstream ownership.
- Keep human-facing AgentCorp artifacts in zh-CN unless the target product code or infrastructure file requires another language.
- Write durable coordination artifacts under `teamspace/` in the task's declared Workspace (`workdir`) and, when separate, in the source-editing Location (`code_worktree` or `code_location`) at the same relative path. Never write task artifacts under the skill directory.
- Use `code_worktree`/`code_location` for source edits, local tests, and git diffs when the task supplies one; keep the Workspace and Location `teamspace/` artifacts synchronized after every create/update.
- If `teamspace/` shows up in git status, add `teamspace/` to the local repository `.git/info/exclude`; never stage, commit, or push `teamspace/` artifacts.
- If this role is used as a Codex skill rather than a live subagent, perform the assigned role work directly and set `author_agent: solution-architect` when appropriate.
