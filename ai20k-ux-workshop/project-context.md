# Project Context & Rules

This document outlines the core development guidelines and agent rules for the workspace.

## Agent Guidelines & Rules

### 1. RTK - Rust Token Killer
- **Rule**: Always prefix shell commands with `rtk` (e.g. `rtk git status`, `rtk npm run test`, `rtk node tests/server.test.js`) to filter, compress, and optimize tool output before it reaches the LLM context.
- **Why**: Saving 60-90% tokens on common shell operations prevents context bloating and reduces latency.

### 2. General Conventions
- Maintain the **hinge rule**: all LLM calls route through `server/src/llmService.js` (client must never import the SDK directly).
- Use **plain JSX and inline styles** on the client (no TS, no Tailwind, no styled-components).
- Keep all state session-scoped and in-memory.
