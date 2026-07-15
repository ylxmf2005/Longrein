<div align="center">

# AgentCorp

AgentCorp is a role-based software delivery system for Claude Code and Codex. It
assigns requirements, planning, implementation, independent review,
verification, and acceptance to distinct roles, involving people when direction,
trade-offs, or risk require human judgment.

AgentCorp preserves not only the final result but how it was reached: task goals,
key decisions, phase owners, checks actually run, and unresolved issues.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](#claude-code) [![Codex](https://img.shields.io/badge/Codex-plugin-1f2328)](#codex) [![Agent Skills](https://img.shields.io/badge/Agent%20Skills-open%20standard-6366f1)](docs/skills.md)

English · [简体中文](README_CN.md)

[Quick Start](#quick-start) · [Why AgentCorp](#why-agentcorp) · [How It Works](#how-it-works) · [39 Skills](docs/skills.md)

</div>

## Quick Start

### Claude Code

```text
/plugin marketplace add ylxmf2005/AgentCorp
/plugin install agentcorp@agentcorp
```

Run `/reload-plugins` or restart Claude Code.

### Codex

```text
codex plugin marketplace add ylxmf2005/AgentCorp
codex plugin add agentcorp@agentcorp
```

Start a new Codex task. You can also install **AgentCorp** from the `/plugins`
menu after adding the marketplace. Lifecycle hooks need one additional setup
step: [Codex setup](docs/codex-setup.md).

### Give it a task

Pass the work directly to the relevant skill. The Delivery Orchestrator chooses
the workflow parameters for an end-to-end task; the Code Review Lead chooses
the review depth from the diff and its risk:

```text
/agentcorp:delivery-orchestrator <your prompt>
/agentcorp:code-review-lead <your prompt>
```

Parameters remain available when you need explicit control; otherwise the skill
infers them from the task, repository, and risk surface.

## Why AgentCorp

Coding agents are fast. The hard part is knowing whether their result deserves
to ship. A single conversation often collapses author, reviewer, and tester
into the same context, so confident claims can pass as proof.

AgentCorp separates those responsibilities and makes the handoffs inspectable:

| Typical agent loop | AgentCorp |
| --- | --- |
| The agent writes the change and judges it | The workflow separates authors from approvers |
| The human sees only the final answer | The sponsor shapes intent, can revise the route at recorded gates, and owns scope and residual risk |
| A review finding immediately becomes a fix | The workflow requires `review-researcher` to re-prove it as a possible false positive |
| "Tests pass" is the end of the story | Claims point to a path, log, response, or screenshot you can open |
| A null check and a migration get the same process | Small changes take a lighter path; higher-risk work adds independent roles, review, and verification |
| Lessons disappear with the session | `compound` turns them into tests, repo rules, or reviewer proposals |

AgentCorp is not a coding model, agent runtime, or prompt pack. It is a delivery
organization with contracts: who produces each artifact, who may approve it,
and what evidence must exist before the work moves forward.

## How a Task Assembles Its Team

AgentCorp includes 39 skills, but a task does not run all of them. The Delivery
Orchestrator selects the roles its scope and risk require, while human judgment
stays involved in direction, disputed findings, and residual risk.

[![How AgentCorp assembles a delivery team](docs/assets/task-delivery-team.png)](docs/assets/task-delivery-team.excalidraw)

[Browse all 39 skills](docs/skills.md).

## What You Get

An orchestrated task is designed to leave a navigable record. The full layout
keeps cross-task knowledge beside each task's decisions and evidence:

```text
teamspace/
├── testing-context.md                   # shared runtime and test facts
├── compound/                            # reusable lessons from prior tasks
│   └── <lesson>.md
├── knowledge/                           # reusable research snapshots
│   └── <technology>/INDEX.md
├── probes/                              # standalone territory reports
│   └── <date>-<topic>.md
├── walkthroughs/                        # standalone teaching artifacts
│   └── <change>.html
└── tasks/<task>/
    ├── task.md                          # success criteria, route, decisions, gates
    ├── manifest.md                      # phase, owner, quality gate, artifact, receipt
    ├── probe/
    │   └── 00-probe.md                  # unknowns and corrected assumptions
    ├── scope-challenge/
    │   └── 001-<topic>.md               # independent evidence before a material route change
    ├── handoffs/                        # delegated assignments and receipts
    │   ├── <phase>.md
    │   └── <phase>-receipt.md
    ├── requirements/
    │   └── validated-requirements.md
    ├── design/
    │   ├── architecture.md
    │   ├── dual-design-runs/<run-id>/    # conditional post-activation audit chain
    │   ├── impact-analysis.md
    │   ├── diagnosis.md
    │   └── interface-contract.md
    ├── test/
    │   ├── test-plan.md
    │   ├── api-test-plan.md
    │   ├── e2e-test-plan.md
    │   ├── regression-test-plan.md
    │   ├── test-plan-review.md
    │   └── exploration/
    │       ├── charters.md
    │       ├── frontier.md
    │       └── journal.md
    ├── implementation/
    │   ├── implementation-story.md
    │   └── implementation-result.md
    ├── review/
    │   ├── plan-review.md
    │   ├── plan-review-findings/
    │   ├── code-review.md
    │   ├── specialist-findings/
    │   │   └── <reviewer>.md
    │   ├── research/
    │   │   ├── 00-index.md              # every finding is rechecked
    │   │   ├── 001-confirmed-....md
    │   │   └── 002-false-positive-....md
    │   ├── fix-records/
    │   │   └── <file-group>.md
    │   └── fix-result.md
    ├── research/<topic>/                # hands-on research packages
    │   ├── 00-report.md
    │   ├── env/
    │   ├── sources/
    │   └── experiments/
    ├── explain/                         # persisted decision explanations
    │   └── <topic>/
    │       ├── 00-index.md
    │       └── 001-context.md
    ├── walkthrough/
    │   └── <change>.html                # background, intuition, story, quiz
    ├── verification/
    │   ├── assignments/
    │   │   └── <tester>.md
    │   ├── test-results/
    │   │   └── <tester>.md
    │   └── verification-report.md
    ├── acceptance/
    │   ├── acceptance-package.md
    │   └── acceptance-decision.md
    ├── compound/
    │   └── compound-result.md
    └── delivery/
        └── delivery-report.md
```

Not every task creates every optional file, but every phase it does run has an
accountable home. Phase artifacts carry structured frontmatter, and delegated
handoffs are checked mechanically before their claims are trusted. See the
[full artifact layout](docs/artifacts.md).

## How It Works

[![AgentCorp delivery workflow](docs/assets/delivery-workflow.png)](docs/assets/delivery-workflow.excalidraw)

Give AgentCorp a task, and the Delivery Orchestrator does not immediately hand
it to a coding agent. It first establishes what the task should solve, what
counts as done, and where it is most likely to fail. On unfamiliar ground,
`probe` investigates the actual code, tests, and existing constraints to uncover
blind spots; when the direction is still open, `brainstorm` offers concrete paths
for you to compare and choose.

Once the direction is settled, the Test Planner, Solution Architect, and
Implementation Engineer move the test strategy, design, and implementation
forward. After implementation, the Code Review Lead convenes the specialist
reviewers required by the risks in the change instead of leaving authors to
judge their own work.

Review findings do not become fix tasks automatically. The Review Researcher
re-investigates each finding and distinguishes confirmed defects, partial issues,
false positives, and questions that need human judgment. Only confirmed items
approved for the current task go to the Review Fixer, and fixes are reviewed
again rather than treated as proof that the issue is resolved.

Finally, the Test Leader organizes the API, E2E, regression, or other verification
the task requires, and the Acceptance Review Lead maps the evidence back to the
original goals. Along the way, you can decide requirements, design trade-offs,
disputed findings, and residual risks, using `explain` or `walkthrough` when you
need to understand the change before deciding.

When the task ends, AgentCorp preserves its goals, key decisions, phase owners,
review conclusions, checks actually run, and unresolved issues, so the result can
be inspected, traced, and continued by someone else.

## Scale the Process to the Risk

Four independent knobs tune a delivery:

| Knob | Values | Controls |
| --- | --- | --- |
| `execution:` | `direct` \| `hybrid` \| `delegated` | who executes the phases and who reviews them |
| `interaction:` | `auto` \| `gate` | skip optional sponsor pauses or stop at every human gate |
| `workflow:` | `compact` \| `standard` \| `expanded` \| `exhaustive` | how much independent coverage and redundancy to convene |
| `lang:` | any language | the language of every human-facing artifact |

The compact workflow trades redundancy for speed, never evidence for convenience.
The workflow requires deeper scrutiny for security, permission, public contract,
and data-loss surfaces. See the [parameter catalog](docs/parameters.md) for the
exact behavior of every level and skill.

## Documentation

- [All 39 skills](docs/skills.md)
- [Parameters and workflow profiles](docs/parameters.md)
- [Runtime artifacts](docs/artifacts.md)
- [Codex setup](docs/codex-setup.md)

Questions and bug reports belong in [GitHub Issues](https://github.com/ylxmf2005/AgentCorp/issues).
