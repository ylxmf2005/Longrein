# Local AutoDev Workflow

Use this reference progressively while coordinating work. It is the Delivery Orchestrator's local workflow contract and does not depend on any external runtime directory.

## Operating Philosophy

- Define done before routing: what must work, what must not break, what is out of scope.
- Understand before changing: require enough code, test, requirement, issue, or design context for the selected phase.
- Present the phase sequence before work begins; this is the pipeline commitment.
- Preserve author/reviewer separation. Artifact authors do not approve their own artifacts.
- Treat every result as evidence. A passing command is useful only if it proves the changed behavior.
- Stop when the success criteria are met. Do not absorb adjacent scope into the current run.
- Keep artifacts short and role-scoped: each phase writes only what its owner is responsible for, cites upstream artifacts instead of restating them, and adds detail only when it changes a decision or prevents implementation/verification ambiguity.
- Use Markdown files with YAML frontmatter for all assignments, receipts, manifests, and phase artifacts.

## Workflow Modes

Every task selects one workflow mode before phase execution begins:

| Mode | Default? | How it works | When to use |
| --- | --- | --- | --- |
| `single-agent` | Yes | Delivery Orchestrator executes non-review phases directly in the current workflow. Review phases still go to separate review agents. | Normal tasks, small/medium changes, or any work where one agent can preserve enough context. |
| `subagents` | No | Delivery Orchestrator delegates phase artifacts to stage owners through assignment/receipt files and validates each returned artifact. | Sponsor requests subagents, L/XL work, parallel implementation, or phases needing separate authorship beyond review. |

Default to `single-agent`. Switching to `subagents` requires an explicit sponsor choice or a recorded orchestration reason: high complexity, independent parallel modules, specialized execution environment, or a strong need for author separation beyond the review phases.

Review independence is mandatory in both modes. `test-plan-review`, `plan-review`, `code-review`, and `acceptance-review` are always assigned to their review owners; the Delivery Orchestrator does not approve its own artifacts or evidence.

In `single-agent`, keep the same phase vocabulary and artifact paths. The Delivery Orchestrator writes the non-review artifacts directly, records itself as owner in `manifest.md`, and may omit assignment/receipt files for those phases. Delegated review phases keep assignment/receipt files.

In `subagents`, use the full handoff discipline for every delegated phase.

## Task Classification

| Signal | Paradigm |
| --- | --- |
| New project/system, new major subsystem, or no existing codebase | `dev/architecture-first` |
| Defect, regression, incorrect behavior, crash, data loss, or security bug | `bugfix/hypothesis-driven` |
| Single function/component/endpoint, 1-2 modules, no existing interface changes | `addition/lightweight` |
| Existing product enhancement, behavior extension, or interface/data-flow change | `enhancement/delta-design` |

When uncertain, choose `enhancement/delta-design`. If a phase quality gate reveals mismatch, reclassify before continuing.

## Human Gate Policy

Human gates are sponsor checkpoints, not phase quality gates. A skipped human gate removes the sponsor pause; it does not weaken the evidence required to continue.

Default human gates:

- Requirements
- TestPlan
- Design or diagnosis
- Implementation Story Spec
- Blocking or risky review/verification decisions
- Final delivery

Allowed outcomes for a human gate:

| Outcome | Meaning |
| --- | --- |
| `approved` | Sponsor approved or said to continue. |
| `skipped` | Sponsor explicitly skipped this gate. |
| `revised` | Sponsor requested changes; rerun or amend the owning phase before continuing. |
| `blocked` | Sponsor input, credentials, environment, or risk acceptance is required. |

For small low-risk changes, ask the sponsor whether to skip specific upcoming gates. Name the exact gates and keep review independence intact. Example: "This is a small isolated change; should I skip the TestPlan and Design human gates, keep Code Review, and report Final delivery?"

Never skip a human gate silently. Record skipped gates in `task.md` Gate History and in `manifest.md`.

Mandatory pauses even when gates are skipped or full-auto is requested:

- Requirements confidence is LOW or success criteria are unclear.
- Priority, scope, or risk acceptance is unclear.
- A review owner returns `request_changes` or `needs_more_evidence`.
- Verification fails or required evidence is missing.
- Credentials, environment, or permissions are missing.
- Final delivery status needs to be reported.

## Paradigms

### `dev/architecture-first`

1. `validate-requirements`
2. `test-plan`
3. `test-plan-review`
4. `architecture`
5. `extract-contracts` unless S complexity with a single submodule and no public/shared interface risk
6. `implementation-plan`
7. `plan-review`
8. `implement`
9. `code-review`
10. `verify`
11. `acceptance-review`
12. `deliver`

### `enhancement/delta-design`

1. `validate-requirements`
2. `test-plan`
3. `test-plan-review`
4. `impact-analysis` by default. Use `architecture` instead when structural decisions dominate; produce both only for L/XL work or when the orchestrator explicitly needs separate structural design and delta impact records.
5. `extract-contracts` only for L/XL work with 2+ independent affected modules or public/shared interface changes
6. `implementation-plan`
7. `plan-review`
8. `implement`
9. `code-review`
10. `verify`
11. `acceptance-review`
12. `deliver`

Design artifacts are owned by the Solution Architect.

### `bugfix/hypothesis-driven`

1. `validate-requirements` using the bug report and reproduction confidence
2. `diagnose`
3. `implementation-plan`
4. `plan-review` unless the fix is explicitly collapsed as tiny and low-risk
5. `implement`
6. `code-review`
7. `verify`
8. `acceptance-review`
9. `deliver`

Diagnosis defines correctness and regression criteria. If the bug cannot be reproduced or bounded, block for more information instead of guessing.

### `addition/lightweight`

1. `validate-requirements`
2. `test-plan` with lightweight feature-level acceptance criteria
3. `test-plan-review`
4. `lightweight-design-note` only when target modules or constraints are not obvious
5. `implementation-plan`
6. `plan-review`
7. `implement`
8. `code-review`
9. `verify`
10. `acceptance-review`
11. `deliver`

Escalate to `enhancement/delta-design` when 3+ modules are affected or existing interfaces must change.

## Phase Catalog

| Phase | Owner | Inputs | Outputs | Quality gate |
| --- | --- | --- | --- | --- |
| `validate-requirements` | Delivery Orchestrator (`validate-requirements` skill) | Task description, issue, or requirements draft | Validated requirements with confidence and required Mermaid coverage | Confidence MEDIUM/HIGH; no blocker questions; inputs, outputs, constraints, success criteria understood; change-bearing requests have at least two complete Mermaid diagrams including one before/after view; no-change requests have at least one complete Mermaid diagram; counts are lower bounds and oversized diagrams must be split for Markdown readability; Mermaid validation evidence records syntax and human-readability checks |
| `test-plan` | Test Planner | Validated requirements or diagnosis criteria | Test strategy with risk-ranked checks, required layers, environment needs, and explicit gaps | Must Haves observable; forbidden zones concrete; coverage has no unjustified gaps |
| `test-plan-review` | Test Plan Reviewer | Validated requirements, TestPlan/Test Strategy, project constraints | `approve`, `request_changes`, or `needs_more_evidence` | Test plan can be executed and covers requirement/risk surfaces without test theater |
| `architecture` | Solution Architect | Validated requirements and approved TestPlan | Structural design: key decisions, module boundaries, interfaces, data flow, tradeoffs, risks, and required Mermaid coverage | Required decisions explicit; change-bearing architecture has at least two complete Mermaid diagrams including one before/after view; no-change architecture has at least one complete Mermaid diagram; counts are lower bounds and oversized diagrams must be split for Markdown readability; Mermaid validation evidence records syntax and human-readability checks; diagrams are complete, not placeholders; Implementation Planner can rely on it without inventing architecture |
| `impact-analysis` | Solution Architect | Validated requirements, approved TestPlan, existing codebase context | Delta record: affected modules, interface/data changes, preserved behavior, risks, complexity, and delta Mermaid coverage | Affected modules and interface changes explicit; risk present; at least two complete Mermaid diagrams including one before/after view; counts are lower bounds and oversized diagrams must be split for Markdown readability; Mermaid validation evidence records syntax and human-readability checks; complexity S/M or escalated |
| `diagnose` | Solution Architect | Bug report, reproduction steps, observed failures | Diagnosis with hypotheses tested, evidence, root cause, proposed fix, affected files, regression criteria, and bugfix Mermaid coverage | Root cause causal chain has evidence; no guessing; reproduction status documented; at least two complete Mermaid diagrams including one before/after failure-to-fix view; counts are lower bounds and oversized diagrams must be split for Markdown readability; Mermaid validation evidence records syntax and human-readability checks; diagrams are complete, not placeholders |
| `extract-contracts` | Solution Architect | Architecture or impact doc | Markdown contract artifact with submodule contracts, shared types/schemas, and protocol shapes | Every submodule/interface has a contract; contracts contain signatures/types/shapes only; shared types are centralized |
| `lightweight-design-note` | Solution Architect | Validated requirements, approved TestPlan, obvious existing architecture context | Short design record: target modules, interface changes or `none`, preserved behavior, risks, constraints, and required Mermaid coverage | Target modules and constraints explicit; if the note describes behavior/interface/data-flow/workflow change, at least two complete Mermaid diagrams including one before/after view; if no behavior change, at least one complete Mermaid diagram; counts are lower bounds and oversized diagrams must be split for Markdown readability; Mermaid validation evidence records syntax and human-readability checks; diagrams are complete, not placeholders |
| `implementation-plan` | Implementation Planner | Validated requirements, approved TestPlan, design artifact/contracts | Concise Implementation Story Spec: goal, scoped ACs, ordered tasks, target modules, constraints, verification expectations by reference | First task unambiguous; target paths/modules named; no implementation-changing open questions |
| `plan-review` | Plan Review Lead | Implementation Story Spec plus requirements, TestPlan, design artifact/contracts | `approve`, `request_changes`, or `needs_more_evidence` | Story Spec gives Implementation Engineer enough context to build without inventing architecture |
| `implement` | Implementation Engineer | Approved Implementation Story Spec and Plan Review Lead decision | Working code, focused tests, concise implementation result with changed files, commands, deviations, blockers | Matches approved Story Spec/contracts; focused tests/checks run or blockers documented |
| `code-review` | Code Review Lead | Diff, changed files, Story Spec, requirements, TestPlan, design/diagnosis, local standards | One review decision and triaged findings | Review completed; must-fix issues addressed or decision is request_changes |
| `verify` | Test Leader coordinating testers | Implementation, TestPlan or diagnosis criteria, environment spec | Verification results by capability/integration/E2E/regression | Required checks pass; E2E executed when required; gaps explicit; no fake or inferred success |
| `acceptance-review` | Acceptance Review Lead | Requirements, TestPlan, Story Spec, implementation notes, code review decision, verification evidence, residual risks | `accept`, `reject`, or `needs_more_evidence` | Evidence supports every Must Have and scoped risk; residual risk acceptable |
| `deliver` | Delivery Orchestrator | Accepted implementation and evidence | Delivery report | Report includes files/artifacts, tests, deviations, follow-up, and residual risk |

## Stage Owners

- Delivery Orchestrator owns classification, mode selection, gatekeeping, and final delivery in both modes.
- Delivery Orchestrator owns `validate-requirements` directly, via the `validate-requirements` skill loaded on demand.
- In `single-agent`, Delivery Orchestrator also authors `test-plan`, design/diagnosis/contracts when needed, `implementation-plan`, `implement`, and `verify` outputs directly.
- In `subagents`, Test Planner owns `test-plan`; Solution Architect owns design/analysis artifacts; Implementation Planner owns concise Implementation Story Specs; Implementation Engineer owns `implement`; Test Leader owns verification coordination; API Contract Tester, E2E Tester, and Regression Tester execute assigned verification.
- Test Plan Reviewer owns `test-plan-review` in both modes.
- Plan Review Lead owns `plan-review` in both modes.
- Code Review Lead owns `code-review` in both modes.
- Acceptance Review Lead owns `acceptance-review` in both modes.

## Artifact Organization

When a task produces durable notes, designs, prompts, screenshots, logs, reviews, verification evidence, or handoffs, resolve artifact locations before writing. All durable coordination artifacts live under `<workdir>/teamspace/` and, when a separate `code_worktree`/`code_location` exists, must be synchronized under `<code_worktree>/teamspace/` at the same relative path. Record artifact paths relative to `workdir`. Default task run layout:

```text
teamspace/tasks/<task_id>/
  task.md
  manifest.md
  handoffs/
    001-validate-requirements.md
    001-validate-requirements-receipt.md
  requirements/
    validated-requirements.md
  test/
    test-plan.md
    test-plan-review.md
  design/
    architecture.md | impact-analysis.md | diagnosis.md | extracted-contracts.md | lightweight-design-note.md
  implementation/
    implementation-story.md
    implementation-result.md
  review/
    plan-review.md
    code-review.md
    specialist-findings/
  verification/
    assignments/
    verification-report.md
    test-results/
  acceptance/
    acceptance-package.md
    acceptance-decision.md
  delivery/
    delivery-report.md
```

Use only the files/subdirectories needed for the task. Keep paths relative inside artifacts and handoffs.

- `teamspace/` is local coordination state. If it appears in git status, add `teamspace/` to `.git/info/exclude` for that local repository or worktree; never stage or commit it.

## Orchestrator Artifact Demos

Use shared demo files instead of restating shapes:

- `references/templates/task-record.demo.md` for `task.md`
- `references/templates/task-manifest.demo.md` for `manifest.md`
- `references/templates/phase-assignment.demo.md` for delegated phase assignments
- `references/templates/phase-receipt.demo.md` for delegated phase receipts
- `references/templates/acceptance-package.demo.md` for `acceptance/acceptance-package.md`

Copy the shape, then replace example values with the current task, phase, owner, status, and paths.

## Phase Handoff Discipline

- For delegated phases, Delivery Orchestrator writes the phase assignment file before starting the phase.
- Each delegated phase assignment includes `task_root` as `teamspace/tasks/<task_id>/` relative to `workdir` and an `output_path` relative to that task root. When Location differs from Workspace, the same task root must also exist under `<code_worktree>/teamspace/tasks/<task_id>/`.
- The delegated owner writes the phase artifact at the assignment's `output_path`.
- The delegated owner writes or returns a Markdown receipt that names the artifact path and status.
- Delivery Orchestrator validates that delegated artifact paths match the assignment, the frontmatter `author_agent` matches the owner, and the status satisfies the phase gate.
- Delivery Orchestrator records the assignment, artifact, receipt, human gate result, and phase quality result in `manifest.md`, then synchronizes the updated artifact set between Workspace and Location.
- Delivery Orchestrator stops at active human gates until the sponsor explicitly approves, skips, or redirects.
- In `single-agent`, assignment/receipt files are optional for phases authored by Delivery Orchestrator; the phase artifact and manifest entry are still required. Review phases always use assignment/receipt files because they remain delegated.
- In `subagents`, assignment/receipt files are required for delegated phases.
- Delivery Orchestrator authors the validated requirements artifact itself (via the `validate-requirements` skill) in both modes.
- During delegated verification, Test Leader may write tester assignment files under `verification/assignments/`; testers write result files under `verification/test-results/`; Test Leader writes the final `verification/verification-report.md`.

## Verification Hierarchy

1. Capability: every per-module Must Have and failure/edge case is directly checked.
2. Integration/API: every cross-module or public contract flow has success and error propagation checks.
3. E2E: every user-facing capability appears in at least one full user goal with happy and error paths.
4. Frontend visual/interactive checks when UI changes are involved.

Do not proceed to a higher level while required lower-level checks are failing. If a scenario cannot run, document why and treat it as a gap unless explicitly accepted.

## Parallel Execution Protocol

Parallel implementation is a protocol for the `implement` phase, not a separate phase.

Parallelize only when all are true:

- Complexity is M/L/XL.
- At least two submodules can be built independently.
- Submodules share interfaces but not implementation.
- Architecture or impact doc exists.
- `extract-contracts` is complete.
- Implementation Story Spec slices tasks per contract and preserves only the integration context needed by that submodule.
- TestPlan scopes Must Haves, Need Haves, Failure/Edge Cases, and Forbidden Zones per submodule.

Each parallel implementation session receives exactly these inputs:

1. `STORY_SPEC_PATH`: relative path to the approved Implementation Story Spec.
2. `DESIGN_DOC_PATH`: relative path to architecture, impact, diagnosis, or contracts.
3. `OWN_CONTRACT`: contract stub this session implements.
4. `DEP_CONTRACTS`: read-only contracts this session calls but does not modify.
5. `TESTPLAN_SCOPE`: capability, boundary, Must Have, Need Have, Failure/Edge Cases for the submodule.
6. `FORBIDDEN_ZONE`: explicit redlines for the submodule.
7. `COMPLETION_SIGNAL`: exact done signal expected by the coordinator.
8. `INTEGRATION_CONTEXT`: integration tests and cross-boundary expectations involving this submodule.
