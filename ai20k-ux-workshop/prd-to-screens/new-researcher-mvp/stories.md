---
type: workshop-artifact
app_slug: new-researcher-mvp
language: en
created: 2026-06-13
---

# New Researcher MVP — User Stories

## Product concept

SciSpace-inspired research guidance tool for students learning how research works.
Single actor (Student). An AI agent guides the student through a structured 10-step research cycle:

> 1\. Clarify Topic → 2. Define Scope → 3. Build Search Strategy → 4. Search Papers → 5. Screen Papers → 6. Extract Data → 7. Build Literature Matrix → 8. Identify Gap → 9. Draft Problem Statement → 10. Mentor Review

## Valuable stories (shipping)

1. **(Student)** Student enters a research topic → receives Socratic clarification → confirms refined question → defines scope → configures search strategy → reviews screening criteria — all in a single guided setup flow.
2. **(Student)** Student searches papers → views results table → filters and saves to library → reviews structured extraction per paper → uses Chat with PDF for deeper understanding.
3. **(Student)** Student views literature matrix → reviews gap analysis and suggested directions → edits and finalizes Research Problem Card.
4. **(Student)** Student prepares mentor review brief → exports research artifacts (Problem Card, Matrix, Brief).

Four phases of the same actor's journey → four core screens. Progress sidebar persists across all screens.

## Candidate stories — filter results

```
Story US-1 — Student enters research topic/question, receives Socratic clarification
             questions, confirms refined research question.
  Gate A (core loop):     PASS — the entry point of the entire product; without a
                          clarified question nothing downstream works.
  Gate B (AI hand-off):   PASS — student inputs raw topic → agent asks Socratic
                          questions → student confirms refined question. Clear
                          human-AI-human loop.
  Gate C (R worth it):    PASS — AI may misinterpret domain or intent; student must
                          be able to reject/edit the refined question.
  Verdict: KEEP → Screen 1 (Research Setup).

Story US-2 — Student defines research scope with agent guidance (target domain,
             expected output type).
  Gate A: FAIL as standalone — scope definition is a continuation of the setup
          conversation, not a separate moment. Same input context as US-1.
  Verdict: FOLD into Screen 1 (follows US-1 as next step in setup wizard).

Story US-3 — Student reviews and edits screening criteria (inclusion/exclusion)
             proposed by agent.
  Gate A: FAIL as standalone — screening criteria are a configuration artifact
          produced during setup. They inform the search, not a separate screen.
  Verdict: FOLD into Screen 1 (displayed as editable card after scope is set).

Story US-4 — Student configures search strategy (databases, paper coverage,
             search terms, publication period).
  Gate A: FAIL as standalone — search configuration is the final setup step
          before the actual search. Same wizard context as US-1/2/3.
  Verdict: FOLD into Screen 1 (final step of setup wizard, triggers transition
           to Screen 2).

Story US-5 — Student views paper search results in a table, filters and saves
             papers to library.
  Gate A (core loop):     PASS — this is the core discovery moment; student sees
                          what the literature landscape looks like.
  Gate B (AI hand-off):   PASS — agent searched databases → presents results →
                          student filters, evaluates, saves. Clear hand-off.
  Gate C (R worth it):    PASS — search may return irrelevant papers or miss key
                          ones; student needs to filter, remove, or re-search.
  Verdict: KEEP → Screen 2 (Paper Discovery & Review).

Story US-6 — Student reviews structured extraction of paper fields (problem,
             method, dataset, result, limitation).
  Gate A: FAIL as standalone — extraction is a detail view of a paper already in
          the library. It lives inside the paper review flow, not separately.
  Verdict: FOLD into Screen 2 (detail panel when a paper is selected from the
           results table or library).

Story US-7 — Student views and interacts with literature matrix.
  Gate A (core loop):     PASS — the matrix is where the student synthesizes
                          across papers. This is the analytical core of research.
  Gate B (AI hand-off):   PASS — agent populates the matrix from extracted data →
                          student reviews, edits cells, reorders.
  Gate C (R worth it):    PASS — AI extraction errors propagate into the matrix;
                          student must be able to correct individual cells.
  Verdict: KEEP → Screen 3 (Synthesis & Gap Analysis).

Story US-8 — Student reviews gap analysis and suggested research directions.
  Gate A: FAIL as standalone — gap analysis is derived from the matrix. It is the
          "so what" interpretation that naturally follows the matrix view.
  Verdict: FOLD into Screen 3 (panel below or beside the matrix, showing gaps
           and suggested directions).

Story US-9 — Student edits and finalizes Research Problem Card.
  Gate A: FAIL as standalone — the Problem Card is the output artifact of the
          gap analysis step. It lives on the same screen as synthesis results.
  Verdict: FOLD into Screen 3 (editable card section after gap analysis, the
           deliverable of the synthesis phase).

Story US-10 — Student prepares and exports mentor review brief.
  Gate A (core loop):     PASS — the mentor brief is the culmination of the
                          entire workflow. It packages everything for review.
  Gate B (AI hand-off):   PASS — agent assembles brief from all prior artifacts →
                          student reviews, edits, and sends/exports.
  Gate C (R worth it):    PASS — auto-generated brief may misrepresent the
                          student's actual reasoning; editing is essential.
  Verdict: KEEP → Screen 4 (Mentor Review & Export).

Story US-11 — Student uses Chat with PDF to understand individual papers.
  Gate A: FAIL as standalone — Chat with PDF is a tool within the paper review
          context, not a separate destination.
  Verdict: FOLD into Screen 2 (accessible from paper detail panel — slide-over
           or modal chat with the selected paper).

Story US-12 — Student tracks research progress in right sidebar throughout
              workflow.
  Gate A: FAIL as standalone — progress tracking is a persistent navigation
          element, not a screen. It is the scaffold that connects all screens.
  Verdict: FOLD into Global Shell (right sidebar component, visible on all
           screens, shows step completion and allows navigation).

Story US-13 — Student exports research artifacts (Problem Card, Matrix, Brief).
  Gate A: FAIL as standalone — export is a command, not a screen. It can be
          triggered from Screen 3 (Problem Card, Matrix) and Screen 4 (Brief).
  Verdict: FOLD into Screen 3 + Screen 4 (export buttons on each screen for
           the artifacts produced there).

Story US-14 — (Future) Mentor reviews and comments on student's research
              direction.
  PRD label: (Future).
  Verdict: DROP — requires a second actor (Mentor) with separate auth and
           notification system. Out of scope for MVP.
```

## Screen map (summary)

| Screen | Name | Stories | Research Cycle Steps |
|--------|------|---------|----------------------|
| Global Shell | Progress Sidebar | US-12 | Persistent across all steps |
| Screen 1 | Research Setup | US-1, US-2, US-3, US-4 | 1. Clarify → 2. Scope → 3. Strategy + Screening |
| Screen 2 | Paper Discovery & Review | US-5, US-6, US-11 | 4. Search → 5. Screen → 6. Extract |
| Screen 3 | Synthesis & Gap Analysis | US-7, US-8, US-9, US-13 (partial) | 7. Matrix → 8. Gap → 9. Problem Statement |
| Screen 4 | Mentor Review & Export | US-10, US-13 (partial) | 10. Mentor Review + Export |

## Notes for the team

- Single actor (Student) means all screens share the same layout shell. No auth complexity for MVP.
- The 10-step research cycle maps cleanly to 4 screens: Setup (steps 1–3), Discovery (steps 4–6), Synthesis (steps 7–9), Review (step 10). This mirrors how researchers actually work in phases.
- The Progress Sidebar (US-12) is the navigational spine. It shows which step the student is on, allows jumping between completed steps, and prevents the linear flow from feeling trapped.
- Chat with PDF (US-11) is folded into Screen 2 but should be designed as a reusable component — it may surface in Screen 3 later when students want to re-check a paper while reviewing the matrix.
- Export (US-13) is split across Screen 3 and Screen 4 because the artifacts belong to different phases. Do not create a separate "export center" — export where you create.
- US-14 (Mentor Review) is the natural MVP+1 feature. Screen 4 should be designed with future mentor interaction in mind (comment slots, approval status), but none of that ships in MVP.
- All AI-generated content (refined question, screening criteria, search results, extractions, matrix, gap analysis, problem card draft, mentor brief) must be editable by the student. This is the core pedagogical principle: the tool teaches research by making AI outputs transparent and correctable.
