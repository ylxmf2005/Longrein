# AgentCorp

**A multi-agent coding pipeline: controllable, understandable, verifiable.**

English · [Simplified Chinese](README_CN.md)

[Quick Start](#quick-start) · [Skills](#skills) · [Artifacts](#artifacts)

---

AI can generate code faster and faster, but the cost of verifying whether that
code is correct still lands on you. When you receive a pile of code that "looks
fine," the responsibility for judging whether it is actually right is entirely
yours. The deeper your dependency on AI becomes, the easier it is for that
judgment to get dull.

The harder problem is the loop that follows: an agent's work process is a black
box, so you cannot understand its reasoning; because you cannot understand it,
you skip review; because you skip review, cognitive debt accumulates; the deeper
that debt gets, the more dependent you become, and the harder it is to correct
the agent when it goes wrong. Eventually, you no longer dare to hand it important
work.

AgentCorp exists to break that loop. It turns agent work from an uncontrollable,
unreadable, untraceable black-box chain into a **controllable, understandable,
verifiable** pipeline. It includes **29 skills**: 27 specialized delivery roles
drawn from enterprise-grade software delivery practice, covering the full
development flow, plus 2 reusable capabilities that any role can call. It works
with both **Claude Code** and **Codex**.

- **Controllable** -- The process scales itself to the size of the task. A
  one-line change does not pay the cost of an architecture review, while a new
  system skips no critical phase. Gates actually block: failed verification
  stops the pipeline, and repeated failure forces replanning. You can step in at
  any point, or let the pipeline run.
- **Understandable** -- Every phase leaves a structured artifact and records
  who made which decision under what evidence. Every review finding is explained
  to the level of "even if you have not read this code, you can still judge
  whether it should be changed." At delivery time, the final diff is turned into
  function-level comments that explain why the change was made.
- **Verifiable** -- No role can approve its own output. Tests are decided
  before implementation and independently reviewed. Review findings are treated
  as possible false positives and re-verified by another role; only confirmed
  findings enter the fix stage.

## Quick Start

### Install

**Claude Code:**

```
/plugin marketplace add ylxmf2005/AgentCorp
/plugin install agentcorp@agentcorp
```

Then run `/reload-plugins` or restart. Skills are namespaced, for example
`/agentcorp:delivery-orchestrator`.

**Codex:**

```
codex plugin marketplace add ylxmf2005/AgentCorp
```

Launch Codex, enable **AgentCorp** from the `/plugins` menu, and restart. To
install a single skill: `use skill-installer to install the skill at repo
ylxmf2005/AgentCorp path agentcorp/delivery-orchestrator`.

### First Use

After installation, describe what you need, or call
`/agentcorp:delivery-orchestrator`. It will first confirm the success criteria
with you, recommend an execution route, then move through the phases and stop at
each gate to report.

When a task needs a real browser or logged-in state verification, AgentCorp uses
an isolated browser profile, asks you to log in manually once, and then performs
checks inside the page automatically. It does not touch your local cookies. At
the end of the task, you receive a delivery report and an audit record that
traces every decision.

## Skills

The 29 skills are grouped by function below. Each skill's behavior is defined in
`agentcorp/<skill>/SKILL.md` and appears in the Claude Code and Codex skill
pickers. Of these, 27 are specialized delivery roles; the skills marked with [1]
are reusable support capabilities that any role may call.

- **Orchestration** - `delivery-orchestrator`
- **Planning and design** - `solution-architect`, `implementation-planner`, `test-planner`, `parallel-researcher`
- **Implementation** - `implementation-engineer`, `review-fixer`
- **Plan and test-plan review** - `plan-review-lead`, `test-plan-reviewer`, `adversarial-reviewer`
- **Code review** - `code-review-lead` + `correctness-reviewer`, `security-reviewer`, `performance-reviewer`, `reliability-reviewer`, `simplicity-reviewer`, `change-hygiene-reviewer`, `standards-reviewer`, `project-steward-reviewer`, `api-contract-reviewer`
- **Verification** - `test-leader`, `e2e-tester`, `api-contract-tester`, `regression-tester`
- **Recheck and acceptance** - `review-researcher`, `acceptance-review-lead`
- **Support** - `change-detailed-walker`, `brainstorm`[1], `authenticated-browser-session`[1]

[1] `brainstorm` (a general thinking capability, mainly for requirement
clarification) and `authenticated-browser-session` (a persistent authenticated
browser capability) are reusable behavior capabilities, not delivery roles with
their own gates. Any role can load them when needed.

## Artifacts

Every phase leaves a structured artifact with frontmatter (`artifact_type` /
`author_agent` / `phase` / `status` / `source_artifacts`), making the work
auditable and traceable. For example, for "add an invite members feature to a
web app," a complete delivery creates an artifact tree like this under
`teamspace/`:

```
teamspace/
├── testing-context.md                   # Cross-task testing context: page map, observable surfaces, test-data conventions
├── learnings/                           # Cross-task learnings (one file each; grep for duplicates before writing)
│   └── invite-token-reuse-trap.md       #   Trigger -> root cause -> what to do -> how to move faster next time
└── tasks/20260622-invite-members/       # Current task root
    ├── task.md                          # Task record: success criteria, phase flow, gate history, decision log
    ├── manifest.md                      # Audit ledger: phase owner/status/human gate/quality gate/artifact/receipt
    │
    ├── requirements/
    │   └── validated-requirements.md    # Validated requirements: user journeys, FR/AC, non-goals, handoff to architecture and testing
    │
    ├── design/
    │   ├── architecture.md              # Architecture: components, data model, Mermaid diagrams, implementation constraints
    │   └── api-contract.md              # API contract: POST /invites, compatibility, migration notes, verification hooks
    │
    ├── test/
    │   ├── test-plan.md                 # Master test plan: risk levels, must-haves, forbidden zones, coverage summary
    │   ├── api-test-plan.md             # API manual: literal curl requests, expectations, evidence, failure handling
    │   ├── e2e-test-plan.md             # E2E manual: browser steps, literal input, screenshots as primary evidence
    │   ├── regression-test-plan.md      # Regression manual: blast radius, existing suites, new "fails before fix" checks
    │   ├── test-plan-review.md          # Test-plan review decision (approve / request_changes)
    │   └── exploration/                 # Exploratory test work files (kept in the task; confirmed conclusions update testing-context)
    │       ├── charters.md              # Exploration charters: C-1/C-2/C-3 goals and status
    │       ├── frontier.md              # Exploration backlog: entry points and provenance
    │       └── journal.md               # Exploration journal: each action, observation, screenshot
    │
    ├── implementation/
    │   ├── implementation-story.md      # Implementation story: AC, task tree (file pointers), constraints, verification expectations
    │   └── implementation-result.md     # Implementation result: changed files, commands, deviations, blockers, review handoff
    │
    ├── review/
    │   ├── plan-review.md               # Plan review decision: must-fix/suggested/evidence gaps/residual risk/next owner
    │   ├── code-review.md               # Code-review decision: aggregates specialists, approve / request_changes
    │   ├── specialist-findings/         # Specialist findings (each with severity/confidence/evidence/impact/recommendation)
    │   │   ├── correctness-reviewer.md
    │   │   ├── security-reviewer.md
    │   │   ├── performance-reviewer.md
    │   │   ├── reliability-reviewer.md
    │   │   ├── simplicity-reviewer.md
    │   │   ├── change-hygiene-reviewer.md
    │   │   ├── standards-reviewer.md
    │   │   ├── project-steward-reviewer.md
    │   │   ├── api-contract-reviewer.md
    │   │   └── adversarial-reviewer.md  # Adversarial: broken assumptions, combination failures, cascades, abuse cases
    │   ├── research/                    # Review recheck: each finding is tested as a possible false positive
    │   │   ├── 00-index.md              # Index: 7-column list, confirmed first -> false positives at the bottom
    │   │   ├── F-01-confirmed-...md     # One file per issue: context, code context, root cause, fix recommendation
    │   │   └── F-02-false-positive-...md#   Includes a Human decision skeleton left blank for human checkoff
    │   ├── fix-records/                 # Fix records (parallelized by file-group ownership)
    │   │   └── invite-service.md        # Each entry: verdict, changed files, regression check (fails before, passes after)
    │   └── fix-result.md                # Fix summary
    │
    ├── verification/
    │   ├── verification-report.md       # Verification decision: approve / request_changes, citing each test result
    │   └── test-results/                # Test execution results (based on real evidence, never invented)
    │       ├── e2e-tester.md            # Status, checks, commands, screenshot/URL evidence
    │       ├── api-contract-tester.md   # Requests/responses, pass/fail
    │       └── regression-tester.md     # Before/after comparison, exit code
    │
    ├── acceptance/
    │   ├── acceptance-package.md        # Acceptance package: all artifact indexes + success criteria and direct evidence
    │   └── acceptance-decision.md       # Final acceptance decision: accept / reject / needs_more_evidence
    │
    └── _handoffs/                       # Phase assignment-receipt loop (one pair per delegated phase)
        ├── to-solution-architect.md     # Assignment: goal, inputs, constraints, stop conditions, output_path
        ├── from-solution-architect.md   # Receipt: artifact path, completion notes, blockers
        └── ...                          # One pair each for test-planner / implementation-engineer / etc.
```

---

AgentCorp lets work compound while welding controllability, understandability,
and verifiability into the structure itself, instead of leaving them for the
operator to guarantee by hand.
