# Local TestPlan Reference

Use this when producing the TestPlan phase artifact.

## Purpose

The TestPlan defines boundaries, forbidden zones, and Must Have checkpoints before implementation. It tells implementers what must remain testable and tells testers how to prove the risky behavior.

Keep it short and executable. Summarize coverage at the level needed to expose risk and guide Test Leader.

## Required Shape

Follow `references/templates/test-plan.demo.md`. Keep sections empty only when they are genuinely out of scope.

## Testing Hierarchy

Level 1: Capability tests. Every Must Have and every failure/edge case gets a direct check.

Level 2: Integration/API tests. Every communicating module pair or public contract has at least one success check and one error propagation check.

Level 3: E2E tests. Every user-facing capability appears in at least one full user goal, and every goal has happy and error paths with verification at each step.

Do not move up the hierarchy when the lower level has unresolved failures.

## Environment Spec

Record the environment in plain Markdown:

- Environment kind: local, docker, ssh, hosted, or other.
- Command execution method, when known.
- Working directory, ports, and service URLs when relevant.
- Environment variable names only, unless a non-secret value is required.
- Credential references only; do not print secrets.
- Whether the environment is already available or must be provisioned.

If no environment exists, mark E2E as blocked or local-only and list what evidence will be weaker.

## Quality Gate

Pass only when Must Haves are observable, forbidden zones are concrete, integration checks cover real boundaries, E2E coverage has no unjustified gaps, and recommended tester roles are actionable for Test Leader.
