# Stage 04 - ADR (architecture decisions)

Short. The most valuable section is what you are NOT doing and why.

## Gate - check ALL before `/flow next`
- [x] Each decision has a one-line "why" and a one-line "what I rejected"
- [x] The NOT-doing list is written
- [x] Decisions cover: data storage, auth approach, deploy target
- [x] No FILL placeholders remain in this file

## Decisions

| # | Decision | Why | Rejected alternative |
|---|---|---|---|
| 1 | FastAPI backend with OpenAPI kept live at `/docs` | The contract is the seam, and FastAPI makes request/response shapes visible for backend, frontend, and tests from the first slice. | Flask or ad-hoc server actions without a served API contract. |
| 2 | React/Next.js frontend with three-panel responsive layout | The source truth requires left tools, center action, and right research progress; React makes the stateful progress sidebar and task workflow practical. | Static HTML-only product or chat-only UI. |
| 3 | SQLite for local MVP, upgradeable to Postgres without changing domain objects | The first validation needs persistence for projects, papers, criteria, matrices, and artifacts without infra delay. | Starting with managed Postgres before the workflow is validated. |
| 4 | Session-based or single-user lightweight auth for MVP | First users come from a known cohort; account complexity is not needed to prove the guided workflow. | Custom auth, roles, teams, SSO, or payment-gated accounts. |
| 5 | Semantic Scholar metadata adapter plus manual PDF upload fallback | It gives a free scholarly-data path while still allowing students to continue when search coverage is weak. | Building a crawler or depending only on Google Scholar scraping. |
| 6 | Human-reviewed AI drafts, not autonomous research agents | The source truth says AI may suggest and draft, but the student confirms scope, criteria, extraction, and final direction. | Multi-step autonomous agentic pipelines that decide the research direction. |
| 7 | Deploy API and frontend to a simple web target with live `/docs` | The MVP needs clickable/curlable world-state evidence and simple review by cohort users. | Local-only notebook or desktop app. |

## NOT doing in v1 (and why it's safe to skip)

- No citation graph: paper table, source preview, and citation verification cover the core research workflow.
- No workflow gallery or marketplace: fixed task cards are enough for the first cohort.
- No autonomous research agent: human review is a product boundary, not a missing feature.
- No custom auth, payments, teams, or SSO: the first proof is individual student workflow completion.
- No hidden novelty claims: gap hypotheses must show evidence and uncertainty, and mentor review remains required.
- No advanced multi-agent planning or code execution: outside the main student research-cycle promise.
