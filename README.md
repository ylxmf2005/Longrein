# AgentCorp

A multi-agent software-delivery pipeline, packaged as **Agent Skills**. A Delivery
Orchestrator classifies a task and routes each phase to a specialized role —
planning, implementation, multiple *independent* code reviewers, and layered
verification — with explicit gates between phases.

The suite uses the [Agent Skills](https://agentskills.io) `SKILL.md` standard, so the
same skills install in both **Claude Code** and **Codex** from this one repository.

## Install — Claude Code

```
/plugin marketplace add ylxmf2005/AgentCorp
/plugin install agentcorp@agentcorp
```

Then `/reload-plugins` (or restart Claude Code). Skills are namespaced under the
plugin, e.g. `/agentcorp:delivery-orchestrator`, `/agentcorp:code-review-lead`.

## Install — Codex

**Whole suite (plugin):**

```
codex plugin marketplace add ylxmf2005/AgentCorp
```

Then launch Codex, enable **AgentCorp** from the `/plugins` menu, and restart so the
skills load.

**Individual skills (lighter, no plugin):** inside Codex, ask the built-in
installer, e.g.

```
use skill-installer to install the skill at repo ylxmf2005/AgentCorp path agentcorp/delivery-orchestrator
```

This lands the skill in `~/.codex/skills/`.

### Codex note: single-agent workflow

Codex has no subagents. The orchestrator **defaults to single-agent workflow** — it
runs each non-review phase itself while still delegating reviews to independent
review roles — so the suite works on Codex out of the box. The **subagents
workflow** (parallel fan-out to dispatched agents) is a Claude Code-only
enhancement and is simply unavailable on Codex.

## What's inside

26 skills covering the full pipeline:

- **Orchestration** — `delivery-orchestrator`
- **Planning & design** — `solution-architect`, `implementation-planner`, `test-planner`, `sota-researcher`
- **Implementation** — `implementation-engineer`, `review-fix-agent`
- **Plan / test-plan review** — `plan-review-lead`, `test-plan-reviewer`, `adversarial-reviewer`
- **Code review** — `code-review-lead` plus specialized reviewers: `correctness-reviewer`, `security-reviewer`, `performance-reviewer`, `reliability-reviewer`, `simplicity-reviewer`, `standards-reviewer`, `api-contract-reviewer`
- **Verification** — `test-leader`, `e2e-tester`, `api-contract-tester`, `regression-tester`
- **Review research & acceptance** — `review-research-agent`, `acceptance-review-lead`
- **Support** — `change-detailed-walker`, `fresh-start-handoff`

Full per-skill descriptions live in each `agentcorp/<skill>/SKILL.md` and show up in
the Claude Code / Codex skill pickers.

## Layout & maintenance

| Path | Role |
|------|------|
| `agentcorp/<skill>/SKILL.md` | The skills — **single source**, shared by both tools |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code manifests — **canonical metadata** |
| `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | Codex manifests — **generated** |
| `tools/codex-interface.json` | Codex-only branding/policy (no Claude equivalent) |
| `tools/sync-codex.py` | Regenerates the Codex manifests from the Claude manifests |

Both ecosystems point their `skills` field at the same `./agentcorp` directory and
auto-discover the skill folders — there is no duplicated skill content. To change
metadata: edit the Claude manifests (and `tools/codex-interface.json` for Codex
branding), then run:

```
python3 tools/sync-codex.py
```
