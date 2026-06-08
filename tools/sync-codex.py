#!/usr/bin/env python3
"""Generate the Codex plugin manifests from the canonical Claude Code manifests.

Single source of truth:
  .claude-plugin/plugin.json        (plugin metadata)
  .claude-plugin/marketplace.json   (marketplace catalog)
  tools/codex-interface.json        (Codex-only branding/policy that has no Claude equivalent)

Generated outputs (do not edit by hand):
  .codex-plugin/plugin.json         (per-plugin manifest Codex reads)
  .agents/plugins/marketplace.json  (top-level catalog `codex plugin marketplace add` reads)

Skills are NOT copied or transformed: both ecosystems point their `skills` field at the
same ./agentcorp directory and auto-discover <name>/SKILL.md. Edit the Claude manifests
(or the branding file), then run this script to keep the Codex manifests in lockstep.

Usage:  python3 tools/sync-codex.py
"""
from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CLAUDE_PLUGIN = REPO / ".claude-plugin" / "plugin.json"
CLAUDE_MARKET = REPO / ".claude-plugin" / "marketplace.json"
OVERRIDES = REPO / "tools" / "codex-interface.json"
CODEX_PLUGIN = REPO / ".codex-plugin" / "plugin.json"
CODEX_MARKET = REPO / ".agents" / "plugins" / "marketplace.json"

# Plugin-manifest fields that carry over unchanged from Claude to Codex.
COPY_FIELDS = (
    "name", "version", "description", "author",
    "homepage", "repository", "license", "keywords", "skills",
)


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def build_plugin(claude: dict, overrides: dict) -> dict:
    out = {k: claude[k] for k in COPY_FIELDS if k in claude}
    interface = dict(overrides.get("plugin_interface", {}))
    interface.setdefault("shortDescription", claude.get("description", ""))
    if claude.get("homepage"):
        interface.setdefault("websiteURL", claude["homepage"])
    interface.setdefault("screenshots", [])
    out["interface"] = interface
    return out


def build_marketplace(claude_market: dict, overrides: dict) -> dict:
    policy = overrides.get("policy", {"installation": "AVAILABLE", "authentication": "ON_INSTALL"})
    category = overrides.get("category", "Coding")
    plugins = []
    for entry in claude_market.get("plugins", []):
        source = entry.get("source", "./")
        path = source if isinstance(source, str) else source.get("path", "./")
        plugins.append({
            "name": entry["name"],
            "source": {"source": "local", "path": path},
            "policy": policy,
            "category": category,
        })
    return {
        "name": claude_market["name"],
        "interface": overrides.get("marketplace_interface", {"displayName": claude_market["name"]}),
        "plugins": plugins,
    }


def main() -> None:
    claude = load(CLAUDE_PLUGIN)
    claude_market = load(CLAUDE_MARKET)
    overrides = load(OVERRIDES) if OVERRIDES.exists() else {}

    write(CODEX_PLUGIN, build_plugin(claude, overrides))
    write(CODEX_MARKET, build_marketplace(claude_market, overrides))

    print(f"wrote {CODEX_PLUGIN.relative_to(REPO)}")
    print(f"wrote {CODEX_MARKET.relative_to(REPO)}")


if __name__ == "__main__":
    main()
