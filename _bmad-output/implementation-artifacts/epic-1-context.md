# Epic 1 Context: Environment Setup and Agent Entry Configuration

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Configure the local development environment for compliance with the course's AI logging rules and ensure CLI agents have a standard entry point.

## Stories

- Story 1.1: Setup AI Usage Logging Hooks
- Story 1.2: Create AGENTS.md
- Story 1.3: Verify Setup and Log Submission

## Requirements & Constraints

- Git pre-push hooks must be successfully installed.
- A `.ai-log/` folder must be created in the workspace.
- The grading server's API key and endpoint must be configured in `.env`.
- CLI agents (like Antigravity) must automatically detect and use the `AGENTS.md` stub file.

## Technical Decisions

- Run the existing setup script: `scripts/setup_hooks.ps1` (for Windows PowerShell) or `scripts/setup_hooks.sh` (for Unix).
- Create the `AGENTS.md` file at the root path `_VIN20K_PROJECT`.
