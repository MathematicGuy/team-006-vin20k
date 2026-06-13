# C-001 - Vertical slice: guided research intent to progress sidebar

status: todo
deps: none

## Scope

Build one deployable vertical slice for the New Researcher MVP: a student creates a project, enters a vague research intent or selects a task card, receives interpreted task state plus Socratic clarification questions, and sees the right research progress sidebar update with current step, missing inputs, completed artifacts, and next action.

This card proves the product seam before wider buildout. It does not implement paper search, extraction, literature matrix generation, export, auth beyond the chosen MVP token/session approach, or mentor review artifacts.

## Allowed files

- Backend API files for `POST /api/projects`, `POST /api/research-intents`, and `GET /api/projects/{project_id}/progress`
- Backend domain/model files for `Project`, `ResearchIntentResponse`, `ProgressResponse`, and related shared shapes from `flow/05-contract.md`
- Frontend files for the main page prompt, task cards, live preview, and right progress sidebar
- Contract/OpenAPI tests for the endpoints in this card
- Minimal persistence/config files needed for the slice
- Documentation updates only when they record actual endpoint or run evidence

## Verify (run these before calling the card done)

- [ ] Start the app and open the live main page URL.
- [ ] Create a project with initial intent "I want to research AI in education" and confirm the API returns a `Project` with `current_step: clarify_topic`.
- [ ] Submit the intent through the UI prompt or task card and confirm the live preview shows interpreted task state plus Socratic questions.
- [ ] Confirm the right sidebar shows current step, missing inputs, no completed artifacts yet, and a next action to answer clarification questions.
- [ ] Fetch `/openapi.json` and confirm the three card endpoints exist with request and response shapes matching `flow/05-contract.md`.

## Done-evidence (world-state proof, named BEFORE building)

A clickable deployed or locally served URL where a student can enter a vague topic and see the prompt/task-card response update the right progress sidebar, plus curl output from `/openapi.json` proving the three vertical-slice endpoints exist with the contracted shapes.

## Evidence (paste the actual proof here when done)

(empty until done)
