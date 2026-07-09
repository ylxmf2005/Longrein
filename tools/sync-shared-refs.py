#!/usr/bin/env python3
"""Materialize canonical shared references into each EN skill directory.

Every skill ships its own copy of the worker-side handoff protocol and the
phase-receipt demo so a single-skill install stays self-contained. Hand-edited
copies drift; this script regenerates them from `tools/shared-references/` so
drift is a mechanical check, not an eyeball job.

- `handoff-protocol.md`: rendered per skill from the master, substituting the
  skill name and the actual `templates/*.demo.md` files present in that skill.
  Skills whose protocol is genuinely role-specific are listed in
  CUSTOM_PROTOCOL and left alone.
- `templates/phase-receipt.demo.md`: byte-identical canonical copy everywhere
  it already exists (the receipt envelope is validated mechanically by
  scripts/validate-handoff.py; uniformity is the point).
- `templates/phase-assignment.demo.md` is NOT synced: assignments legitimately
  carry role-specific fields and examples.

Both trees are covered: `agentcorp/` renders from the EN masters and
`agentcorp-zh/` from the `.zh.md` masters, so the mirror cannot drift either.

Usage: tools/sync-shared-refs.py [--check]
  --check  report drift and exit 1 instead of rewriting
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTERS = ROOT / "tools" / "shared-references"
TREES = {
    ROOT / "agentcorp": ("handoff-protocol.md", "phase-receipt.demo.md"),
    ROOT / "agentcorp-zh": ("handoff-protocol.zh.md", "phase-receipt.demo.zh.md"),
}

# Roles whose handoff protocol carries role-specific semantics (assignment
# authoring, fix groups/OWNED_FILES, tester assignment writing). Edit these
# by hand; the sync leaves them alone.
CUSTOM_PROTOCOL = {
    "delivery-orchestrator",
    "test-leader",
    "test-planner",
    "review-fixer",
}


def render_protocol(master_name: str, skill: str, templates_dir: Path) -> str:
    master = (MASTERS / master_name).read_text(encoding="utf-8")
    demos = sorted(p.name for p in templates_dir.glob("*.demo.md")) if templates_dir.is_dir() else []
    listing = "\n".join(f"- `templates/{name}`" for name in demos) or "- (none)"
    return master.replace("{{SKILL}}", skill).replace("{{TEMPLATES_LIST}}", listing)


def main() -> int:
    check = "--check" in sys.argv[1:]
    drift: list[str] = []
    written: list[str] = []

    for skills_dir, (protocol_master, receipt_master_name) in TREES.items():
        receipt_master = (MASTERS / receipt_master_name).read_text(encoding="utf-8")
        for skill_dir in sorted(skills_dir.iterdir()):
            if not (skill_dir / "SKILL.md").is_file():
                continue
            refs = skill_dir / "references"
            protocol = refs / "handoff-protocol.md"
            if protocol.is_file() and skill_dir.name not in CUSTOM_PROTOCOL:
                want = render_protocol(protocol_master, skill_dir.name, refs / "templates")
                if protocol.read_text(encoding="utf-8") != want:
                    if check:
                        drift.append(str(protocol.relative_to(ROOT)))
                    else:
                        protocol.write_text(want, encoding="utf-8")
                        written.append(str(protocol.relative_to(ROOT)))
            receipt = refs / "templates" / "phase-receipt.demo.md"
            if receipt.is_file() and receipt.read_text(encoding="utf-8") != receipt_master:
                if check:
                    drift.append(str(receipt.relative_to(ROOT)))
                else:
                    receipt.write_text(receipt_master, encoding="utf-8")
                    written.append(str(receipt.relative_to(ROOT)))

    if check:
        if drift:
            for path in drift:
                print(f"[DRIFT] {path}", file=sys.stderr)
            print(f"FAILED: {len(drift)} file(s) drifted from tools/shared-references/", file=sys.stderr)
            return 1
        print("OK: all shared references match the masters")
        return 0

    print(f"OK: rewrote {len(written)} file(s) from the masters")
    for path in written:
        print(f"  {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
