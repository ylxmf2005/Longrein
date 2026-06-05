---
artifact_type: ValidatedRequirements
task_id: example-task-20260603-120000
author_agent: delivery-orchestrator
status: ready_for_review
source_artifacts:
  - sponsor request
confidence: HIGH
---

# Validated Requirements: Example Title

## Sponsor Intent

- Product-level intent, preserving important sponsor wording.

## Problem

- Current user or system problem without prescribing implementation.

## Target Users

- Primary user or system actor and job to be done.

## User Journeys

### UJ-1: Example journey

- Persona and context:
- Entry state:
- Path:
- Success condition:
- Edge case:

```mermaid
flowchart LR
  subgraph Before["Before: current behavior or gap"]
    BActor["Primary user or system actor"] --> BEntry["Entry state"]
    BEntry --> BProblem["Problem, missing capability, or failure mode"]
    BProblem --> BOutcome["Current blocked or degraded outcome"]
  end
  subgraph After["After: required behavior"]
    AActor["Primary user or system actor"] --> AEntry["Same or new entry state"]
    AEntry --> ACapability["Required observable capability"]
    ACapability --> ASuccess["Success outcome and acceptance signal"]
  end
  BProblem -. "validated change" .-> ACapability
```

```mermaid
flowchart TD
  Sponsor["Sponsor intent"] --> Journey["Validated user journey"]
  Journey --> Requirement["Functional requirement"]
  Requirement --> Criteria["Acceptance criteria"]
  Criteria --> Scope["In scope and non-goals"]
  Criteria --> Handoff["Test and architecture handoffs"]
```

## Glossary

- **Term** - Definition used consistently downstream.

## Functional Requirements

### FR-1: Capability name

The system must provide an observable capability.

Acceptance criteria:

- AC-1: Observable condition.

Source: sponsor request or source artifact.

## Non-Goals

- Explicit excluded behavior or scope.

## MVP Scope

- In scope:
- Out of scope:

## Constraints

- Sponsor-provided constraint.

## Success Criteria

- What proves the requirements are satisfied.

## Assumptions

- Assumption requiring confirmation or downstream validation.

## Open Questions

- Q-1: Empty when none.

## Handoff To Test Planner

- Must-have behaviors to prove:
- User journeys requiring E2E coverage:
- Risk areas needing explicit tests:

## Handoff To Solution Architect

- Product constraints to preserve:
- Terms and boundaries that architecture must use:
- Technical questions raised by the requirements:

## Mermaid Validation

- Block count:
- Before/after required:
- Declarations checked:
- Task-specific labels checked:
- Example placeholders replaced:
- Edge syntax checked:
- Rendered diagram assets:
