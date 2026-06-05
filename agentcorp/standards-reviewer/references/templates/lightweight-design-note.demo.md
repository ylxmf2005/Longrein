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
- Rendered diagram assets:

## Risks

## TestPlan Mapping

## Implementation Constraints

## Handoff To Implementation Planner
