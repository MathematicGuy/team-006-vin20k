# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope
UX lab build — New Researcher MVP. SciSpace-inspired guided research workflow tool for new researchers and students. 3-panel layout (Left: Research Modules, Center: Prompt + Task Cards + Agent Preview, Right: Research Progress Sidebar). Not production; no auth, no DB, no deploy. See `PRD.md` + `GUIDELINE.md` + `scispace_main_page_user_flow2.md` (UX source of truth).

## Commands
Server (port 3001):
- `cd server && npm install && cp .env.example .env` (paste `GEMINI_API_KEY`)
- `npm run dev` — `node --watch src/index.js`

Client (port 5173, proxies `/api` → server):
- `cd client && npm install && npm run dev`
- Both must run in separate terminals.

No test / lint / typecheck scripts configured. Plain JSX, no TS.

## Hinge rule (hard)
**All LLM calls go through `server/src/llmService.js`.** UI must NEVER import Gemini SDK directly. Swapping provider (GPT (gpt-5.4-nano) -> OpenRouter (deepseek-v4-flash)) = edit this one file. Do not bypass.

## Architecture

Two-process split: React 18 SPA via Vite (client) + Express JSON API (server). Client never holds the API key; all LLM goes server-side.

### Server (`server/src/`)
- `index.js` — Express bootstrap, mounts research API routes (`/api/research`, `/api/papers`, `/api/artifacts`), global JSON error handler.
- `llmService.js` — THE HINGE. Calls LLM for research tasks: interpret intent, Socratic questions, search strategy, paper extraction, gap analysis. Active model: `gemini-2.5-flash-lite`. Validates response shape, retries once on failure. If validation fails twice → 500.
- `prompt.js` — `buildSystemPrompt()` for research agent persona + `buildUserPrompt()` for various research tasks (clarification, search, extraction, synthesis, review).
- `store.js` — in-memory state: `research_sessions`, `papers`, `extractions`, `literature_matrix`, `research_problem_cards`, `artifacts`. State dies on restart.
- `routes/research.js` — `POST /api/research/intent` (interpret user input), `POST /api/research/clarify` (Socratic questioning), `POST /api/research/search` (search strategy + paper discovery), `POST /api/research/extract` (structured data extraction from papers), `POST /api/research/matrix` (literature matrix / gap analysis), `GET /api/research/progress` (current research cycle state).
- `routes/papers.js` — `GET /api/papers` (list papers), `POST /api/papers` (add/import paper).
- `routes/artifacts.js` — `GET /api/artifacts` (list artifacts), `POST /api/artifacts` (save artifact: notes, matrices, problem cards).

### Client (`client/src/`)
- `App.jsx` — top-level shell with 3-panel layout. Left sidebar (Research Modules), center panel (Prompt + Task Cards + Agent Preview), right sidebar (Research Progress).
- `hooks/useResearch.js` — manages research session state, current step in the 10-step research cycle, collected artifacts, and progress tracking. Single source of truth for research workflow state.
- `api/research.js` — fetch wrappers for all research endpoints (`/api/research/*`, `/api/papers`, `/api/artifacts`).
- `components/` — `ResearchPrompt`, `TaskCards`, `LeftSidebar`, `RightProgressSidebar`, `AgentPreview`, `PaperTable`, `ScreeningCriteriaEditor`, `SearchStrategyBuilder`, `LiteratureMatrix`, `ExtractionView`, `ResearchProblemCard`, `MentorReviewBrief`, `SocraticQuestions`, `CitationCard`. Plain JSX + inline styles (no CSS modules, no Tailwind).
- `styles/theme.js` — research-focused design tokens: deep blue primary, teal accent, progress indicator palette, spacing tokens. Import this, don't hardcode colors.

### Data flow (one research turn)
1. User enters a research intent in `ResearchPrompt` or clicks a `TaskCard` → calls appropriate endpoint (e.g. `POST /api/research/intent {query, session_id, current_step}`).
2. Server: interprets intent and determines the current research step → runs the matching workflow (Socratic clarification, search strategy generation, paper extraction, etc.) via `llmService.js` → updates session progress in `store.js` → responds with structured output.
3. Client: `useResearch` updates session state, `AgentPreview` renders the LLM response (Socratic questions, paper results, extraction tables, gap cards), `RightProgressSidebar` updates the 10-step progress tracker.
4. Artifacts (extraction tables, literature matrices, problem cards) are persisted to `store.js` via `POST /api/artifacts` for cross-step reference.

### LLM response contract
Each research task returns a specific shape:

- **Intent interpretation**: `{task_type, research_step, clarification_questions[], suggested_workflow}`
- **Socratic clarification**: `{questions[], context_explanation, recommended_next_step}`
- **Paper search results**: `{papers[{title, authors, year, abstract, source, relevance_score}], search_metadata}`
- **Structured extraction**: `{fields[{paper_id, problem, method, dataset, metric, result, limitation, future_work, relevance, source_citation}]}`
- **Gap analysis**: `{gaps[], evidence[], confidence, reasoning}`

All fields required per task type. Validator rejects malformed responses.

## Conventions
- User-facing strings are in English. Keep them that way.
- Research cycle is the 10-step process: Clarify Topic → Define Research Question → Search Strategy → Paper Discovery → Screening → Structured Extraction → Literature Matrix → Gap Analysis → Research Problem Card → Mentor Review. Never skip steps without explicit user action.
- Citations are AI-generated references — UI must label them as such (not authoritative academic citations).
- Inline styles only on the client. No CSS files, no utility frameworks.
- Session state is in-memory per server process. Restart = reset. Don't add persistence unless PRD scope changes.
- **RTK (Rust Token Killer)**: Always prefix shell commands with `rtk` (e.g. `rtk git status`, `rtk npm run test`) to compress tool output and minimize token usage.

