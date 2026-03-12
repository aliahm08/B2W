---
name: git-repo-reconcile
description: Reconcile a local workspace with its Git repository while preserving the user's preferred local folder structure. Use when the user wants local and repo differences corroborated, explained, and resolved step by step instead of auto-overwriting files.
---

# Git Repo Reconcile

Use this skill when the user wants to align a local folder and a Git repo, especially when the
local structure should be treated as the source of truth unless the user decides otherwise.

## Workflow

1. Corroborate the current state before proposing changes.
2. Explain the differences in plain language.
3. Preserve the local folder structure by default.
4. Avoid destructive commands unless the user explicitly asks for them.
5. Walk the user through each resolution path when there is any ambiguity.

## Required checks

Run these checks before suggesting a resolution:

- `git status --short --branch`
- `git remote -v`
- `git fetch origin` if remote state matters and network access is available
- `git rev-list --left-right --count HEAD...origin/<branch>` after fetching
- `git diff --name-status`
- `git diff --cached --name-status`
- `git ls-files --others --exclude-standard`

If you need a compact report, run `scripts/reconcile_report.sh`.

## Corroboration rule

Never describe a difference from only one signal. Confirm each claim with at least two of:

- Git status or diff output
- Actual file reads
- Filesystem listing
- Remote ref comparison after `git fetch`

If the signals disagree, stop and explain the inconsistency instead of guessing.

## Default decision policy

Prefer the local folder structure unless the user says otherwise. That means:

- Keep local directories and file placement as the baseline structure.
- If repo content is newer, merge that content into the local structure instead of forcing the repo
  layout onto the workspace.
- Use `git mv` for tracked renames or moves when possible so history is preserved.
- For untracked local files that should become part of the repo, stage them explicitly and explain
  why they are being added.

## How to walk the user through differences

Present differences in this order:

1. Branch and remote state
2. Local uncommitted changes
3. Untracked files
4. Commit divergence between local and remote
5. Structural conflicts such as renames, moves, and deletions

For each item, state:

- what differs
- how you verified it
- the lowest-risk next step
- whether the step changes only local state, only Git history, or both

## Resolution patterns

### Local structure should win

Use this path when the user prefers the current local layout.

- Review moved or newly created paths.
- Convert path changes into `git mv` where applicable.
- Stage the intended file set with `git add`.
- Commit with a message that describes the structural sync.
- Push only after confirming the working tree and commit contents are correct.

### Remote content should be incorporated without changing local layout

- Inspect the remote-side file contents first.
- Reapply the content into the preferred local paths.
- Stage the resulting edits and any tracked moves.
- Explain which old remote paths are being retired or redirected.

### Destructive cleanup

Only use this when the user explicitly approves it.

- Deleting local files
- Resetting branches
- Force pushing
- Checking out paths from another ref over local work

## Output format

Keep the walkthrough concise and concrete:

- `Verified`: what commands confirm the state
- `Differences`: modified, untracked, ahead/behind, moved paths
- `Recommended path`: step-by-step plan with local structure preserved
- `Risk`: what could be lost if the wrong action is taken

If the user asks you to complete the sync, carry it through end to end: stage, commit, verify, and
push when requested or clearly implied.
