# Parameters

[← Back to README](../README.md) · [简体中文](parameters_CN.md)

Every knob in AgentCorp, in one place: what it accepts, what it defaults to, and what actually changes when you turn it.

## How parameters work

All AgentCorp parameters are `key:value` tokens written in the invocation text — `/agentcorp:probe output:inline`, `/agentcorp:delivery-orchestrator execution:delegated workflow:exhaustive migrate-webhooks`. Prose synonyms work too ("落库" means `output:artifact`; "赶时间" favors a more compact workflow). Three rules hold everywhere:

- **Unknown keys** get a one-line note and are otherwise ignored — never silently swallowed.
- **A missing load-bearing value** gets one short question, never a guess.
- **Defaults preserve broad coverage**: a more compact profile is chosen only when task scope and risk support it or the sponsor explicitly asks.

`workflow:` is deliberately independent from any host reasoning setting. It changes delivery coverage — team size, optional phases, review lanes, and verification layers — never how carefully a convened agent reasons.

## The orchestrator's four knobs

| Knob | Values | Default | What it changes |
| --- | --- | --- | --- |
| `execution:` | `direct` \| `hybrid` \| `delegated` | `hybrid` | who executes: orchestrator alone / independent assurance roles / every delegable phase assigned |
| `interaction:` | `auto` \| `gate` | `auto` | skip optional sponsor pauses or stop at every human gate |
| `workflow:` | `compact` \| `standard` \| `expanded` \| `exhaustive` | `expanded` | how much team and process coverage is convened — see below |
| `lang:` | any language | the language you write in | the language of every human-facing artifact |

## What each workflow profile provides

Workflow scales the **organization**, never diligence: a convened reviewer has no less-careful setting — the profile only decides who is convened and which process steps run. The full contract lives in `agentcorp/delivery-orchestrator/references/workflow.md` (Workflow); this is the user view:

| | `compact` | `standard` | `expanded` (default) | `exhaustive` |
| --- | --- | --- | --- | --- |
| Intake | 0 questions; small changes take the fast path | fast path for micro only | ≤1 route-changing question set | success criteria confirmed item by item |
| Optional phases | skipped unless a public contract is touched | only on clear triggers | per documented conditions | whenever plausibly useful |
| Plan review | skipped (tiny) or 1 lane | 3 of 5 lanes | all 5 + risk lanes | all + adversarial |
| Code review | 1 round, lead alone (`depth:core`) | 1 round, lead + Correctness + clearly-demanded lanes (`depth:lean`) | 1 full round + scoped amendments (`depth:full`) | up to 2 full rounds; borderline lanes too |
| Finding research | must-fix only | must-fix only | what the lead routed | + suggested items |
| Fix | P0 only | P0+P1 | all confirmed fix-now | + full relevant suites after merge |
| Verify | 1 tester, unit/simple checks + changed-surface regression | 2 testers; expensive e2e skipped unless the TestPlan marks the journey at-risk | per the TestPlan | everything, real environment, strictly |
| Human gates | one batched skip proposal | skip low-risk gates | per policy | no skip proposals |
| Wrap-up | `sweep:line` — honest one-line 无可沉淀 ok | `sweep:core` — regression question asked | `sweep:full` — all three compound questions | + a session-trajectory pass; walkthrough kept alive to merge |

Cost anchor: `compact` approximates one single-agent session; `exhaustive` buys an independent session per lane.

**Floors no profile can cross**: evidence is never fabricated; author ≠ approver; a defect's original failing input is always re-run; security/permission/data-loss surfaces auto-upgrade to `exhaustive` out loud. Review, verify, and acceptance phases shrink but never disappear.

## Per-skill parameters

| Skill | Parameter | Values | Default | What it changes |
| --- | --- | --- | --- | --- |
| `brainstorm` | `mode:` | `questions` \| `proposals` | chosen by gap type, stated | one-question-at-a-time fact finding vs multi-path proposals |
| `code-review-lead` | `depth:` | `full` \| `lean` \| `core` | `full` | lanes convened: full roster / Correctness + clearly-demanded / lead alone |
| `comment-optimizer` | `mode:` | `edit` \| `review` | `edit` | fix comments in place vs findings-only report |
| `compound` | `sweep:` | `line` \| `core` \| `full` | compiled from the workflow profile at dispatch; `full` standalone | how hard the round is interrogated for assets: one honest line / the regression question / all three questions + scraps |
| `compound` | `session:` | `current` \| `last` \| `<path>` | `current` | which session transcript the 复盘 subject replays |
| `compound` | `focus:` | `time` \| `tokens` \| `friction` \| `evolution` \| `project` \| `collaboration` \| `all` | `all` | which lens gets deepened |
| `compound` | `output:` | `artifact` \| `inline` | `artifact` | standalone only: full replay report vs single-question answer |
| `explain` | `output:` | `inline` \| `artifact` | auto (diagrams/multi-point force artifact) | where the explanation lands |
| `explain` | `reader:` | anyone | the sponsor | who the explanation is written for |
| `grill` | `mode:` | `interview` \| `readiness` | `interview` | full one-question interrogation vs a single readiness verdict |
| `parallel-researcher` | `scope:` | `external` \| `repo` \| `both` | `both` | where evidence is hunted |
| `parallel-researcher` | `depth:` | `desk` \| `source-verified` \| `hands-on` | what the decision needs | citation depth, up to install-and-run |
| `precommit-setup` | `runtime:` | `claude` \| `codex` \| `both` | both if configured, else the present one, else ask | which runtime's hooks get wired |
| `probe` | `output:` | `artifact` \| `inline` | `artifact` for non-trivial probes | terrain report as file vs inline |
| `skill-evolution` | `proposal:` | `<id>` \| `all` | summarize pending and ask | which pending proposals get triaged |
| `walkthrough` | `format:` | `html` \| `md` | `html` | self-contained page vs markdown |
| `walkthrough` | `quiz:` | `on` \| `off` | `on` | the understanding gate; `off` only by explicit sponsor decline |

Where you see the options while typing: each skill's slash-command autocomplete shows the same enums (Claude Code `argument-hint`); on Codex, the skill's default prompt lists them as `(options: …)`.

**Deliberate key reuse**: `mode:` appears in three skills and `depth:` in two, each with its own enum — a key is always scoped to its skill and never crosses skills. In particular, `depth:` in `code-review-lead` counts convened lanes, while `depth:` in `parallel-researcher` grades evidence rigor.
