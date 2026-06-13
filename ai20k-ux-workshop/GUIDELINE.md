# GUIDELINE — New Researcher MVP

> Tech stack: see `PRD §Tech stack`.  
> UX lab build — not production. All data is session-scoped mock JSON.

---

## Research Cycle (10 Steps)

The full guided research cycle that a student walks through:

| Step | Name | Key Output |
|------|------|------------|
| 1 | Clarify Topic | Focused research question |
| 2 | Define Scope | Inclusion/exclusion criteria, date range, domains |
| 3 | Build Search Strategy | Boolean query, keyword synonyms, database selection |
| 4 | Search Papers | Retrieved paper list with metadata |
| 5 | Screen Papers | Included/excluded papers with reasons |
| 6 | Extract Data | Structured field extraction per paper |
| 7 | Build Literature Matrix | Cross-paper comparison table |
| 8 | Identify Gap | Evidence-backed gap statement |
| 9 | Draft Problem Statement | Research Problem Card |
| 10 | Mentor Review | Feedback checklist + revision notes |

AI uses Socratic guidance before execution at every step — ask clarifying questions first, then act.

---

## UI pattern

**3-panel layout: Sidebar + Prompt Area + Progress Sidebar**

| Panel | Width | Role | Content |
|-------|-------|------|---------|
| **Left sidebar** | ~220px fixed | Tool navigation | Home, My Library, Chat with PDF, Literature Review, Extract Data, Research Problem Card, Mentor Review |
| **Center panel** | fluid (remaining) | Primary action area | Research prompt input, Task card shortcuts, Live agent preview |
| **Right sidebar** | ~280px fixed | Research journey awareness | Current Step indicator, Completed Artifacts, Missing Inputs, Next Recommended Step, Progress Timeline |

**Principle:** Left = tools, Center = action, Right = awareness.

### Center panel detail

1. **Research prompt** — large text input at top: "What research topic are you exploring today?"
2. **Task card grid** — grouped into three categories:

| Category | Cards |
|----------|-------|
| **I want to…** | Clarify my topic, Define my scope, Build a search strategy, Search for papers, Screen papers |
| **Use…** | Chat with a PDF, Extract data from a paper |
| **Make…** | Literature matrix, Research Problem Card, Export artifacts |

3. **Live agent preview** — below the prompt/cards, shows real-time agent status: what the agent is doing, which step it is on, streaming output, and a stop button.

### Right sidebar detail

- **Current Step** — highlighted step number + name (e.g., "Step 3: Build Search Strategy")
- **Completed Artifacts** — list of outputs produced so far (e.g., ✅ Research question, ✅ Scope criteria)
- **Missing Inputs** — items the student still needs to provide (e.g., ⚠️ Date range not set)
- **Next Recommended Step** — what the system suggests doing next
- **Progress Timeline** — vertical 10-step timeline with status dots (done / active / upcoming)

---

## Visual style

**Scholarly but approachable** — professional academic aesthetic that feels focused and calm, not playful.

Concrete rules:

- **Palette:**

| Role | Color | Hex |
|------|-------|-----|
| Primary (headers, active nav, buttons) | Deep blue | `#1E3A5F` |
| Background (page, panels) | Light grey-white | `#F7F9FC` |
| Accent (links, highlights, active step) | Teal | `#2BA4A0` |
| Progress (completed steps, success) | Green | `#4CAF50` |
| Warning (missing inputs, low confidence) | Amber | `#F59E0B` |
| Danger (errors, failed searches) | Coral | `#EF4444` |
| Text (primary body) | Dark charcoal | `#1F2937` |

- **Corners:** `rounded-lg` (8px) for cards and panels, `rounded-md` (6px) for buttons and tags
- **Type:** sans-serif (Inter / system-ui), 16px base, 14px for metadata and sidebar items, 20px for section headings
- **Spacing:** 16px base unit, 24px between major sections, 8px between tight list items
- **Tone:** professional but encouraging — "What topic are you exploring?" not "Enter query". Guide, don't command.
- **Icons:** use outline-style icons (Lucide / Heroicons). No emoji in UI labels.
- **Borders:** subtle 1px `#E5E7EB` borders between panels. No heavy drop shadows — use light background tints to separate sections.
- **Cards:** white (`#FFFFFF`) card surface on the `#F7F9FC` background, 1px border, 8px radius
- **Progress dots:** ● filled green for done, ◉ teal ring for active, ○ grey outline for upcoming

---

## Structured extraction fields

When extracting data from a paper (Step 6), the agent fills these fields per paper:

| Field | Description |
|-------|-------------|
| **Problem** | Research problem or question the paper addresses |
| **Method** | Methodology, approach, or technique used |
| **Dataset** | Data sources, corpora, or sample described |
| **Metric** | Evaluation metrics or measures reported |
| **Result** | Key findings and quantitative outcomes |
| **Limitation** | Stated limitations or threats to validity |
| **Future Work** | Suggested future directions by the authors |
| **Relevance** | How this paper relates to the student's research question |
| **Source citation** | Full citation string (author, year, title, venue) |

All extracted fields are editable by the student. Confidence indicator (high / medium / low) shown per field when auto-extracted.

---

## User flow (MVP — student researcher)

1. Student opens the app → sees the 3-panel layout. Center panel shows the research prompt and task cards. Right sidebar shows Step 1 as active, no artifacts completed yet.
2. Student types a broad topic (e.g., "AI in medical diagnosis") or clicks the "Clarify my topic" card.
3. Agent asks Socratic clarifying questions: "What aspect of AI in medical diagnosis? Imaging? NLP on records? A specific disease?" — the student refines iteratively.
4. Once the topic is focused, the agent produces a **Research Question** artifact → right sidebar marks Step 1 ✅, advances to Step 2.
5. Student defines scope (criteria, date range, domains). Agent suggests defaults; student confirms or edits → **Scope Criteria** artifact saved.
6. Agent drafts a **Search Strategy** (Boolean query, synonyms, databases). Student reviews and confirms before search runs. Human review checkpoint.
7. Agent executes search → returns a **Paper Table** (title, authors, year, abstract snippet, relevance score). Student sees results in center panel.
8. Student screens papers: include/exclude with reasons, guided by agent suggestions. Agent shows screening criteria for confirmation before applying.
9. For included papers, agent runs **Structured Extraction** → fills the 9 extraction fields per paper. Student reviews and edits extracted data.
10. Agent builds a **Literature Matrix** — cross-paper comparison table across extraction fields.
11. Agent analyzes the matrix and suggests a **Gap Statement** backed by citations from the reviewed papers.
12. Student and agent co-draft a **Research Problem Card** — structured statement of the identified gap and proposed direction.
13. Student submits for **Mentor Review** — generates a summary package with all artifacts, flagged for human feedback.

All LLM outputs show citation sources. All agent suggestions require student confirmation before execution.

---

## T·C·R checklist for this pattern

### T — Transparency (what AI work is visible)

- [ ] Right sidebar shows current step, completed artifacts, and missing inputs at all times
- [ ] Live agent preview: streaming status ("Searching papers…", "Extracting from Paper 3/12…")
- [ ] Citation-backed output: every claim, suggestion, or summary includes source references
- [ ] Extraction confidence: each auto-filled field shows high / medium / low confidence indicator
- [ ] Search strategy shown before execution — student sees the Boolean query and databases before the agent runs it
- [ ] Gap statement includes explicit evidence trail: "Papers A, B, C cover X; no paper addresses Y"

### C — Control (what user can stop / edit / override)

- [ ] Confirm criteria before search: agent shows scope + query for approval, student can edit before running
- [ ] Edit/refine at any step: student can go back and change any artifact (question, scope, criteria, extraction)
- [ ] Stop running workflow: cancel button on any in-progress agent task (search, extraction, matrix build)
- [ ] Choose databases: student can select/deselect databases from a presented list
- [ ] Override screening decisions: manually include/exclude papers regardless of agent recommendation
- [ ] Edit extracted fields: all structured extraction data is editable inline

### R — Recovery (validation + retry + undo)

- [ ] Retry failed searches: "Retry" button when a database search fails or times out
- [ ] Edit extracted fields: fix any auto-extracted value that is incorrect
- [ ] Go back to earlier step: navigate the progress timeline to revisit and revise any prior step
- [ ] Undo criteria changes: revert scope or screening criteria to previous version
- [ ] Error state with explanation: when extraction or search fails, show what went wrong and offer actionable next steps
- [ ] Response validation at service layer: verify LLM output matches expected schema — reject and retry on malformed responses

---

## AI boundaries

| AI may | AI must not |
|--------|-------------|
| Ask clarifying questions | Claim novelty without evidence |
| Suggest scope, criteria, search terms | Invent citations or fabricate sources |
| Retrieve and summarize papers | Decide final research direction alone |
| Extract structured fields from papers | Replace mentor review |
| Build literature matrix | Hide uncertainty or low confidence |
| Suggest evidence-backed gaps | Present AI-generated text as student's own work |
| Draft Research Problem Card | Skip human review checkpoints |

Human review is required at: scope confirmation (Step 2), search strategy approval (Step 3), screening criteria (Step 5), and mentor review (Step 10).

---

## Hinge rule

All LLM calls go through `src/llmService.js`. UI components never import the Gemini SDK directly. Changing provider (Gemini → Claude → GPT) = edit one file.

---

## What NOT to build yet

- Citation graph / knowledge graph visualization
- Workflow gallery (saved/shared research templates)
- Agent marketplace or custom agent plugins
- Autonomous agent mode (all steps require human confirmation in MVP)
- Code execution or computational notebooks
- Auth, login, user accounts
- Persistent DB — mock JSON in memory/file only
- Mobile layout, responsive polish
- Dark mode, i18n
- Full-text PDF parsing (use abstract + metadata in MVP)
- Real database API integrations (mock search results in lab mode)
- T·C·R features beyond the checklist above — run `/tcr-apply` after baseline is working
