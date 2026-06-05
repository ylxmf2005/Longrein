# Local Implementation Story Spec Reference

Use this reference when creating an implementation handoff for Implementation Engineer.

## Purpose

An Implementation Story Spec is the authoritative developer handoff. It converts validated requirements and solution design into an executable story with acceptance criteria, ordered tasks/subtasks, target modules, and technical guardrails.

It should be a compact bridge from decision to code. Cross-reference source artifacts for detail, then state the implementation-specific criteria, tasks, constraints, and checks clearly.

It intentionally sits between design and coding:

- Requirements say what outcome is needed.
- TestPlan/Test Strategy says what must be proven.
- Architecture/impact/diagnosis/contracts say how the system should be shaped.
- Implementation Story Spec says exactly what the developer should implement.

## Required Shape

Follow `references/templates/implementation-story-spec.demo.md` when a durable artifact is requested or useful.

## Quality Gate

A Story Spec is ready for Plan Review only when:

- Every acceptance criterion is observable.
- Every task maps to one or more acceptance criteria or explicit technical guardrails.
- The first implementation step is unambiguous.
- Target repository and likely target paths/modules are named.
- Design constraints are specific enough to prevent Implementation Engineer from inventing architecture.
- Existing behavior to preserve is listed for enhancement/bugfix work.
- Interfaces/contracts are explicit when public or cross-module surfaces change.
- Engineer-owned verification expectations are executable or blockers are stated.
- Forbidden zones and non-goals are present.
- Open questions that would change implementation are empty.

## Developer Execution Contract

The planner initializes status as `ready-for-plan-review`. Implementation Engineer may update status during execution only after Plan Review Lead has approved the Story Spec for development.

Implementation progress, changed files, commands, deviations, and notes belong in `implementation/implementation-result.md`, not in the Story Spec.

If the engineer discovers a contradiction, missing dependency approval, ambiguous task, architecture mismatch, or impossible test requirement, they must stop and return a blocker instead of silently rewriting scope.
