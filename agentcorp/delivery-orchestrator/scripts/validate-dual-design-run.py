#!/usr/bin/env python3
"""Stable AgentCorp entrypoint for the canonical DualDesignRun validator."""

from pathlib import Path
import runpy
import sys

TOOLS = Path(__file__).resolve().parents[3] / "tools"
sys.path.insert(0, str(TOOLS))
runpy.run_path(str(TOOLS / "validate-dual-design-run.py"), run_name="__main__")
