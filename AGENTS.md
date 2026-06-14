# AGENTS.md — Team-006 Agent Researcher

This file is the entry point for any CLI agent that reads `AGENTS.md` (OpenAI CodexApp (ChatGPT), Amp, Crush, Goose, Auggie, OpenCode, Kimi Code, Mistral Vibe, and other AGENTS.md-compatible tools).

You are the developer agent for **team-006-agent-researcher**.

Read `README.md` at the project root first — it contains the project description, virtual environment configuration, git pre-push hooks setup, and requirements for the VinUni AI20K Build Phase.

Communicate with the user in **English**.

## Git Workflow Guidelines (No Chaos Teamwork)

To prevent code conflicts, broken builds, and messy git history, all agents and developers must strictly adhere to the following workflow guidelines:

### 1. Branching Strategy
- **`main`**: The production-ready branch. Always stable. Never push directly to `main`. All changes must go through a Pull Request (PR) merging into `develop` first, then from `develop` into `main`.
- **`develop`**: The integration branch. All feature branches merge here first. Once `develop` is stable and ready for release, it is merged into `main`.
- **`feature/YOUR-FEATURE-NAME`**: Dedicated branch for a single cohesive feature or bug fix. Name should describe the feature clearly.
  - *Example:* `feature/agent-search-tool`

### 2. Commit Message Format
Every commit message must follow the Conventional Commits format:
```
type(scope): short description

[detailed description if needed]
```
Common types:
- `feat`: New feature (e.g., `feat(api): add endpoint /chat/stream`)
- `fix`: Bug fix (e.g., `fix(agent): handle empty input exception`)
- `docs`: Documentation update (e.g., `docs: update setup instructions in README.md`)
- `test`: Adding or modifying tests (e.g., `test(agent): add search tool unit test`)
- `refactor`: Code restructuring without changing functionality (e.g., `refactor(config): migrate config to pydantic-settings`)
- `chore`: Maintenance tasks, dependencies, etc. (e.g., `chore: update ruff to v0.4.0`)

*Scope* is optional but recommended (e.g., `agent`, `api`, `config`, `models`, `tests`).

### 3. Pull Request (PR) Template
Every Pull Request must include a clear title (following the commit format) and the following description template:

```markdown
## PR Template

### Changes
- [List specific changes made]

### Why
- [Explain the problem and approach / why these changes matter]

### How to Test
1. [Steps to set up environment / run server]
2. [Test commands, e.g., pytest tests/...]
3. [Manual validation steps via UI or Swagger UI]

### Checklist
- [ ] Code complies with the style guide
- [ ] Unit tests have been written/updated
- [ ] All tests pass successfully
- [ ] No hardcoded secrets or sensitive credentials
```
