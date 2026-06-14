# Project Initialization and Agent Environment Setup

This epic outlines the tasks required to set up the repository for AI development, including setting up AI usage logging hooks and creating the `AGENTS.md` entry point.

## Epic 1: Environment Setup and Agent Entry Configuration

This epic focuses on configuring the local development environment for compliance with the course's AI logging rules and ensuring CLI agents have a standard entry point.

### Story 1.1: Setup AI Usage Logging Hooks
Execute the setup hooks script to install the git pre-push hooks and initialize the `.ai-log` directory.
- **Goal:** Enable automatic logging of AI coding assistant prompts and tool calls.
- **Reference:** `eval/docs/guide/chapter-02.md`
- **Actions:**
  - Run the setup hooks script (e.g., `powershell -ExecutionPolicy Bypass -File scripts\setup_hooks.ps1` or `bash scripts/setup_hooks.sh`).
  - Configure `.env` with the appropriate `AI_LOG_API_KEY`.

### Story 1.2: Create AGENTS.md
Create the `AGENTS.md` stub file at the project root pointing agents to `README.md`.
- **Goal:** Establish a standard entry point for CLI-based agents in the workspace.
- **Reference:** `core/AGENTS.md` and `lumina-wiki/AGENTS.md`
- **Actions:**
  - Create `AGENTS.md` at the root path of `_VIN20K_PROJECT`.
  - Add standard redirection instruction pointing to the root `README.md`.

### Story 1.3: Verify Setup and Log Submission
Verify that the hook runs correctly, the `.ai-log/` folder is correctly set up, the environment configuration is in `.env`, and `AGENTS.md` is present and correctly structured.
- **Goal:** Ensure all environment configurations work end-to-end.
