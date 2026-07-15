#!/usr/bin/env python3
"""CLI for the canonical DualDesignRun validator."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from dual_design_run import ValidationError, validate_chain


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("--task-record", type=Path)
    parser.add_argument("--task-root", type=Path)
    args = parser.parse_args()
    try:
        for message in validate_chain(args.run_dir, args.task_record, args.task_root):
            print(message)
    except (OSError, ValidationError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print("dual-design run OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
