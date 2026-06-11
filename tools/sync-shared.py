#!/usr/bin/env python3
"""Sync shared reference files into every skill.

Skills must stay self-contained: single-skill installs (Codex skill-installer,
or copying one folder into ~/.claude/skills/) only take the skill directory,
so cross-skill references like ../shared/ would dangle. Shared content is
therefore hard-copied into each skill's references/.

Edit the canonical copy, then run:  python3 tools/sync-shared.py
"""

import hashlib
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = ROOT / "agentcorp"

# canonical copy (relative to agentcorp/) -> filename placed in every skill's references/
SHARED = {
}


def main():
    drift = False
    skills = sorted(p for p in SKILLS_DIR.iterdir() if (p / "SKILL.md").is_file())
    for canonical_rel, filename in SHARED.items():
        canonical = SKILLS_DIR / canonical_rel
        if not canonical.is_file():
            sys.exit(f"missing canonical file: {canonical}")
        copies = [canonical]
        for skill in skills:
            dst = skill / "references" / filename
            if dst == canonical:
                continue
            dst.parent.mkdir(exist_ok=True)
            shutil.copyfile(canonical, dst)
            copies.append(dst)
        digests = {hashlib.md5(p.read_bytes()).hexdigest() for p in copies}
        ok = len(digests) == 1
        drift = drift or not ok
        print(f"{filename}: {len(copies)} copies across {len(skills)} skills "
              f"[{'OK' if ok else 'DRIFT'}]")
    sys.exit(1 if drift else 0)


if __name__ == "__main__":
    main()
