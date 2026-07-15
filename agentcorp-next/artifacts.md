# Artifacts — the shared coordinate system

Every path, enum, and format here is contract, not guidance: agents, validators,
and the sponsor's muscle memory all depend on these exact spellings. A stronger
model changes none of this — it only fills the shapes better. One authoritative
home per rule: charters cite this file rather than restating it.

## Task identity and Baseline

- `task_id`: `<YYYYMMDD-HHMMSS>-<desc-slug>` (timestamp first — a directory listing
  browses in time order). Task root: `teamspace/tasks/<task_id>/`.
- Before minting a new task, reconnoiter `teamspace/tasks/` — an in-flight task on
  the same intent is resumed or explicitly superseded, never silently duplicated.
- Every task pins its **Baseline** in `task.md` frontmatter at intake, before any
  artifact reads code: `source_ref` (what the branch is cut from and verified
  against), `target_ref` (what delivery merges into), `merge_base`. Both refs are
  sponsor intent confirmed out loud, never inferred from whichever branch happened
  to be checked out. Any assignment that reads, diffs, or edits code carries the
  three refs; when `source_ref != target_ref`, delivery additionally requires the
  work reconciled onto `target_ref`. Baseline drift (either ref moved) reopens the
  affected claims before any dependent phase advances.

## Task directory layout

```text
teamspace/tasks/<task_id>/
  task.md                          # TaskRecord — live execution ledger
  manifest.md                      # TaskManifest — phase/owner/gate table
  probe/00-probe.md                # optional terrain report
  handoffs/                        # auxiliary: assignments + receipts (execution-dependent)
  requirements/validated-requirements.md
  test/
    test-plan.md                   # overall strategy; playbooks alongside:
    api-test-plan.md  e2e-test-plan.md  regression-test-plan.md
    test-plan-review.md
  design/                          # combine as needed; multiple may coexist
    architecture.md  impact-analysis.md  diagnosis.md  interface-contract.md
  implementation/
    implementation-story.md  implementation-result.md
  review/
    plan-review.md  plan-review-findings/
    code-review.md  specialist-findings/
    research/
      00-index.md                  # one line per finding, P0→P1→P2
      <id>-<verdict>-<slug>.md     # one file per finding — never a bundle
    fix-result.md  fix-records/<group-slug>.md
  walkthrough/<slug>.html
  verification/
    assignments/  verification-report.md  test-results/<tester-slug>.md
  acceptance/
    acceptance-package.md  acceptance-decision.md
  compound/compound-result.md
  delivery/delivery-report.md
```

Outside the task dir: `teamspace/testing-context.md` (project-level testing
ledger, cross-task), `teamspace/compound/<slug>.md` (cross-task compound store),
`teamspace/skill-evolution/pending/` (gated self-modification proposals),
`teamspace/walkthroughs/`, `teamspace/probes/`, `teamspace/replays/` (standalone
homes, named `<YYYYMMDD>-<slug>`).

**Key vs auxiliary.** Everything above except `handoffs/`, `verification/
assignments/`, and exploration scratch (`test/exploration/`) is a key artifact:
the sponsor opens it, gates on it, or navigates by it — path and shape are
invariant. Auxiliary coordination files follow whatever handoff mechanics the
runtime uses; the *fidelity rules* below still bind whatever replaces them.

## Frontmatter and hygiene

- Every markdown artifact carries YAML frontmatter: `artifact_type`, `task_id`,
  `author_agent`, `status`, plus `source_artifacts:` where lineage matters.
  Exception: self-contained HTML artifacts carry none — their receipt declares
  the type. Paths inside artifacts are relative to `workdir`; never bake in a
  machine-specific location.
- `artifact_type` values: `TaskRecord`, `TaskManifest`, `PhaseAssignment`,
  `PhaseReceipt`, `AcceptancePackage`, `AcceptanceDecision`, `CodeReviewDecision`,
  `PlanReviewDecision`, `TestPlanReviewDecision`, `SpecialistReviewFindingSet`,
  `ReviewResearchNote`, `ArchitectureDesign`, `ImpactAnalysis`, `Diagnosis`,
  `InterfaceContract`, `ImplementationStorySpec`, `ImplementationResult`,
  `FixRecordSet`, `FixResult`, `TestPlan`, `TestingContext`,
  `TestExecutionResult`, `VerificationReport`, `CompoundResult`,
  `DeliveryReport`, `ProbeReport`, `SpecialistResearchReport`, `ResearchPackage`,
  `Explanation`, `ExplanationSet`, `ChangeWalkthrough`, `ReplayReport`,
  `SkillEvolutionProposal`.
- `teamspace/` is local coordination state: excluded from git (`.git/info/exclude`),
  never staged or committed; when a separate code worktree exists, artifacts sync
  to the same relative path on both sides before completion is reported. Any
  repo-level scan (grep for consumers, dead-code sweeps, coverage gates) excludes
  `teamspace/`.
- Human-readable prose follows the sponsor's language recorded at intake
  (`output_language`); protocol fields, enums, paths, and code identifiers stay
  original.

## Closed vocabularies

| Vocabulary | Values (exact) |
| --- | --- |
| Human gate outcome | `approved` \| `skipped` \| `revised` \| `blocked` |
| Review decision | `approve` \| `request_changes` \| `needs_more_evidence` \| `blocked` |
| Acceptance decision | `accept` \| `reject` \| `needs_more_evidence` \| `blocked` |
| Specialist finding severity | `critical` \| `major` \| `minor` (project-steward alone: `P0`–`P3`, P3 advisory, never a gate) |
| Research/fix severity | `P0` \| `P1` \| `P2` (translate: critical→P0, major→P1, minor→P2, steward P3→P2; ordered P0→P1→P2 in every index) |
| Finding confidence | bands: high ≥0.80 · medium 0.60–0.79 · below 0.60 held (security's reporting floor is 0.60; a held severe-if-real concern gets one Residual-risks line, never silence) |
| Research verdict | `confirmed` \| `false-positive` \| `partial` \| `needs-human` |
| Research disposition | `fix-now` \| `defer` (defer names its follow-up shape) |
| Requirements confidence | `HIGH` \| `MEDIUM` \| `LOW` (gate requires MEDIUM/HIGH) |
| Tester result status | `passed` \| `failed` \| `blocked` \| `partial` (+ per-check `needs_more_evidence`) |
| Unverifiable claim marker | `status=unverified` — passes no gate |
| Delivery status | `delivered` \| `delivered-with-risk` \| `blocked` \| `rejected` |
| Paradigm | `dev/architecture-first` \| `enhancement/delta-design` \| `bugfix/hypothesis-driven` \| `addition/simple` |
| Execution strategy | `direct` \| `hybrid` (default) \| `delegated` |
| Workflow profile | `compact` \| `standard` \| `expanded` (default) \| `exhaustive` |
| Interaction pace | `continuous` (default) \| `guided` |
| Fresh-start evidence markers | `VERIFIED:` \| `ACCEPTED:` \| `FAILED:` \| `UNVERIFIED:` |
| Artifact coherence state | `coherent` \| `needs_revision` |

## Handoff fidelity — the two kinds

Whatever mechanics carry a handoff, the fidelity rule is invariant:

- **Independent (review-type)** — test-plan-review, plan-review, code-review,
  specialist reviews, review-research, acceptance-review, verification. The
  downstream *judges again*: pass pointers and paths only, never upstream
  conclusions (conformity bias); it returns distilled conclusions, not raw context.
- **Coupled (continuation-type)** — implement, fix, and any handoff where the
  downstream *builds on* the upstream decision. Feed the full upstream artifact
  and its decisions, not a summary: `fix` carries research's full verdict + root
  cause + recommendation per issue; `implement` carries the full Story Spec and
  contracts. When unsure, treat as coupled.

A receipt's word is not evidence: mechanical validation first (the artifact exists
at the assigned path, fields line up), quality judgment second — a failed check is
`needs_more_evidence`, not a gate pass. A send-back is never a verbatim retry:
change something (context, partition, channel) or escalate; after the same phase
bounces twice in a row, stop and re-evaluate the plan instead of retrying a third
time.
