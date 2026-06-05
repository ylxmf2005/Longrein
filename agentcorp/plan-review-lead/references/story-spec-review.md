# Local Implementation Story Spec Review Reference

Use this when reviewing an Implementation Story Spec before implementation.

## Required Story Spec Sections

- Story.
- Source Context.
- Acceptance Criteria.
- Tasks / Subtasks.
- Implementation Constraints.
- Verification Expectations.
- Review Focus.
- Status.

## Review Checklist

- Planner-created specs use `ready-for-plan-review`; approval is recorded in the Plan Review Decision, not by rewriting the planner's status.
- Every acceptance criterion is observable and traces to requirements or design/test context.
- Every task/subtask is tied to acceptance criteria or explicit technical guardrails where useful.
- Target modules/files are specific enough for the first implementation pass.
- Implementation Constraints include architecture/design constraints, existing code context, interfaces/contracts, forbidden zones, and references needed to implement.
- Enhancement/bugfix stories state existing behavior to preserve.
- Public interfaces, data schema, auth/authz, reliability, performance, and security risks are surfaced for specialist review when relevant.
- Verification Expectations are executable by Implementation Engineer or clearly delegated to Test Leader/testers.
- The plan does not require Implementation Engineer to infer missing architecture, invent scope, or choose unapproved dependencies.

## Failure Modes

Request changes for vague tasks, missing acceptance criteria, missing design constraints, target ambiguity, unreviewed interface changes, absent regression criteria for bugfixes, or testing requirements that cannot be executed or delegated.

Use `needs_more_evidence` when requirements, TestPlan, diagnosis evidence, code context, or specialist review is missing but could validate the Story Spec.
