#!/usr/bin/env bash
set -euo pipefail

base_ref="${1:-origin/$(git rev-parse --abbrev-ref HEAD)}"

echo "Repo root: $(git rev-parse --show-toplevel)"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Base ref: ${base_ref}"
echo

echo "[status]"
git status --short --branch
echo

if git rev-parse --verify "${base_ref}" >/dev/null 2>&1; then
  echo "[ahead-behind]"
  git rev-list --left-right --count HEAD..."${base_ref}"
  echo

  echo "[commit-diff]"
  git diff --name-status --find-renames "${base_ref}"...HEAD
  echo
else
  echo "[ahead-behind]"
  echo "base ref not found locally"
  echo
fi

echo "[staged]"
git diff --cached --name-status --find-renames
echo

echo "[unstaged]"
git diff --name-status --find-renames
echo

echo "[untracked]"
git ls-files --others --exclude-standard
