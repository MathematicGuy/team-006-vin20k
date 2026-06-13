---
type: build-prompts
app_slug: new-researcher-mvp
language: en
patterns: [3-panel-research]
created: 2026-06-13
---

# New Researcher MVP — Build Prompts

**Product:** SciSpace-inspired research guidance tool for students learning how research works.
**UI pattern:** 3-panel layout — Left sidebar (Research Modules), Center (Prompt + Task Cards + Agent Preview), Right sidebar (Research Progress).
**Stack:** React 18 + Vite + plain JSX + inline styles (client) + Node + Express (server), LLM via `server/src/llmService.js`, in-memory store.
**Research Cycle:** 10 steps — Clarify Topic → Define Scope → Build Search Strategy → Search Papers → Screen Papers → Extract Data → Build Literature Matrix → Identify Gap → Draft Problem Statement → Mentor Review.
**Usage:** Open a fresh AI coding session in an empty directory. Copy `GUIDELINE.md` into it. Paste Prompt 0 first, wait for dev server to run. Then paste T, C, R in order. Ship Screen 1 first (~30–40 min), then repeat the 4-prompt cycle for Screen 2 (~30–40 min). Do NOT skip prompts or reorder them.

---

## Screen 1 — Main Research Page (3-panel layout)

### Prompt 0 — Baseline

```
Read GUIDELINE.md in this directory completely before writing any code.

Build Screen 1 (Main Research Page) baseline exactly as specified:

LAYOUT: Single-column centered layout, max-width 800px, centered on a #F7F9FC
background. No sidebars yet — those come in Prompt T.

HEADER: Top bar with app name "Research Navigator" in bold #1E3A5F, subtitle
"Your guided path from topic to problem statement" in 14px #6B7280.

CENTER PANEL:
1. Research prompt — a large textarea (min-height 80px, width 100%, border 1px
   #E5E7EB, border-radius 8px, padding 16px, font 16px Inter/system-ui) with
   placeholder text "What research topic are you exploring today?". Below it,
   a primary button "Start Exploring" (bg #1E3A5F, text white, padding 10px
   24px, border-radius 24px, font-weight 600). Disable the button when
   textarea is empty.

2. Task card grid — 3 columns on desktop, 1 column on narrow. Three groups:
   - "I want to…" group: cards for "Clarify my topic", "Define my scope",
     "Build a search strategy", "Search for papers", "Screen papers". Each
     card: white bg, 1px #E5E7EB border, 8px radius, 16px padding, hover
     border color #2BA4A0.
   - "Use…" group: "Chat with a PDF", "Extract data from a paper".
   - "Make…" group: "Literature matrix", "Research Problem Card",
     "Export artifacts".
   Each card has a title (16px bold #1F2937), a one-line description (14px
   #6B7280), and a subtle icon placeholder (just render the first letter of
   the card title in a 32px #2BA4A0 circle for now). Clicking any card
   populates the textarea with a starter prompt for that task.

3. Agent preview area — below the cards, a container (bg white, 8px radius,
   min-height 120px, 1px #E5E7EB border) with placeholder text "Agent
   responses will appear here" in italic 14px #9CA3AF. When the student
   submits a prompt, show a loading state: "Analyzing your research
   intent…" in italic #6B7280 with a pulsing dot animation (CSS only).
   When the response arrives, render it as markdown-like blocks: paragraphs,
   bold for key terms, bullet lists.

SERVER: Implement Express server (port 3001):
- POST /api/research/ask — receives { prompt, step?, context? }. Calls
  llmService.js which wraps the LLM call. The route parses the LLM response
  and returns { response, meta: { step, suggestedNext, citations, confidence } }.
- server/src/llmService.js — export askLLM(prompt, systemContext). Use
  responseSchema to enforce structured output. Include validateResponse that
  checks required fields exist. Retry once on malformed response. 15-second
  timeout via Promise.race. When GEMINI_API_KEY is missing or the call fails,
  return fake fallback data:
  {
    response: "Great topic! To narrow this down, consider: (1) What specific
    aspect interests you most? (2) What time period? (3) Any particular
    methodology you're drawn to? Let's refine your question together.",
    meta: {
      step: "clarify_topic",
      suggestedNext: "define_scope",
      citations: [
        { source: "Research Methods Guide", excerpt: "A well-defined research
          question is the foundation of any systematic review." }
      ],
      confidence: 0.85
    }
  }

CLIENT: Create client/src/api/research.js with a fetch wrapper:
askResearch(prompt, step, context) that calls POST /api/research/ask.
Use a custom hook useResearch() in hooks/useResearch.js that manages
{ loading, response, error } state and exposes an ask(prompt) function.

STYLING: All styles inline per GUIDELINE.md. Font: Inter/system-ui. Colors
from the palette: #1E3A5F primary, #F7F9FC background, #2BA4A0 accent,
#1F2937 text. No CSS modules, no Tailwind, no styled-components.

Run npm install in both server/ and client/, start both with npm run dev.
```

**⚠ Do NOT touch after this stage:** llmService.js hinge architecture, fake fallback data shape, the POST /api/research/ask contract.

---

### Prompt T — Transparency

```
Following GUIDELINE.md T·C·R checklist section T for Screen 1, expand the
single-column layout into the full 3-panel layout:

LEFT SIDEBAR (220px fixed, bg white, border-right 1px #E5E7EB, padding 16px):
- App logo area: "Research Navigator" in 18px bold #1E3A5F, margin-bottom 24px.
- Navigation items, each 40px height, 8px radius, padding 8px 12px, 14px font:
  "Home" (default active), "My Library", "Chat with PDF", "Literature Review",
  "Extract Data", "Research Problem Card", "Mentor Review".
  Active item: bg #EFF6FF, text #1E3A5F, left border 3px #1E3A5F.
  Inactive: text #6B7280, hover bg #F7F9FC.
  Clicking a nav item is cosmetic for now (no routing) but sets active state.

CENTER PANEL (fluid remaining width, padding 24px, overflow-y auto):
- Keep the research prompt, task cards, and agent preview from Prompt 0.
- After each agent response, render a "Sources" section below the response:
  for each item in meta.citations, show a citation card (white bg, 1px #E5E7EB
  border, 8px radius, padding 12px, margin-bottom 8px). Card shows:
  source name in bold 14px #1F2937, excerpt in 14px #6B7280 (2-line clamp).
  Above the citation list, show label "Sources — AI-generated, verify before
  citing" in 12px italic #9CA3AF.
- Live agent preview upgrade: when loading is true, show a status bar at the
  top of the agent preview area: a teal (#2BA4A0) left border 3px, bg #F0FDFA,
  padding 12px, text "Analyzing your research intent…" or "Searching papers…"
  depending on the current step from context. Show a small animated progress
  bar (teal, 4px height, indeterminate CSS animation).

RIGHT SIDEBAR (280px fixed, bg white, border-left 1px #E5E7EB, padding 16px):
- Section header: "Research Progress" in 16px bold #1E3A5F.
- Current Step indicator: highlighted card (bg #EFF6FF, border-left 3px #2BA4A0,
  padding 12px, 8px radius) showing step number + name, e.g. "Step 1: Clarify
  Topic". Derive the current step from the latest response's meta.step. Default
  to Step 1 when no response yet.
- Completed Artifacts list: for each completed step, show "✅ [artifact name]"
  in 14px #4CAF50. Initially empty.
- Missing Inputs: show "⚠️ [missing item]" in 14px #F59E0B for items the
  student hasn't provided yet. Default: "⚠️ Research question not defined",
  "⚠️ Scope criteria not set", "⚠️ Search strategy not built".
- Next Recommended Step: a subtle card (bg #F7F9FC, padding 8px 12px, 8px
  radius) showing "Next: [suggestedNext from meta]" in 14px #2BA4A0.
  Read from latest response meta.suggestedNext.
- Progress Timeline: vertical timeline of all 10 steps. Each step is a row:
  a dot (12px circle) + step name (14px). Done steps: filled green dot #4CAF50
  + text #1F2937. Active step: teal ring dot #2BA4A0 (border 2px, hollow) +
  bold text. Upcoming: grey outline dot #D1D5DB + text #9CA3AF. Connected by
  a 2px vertical line (#E5E7EB) between dots.

Don't touch the server, llmService.js, useResearch hook, or the baseline agent
response rendering logic. Don't add filters, controls, or error handling yet.
```

**⚠ Do NOT touch after this stage:** Left sidebar nav structure, right sidebar progress timeline layout, citation card format.

---

### Prompt C — Control

```
Following GUIDELINE.md T·C·R checklist section C for Screen 1, add user
control capabilities:

SCREENING CRITERIA EDITOR:
When the current step is "define_scope" or "screen_papers", show a criteria
editor panel in the center area (below the prompt, above task cards). It has:
- A form with labeled inputs: "Date range" (two date inputs, from/to),
  "Domains" (comma-separated text input), "Include keywords" (text input),
  "Exclude keywords" (text input).
- Each field: label 14px bold #1F2937, input with 1px #E5E7EB border, 6px
  radius, padding 8px 12px, 14px font. Focus border: #2BA4A0.
- Two buttons at bottom: "Apply Criteria" (bg #1E3A5F, white text, 24px
  radius) and "Reset to Defaults" (border 1px #E5E7EB, text #6B7280, 24px
  radius). Applying saves criteria to local state and includes it in the
  next /api/research/ask call as context.criteria.

SEARCH STRATEGY BUILDER:
When step is "build_search_strategy", show a strategy preview panel:
- Boolean query display: a readonly textarea showing the generated query
  (e.g., "(AI OR machine learning) AND (medical diagnosis)") with an "Edit"
  button that makes it editable.
- Keyword synonyms: tag pills (bg #EFF6FF, 6px radius, 14px, padding 4px
  12px, border 1px #DBEAFE) with an × to remove, and a text input + "Add"
  button to add new synonyms.
- Database selection: checkboxes for "PubMed", "IEEE Xplore", "Semantic
  Scholar", "arXiv", "Google Scholar". All checked by default. Student can
  deselect any.
- "Confirm & Search" button (bg #1E3A5F, white, 24px radius). This
  confirmation gate is required — the agent MUST NOT auto-execute the search.
  Show a confirmation dialog (inline, not modal): "Ready to search [N]
  databases with this query?" with "Run Search" and "Edit First" buttons.

STOP WORKFLOW:
Add a "Stop" button (bg #EF4444, white text, 24px radius, padding 8px 20px)
that appears ONLY when useResearch().loading is true. It sits in the agent
preview status bar next to the loading text. Clicking aborts the in-flight
request via AbortController and shows "Search stopped by user" in the agent
preview.

GO BACK TO EARLIER STEP:
In the right sidebar progress timeline, make completed step dots clickable.
Clicking a completed step sets currentStep to that step's index, shows a
confirmation: "Going back to Step [N] — your later work is preserved but the
agent will restart from here. Continue?" with "Go Back" and "Stay" buttons.
Going back updates the right sidebar's current step indicator and clears the
agent preview to the starter state for that step.

Don't touch the Transparency panel layouts, citation cards, or the progress
timeline visual styling. Don't add error handling yet.
```

**⚠ Do NOT touch after this stage:** Screening criteria field names, search strategy confirmation gate flow, stop button abort logic.

---

### Prompt R — Recovery

```
Following GUIDELINE.md T·C·R checklist section R for Screen 1, add error
handling and recovery:

ERROR HANDLING WITH RETRY:
Wrap the askResearch call in useResearch with try/catch. On error, set an
error state and render an error card in the agent preview area: red left
border 3px #EF4444, bg #FEF2F2, padding 16px, 8px radius. Show:
- "⚠ Something went wrong" in 16px bold #EF4444.
- Error message in 14px #6B7280 (from the caught error, or "The research
  agent couldn't process your request").
- Two buttons:
  "Retry" (bg #1E3A5F, white, 24px radius) — re-sends the last prompt as-is.
  "Simplify & Retry" (border 1px #E5E7EB, text #1F2937, 24px radius) —
  truncates the last prompt to 150 characters, appends "…(simplified)", and
  re-sends.
- Below the buttons: "If this keeps happening, try breaking your question
  into smaller parts." in 12px italic #9CA3AF.

INPUT VALIDATION:
Before calling askResearch, validate the prompt:
- If trimmed length < 10 characters, show an inline warning below the textarea:
  "Your question is too short — add more detail so the agent can help
  effectively" in 14px #F59E0B, with a subtle amber left border 3px. Clear
  this warning as the user types past 10 characters.
- If trimmed length > 2000 characters, show: "Your question is very long —
  consider focusing on one aspect at a time" in 14px #F59E0B. Still allow
  submission but show the warning.

TIMEOUT HANDLING:
Ensure llmService.js has the 15-second timeout via Promise.race (add it if
missing). When a timeout occurs, the error card should show a specific
message: "The research agent is taking too long. This usually means the
question is too broad." with the standard Retry / Simplify buttons.

FALLBACK WHEN AI UNCERTAIN:
When the response has meta.confidence < 0.5, render a warning banner above
the response in the agent preview: bg #FFFBEB, border-left 3px #F59E0B,
padding 12px. Text: "Low confidence — the agent isn't sure about this
response. Consider rephrasing your question or providing more context." in
14px #92400E. Still show the response below the banner, but add a subtle
amber tint (bg #FFFBEB) to the response container.

STATE PRESERVATION ON RETRY:
When retrying, keep the right sidebar's current step and completed artifacts
intact — do not reset progress. Keep the citation cards from the last
successful response visible (greyed out with 50% opacity) until the new
response replaces them. Do not optimistically clear the agent preview.

Don't touch the Transparency panel, Control UI, or left sidebar. Don't add
new features — only harden what exists.
```

**⚠ Do NOT touch after this stage:** Error card format, validation thresholds, timeout duration (15s).

---

## Screen 2 — Paper Review & Extraction

### Prompt 0 — Baseline

```
Read GUIDELINE.md completely before writing any code. This is Screen 2
(Paper Review & Extraction) — add it alongside Screen 1 with a hash route
(#/papers opens Paper Review, default "/" is the Main Research Page).
Do NOT regress Screen 1. Both screens must work.

NAVIGATION: In the left sidebar, add "Paper Review" as a nav item. Clicking
it navigates to #/papers. "Home" navigates to #/ (Screen 1). Use a simple
hash-based router (window.onhashchange listener or a small useHashRoute
hook) — no react-router dependency.

LAYOUT: Same 3-panel frame as Screen 1 (left sidebar 220px, center fluid,
right sidebar 280px). Left sidebar and right sidebar are shared — only the
center panel content changes.

CENTER PANEL — PAPER TABLE:
- Header: "Paper Review" in 20px bold #1E3A5F, subtitle "Review and manage
  your retrieved papers" in 14px #6B7280.
- Paper table (HTML table, not a library): columns are "Title", "Authors",
  "Year", "Relevance", "Status". Table styling: header row bg #F7F9FC, 14px
  bold #1F2937, rows alternate white/#FAFBFC, row height 48px, cell padding
  12px 16px, border-bottom 1px #E5E7EB.
  - Title: 14px bold #1F2937, max-width 300px, text-overflow ellipsis.
  - Authors: 14px #6B7280, max-width 200px, truncated.
  - Year: 14px #1F2937, 60px width.
  - Relevance: a small horizontal bar (60px wide, 6px height, bg #E5E7EB,
    filled portion colored: #4CAF50 if ≥0.7, #F59E0B if ≥0.4, #EF4444
    below), with percentage text beside it in 12px.
  - Status: a badge — "Included" (bg #ECFDF5, text #065F46, 6px radius),
    "Excluded" (bg #FEF2F2, text #991B1B), "Pending" (bg #FFF7ED, text
    #9A3412). Default all to "Pending".
- Clicking a row expands an inline detail panel below that row (not a
  separate page): shows full title, abstract (first 3 sentences), and a
  "View Extraction" button.

SERVER: Add GET /api/papers — returns a hardcoded list of 8 mock papers
with fields: id, title, authors (array), year, abstract, relevance (0-1),
status ("pending"), source, extractedFields (null initially). Mock data
should look like realistic CS/medical research papers.

CLIENT: Create client/src/api/papers.js with fetchPapers(). Create
hooks/usePapers.js that fetches on mount and exposes { papers, loading,
error, selectedPaper, selectPaper }.

Run both dev servers. Verify Screen 1 still works at #/.
```

**⚠ Do NOT touch after this stage:** Paper table column structure, mock paper data shape, hash routing mechanism.

---

### Prompt T — Transparency

```
Following GUIDELINE.md T·C·R checklist section T for Screen 2, add
structured extraction view and confidence indicators:

STRUCTURED EXTRACTION VIEW:
When the user clicks "View Extraction" on a paper row, replace the inline
detail panel with a structured extraction card (bg white, 8px radius, 1px
border #E5E7EB, padding 24px). The card has:
- Paper title in 18px bold #1E3A5F at top.
- A grid of extraction fields (2 columns on desktop, 1 on narrow). For each
  of the 9 extraction fields defined in GUIDELINE.md (Problem, Method,
  Dataset, Metric, Result, Limitation, Future Work, Relevance, Source
  citation):
  - Label: 12px uppercase tracking-wider #9CA3AF, margin-bottom 4px.
  - Value: 14px #1F2937, min-height 40px, padding 8px, bg #F7F9FC, 6px
    radius. Show placeholder "Not yet extracted" in italic #D1D5DB if null.
  - Confidence indicator: a small dot (8px circle) next to the label —
    green #4CAF50 for high (≥0.7), amber #F59E0B for medium (≥0.4), red
    #EF4444 for low. Tooltip on hover: "High/Medium/Low confidence —
    auto-extracted by AI".

When no extraction exists yet, show a button "Run Extraction" (bg #2BA4A0,
white text, 24px radius) that calls POST /api/papers/:id/extract. This
endpoint calls llmService.js with the paper abstract and returns mock
extracted fields with random confidence values (0.3–0.95 per field).
Store extracted fields in memory on the server.

LITERATURE MATRIX DISPLAY:
Below the paper table, add a collapsible section "Literature Matrix" (click
to expand/collapse, default collapsed). When expanded, show a comparison
table: rows are papers (title, truncated), columns are the extraction fields
(Problem, Method, Dataset, Metric, Result). Cells show the first 50 chars
of each value, or "—" if not extracted. Cell bg tinted by confidence:
green tint #ECFDF5 for high, amber tint #FFFBEB for medium, red tint
#FEF2F2 for low, white for null. Table header: sticky, bg #1E3A5F, text
white, 12px uppercase. Use horizontal scroll if needed.

RIGHT SIDEBAR UPDATE:
When on Screen 2, the right sidebar should update:
- Current step shows "Step 6: Extract Data" (or appropriate step based on
  what papers have been extracted).
- Completed Artifacts: add "✅ Paper list retrieved (8 papers)" when papers
  are loaded. Add "✅ [Paper title] extracted" for each extracted paper.
- Missing Inputs: "⚠️ [N] papers not yet extracted" for remaining.

Don't touch Screen 1, the paper table baseline structure, or the server
mock data. Don't add editing, filtering, or error handling yet.
```

**⚠ Do NOT touch after this stage:** Extraction field grid layout, confidence dot colors/thresholds, literature matrix column order.

---

### Prompt C — Control

```
Following GUIDELINE.md T·C·R checklist section C for Screen 2, add user
control capabilities:

EDIT EXTRACTED FIELDS:
In the structured extraction view, make each field value editable. Add a
small "Edit" icon button (pencil icon placeholder — use ✏ character, 14px,
#9CA3AF, hover #1E3A5F) next to each field label. Clicking it converts the
field value area from a read-only display to an editable textarea (14px,
border 1px #2BA4A0, 6px radius, padding 8px, bg white). Show two small
buttons below: "Save" (bg #1E3A5F, white, 6px radius, 12px font, padding
4px 12px) and "Cancel" (text #6B7280, 12px). Saving calls
PUT /api/papers/:id/fields { fieldName, value } — add this endpoint to the
server (updates the in-memory paper object). After saving, the confidence
indicator for that field changes to a blue dot #1E3A5F with tooltip "Manually
edited by user" — distinguishing human edits from AI extractions.

FILTER PAPERS:
Above the paper table, add a filter bar (flex row, gap 12px, padding 12px 0):
- Status filter: three chip buttons "All" (default active), "Included",
  "Excluded", "Pending". Active chip: bg #1E3A5F, text white, 6px radius.
  Inactive: bg #F7F9FC, text #6B7280, border 1px #E5E7EB.
- Year range: two small number inputs (width 80px) for min/max year.
- Relevance threshold: a small dropdown with options "Any", "≥70%", "≥50%",
  "≥30%". Default "Any".
- Search: text input (width 200px, placeholder "Search titles…", 1px border,
  6px radius). Filters paper titles client-side.
All filtering is client-side over the already-fetched papers list. Update the
paper count display: "Showing X of Y papers" in 14px #6B7280.

COMPARE PAPERS:
Add a checkbox column as the first column in the paper table. When 2 or more
papers are checked, show a floating action bar at the bottom of the center
panel (bg white, box-shadow 0 -2px 8px rgba(0,0,0,0.1), padding 12px 24px,
8px radius): "[N] papers selected" + "Compare" button (bg #2BA4A0, white,
24px radius) + "Clear Selection" link (#6B7280). Clicking "Compare" opens
a side-by-side extraction comparison: columns are the selected papers, rows
are extraction fields. Same confidence tinting as the literature matrix.

SAVE TO LIBRARY:
In the paper row detail panel, add a "Save to Library" button (border 1px
#1E3A5F, text #1E3A5F, 24px radius, 14px). Clicking it calls POST
/api/library/add { paperId }. Add this endpoint — it adds the paper ID to
an in-memory savedPapers set. Saved papers show a small bookmark icon (use
🔖 character) next to their title in the table. In the left sidebar, the
"My Library" nav item shows a count badge (bg #2BA4A0, text white, 12px,
min-width 20px, text-align center, border-radius 10px) with the number of
saved papers.

INCLUDE/EXCLUDE PAPERS:
In the paper table Status column, make the badge clickable. Clicking cycles:
Pending → Included → Excluded → Pending. Each click calls PATCH
/api/papers/:id { status }. Add this endpoint.

Don't touch Screen 1, the Transparency extraction view layout, the
confidence indicators, or the literature matrix. Don't add error handling.
```

**⚠ Do NOT touch after this stage:** Filter bar layout, compare side-by-side structure, save/library badge logic.

---

### Prompt R — Recovery

```
Following GUIDELINE.md T·C·R checklist section R for Screen 2, add error
handling and recovery:

RETRY FAILED EXTRACTIONS:
When POST /api/papers/:id/extract fails (network error or timeout), show an
error state inside the extraction card: red left border 3px #EF4444, bg
#FEF2F2. Message: "Extraction failed for this paper" in 14px #EF4444. Two
buttons: "Retry Extraction" (bg #1E3A5F, white, 24px radius) and "Fill
Manually" (border 1px #E5E7EB, text #1F2937, 24px radius — this opens all
fields in edit mode). If retry also fails, show: "Extraction failed twice.
You can fill in the fields manually or skip this paper." in 12px italic
#9CA3AF.

VERIFY SOURCE PASSAGES:
In the structured extraction view, add a "Verify" link (12px, underlined,
#2BA4A0) next to each extracted field value. Clicking it highlights the
field and shows a small popover (bg white, box-shadow 0 2px 8px
rgba(0,0,0,0.15), 8px radius, padding 12px, max-width 300px) with:
- "Source passage" label in 12px bold #1F2937.
- The relevant abstract excerpt that the extraction came from (from
  meta.sourcePassage — add this field to the mock extraction response),
  in 14px italic #6B7280.
- "Looks correct" button (bg #4CAF50, white, 6px radius, 12px) that
  upgrades the confidence to high and closes the popover.
- "Incorrect" button (bg #EF4444, white, 6px radius, 12px) that opens
  the field in edit mode and adds a small "⚠ Flagged for review" badge
  next to the field label.
Click outside popover to dismiss it.

UNDO EDITS:
When the user edits and saves an extraction field, show a toast notification
at the bottom-right of the screen: bg #1F2937, text white, 14px, 8px radius,
padding 12px 20px, box-shadow. Text: "Field updated · Undo" where "Undo" is
a link (underlined, #2BA4A0). Auto-dismiss after 6 seconds. Clicking "Undo"
within the 6 seconds reverts the field to its previous value (store the
previous value in a ref before the edit). Also revert the confidence
indicator back to its original AI-generated state. If the toast has already
dismissed, the edit cannot be undone (no persistent undo stack needed).

PAPER TABLE ERROR STATE:
If GET /api/papers fails, don't render an empty table. Instead show an error
card in the center panel: bg white, 8px radius, 1px #E5E7EB border, padding
32px, text-align center. Content: "📚" in 48px, "Couldn't load your papers"
in 18px bold #1F2937, "Check your connection and try again" in 14px #6B7280,
"Retry" button (bg #1E3A5F, white, 24px radius). Clicking Retry re-fetches.

EXTRACTION BATCH ERROR:
If multiple extractions are triggered (future feature prep) and some fail,
show a summary banner above the paper table: "Extracted [N] of [M] papers
successfully. [K] failed — you can retry them individually." bg #FFFBEB,
border-left 3px #F59E0B, padding 12px, 14px #92400E.

Don't touch Screen 1, the Transparency layouts, or the Control UI
(filters, compare, library). Only harden what exists.
```

**⚠ Do NOT touch after this stage:** Toast timing (6s), undo mechanism, verify popover layout.

---

## Stage failure protocol

| Symptom | Action |
|---|---|
| AI code generator produces broken code | `That errored with: [paste full error]. Fix it without changing the existing component structure.` |
| Prompt runs >90 seconds with no output | Narrate the expected outcome: "This should produce a 3-panel layout with left nav, center cards, right progress sidebar." |
| Unexpected feature added (e.g., auth, database, PDF parser) | "That's out of scope for this lab. Remove [feature] — see GUIDELINE.md 'What NOT to build yet'." |
| LLM API key missing or API fails | The fake fallback in llmService.js should handle this automatically. If not: `Check that llmService.js returns the fake fallback object when GEMINI_API_KEY is missing.` |
| LLM returns malformed JSON | `The response isn't valid JSON — llmService validateResponse should retry once then return the fake fallback. Check the retry and fallback path.` |
| Client imports LLM SDK directly | `This violates the hinge rule — all LLM calls go through server/src/llmService.js. Remove the direct import and use the /api/research/ask endpoint instead.` |
| Dev server won't start | `npm run dev failed with: [paste error]. Fix the Vite config (client port 5173) or Express config (server port 3001).` |
| Port conflict | Ctrl+C both servers, restart. Vite auto-picks the next port; Express needs port 3001 free. |
| Screen 1 breaks after building Screen 2 | `Screen 1 at #/ is broken — [describe what's wrong]. Fix it without changing Screen 2. The hash router should keep them independent.` |
| Right sidebar shows wrong step | `The progress timeline shows [wrong step] but should show [correct step] based on the last response meta.step. Check useResearch hook state.` |
| Extraction confidence colors wrong | `The confidence dot for [field] shows [wrong color] at [value]. Thresholds: ≥0.7 green, ≥0.4 amber, below red. Fix the conditional.` |
| Literature matrix overflows | `The matrix table overflows without horizontal scroll. Add overflow-x: auto to the matrix container.` |

---

## Estimated time per screen

| Screen | Prompt 0 | Prompt T | Prompt C | Prompt R | Total |
|--------|----------|----------|----------|----------|-------|
| 1 — Main Research Page | ~10 min | ~10 min | ~10 min | ~8 min | ~30–40 min |
| 2 — Paper Review & Extraction | ~10 min | ~10 min | ~12 min | ~10 min | ~35–45 min |

Times assume a responsive AI code generator. Add 5–10 minutes per prompt if you need to debug build errors.
