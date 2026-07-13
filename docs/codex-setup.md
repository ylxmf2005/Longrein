# Running AgentCorp on Codex

[← back to README](../README.md) · [简体中文](codex-setup_CN.md)

## Install

```
codex plugin marketplace add ylxmf2005/AgentCorp
```

Launch Codex, enable **AgentCorp** from the `/plugins` menu, and restart.

To install a single skill instead of the whole plugin:

```
use skill-installer to install the skill at repo ylxmf2005/AgentCorp path agentcorp/delivery-orchestrator
```

## Lifecycle hooks

Codex has no `SessionEnd` event, so the plugin's lifecycle hooks mount
differently there: copy or merge `hooks/codex-hooks.json` into
`<repo>/.codex/hooks.json` (or `~/.codex/hooks.json`), adjusting
`AGENTCORP_PLUGIN_ROOT` to this checkout.

The same scripts serve both runtimes. On Codex, skill-evolution capture records
each turn via the `Stop` hook, and the next session start sweeps sessions idle
for 30+ minutes into the analyzer.
