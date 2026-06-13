# Stage 03 - PRD

1-2 pages max. Test: could a stranger build v1 from this without asking you anything?

## Gate - check ALL before `/flow next`
- [x] Every section below is filled from MY scope decision (stage 02), not re-expanded
- [x] Success metric is a NUMBER, not vibes ("save time" fails; "first response < 2h" passes)
- [x] Each feature names the user action and the observable result
- [x] Pain & gain is a MAPPING TABLE: every pain cites evidence (a stage-01 quote or a named observation), and names the v1 feature that kills it; every v1 feature kills at least one pain
- [x] A stranger could build v1 from this without asking me anything
- [x] No FILL placeholders remain in this file

## Context

The product is a SciSpace-like main page for students who are still learning how research works. The source-of-truth flow keeps SciSpace's core model - prompt or task shortcut, agent interpretation, live task preview, required input, workflow execution, citation-backed output, review/refine/export/continue - but changes the purpose from "execute known research tasks" to "guide a new researcher into the right research task." The most important product difference is the right sidebar research progress preview, which shows current step, completed artifacts, missing inputs, next recommended action, and progress through the research cycle.

## Target users

Primary user: master's or early PhD student in AI, computing, or applied research who has a broad topic, a few papers, or a professor's direction but does not know how to turn it into a reviewed research direction. They use Google Scholar, Semantic Scholar, ChatGPT, SciSpace-like tools, PDFs, and spreadsheets, but they still need structure, citation checks, and mentor-reviewable outputs. Secondary user: mentor or instructor who wants students to bring a coherent research problem card, search strategy, literature matrix, and direction brief instead of scattered notes.

## Pain & gain (mapping table - the traceability spine of the PRD)

Every row: a concrete pain, the evidence it's real, what people do about it today, the
ONE v1 feature that kills it, and the observable gain. If a feature kills no pain, cut
it; if a pain has no feature, it goes to the "not addressed" list - honestly.

| # | Persona | Pain (concrete) | Evidence (stage-01 quote/source or named observation) | Today's workaround | V1 feature that kills it | Observable gain |
|---|---|---|---|---|---|---|
| P1 | New researcher | Starts with vague intent and does not know which research step comes next | Source truth examples: "I want to research anomaly detection", "I want to do AI in education", "I have 5 papers but do not know the gap" | Generic chatbot prompt or asking mentor for direction | Research-focused landing prompt, task cards, and Socratic topic clarification | User gets a refined research question, draft scope, and named current step |
| P2 | New researcher | Gets lost across topic, scope, search, screening, extraction, gap, and mentor review | Source truth: right panel must show what they are doing, where they are, produced artifact, and next step | Notes, spreadsheets, memory, ad-hoc task lists | Right research progress sidebar | Sidebar shows current step, completed artifacts, missing inputs, and next recommended action after each major action |
| P3 | New researcher | Search strategy and screening are complex and easy to do badly | Stage 01: search strategy methods can be complex, time consuming, resource intensive, and error prone | Google Scholar keywords without explicit criteria | Screening criteria editor and search strategy builder | User confirms inclusion/exclusion criteria, sources, paper coverage, search terms, and publication period before retrieval |
| P4 | New researcher | Reads papers but cannot convert them into a comparable evidence table | Source truth: structured extraction fields include problem, method, dataset, metric, result, limitation, future work, relevance, citation | Manual spreadsheet and copy-pasted summaries | Paper table, source preview, structured extraction, and literature matrix | User gets a reviewed matrix with source-linked fields per selected paper |
| P5 | Mentor/instructor | Receives unclear direction without citation evidence or explicit uncertainty | Source truth: AI must not claim novelty without evidence, invent citations, decide final direction alone, or replace mentor review | Long chat transcripts or informal student notes | Citation-backed artifact generation and export | User exports a research problem card, gap hypothesis, direction brief, and mentor review brief with citations and open questions |

### Pains NOT addressed in v1 (deliberate - tie to the scope cut list)

- Exploring citation networks visually -> deferred to v2 because the paper table and source preview are enough to validate the main workflow.
- Fully autonomous research planning -> deferred because the source truth requires student confirmation and mentor review.
- Team collaboration and billing -> deferred until the individual student workflow proves useful.
- Marketplace/workflow gallery -> deferred because task cards and fixed guided flows are enough for the first cohort.

## Problem statement

New researchers need a guided research workspace that helps them move from vague topic to mentor-reviewable research direction without losing track of scope, evidence, missing inputs, or the next step. Existing tools help execute research tasks, but this product must teach the research cycle while executing a SciSpace-like workflow.

## Features (user-centric - action -> observable result)

- As a student, I open the main page, type a topic or click a task card, and I see the selected research workflow plus a beginner-friendly explanation of what step I am in.
- As a student, I enter a vague topic, answer Socratic questions, and I see a refined research question plus draft scope.
- As a student, I review proposed inclusion and exclusion criteria, edit them, and I see the criteria saved as required inputs before search can run.
- As a student, I choose paper coverage, sources, search terms, and publication period, and I see a confirmed search strategy ready to execute.
- As a student, I run search or add uploaded papers, and I see a paper table with source preview, filters, compare/save actions, and citation verification status.
- As a student, I run structured extraction on selected papers, review/edit extracted fields, and I see a literature matrix with source citations.
- As a student, I ask for gap or direction help, and I see a citation-backed gap hypothesis, research problem card, direction brief, or mentor review brief with uncertainty.
- As a student, I export artifacts, and I receive Markdown/PDF files for mentor review or continued work.
- As a student, I take any major action, and the right sidebar updates current step, completed artifacts, missing inputs, and next recommended action.

## Non-functional requirements

- No invented citations: every important claim must link to a paper, uploaded source, or explicit "needs verification" marker.
- Human-in-the-loop gates: the student confirms scope, screening criteria, search strategy, and extracted fields before downstream artifacts are accepted.
- Beginner copy: each research step explains why it matters in one short paragraph or helper line.
- MVP search size: support 20-50 papers, 1-3 sources, keyword plus synonym expansion, and manual upload fallback.
- Responsive layout: desktop uses left tools, center action, right progress sidebar; mobile collapses the right progress into a sticky progress panel.
- Exportable artifacts: at minimum Markdown export; PDF can be generated from the same artifact HTML if time permits.

## Tech stack

Backend: FastAPI with Python for research workflow APIs, paper/search adapters, extraction jobs, and OpenAPI contract.
Database: SQLite for local MVP or Postgres if deployed; schema covers projects, papers, criteria, search strategies, extracted fields, artifacts, citations, and progress events.
Frontend: React or Next.js with the design law in `buildflow/DESIGN.md`; no engine words in user-facing copy.
AI/search integrations: one LLM provider for Socratic questions/extraction/artifact drafts; Semantic Scholar API for paper metadata; manual PDF upload as fallback.
Deploy target: a simple cloud web deploy such as Render/Fly/Railway for API plus frontend, with `/docs` kept enabled until v1 ships.

## Success metric (numbers only)

In the first AI20K/VIN cohort test, 8 of 10 students complete a topic-to-mentor-brief flow on a 20-paper or smaller set in under 60 minutes, and at least 6 of 10 export all four core artifacts: refined research question, search strategy, literature matrix, and mentor review brief.
