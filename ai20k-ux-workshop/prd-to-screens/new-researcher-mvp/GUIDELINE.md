---
type: build-contract
app_slug: new-researcher-mvp
language: en
patterns: [3-panel-workspace, progressive-socratic]
created: 2026-06-13
---

# GUIDELINE.md — New Researcher MVP build contract

The AI coding agent reads this file completely before writing code for any Stage (0, T, C, R).

---

## §1 Project

- **Name:** New Researcher MVP
- **UI Pattern:** 3-panel research workspace — Left sidebar (research modules) + Center pane (prompt, task cards, agent preview) + Right sidebar (research progress tracker). Progressive Socratic guidance: the agent asks questions before giving answers.
- **Primary actor:** Student / New Researcher — a university student or early-career researcher learning how the research process works. They interact with the center pane, receive Socratic questions, build search strategies, screen papers, and extract structured data.
- **Secondary actor (future):** Mentor / Advisor — reviews research progress, validates criteria, annotates extracted data. Not implemented in MVP; the right sidebar shows a placeholder "Mentor Review" step at the end of the research cycle.
- **Purpose:** UX lab build validating a research guidance workflow for new researchers. Tests whether a Socratic, step-by-step approach (clarify → search → screen → extract → synthesize) helps students understand research methodology. Not production. No real database. No authentication. No deployment target.

### Research Cycle — 10 fixed steps

The research process is modeled as a fixed 10-step cycle. The left sidebar lists these steps as navigable modules. The right sidebar tracks completion status. The center pane renders the active step's UI.

| # | Step name               | Purpose                                                            |
|---|-------------------------|--------------------------------------------------------------------|
| 1 | Clarify Topic           | Student states a broad topic; agent asks Socratic questions to narrow it |
| 2 | Define Research Problem  | Agent helps student formulate a specific, answerable research question |
| 3 | Build Search Strategy    | Student selects databases, keywords, inclusion/exclusion criteria  |
| 4 | Run Paper Search         | Agent executes search and returns candidate papers                 |
| 5 | Screen Papers            | Student applies screening criteria; agent flags borderline cases   |
| 6 | Extract Data             | Structured extraction of key fields from selected papers           |
| 7 | Analyze Gaps             | Agent identifies gaps, contradictions, under-explored areas        |
| 8 | Build Literature Matrix  | Tabular comparison of papers across themes/variables               |
| 9 | Draft Synthesis          | Agent generates a narrative synthesis; student edits               |
|10 | Mentor Review            | Placeholder for mentor feedback (future); marks cycle complete     |

Steps are always presented in order. The student can revisit earlier steps but cannot skip ahead past the current frontier.

---

## §2 Stack

- **Client:** React 18 + Vite + plain JSX + inline styles. No TypeScript. No Tailwind. No CSS modules. No styled-components. Screen navigation via internal state or manual hash routes — no routing library.
- **Server:** Node.js + Express, JSON API, `nanoid` for IDs, ISO 8601 timestamps.
- **LLM:** Gemini 2.5 Flash Lite via `@google/generative-ai` with `responseSchema` for structured JSON. Called only on the server. Never imported on the client.
- **Storage:** In-memory arrays in `server/src/store.js`. All state is lost on server restart. No database. No file persistence.

---

## §3 `server/src/llmService.js` contract (Hinge Rule — read carefully)

**All LLM calls go through this single file.** The client must never import the Gemini SDK. This is a hard rule of the repository. Violating it stops the build and must be reported.

### Exports

```
interpretResearchIntent({ topic, history })
  → { narrowedTopic, researchQuestions[], suggestedKeywords[], domainClassification, confidence }

generateSocraticQuestions({ context, step, previousAnswers })
  → { questions[], hints[], guidanceLevel }

buildSearchStrategy({ researchQuestion, criteria })
  → { databases[], queryStrings[], filters{}, estimatedResults, coverageNotes }

extractPaperFields({ paperText, schema })
  → { fields{}, confidence, sourcePassages[], warnings[] }

analyzeGaps({ papers[], researchQuestion })
  → { gaps[], contradictions[], underExploredAreas[], strengthAreas[] }

generateResearchProgress({ sessionState })
  → { completedSteps[], currentStep, nextActions[], overallProgress, qualityIndicators{} }
```

### Behavior

- **Model:** `gemini-2.5-flash-lite` with `responseSchema` matching the return shape of each function.
- **Validation:** Each function has a `validateResponse()` check that verifies JSON shape, clamps numeric fields (confidence 0–100), deduplicates arrays, and enforces maximum lengths (e.g., questions ≤ 5, keywords ≤ 10, gaps ≤ 8).
- **Retry:** If validation fails, retry once with the same input. Two consecutive failures → throw → route returns 500 with `{ error: "LLM_VALIDATION_FAILED" }`.
- **Timeout:** 15-second timeout via `Promise.race`.
- **Abort:** Each function accepts an `AbortSignal` from the route handler. When the client cancels a request, the in-flight LLM call is aborted via `AbortController`.
- **Thinking budget:** `thinkingConfig: { thinkingBudget: 0 }` to minimize latency.
- **Fake fallback:** If `GEMINI_API_KEY` is missing or empty, return deterministic mock responses for common research topics (see §9 Seed Data). 1-in-8 random calls return `{ error: "LLM_SIMULATED_FAIL" }` to exercise recovery paths.

**Never change the function signatures.** Changing LLM provider = edit internals only, do not touch the exported interface.

---

## §4 File layout

```
server/
  .env.example              # GEMINI_API_KEY=
  src/
    index.js                # Express bootstrap, mount routes, global JSON error handler, CORS
    llmService.js           # HINGE — do not change signatures
    prompt.js               # buildSystemPrompt(step) + buildUserPrompt(context, history)
    store.js                # In-memory sessions, papers, artifacts + getSession(session_id)
    researchSteps.js        # RESEARCH_STEPS (10 items) — source of truth for the cycle
    routes/
      research.js           # POST /api/research/start, POST /api/research/clarify,
                            # POST /api/research/socratic, GET /api/research/progress
      papers.js             # POST /api/papers/search, POST /api/papers/screen,
                            # POST /api/papers/extract, GET /api/papers/:session_id
      artifacts.js          # POST /api/artifacts/matrix, POST /api/artifacts/synthesis,
                            # GET /api/artifacts/:session_id

client/
  index.html
  vite.config.js            # proxy /api → http://localhost:3001
  src/
    main.jsx
    App.jsx                 # Shell: 3-panel layout manager, toast system, keyboard shortcuts
    api/
      research.js           # fetch wrappers for /api/research/*, throws Error(data.error || "Error <status>")
    hooks/
      useResearch.js        # Session state, current step, step navigation, abort controller,
                            # ask/stop/retry/back, papers[], artifacts{}
    components/
      LeftSidebar.jsx       # Research module list (10 steps), active step highlight, step status icons
      ResearchPrompt.jsx    # Center pane text input + submit, adapts placeholder per active step
      TaskCards.jsx         # "I want to…" / "Use…" / "Make…" starter cards for Step 1
      AgentPreview.jsx      # Live preview of agent's current activity (thinking, searching, extracting)
      RightProgressSidebar.jsx  # Progress timeline, step completion %, quality indicators
      PaperTable.jsx        # Tabular list of candidate/screened papers with status badges
      ScreeningCriteriaEditor.jsx  # Editable inclusion/exclusion criteria (Stage +C)
      SearchStrategyBuilder.jsx    # Database picker, keyword editor, date range, coverage slider (Stage +C)
      LiteratureMatrix.jsx  # Cross-paper comparison table (themes × papers)
      ExtractionView.jsx    # Structured field display with source passage highlights
      SocraticQuestions.jsx # Agent question cards with hint toggle
      CitationCard.jsx      # Single citation display: title, source passage, confidence badge
      ResearchProblemCard.jsx # Formatted research question with domain classification tag
    styles/
      theme.js              # Design tokens (§7). Import everywhere, never hardcode values.
    utils/
      validate.js           # Client-side defensive validation for step names, field shapes
```

---

## §5 Baseline (Stage 0)

Stage 0 is the minimal working build. Single-column center pane only. No sidebars. No progress tracking.

### Layout

- Header: "New Researcher" 24px bold, subtitle "Learn how research works, one step at a time" 14px gray `#6B7280`.
- Single-column center pane, max-width 720px, horizontally centered, padding 24px.
- Background: `#F7F9FC`.

### Task cards

- Three starter cards arranged in a row below the prompt input:
  - **"I want to…"** — "Explore a research topic" (primary blue `#1E3A5F` border-left 4px)
  - **"Use…"** — "A specific paper or resource as a starting point" (teal `#2BA4A0` border-left 4px)
  - **"Make…"** — "A literature review or research summary" (green `#4CAF50` border-left 4px)
- Clicking a card populates the prompt input with a template sentence. The student edits and submits.

### Prompt input

- Textarea at the top of the center pane (not bottom — this is a workspace, not a chat).
- Placeholder: "What topic would you like to research? For example: 'How does sleep affect academic performance in university students?'"
- Submit button: "Start Research" primary deep blue `#1E3A5F`, rounded, right-aligned.
- Enter submits, Shift+Enter for newline.

### Agent response area

- Below the prompt, a simple card shows the agent's response.
- Response renders as a readable block with markdown-like formatting (bold, lists, paragraphs).
- Loading state: pulsing teal dot + italic "Thinking about your research direction…" in `#6B7280`.
- Follow-up Socratic questions appear as clickable chips below the response. Clicking a chip populates the prompt with that question.

### Session

- Session ID generated via `nanoid` on first interaction. Stored in a ref. Reset when the user clicks "New Research" button in the header.
- History maintained in memory. Up to 6 exchanges kept in context for the LLM.

---

## §6 T·C·R Progressive Stages

### Stage +T — Transparency

**What changes:** The single column expands into the full 3-panel layout. The student can see where they are in the process, what the agent is doing, and where every piece of information comes from.

#### Left sidebar (280px, fixed)

- Title: "Research Modules" 14px bold uppercase `#6B7280`.
- Lists all 10 research steps vertically.
- Each step shows: step number (circle), step name, status icon.
- Status icons: ○ upcoming (gray `#6B7280`), ◉ current (teal `#2BA4A0`, pulsing), ● completed (green `#4CAF50`), ✕ error (coral `#EF4444`).
- Active step has bg `#E8F4F3` (light teal) + left border 3px teal `#2BA4A0`.
- Clicking a completed step shows its results in the center pane (read-only). Cannot click upcoming steps.

#### Center pane (1fr, scrollable)

- Adapts its UI to the active research step:
  - Steps 1–2: Socratic question-and-answer interface (prompt + agent questions + student answers).
  - Step 3: Search strategy builder (simplified in Stage +T — read-only preview; editable in Stage +C).
  - Step 4: Paper search results table with status indicators.
  - Step 5: Screening interface with paper cards and include/exclude buttons.
  - Step 6: Extraction view showing structured fields with source passages highlighted.
  - Step 7: Gap analysis cards.
  - Step 8: Literature matrix table.
  - Step 9: Draft synthesis editor.
  - Step 10: Mentor review placeholder.
- **Agent preview panel** (bottom of center pane, collapsible): Shows live status of what the agent is currently doing. States: "Analyzing your topic…", "Searching 3 databases…", "Screening paper 4 of 12…", "Extracting fields from [Paper Title]…". Includes a small progress bar and elapsed time.
- **Citation sources on every output:** Every piece of AI-generated content shows its source. For Socratic questions: "Based on your topic description." For paper data: paper title + DOI/URL. For extracted fields: source passage shown inline with highlight. For gap analysis: list of papers that informed the finding.
- **Extraction confidence indicators:** Each extracted field shows a confidence badge: High (green `#4CAF50` ≥ 80), Medium (amber `#F59E0B` 50–79), Low (coral `#EF4444` < 50). Tooltip shows the source passage.

#### Right sidebar (300px, fixed)

- Title: "Research Progress" 14px bold uppercase `#6B7280`.
- Vertical timeline of all 10 steps with connecting lines.
- Each step node shows: step number, step name, completion status.
- Current step is highlighted with a teal ring and pulsing animation.
- Completed steps show a green checkmark and timestamp of completion.
- Below the timeline: **Overall progress bar** (percentage of steps completed).
- Below the progress bar: **Quality indicators panel** showing:
  - Papers found: N
  - Papers screened: N of M
  - Fields extracted: N of M
  - Research question clarity: High/Medium/Low (from LLM assessment)
- All numbers update in real time as the student progresses.

---

### Stage +T+C — Control

**What changes:** The student gains the ability to modify, direct, and pause the agent's work. They can edit criteria, choose databases, stop operations, and navigate backward.

#### Screening criteria editor (`ScreeningCriteriaEditor.jsx`)

- Appears in Step 5 (Screen Papers) as a panel above the paper list.
- Two columns: "Include if…" (green border-left) and "Exclude if…" (coral border-left).
- Each criterion is an editable text field with a delete (×) button.
- "Add criterion" button at the bottom of each column.
- Agent suggests initial criteria based on the research question; student can edit, add, or remove before screening begins.
- **Confirm gate:** A prominent "Confirm Criteria & Start Screening" button. Screening does not run until the student explicitly confirms. The button is primary teal `#2BA4A0` with a lock icon that changes to a checkmark after confirmation.

#### Search strategy builder (`SearchStrategyBuilder.jsx`)

- Appears in Step 3 (Build Search Strategy) as the primary center pane content.
- **Database picker:** Checkboxes for available databases (PubMed, Semantic Scholar, Google Scholar, arXiv, Scopus — all simulated). At least one must be selected.
- **Keyword editor:** Tag-style input. Agent suggests keywords; student can add/remove. Maximum 10 keywords.
- **Publication period:** Two date pickers (from/to) with presets: "Last 5 years", "Last 10 years", "All time".
- **Paper coverage slider:** Range input 10–100 with label "Target number of papers to review". Default: 30.
- **Preview panel:** Shows the constructed search query string in a read-only code block before the student confirms.
- **Confirm gate:** "Run Search with This Strategy" button. Search does not execute until confirmed.

#### Stop running workflow

- When any agent operation is in progress (searching, screening, extracting), a red "Stop" button appears in the agent preview panel.
- Clicking "Stop" fires `AbortController.abort()` on the active request.
- The agent preview shows "Stopped by you" and preserves any partial results already received.
- Keyboard shortcut: `Escape` stops the current operation.

#### Navigate backward

- In the left sidebar, clicking any completed step re-opens it in the center pane.
- A yellow banner appears: "You are reviewing Step N. Changes here may affect later steps."
- If the student modifies data in an earlier step (e.g., changes criteria in Step 5 after completing Step 6), all downstream steps are marked as "needs re-run" with an amber warning icon in both sidebars.

---

### Stage +T+C+R — Recovery

**What changes:** The system handles errors gracefully, lets the student undo mistakes, and provides clear retry paths. When the AI is uncertain, it stops and asks rather than guessing.

#### Retry failed paper searches

- If `POST /api/papers/search` returns an error, the paper table shows an error card: red border `#EF4444`, ⚠ icon, message "Search failed: [error message]".
- Two action buttons: "Retry Search" (re-sends the same strategy) and "Edit Strategy & Retry" (returns to Step 3 with the strategy builder pre-filled).
- If a search partially succeeds (some databases return results, others fail), show the successful results with a warning banner: "Results from [N] of [M] databases. [Failed databases] did not respond." + "Retry Failed" button.

#### Edit extracted fields with source verification

- In Step 6 (Extract Data), each extracted field is editable (click to edit).
- When a student edits a field, the source passage is shown side-by-side so they can verify their edit against the original text.
- Edited fields get a blue "Edited" badge. The original AI-extracted value is preserved and viewable via a "Show original" toggle.

#### Undo criteria changes

- Every change to screening criteria (add, edit, delete) pushes to an undo stack.
- "Undo" button (↶) appears in the criteria editor toolbar. Keyboard shortcut: `Ctrl+Z` (when criteria editor is focused).
- Undo stack depth: 10 operations.
- Toast notification on undo: "Criterion change undone" with a "Redo" action (6-second auto-dismiss).

#### Error states with clear retry actions

- **Network errors:** Inline error card replacing the loading state. Message: "Could not reach the server. Check your connection." + "Retry" button.
- **LLM timeout (15s):** Error card: "The AI took too long to respond." + "Retry" button + "Simplify your input" suggestion.
- **LLM validation failure:** Error card: "The AI returned an unexpected response." + "Retry" button. After 2 consecutive failures on the same step, show: "This step is having trouble. Try rephrasing your input or go back to the previous step."
- **All error cards** preserve the previous successful state in the UI. No optimistic clearing.

#### Fallback: AI uncertainty guard

- If the LLM returns a confidence below 40 on any operation, the agent does **not** silently proceed.
- Instead, it shows a yellow guidance card: "I'm not confident about this result. Here's what I'm unsure about: [specific uncertainty]. Can you provide more details about [specific aspect]?"
- The student must respond or explicitly click "Proceed anyway" before the workflow continues.
- If source passages for an extraction are weak (confidence < 30), the field is marked "Unverified — manual review needed" with a coral badge, and it is excluded from the literature matrix until the student confirms or edits it.

---

## §7 Design tokens

Defined in `client/src/styles/theme.js`. Import everywhere. Never hardcode color/spacing/radius values in component files.

```js
// client/src/styles/theme.js

export const colors = {
  // Primary palette
  primary:        '#1E3A5F',   // Deep blue — headers, primary buttons, active nav
  primaryHover:   '#16304F',   // Darker blue on hover
  primaryLight:   '#E8EFF7',   // Light blue tint for selected states

  // Accent
  accent:         '#2BA4A0',   // Teal — current step, confirm buttons, active indicators
  accentLight:    '#E8F4F3',   // Light teal for active step background
  accentHover:    '#239490',   // Darker teal on hover

  // Semantic
  success:        '#4CAF50',   // Green — completed steps, high confidence
  warning:        '#F59E0B',   // Amber — medium confidence, needs-rerun, caution
  danger:         '#EF4444',   // Coral — errors, low confidence, failed steps
  info:           '#3B82F6',   // Blue — edited badges, informational

  // Text
  textDark:       '#1F2937',   // Primary text
  textMuted:      '#6B7280',   // Secondary text, labels, placeholders
  textLight:      '#9CA3AF',   // Disabled text, timestamps

  // Background
  bgPage:         '#F7F9FC',   // Page background
  bgWhite:        '#FFFFFF',   // Card/panel backgrounds
  bgMuted:        '#F3F4F6',   // Subtle section backgrounds
  bgUserInput:    '#EFF6FF',   // User's input highlight

  // Border
  border:         '#E5E7EB',   // Default borders
  borderLight:    '#F3F4F6',   // Subtle dividers
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  base: 16,    // Base unit
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   6,
  card: 8,     // Cards, inputs
  panel: 12,   // Panels, modals
  full: 9999,  // Buttons, badges, pills
};

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  baseFontSize: 16,
  lineHeight: 1.6,
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const shadows = {
  sm:   '0 1px 2px rgba(0,0,0,0.05)',
  md:   '0 4px 6px rgba(0,0,0,0.07)',
  lg:   '0 10px 15px rgba(0,0,0,0.1)',
};

// Step progress color helper
export function stepColor(status) {
  switch (status) {
    case 'completed': return colors.success;     // #4CAF50
    case 'current':   return colors.accent;      // #2BA4A0
    case 'upcoming':  return colors.textMuted;   // #6B7280
    case 'error':     return colors.danger;       // #EF4444
    case 'needs-rerun': return colors.warning;   // #F59E0B
    default:          return colors.textMuted;
  }
}

// Confidence color helper
export function confidenceColor(score) {
  if (score >= 80) return colors.success;   // Green — high confidence
  if (score >= 50) return colors.warning;   // Amber — medium confidence
  return colors.danger;                     // Coral — low confidence
}

// Confidence label helper
export function confidenceLabel(score) {
  if (score >= 80) return 'High confidence';
  if (score >= 50) return 'Medium confidence';
  return 'Low confidence';
}
```

---

## §8 Constraints

- **No TypeScript.** No Tailwind. No CSS modules. No styled-components. Inline styles only on the client.
- **Allowed dependencies:**
  - Client: `react`, `react-dom`, `vite`, `nanoid`.
  - Server: `express`, `@google/generative-ai`, `nanoid`, `dotenv`, `cors`.
- **No routing library.** Screen/step navigation via `useState` + manual hash routes (e.g., `#/step/3`). Hash route changes update state; state drives rendering.
- **No state management library** (no Redux, no Zustand, no MobX). `useState` + `useReducer` + custom hooks are sufficient.
- **User-facing strings in English.** Use clear, jargon-free language appropriate for a student learning research methodology.
- **Research cycle is a fixed 10-step process.** Steps cannot be added, removed, or reordered by the student. The sequence is defined in `server/src/researchSteps.js` and is the single source of truth.
- **Citations always labeled as AI-generated references.** Never call them "verified sources" or "peer-reviewed citations." Use the label: "AI-generated reference — verify independently."
- **No Gemini SDK on the client.** All LLM calls go through the server via `llmService.js`. Violating this hinge rule = stop work and report.
- **All structured extraction must show source passages.** Every field the AI extracts from a paper must display the original text passage it was derived from. No "black box" extraction.
- **Student must confirm criteria before any automated search.** The system never runs a search or screening operation without explicit student confirmation via a confirm button (§6 +C confirm gates).
- **Session state is in-memory per server process.** Restart = full reset. No persistence layer. This is intentional for a UX lab build.
- **No external API calls from the client.** The client talks only to the Express server at `/api/*`. The server handles all external communication (LLM, simulated database searches).

---

## §9 Fake fallback seed data

`llmService.js` returns deterministic mock responses when `GEMINI_API_KEY` is missing. Same input → same output (except 1-in-8 random simulated failure for Stage R testing).

### interpretResearchIntent mocks

- **"sleep" / "academic performance"** →
  ```json
  {
    "narrowedTopic": "The effect of sleep duration and quality on academic performance in university students",
    "researchQuestions": [
      "How does sleep duration affect GPA in undergraduate students?",
      "What is the relationship between sleep quality and exam performance?"
    ],
    "suggestedKeywords": ["sleep duration", "academic performance", "university students", "GPA", "sleep quality"],
    "domainClassification": "Health Sciences / Education",
    "confidence": 85
  }
  ```

- **"climate change" / "agriculture"** →
  ```json
  {
    "narrowedTopic": "Impact of climate change on crop yield in Southeast Asian rice farming",
    "researchQuestions": [
      "How have rising temperatures affected rice yields in Southeast Asia over the past 20 years?",
      "What adaptation strategies have been most effective for rice farmers?"
    ],
    "suggestedKeywords": ["climate change", "rice yield", "Southeast Asia", "crop adaptation", "temperature impact"],
    "domainClassification": "Environmental Science / Agriculture",
    "confidence": 82
  }
  ```

- **"machine learning" / "healthcare"** → narrowed to "ML for early diagnosis of Type 2 diabetes", confidence 78.

- **"social media" / "mental health"** → narrowed to "Impact of Instagram usage on anxiety in adolescents aged 13–18", confidence 80.

- **Generic fallback** (no keyword match) →
  ```json
  {
    "narrowedTopic": "Your topic needs more specificity. Consider focusing on a specific population, time period, or outcome.",
    "researchQuestions": ["What specific outcome are you most interested in?"],
    "suggestedKeywords": [],
    "domainClassification": "General",
    "confidence": 35
  }
  ```
  Note: confidence 35 triggers the uncertainty guard (§6 +R).

### generateSocraticQuestions mocks

- Returns 3 questions per call, tailored to the step:
  - Step 1 (Clarify Topic): "What specific population are you interested in?", "What time period should your research cover?", "What outcome or variable matters most to you?"
  - Step 2 (Define Problem): "Is this a 'how' question, a 'what' question, or a 'why' question?", "Can this question be answered with available data?", "What would change if we knew the answer?"

### extractPaperFields mocks

- Returns 4–6 fields per paper with confidence scores between 45–95.
- Source passages are lorem-ish research text, clearly marked as simulated.
- One field per mock paper deliberately has confidence < 30 to exercise the "Unverified" badge path.

### 1-in-8 simulated failure

- Any function may return `{ error: "LLM_SIMULATED_FAIL" }` with probability 1/8.
- Deterministic seed: `Math.floor(Date.now() / 1000) % 8 === 0`.
- This exercises retry logic, error cards, and recovery UI in every stage.
