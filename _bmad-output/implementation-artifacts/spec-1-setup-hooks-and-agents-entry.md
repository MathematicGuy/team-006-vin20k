---
title: 'Setup AI Logging Hooks and AGENTS.md Stub'
type: 'chore'
created: '2026-06-14T18:35:00+07:00'
status: 'done'
route: 'one-shot'
---

# Setup AI Logging Hooks and AGENTS.md Stub

## Intent

**Problem:** The local development environment was missing the required AI usage logging configuration (pre-push Git hook) and the root CLI agent stub entry (`AGENTS.md`), which are essential compliance checks.

**Approach:** Run the PowerShell setup script to configure Git hooks, populate the missing AI logging environment variables in `.env`, and create the stub `AGENTS.md` file pointing to `README.md`.

## Suggested Review Order

**Logging Configuration**

- Add logging server environment variables to `.env` file
  [`.env:5`](../../.env#L5)

**Git Hooks Installation**

- Enable pre-push logging hooks using the repository setup script
  [`pre-push:1`](../../.git/hooks/pre-push#L1)

**Agent Stub Entry**

- Direct CLI agents to canonical root documentation and define Git workflow constraints
  [`AGENTS.md:1`](../../AGENTS.md#L1)

**Logging Robustness Enhancements**

- Support non-origin Git remotes (e.g. main)
  [`log_hook.py:59`](../../scripts/log_hook.py#L59)
  [`log_antigravity.py:339`](../../scripts/log_antigravity.py#L339)

- Ignore Microsoft Store Python redirection alias during hook execution
  [`_pyrun.sh:11`](../../scripts/_pyrun.sh#L11)
