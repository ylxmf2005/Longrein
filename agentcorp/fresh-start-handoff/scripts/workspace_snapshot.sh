#!/usr/bin/env bash
set -euo pipefail

if ! command -v git >/dev/null 2>&1; then
  echo "git not found"
  exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "not inside a git worktree"
  exit 0
fi

echo "## Git branch"
git status --short --branch

echo

echo "## Changed files"
git diff --name-status || true

echo

echo "## Staged files"
git diff --cached --name-status || true

echo

echo "## Diff stat"
git diff --stat || true

echo

echo "## Recent commits"
git log --oneline -5 || true
