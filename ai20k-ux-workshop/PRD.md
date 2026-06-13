# PRD — New Researcher MVP (AI Research Guide)

## Problem + context
New graduate students and early-career researchers struggle to navigate the research cycle — from clarifying a topic to producing a defensible problem statement. They don't yet know how to build a search strategy, screen papers systematically, extract structured data, or identify a genuine research gap. Mentors cannot walk every student through each step 1-on-1. This app is a **UX lab build** — validating a SciSpace-inspired 3-panel layout (sidebar tools + center prompt/task cards + right-side progress preview) that guides beginners through a 10-step research cycle with Socratic scaffolding, structured artifacts, and citation-backed output. Not production, not a real research database.

## Users
- **Primary:** New researchers / graduate students who need step-by-step guidance through the research cycle (clarify topic → literature review → gap identification → problem statement → mentor review)
- **Secondary:** Mentors / advisors who review student research direction, verify scope decisions, and approve the final Research Problem Card before the student proceeds

## User stories
1. **(Step 1 — Clarify Topic)** Student types a broad research interest into the main prompt; the agent asks Socratic clarifying questions to narrow the topic before any search begins.
2. **(Step 2 — Define Scope)** Student confirms or adjusts scope boundaries (domain, population, time range, inclusion/exclusion criteria) suggested by the agent; the scope is saved as an artifact.
3. **(Step 3 — Build Search Strategy)** Agent proposes search terms, Boolean queries, and database targets (Google Scholar, PubMed, arXiv, Semantic Scholar); student reviews and edits.
4. **(Step 4 — Search Papers)** Agent retrieves candidate papers from configured sources; results appear in a paper table with title, year, abstract snippet, and relevance indicator.
5. **(Step 5 — Screen Papers)** Student applies screening criteria to include/exclude papers; the agent highlights potential matches and flags borderline cases for human decision.
6. **(Step 6 — Extract Data)** For each selected paper, the agent extracts structured fields (objective, method, sample, key findings, limitations); student verifies and corrects.
7. **(Step 7 — Build Literature Matrix)** Extracted data is aggregated into a Literature Matrix (rows = papers, columns = structured fields); student can sort, filter, and annotate.
8. **(Step 8 — Identify Gap)** Agent analyzes the Literature Matrix and suggests potential research gaps with supporting evidence; student reviews and selects a gap hypothesis.
9. **(Step 9 — Draft Problem Statement)** Agent drafts a Research Problem Card (problem, significance, gap, proposed direction) backed by citations from the matrix; student edits and confirms.
10. **(Step 10 — Mentor Review)** Student exports a Mentor Review Brief summarizing scope, matrix, gap, and proposed direction for advisor feedback.
11. **(Cross-cutting)** Right sidebar shows a Research Progress Timeline — current step, completed artifacts, missing inputs, and the next recommended step — updated live as the student works.
12. **(Cross-cutting)** Student clicks a predefined Task Card (e.g., "Compare papers", "Find research gap") to jump into a specific workflow without typing a prompt.
13. **(Later)** Student opens "Chat with PDF" to ask questions about a specific uploaded paper inline.
14. **(Later)** Mentor opens a review view to see the student's full artifact trail and leave structured feedback.

## Data model
- **research_sessions** — id, student_id, title, current_step (1–10), status (active | completed), created_at, updated_at
- **research_steps** — id, session_id, step_number (1–10), step_name, status (pending | in_progress | completed | skipped), inputs (JSON), outputs (JSON), completed_at
- **papers** — id, session_id, source (scholar | pubmed | arxiv | semantic_scholar), external_id, title, authors (array), year, abstract, url, screening_status (pending | included | excluded), relevance_score, added_at
- **literature_matrix_entries** — id, session_id, paper_id, objective, method, sample, key_findings, limitations, student_notes, verified (boolean), created_at
- **research_problem_cards** — id, session_id, problem_statement, significance, gap_description, proposed_direction, citations (array of paper_ids), status (draft | confirmed | reviewed), created_at, updated_at
- **artifacts** — id, session_id, type (scope | search_strategy | paper_set | literature_matrix | gap_hypothesis | direction_brief | mentor_review_brief), content (JSON), step_number, created_at

## Tech stack
- **Frontend:** React 18 + Vite + plain JSX + inline styles (3-panel layout: left sidebar, center prompt area, right progress sidebar)
- **Backend:** Express JSON API (server)
- **LLM:** LLM calls go through `server/src/llmService.js` — swap provider by editing that one file, UI untouched (**hinge rule**)
- **Storage:** In-memory JSON (no DB) — sufficient for UX lab sessions
- **Not using:** TypeScript, Tailwind, SQLite, external auth services

## Constraints
- UX lab build — prototype fidelity, not production
- No auth, no persistent storage beyond in-memory; session resets on server restart
- Demo runs on a single laptop, no deployment target
- User-facing strings in English
- Paper search results are **mock data or limited API calls** in lab mode — real corpus integration is out of scope
- Citations must be traceable to actual papers in the session's paper set; the AI must not invent citations
- **Hinge rule:** All LLM calls route through `server/src/llmService.js` — no direct LLM calls from frontend or other server modules
- AI must ask Socratic clarifying questions before executing any research workflow (differentiator from SciSpace)
- Human review checkpoints: student confirms scope (Step 2), student reviews screening criteria (Step 5), student verifies extracted fields (Step 6), mentor reviews final direction (Step 10)

## API surface
- **POST /api/sessions** — create a new research session, returns session object with id and initial step
- **GET /api/sessions/:id** — get session details including current step, status, and progress summary
- **PUT /api/sessions/:id/step** — advance or update the current research step (with inputs/outputs)
- **GET /api/sessions/:id/progress** — get the full Research Progress Timeline (all steps, completed artifacts, missing inputs, next recommended step)
- **POST /api/sessions/:id/clarify** — send student's topic/answer to Socratic clarification; returns agent's follow-up questions or confirmed scope
- **POST /api/sessions/:id/search** — execute paper search with given strategy; returns paginated paper results
- **GET /api/sessions/:id/papers** — list all papers in session, filterable by screening_status and source
- **PUT /api/sessions/:id/papers/:paperId/screen** — update a paper's screening status (include / exclude)
- **POST /api/sessions/:id/extract** — run structured extraction on a selected paper; returns extracted fields for verification
- **GET /api/sessions/:id/matrix** — get the full Literature Matrix for the session
- **POST /api/sessions/:id/gap** — analyze the matrix and return gap hypotheses with evidence
- **POST /api/sessions/:id/problem-card** — draft or update a Research Problem Card
- **GET /api/sessions/:id/artifacts** — list all artifacts produced in the session
- **POST /api/sessions/:id/export** — export selected artifacts (matrix, problem card, mentor brief) as structured JSON/Markdown

## Success criteria
- Student enters a broad topic, receives at least 2 Socratic clarifying questions before any search is triggered
- Right sidebar updates live: shows current step, lists completed artifacts, flags missing inputs, and recommends the next step
- Paper table displays at least 5 mock/retrieved papers with title, year, abstract snippet, and screening controls
- Literature Matrix renders correctly with rows = included papers, columns = structured fields, all editable
- Research Problem Card contains problem statement, gap, proposed direction, and at least 2 traceable citations from the paper set
- Switching LLM provider requires editing only `server/src/llmService.js` — no frontend or other server file changes
- A complete 10-step walkthrough (clarify → mentor review) can be demoed in a single lab session without crashes or data loss

## Out of scope
- Auth / login / user accounts
- Persistent database — in-memory only, resets on restart
- Mobile / responsive layout
- Dark mode, i18n, CSS polish
- Real-time paper corpus integration (lab uses mock data or limited API snapshots)
- Voice input / audio
- Citation graph visualization
- Autonomous multi-agent research workflows
- Code execution / computational analysis
- Workflow gallery / agent marketplace

## Open questions
- Should the Socratic clarification step have a maximum number of follow-up rounds before auto-proceeding, or let the student decide when scope is "good enough"?
- What is the minimum viable paper count for the Literature Matrix to meaningfully suggest gaps (3? 5? 10?)?
- Should the mentor review brief be a structured form or a free-text narrative with embedded artifacts?
- How should the right-side progress sidebar handle students who skip steps or work out of order?
