---
type: workshop-internal
status: draft
updated: 2026-04-22
purpose: Spec for 6 parallel sub-agents building remaining case-*.html files. Template = 03-case-query-to-chart.html (2108 lines, approved 2026-04-22).
---

# Batch guideline — remaining 6 case files

Use `03-case-query-to-chart.html` as the structural template. Clone its section order, CSS, JS patterns. Change only the UI pattern-specific content. Do NOT redesign layout, colors, typography, or section structure.

## Files to produce

| File | UI pattern | Teams | Notes |
|---|---|---|---|
| `01-case-chat-context.html` | 1 Chat + context panel | 108, 110, 114 | Sources-visible chat. Teaching assistant, admissions RAG, Socratic tutor. |
| `02-case-upload-to-dashboard.html` | 2 Upload → dashboard | 109 | CSV upload → insight dashboard. 15k comments. |
| `04-case-wizard-audit.html` | 4 Wizard + inline audit | 113, 115 | ABET syllabus, virtual lab teacher-flow. |
| `05-case-draft-approve-send.html` | 5 Draft → approve → send | 111 | Emergency comms, irreversible send. |
| `06-case-queue-approval.html` | 6 Queue + approval | 105, 107 | Moderation queue. `demo-3-queue-approval.html` is existing draft — rewrite, don't copy. |
| `07-case-realtime-streaming.html` | 7 Real-time streaming | 107, 115 | Voice Q&A, live simulator. |

Each sub-agent gets exactly one file. They run in parallel.

## Section order (hard requirement)

All 6 files use this exact outline from the template:

1. **Nav** (localized labels, anchor links to sections below)
2. **Hero** (`<header class="hero">`) — h1 + lede + 3 meta stamps + animated pattern-demo (4 steps, play/pause) + rules card (`#rules`, 5 rules) + remember block (`Ba dòng tối thiểu` — 3 bullets)
3. **Diagnostic** (`#diagnostic`, kicker "Bước 1 · Kiểm tra trước khi paste") — 5 yes/no questions, verdict panel, sibling-case fallback links
4. **Interactive 1** (e.g. `#confidence` for query-to-chart) — illustrates Rule #2 concretely with 3 walkthrough examples
5. **T-C-R prompts** (`#tcr`, kicker "Bước 2 · 3 prompt bổ sung") — 3 prompt codeblocks (T → C → R), each with `.after-paste` panel (3 bullets), `.tcr-cite` framework-tie line, one `.ix` interactive per block where useful
6. **Ordering callout** ("Vì sao phải đúng thứ tự T → C → R")
7. **Playground** (`#playground`) — toggle: chưa áp dụng / đã áp dụng, 3 example chips, "Ép lỗi" toggle, live JS render
8. **Traps** (`#traps`, kicker "5 chỗ dễ sai") — 5 `<div class="trap">`, each = Vietnamese prose paragraph + `<em>` agent-facing English prompt quote
9. **Adapt** (`#adapt`, "Ba biến thể") — 3 `.team-card` showing how to reuse 3 prompts for nearby app shapes
10. **Sources** (`#sources`) — 5 source cards (Nielsen, HAX, PAIR + 2 production-case citations), English tags OK
11. **Footnotes** (`#footnotes`) — numbered citation list
12. **Footer**

## Hard rules (from the cleanup session)

### Language — Vietnamese base, English narrow-use only

Default: Vietnamese. English is allowed **only** in:

- **Actual code/SQL inside `<pre class="codeblock">`** — these are literally the prompts you paste into Claude Code. They stay in the original bilingual mix (Vietnamese instruction verbs + English JS/SQL tokens).
- **UI labels inside mock UIs** (`.pattern-demo`, `.ix-chart`, pills like `parse OK · high match`) where the label simulates a shipped product's chrome.
- **Code tokens in `<code>`** (e.g. `DROP TABLE`, `askLLM`, `Redux`, `package.json`) — these name real artifacts students will encounter in their repo.
- **Citation titles + source-card paragraphs** referencing English research (Nielsen, HAX, PAIR, Uber, Pinterest).
- **`<em>` blocks inside Traps** that quote the literal English prompt the student pastes to the agent.
- **`<span class="en">`** for short direct quotes from HAX/Nielsen guideline text.

Everything else (headings, subheadings, prose paragraphs, bullets, kickers, h2s, h3s, hints, tooltips, verdict text, aria-labels) is **Vietnamese**.

### Forbidden in Vietnamese prose

Never write any of these as if they were Vietnamese words. If you need the concept, write it in Vietnamese:

- `query` → `câu SQL` or `truy vấn`
- `baseline` → `chưa áp dụng` (when contrasting), or rephrase
- `retrofit` → `bổ sung` or `gắn thêm`
- `refactor` → `viết lại`
- `component` → `khối giao diện` or `chỗ hiển thị`
- `state` → `trạng thái` or `chỗ lưu trạng thái`
- `pre-flight` → `chặn từ sớm · trước khi gọi AI`
- `timeout` in prose → `thời gian chờ tối đa X giây` (keep `timeout` inside code/prompts)
- `retry` in prose → `thử lại` (keep `retry` inside code)
- `data shape` → `kiểu dữ liệu đầu ra` or `hình dạng dữ liệu`
- `audit` (verb) → `kiểm tra` or `soi`
- `user` → `người dùng` (end-user of student's app) or `bạn` (the student reader — never both in same sentence)

### Forbidden: HTML tag names and JS identifiers in human-facing prose

**Never** let these leak into student-facing prose:

- `<textarea>`, `<details>`, `<pre>`, `<summary>` → describe what the UI does: "cho phép người dùng sửa câu SQL", "khối gập được"
- `useState`, `Promise.race`, `fetch`, `WebSocket`, `async/await` → these are fine **only** in agent-facing prompts (`<em>` in Traps, or inside `<pre class="codeblock">`)
- JS method names in general (e.g. `.map()`, `parseInt`) — never in prose

**OK exception**: named function/library artifacts a student will actually encounter — `askLLM`, `Redux`, `Zustand`, `package.json` — when they're the subject of a trap ("App đã có hàm bọc sẵn để gọi AI (ví dụ `askLLM`) — nhưng AI viết lại `fetch` trực tiếp"). Wrap in `<code>`.

### Forbidden: bare numbers without context

Every number needs a referent. NOT `"Sửa LIMIT 5 → 10 mất 2 giây"` — what's 2 seconds? The act of editing the SQL? Keystroke latency? Rephrase with full sentence: `"Khi AI gần đúng nhưng sai một chi tiết nhỏ (giới hạn số dòng sai, thiếu điều kiện lọc), sửa thẳng câu SQL nhanh hơn rất nhiều so với bắt họ viết lại câu hỏi từ đầu."`

Numbers that are fine: `~15 dòng`, `agent chạy ~30s`, `LIMIT 10`, `92%` — they have units + context next to them.

### Pronouns

- **`bạn`** = the student reading the page. Always use this for instructional voice.
- **`người dùng`** = the end-user of the student's app.
- Never **`em`** (too intimate / classroom-kid).
- Never **`user`** as a Vietnamese loan.
- Never **both `bạn` and `người dùng` swapped** in same paragraph. Keep clear which perspective you're writing from.

### Diagnostic section = human yes/no

5 sentences starting with `<strong>` bold predicate. Each is a yes/no a student can answer in 3 seconds. Verdict panel: "Trả lời 'có' cho ≥3 câu" → go to prompts. "Ít hơn 3" → link to sibling case file.

Do NOT write `"agent grep code để check X"` or `"scan repo for Y"` — the diagnostic is for the human to self-assess, not for the AI agent. The AI agent reads the whole page anyway.

### Traps section = 5 tình huống

Label each `Tình huống N · <short headline>`. Format per trap:

```html
<div class="trap">
  <div class="trap-label">Tình huống 1 · <short headline></div>
  <h4><Vietnamese observation of the concrete symptom></h4>
  <p>
    <Vietnamese explanation of why it happens, 1-2 sentences>.
    Trong prompt, <viết|nói rõ|khoá lại>: <em>"<literal English prompt-text the student pastes>"</em>
    <optional follow-up Vietnamese sentence>.
  </p>
</div>
```

Key discipline: Vietnamese = author-to-student; `<em>` = student-to-agent. Do not mix.

### Adapt section = Ba biến thể

Three `.team-card` blocks with: UI pattern badge (short code), h4, tagline, short explainer, then TWO lists:

- **Giữ nguyên** (4 bullets, Vietnamese complete noun-phrases — NOT English jargon)
- **Chỉ đổi** (3 bullets, same)

H2 pattern: `Ba biến thể — phần lớn giữ nguyên, chỉ đổi <UI pattern-specific thing>.`

### T/C/R blocks = single verify panel (Option B)

**NOT 4-tab clusters** ("Agent sẽ thêm / Agent tìm gì / Nếu agent lệch / Framework ties"). Student doesn't care about agent-facing prose.

Instead, per T/C/R block:

```html
<pre class="codeblock">...prompt text...</pre>

<div class="after-paste">
  <h4>Sau khi paste, bạn sẽ thấy</h4>
  <ul>
    <li><Vietnamese sentence describing visible UI change #1></li>
    <li><Vietnamese sentence describing visible UI change #2></li>
    <li><Vietnamese sentence describing visible UI change #3></li>
  </ul>
</div>

<div class="tcr-cite">
  <strong>Framework ties.</strong> Nielsen #X <span class="en">...</span>. HAX G# ... PAIR ...
</div>
```

3 bullets max, each a complete Vietnamese sentence the student will actually see in their browser after running the agent.

### CSS gotchas (copy from template — don't re-derive)

- `.bar-fill` and `.bar-track` both need `display: block` — spans are inline by default and ignore `width: X%` / `height: 100%`.
- Multiple `<a>` inside one `<sup class="cite">` need CSS separator: `.chip sup a + a::before { content: ","; margin: 0 1px; opacity: .6; }` — else "12", "34" render stuck together.
- `.chip sup { font-size: 9px; vertical-align: super; margin-left: 3px; }` for footnote markers not to crash into chip text.
- `.after-paste` panel CSS is at line ~508 — clone it identically.

### Naming & anchors

- File: `case-<ui-pattern-short-slug>.html` (lowercase, hyphen). The slug matches what's in `teams-index.md`.
- Section IDs: `#rules`, `#diagnostic`, `#tcr`, `#playground`, `#traps`, `#adapt`, `#sources`, `#footnotes` — identical across all 6 files for consistent deep-linking.
- Footnote IDs: `fn-nielsen`, `fn-hax`, `fn-pair-errors`, `fn-pair-trust`, plus 1-2 production-case footnotes specific to this UI pattern.

### Navigation labels (must match exactly)

```html
<li><a href="#rules">5 điều bắt buộc</a></li>
<li><a href="#diagnostic">App có hợp không?</a></li>
<li><a href="#tcr">3 prompt</a></li>
<li><a href="#playground">Thử</a></li>
<li><a href="#traps">Chỗ dễ sai</a></li>
<li><a href="#adapt">Biến thể</a></li>
<li><a href="#sources">Nguồn</a></li>
```

### Pattern-demo column labels

- Left column: `<span class="pattern-demo__label">...Chưa áp dụng · <UI pattern-specific context>`
- Right column: `<span class="pattern-demo__label">...Đã áp dụng · sau 3 prompt`

### JS-rendered strings

Mode toggle: `'Đã áp dụng T-C-R'` / `'Chưa áp dụng'`
Loading: `'Đang chạy truy vấn…'` or UI pattern-specific ("Đang phân tích…", "Đang gửi…")
Error: cite real service name + timeout (e.g. `'Gemini API timeout (>15 giây)'`).

## UI pattern-specific content guidance

Each sub-agent must research these minimally before writing:

### `01-case-chat-context.html` (Chat + sources)

- **Core UX problem**: hallucination + no source attribution.
- **3 prompts**: T = hiện nguồn trích dẫn; C = cho ghim/loại bỏ nguồn; R = chặn câu hỏi ngoài phạm vi + giữ conversation khi API lỗi.
- **Production refs**: Perplexity (numbered source pills below answer), ChatGPT with Search, Claude.ai citations. Cite at least 1.
- **Rule #2 variant**: Confidence = "có tìm thấy trong kho tài liệu" vs "đang suy luận" vs "không có nguồn".
- **Adapt**: Teaching Assistant (108), RAG admissions (110), Socratic tutor (114).

### `02-case-upload-to-dashboard.html` (CSV → insights)

- **Core UX problem**: batch workflow — user wait minutes with no feedback, then faces an opaque summary.
- **3 prompts**: T = progress + cho xem raw rows; C = filter/slice + exclude outliers; R = partial-success (N of M rows parsed) + timeout on long file.
- **Production refs**: Julius AI, ChatGPT's Advanced Data Analysis. Cite at least 1.
- **Rule #2 variant**: Per-insight confidence ("dựa trên 1,243/15,000 comment") rather than blanket score.
- **Adapt**: Feedback analysis (109), course-review dashboards, survey analysis.

### `04-case-wizard-audit.html` (Guided form + live check)

- **Core UX problem**: wizard steps with AI-generated draft content — student can't tell if step 3 meets the compliance rule without checking a separate PDF.
- **3 prompts**: T = hiện luật compliance đang áp dụng inline; C = cho override + ghi lý do; R = rollback step + lưu draft.
- **Production refs**: GitHub Copilot's inline suggestions, Grammarly's rule highlights. Cite at least 1.
- **Rule #2 variant**: Per-field highlight (green = ABET-compliant, yellow = missing evidence, red = violates rule X).
- **Adapt**: Syllabus generator (113), lab experiment authoring (115 teacher flow), lesson planner.

### `05-case-draft-approve-send.html` (Draft → send)

- **Core UX problem**: irreversible send — one wrong emergency SMS goes to 15k parents.
- **3 prompts**: T = hiện diff giữa draft và template chuẩn; C = edit + preview per channel (Zalo/SMS/Email); R = hard confirm modal + dry-run to 1 admin first + undo within N seconds.
- **Production refs**: Mailchimp "test send" flow, Twilio's message-preview pattern. Cite at least 1.
- **Rule #2 variant**: Confidence = "copy đã qua kiểm duyệt" vs "AI tự sinh, chưa duyệt".
- **Adapt**: Emergency comms (111), payroll notifications, announcement broadcasts.

### `06-case-queue-approval.html` (Moderator queue)

- **Core UX problem**: 500 flagged items — moderator burns out if UI shows one at a time with no bulk ops.
- **3 prompts**: T = hiện AI reasoning per item (tại sao bị flag); C = bulk approve/reject + filter theo lý do; R = undo last action + audit log cho mỗi decision.
- **Production refs**: Reddit's AutoModerator dashboard, Meta's Oversight Board UI patterns. Cite at least 1.
- **Rule #2 variant**: Confidence = mức độ chắc của phân loại (spam/toxic/QA). 3 bins: tự tin → auto, 50/50 → queue, không rõ → skip.
- **Adapt**: Community mod (105), voice Q&A moderation (107), content review.

### `07-case-realtime-streaming.html` (Voice/chat stream)

- **Core UX problem**: sub-second latency budget — user talks, AI replies, any lag > 800ms feels broken.
- **3 prompts**: T = hiện partial transcript đang cập nhật; C = cho người dùng ngắt + redo câu hiện tại; R = fallback text input khi voice fail + giữ session nếu ngắt mạng.
- **Production refs**: ChatGPT Voice, Google Gemini Live, Pipecat/LiveKit demos. Cite at least 1.
- **Rule #2 variant**: Confidence = độ chắc của transcript (`0.98` = clear, `0.72` = ambiguous, `<0.5` = ask to repeat).
- **Adapt**: Voice Q&A moderator (107), virtual lab simulator (115 student flow), real-time tutoring.

## Check before ship (agent-side)

Before marking your case file complete, grep your own output:

```bash
grep -n -E "(<pre>|<textarea>|<details>|useState|Promise\.race|askLLM|baseline|pre-flight|data shape|em sẽ|agent grep)" your-file.html
```

Any hit in prose (not in `<pre>`, not in `<em>` agent-prompt, not `<code>`) = violation. Fix before returning.

Also grep for:
- Lines containing bare numbers without a noun next to them (`\b\d+\s+[^a-zA-Z<]` is too broad — just eyeball the file)
- Any English h2/h3/h4 outside source cards and footnotes
- `em ` (the word "em" used as pronoun)

## Scope discipline

- **Do NOT** add new interactives beyond what the template already demonstrates (confidence walkthrough, drilldown, validator, playground). Copy these patterns; swap the UI pattern-specific data.
- **Do NOT** introduce new CSS classes. All styling is in the template's `<style>` block.
- **Do NOT** write more than 2200 lines. Template is 2108. Budget +100 for UI pattern-specific prose, no more.
- **Do NOT** modify the nav, hero structure, footer, or section order.

## Handoff format

Return the completed `.html` file in the same directory. Report line count + a 3-line summary:
1. Which production refs you cited.
2. Which diagnostic question was hardest to phrase as yes/no.
3. Any UI pattern-specific deviation from template you made + why.

## Owner

Tony approves/rejects per file. No auto-commit. On rejection, sub-agent re-drafts the specific block; does not restart from scratch.
