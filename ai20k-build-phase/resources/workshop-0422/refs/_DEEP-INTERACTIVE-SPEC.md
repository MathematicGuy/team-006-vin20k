---
type: workshop-internal
status: draft
updated: 2026-04-23
purpose: Replace the 3 shallow widgets (confidence walkthrough + drilldown + validator) per case file with ONE deep interactive that walks the full T→C→R retrofit as a live demo. Playground section stays.
---

# Deep interactive spec — one per case

## The problem we're fixing

Today each case has 3-4 clickable widgets that each do one micro-thing:
- Confidence walkthrough: click 3 preset buttons → expand 3 text panels. (It's a tab set wearing a crown.)
- Drilldown: click bar → show row. (One interaction, no consequence.)
- Validator: type → get color feedback. (Works but isolated from the rest.)
- Playground: toggle chưa/đã + 3 preset chips + force-error. (Has state but no journey.)

None of them make the reader **feel the retrofit** — they don't show what happens when you paste prompt T, then paste prompt C, then paste prompt R. They show atomic rules, not the sequence.

## The replacement — one `#demo` section

Every case file gets **one** section `#demo` (replaces `#confidence`, the per-rule interactives, and `#playground` — merge them). Budget: ~300-400 lines of HTML/CSS/JS per case. Total file stays under 2200 lines (current files are 1985-2162).

The demo simulates the student's app retrofit as a live progression. Three stages:

**Stage 0 — "Chưa áp dụng"** — the broken starting state. User performs the UI pattern's core action; sees the sketchy baseline UI.

**Stage T, C, R** — student "pastes" each prompt. Each paste triggers a visible UI change in the same mock app. Student sees the exact three surfaces appear.

**Fail + recover** — force the error state, show the recovery UI only exists after R has been applied.

### Required controls

- A vertical stepper on the left (4 states): `Chưa áp dụng` · `+T` · `+T+C` · `+T+C+R`. Each step is clickable. Current step highlighted.
- A big "Paste prompt T" button at the bottom of stage 0 that advances to +T. Same pattern for C, R.
- A "Reset" button that returns to stage 0.
- A "Ép lỗi" toggle that only works at +T+C+R — before that, clicking it shows a callout "Recovery chưa áp dụng — prompt R chưa paste."

### Why this works pedagogically

- **Causal**: the reader sees "paste → this exact change appears." Not "here's what Transparency means in theory."
- **Cumulative**: at +T+C+R, all three rules visible in the same UI simultaneously — the reader understands rules compound.
- **Failure-legible**: recovery only exists if you paste R. Student sees the consequence of skipping.
- **One demo, full journey**: ~90 seconds of clicking to walk the whole pattern. Today it's 4 separate widgets, none tied together.

### Removed sections

- `<section id="confidence">` — collapse into the demo (stage T already shows confidence badges).
- `<div class="ix" data-ix="drilldown">` inside T prompt block — collapse into the demo (stage T adds "Xem data thô" button → click reveals raw rows).
- `<div class="ix" data-ix="validator">` inside R prompt block — collapse into the demo (stage +T+C+R enables input-time blocking; before that, dangerous input sails through).
- `<section id="playground">` — delete entirely. Demo replaces it.

Per-rule `.after-paste` green panels stay (they're text, not interactive). `.tcr-cite` framework footer stays.

Nav collapse: `App có hợp không? · 3 prompt · Demo · Chỗ dễ sai · Biến thể · Nguồn` (was `· Thử · Chỗ dễ sai`).

## UI pattern-specific demo content

### 01 · Chat + Context Panel

**Mock app**: single chat bubble + sources panel on the right.

**Stage 0**: User types "Hạn nộp hồ sơ CMC 2026?" → answer bubble appears confidently, no source shown. Also works for "Em thấy buồn, có nên nghỉ học không?" → app answers anyway (out of scope).

**+T**: Each answer bubble now has numbered `¹ ² ³` citation pills with a side-panel showing quoted passages from source docs. Confidence badge: `khớp rõ · 3 nguồn` / `đang suy luận · 0 nguồn`.

**+T+C**: Citation pills are clickable — click → source-panel scrolls to passage. "Ghim nguồn" and "Bỏ nguồn" buttons. Follow-up questions inherit pinned sources.

**+T+C+R**: Out-of-scope questions ("chuyện tình cảm") get blocked with `"Câu hỏi ngoài phạm vi. Tôi chỉ trả lời về thông tin tuyển sinh CMC. Bạn có thể hỏi về: hạn nộp, học phí, điều kiện xét tuyển."` Network-fail path preserves conversation + retry. Force error: `"Gemini API timeout. Câu hỏi của bạn vẫn đây → Thử lại"`.

### 02 · Upload → Dashboard

**Mock app**: file upload → insight tiles.

**Stage 0**: Drop CSV → spinner 5s → 3 insight tiles appear with "dựa trên 15,000 comments" blanket summary. No progress during upload. No row visibility.

**+T**: Upload shows live progress `đã xử lý 12,430 / 15,000 dòng`. Each insight tile now has "Xem N dòng gốc" + column-source badge (`dựa trên cột "comment_text"`).

**+T+C**: Filter chip bar appears: `[ Tất cả ] [ Khoá CS101 ] [ Khoá CS201 ]`. Click chip → insights re-render for subset. "Loại 200 dòng outlier" button.

**+T+C+R**: Upload a "broken" preset file → partial success banner: `parse được 14,203 / 15,000 dòng · 797 dòng lỗi encoding → Thử lại 797 dòng lỗi`. Mid-process "mất mạng" force-error → resumable from saved chunk.

### 03 · Query → Chart (THE TEMPLATE — most polished)

**Mock app**: input box → chart.

**Stage 0**: User types "Top 5 môn sinh viên rate cao nhất 2024" → chart appears. Badge "5 khu vực" but no SQL, no confidence, no raw data access.

**+T**: Above chart, collapsible `▸ Xem truy vấn` row. Click → SQL shown. Badge color changes to `khớp rõ` / `câu hỏi mơ hồ` based on preset. "Xem data thô" button → table of 5 rows.

**+T+C**: SQL block becomes editable. User can click, change `LIMIT 5` → `LIMIT 10`, press "Chạy lại" → chart re-renders with 10 bars. Dangerous edits (`DROP`, `DELETE`) trigger confirm modal.

**+T+C+R**: Type `DROP TABLE students` → blocked at input, never hits API. Type `xx` (3 chars) → blocked. Force error toggle → timeout card: `"Gemini API timeout (>15s). Câu hỏi của bạn vẫn đây → Thử lại"` — click, runs with same question.

### 04 · Wizard + Inline Audit

**Mock app**: 4-field wizard (outcome / method / assessment / evidence) with "Nộp" at bottom.

**Stage 0**: AI fills 4 fields. "Nộp" is green and clickable. No rule references. No highlights. User doesn't know fields pass ABET or not.

**+T**: Each field now has inline colored underline (green/yellow/red) + a small `ABET 3a` chip. Click chip → sidecar shows the verbatim standard quoted. Top-of-wizard summary: `2 đạt · 1 cảnh báo · 1 chưa đạt`.

**+T+C**: Hover on a field → "Regenerate riêng trường này" button. User can also mark a field "Không áp dụng rule này" with required reason text. Other fields untouched.

**+T+C+R**: "Nộp" button is now disabled while ≥1 red field exists; hover tooltip lists which. Autosave banner: `nháp lưu 5 giây trước`. Force error during regeneration: only failed field shows retry; other fields' drafts stay intact. Type placeholder `Lorem ipsum` in a field → blocked at input with suggestion.

### 05 · Draft → Approve → Send

**Mock app**: draft editor + per-channel previews + recipient count + Send button.

**Stage 0**: AI draft appears in one blob. Single "Gửi" button red and clickable. No preview per channel. No diff from template. User sees `Gửi tới 842 phụ huynh`.

**+T**: Draft now shows as diff against last-approved template (`+` new lines green, `-` removed red, unchanged grey). Per-channel tabs: `[ SMS 127/160 ] [ Zalo ] [ Email ]`. Recipient segment expandable: `Khối 9 · 842 phụ huynh · 12 opted-out`.

**+T+C**: Each channel tab is independently editable. "Regenerate riêng SMS" preserves Zalo + Email. Template-locked fields (school name, fee numbers) have 🔒 badge — editing them pops a `"Trường này được khoá — lý do sửa?"` confirm.

**+T+C+R**: "Gửi" button now behind hard confirm: typing `GỬI` in a box. Dry-run to 1 admin number first shows delivered receipt before mass-send. 30-second undo strip after send. Force error mid-batch: `gửi thành công 230 · thất bại 612 → Gửi lại 612 lỗi`. Type placeholder `[Tên trường]` in draft → blocked before AI call.

### 06 · Queue + Approval

**Mock app**: list of 5 flagged items with Approve/Reject per row.

**Stage 0**: 5 item cards. Each has Approve/Reject buttons. No reason why flagged. No confidence. No bulk.

**+T**: Each card now shows 3 reason chips (`từ cấm · voucher` / `link bit.ly` / `tài khoản < 24h`) with confidence bars. Summary header: `5 cần review · 3 chắc chắn · 2 ranh giới`.

**+T+C**: Bulk-select checkboxes appear. Filter toolbar: `[ Theo lý do ] [ Theo user ] [ Theo confidence ]`. Click "Chọn cùng lý do: link bit.ly" → 3 auto-selected. "Duyệt 3 đã chọn" button.

**+T+C+R**: Every action creates an undo strip at bottom: `đã reject 3 item · hoàn tác trong 30s`. Click undo → items restored. Audit log button shows per-decision trace. Force error: `mất kết nối giữa lô · đã xử lý 2/3 · resumable`. Bulk-select >10 items triggers `"Bạn sắp reject 47 items — xem 3 mẫu trước"` preview.

### 07 · Real-time Streaming

**Mock app**: mic button + live partial transcript area + AI reply area. (We simulate streaming with JS setInterval — no actual mic.)

**Stage 0**: Click "Nói thử" button → after 3s delay, full transcript appears + final AI reply. No activity indicator. No confidence. No way to interrupt.

**+T**: Transcript streams word-by-word. Words tinted by simulated confidence (dark-high / grey-dashed-low). Activity waveform pulses. `đang nghe...` indicator.

**+T+C**: Spacebar (or tap) now interrupts mid-reply — AI stops, user can redo current utterance. "Chuyển sang gõ" button swaps mic UI for text input without losing conversation context.

**+T+C+R**: Force "mất mạng" toggle → banner: `mất kết nối · đang nối lại · đừng nói thêm`. Session context preserved. Low-confidence words dashed-underlined: `[được|đức?|làm?]` — hover shows alternatives. Force-error preset: mic permission denied → fallback to text input with explanation.

## Shared JS patterns (everyone implements these)

- A single `state` object: `{ stage: 0|'T'|'C'|'R', forceError: false, preset: 0|1|2 }`.
- `render()` function: reads state, rebuilds the mock-app DOM. Called on any control change.
- Stepper: 4 buttons, setting `state.stage` + calling render.
- "Paste prompt X" buttons at bottom of each stage, advance stage and call render.
- "Ép lỗi" toggle: guarded — if stage < 'R', show an inline callout instead of triggering error.
- "Reset" button: state → initial, render.

Keep vanilla JS. No new libraries. Reuse template's `.ix-*` CSS classes where possible. Add `.demo-stepper`, `.demo-stage`, `.demo-paste-btn`, `.demo-reset` — those are new, add to local `<style>` block per file.

## Copy writing rules (carried from batch guideline)

- Vietnamese base. English only in mock UI chrome (SQL, SMS char counter, citation pills, column names).
- Stage labels: `Chưa áp dụng` · `Sau khi paste T` · `Sau khi paste T+C` · `Sau khi paste T+C+R`.
- Button labels: `Paste prompt T`, `Paste prompt C`, `Paste prompt R`, `Ép lỗi`, `Reset`.
- No `baseline`, `query` (except as `<code>`), `pre-flight`, `retrofit` in prose.

## Deliverable per sub-agent

1. Replace sections `#confidence`, the two per-rule `.ix` blocks inside T and R, and `#playground` in the assigned file with ONE new `#demo` section.
2. Keep all other sections (hero, rules, diagnostic, T-C-R prompts with `.after-paste` panels + `.tcr-cite`, traps, adapt, sources, footnotes).
3. Update nav: replace `Thử` anchor with `Demo`. Remove any now-dead anchor.
4. File must stay under 2200 lines total.
5. Return a 3-line report: which preset makes the point best; any UI pattern-specific JS trick worth noting; any cut you made from the stage progression above (with why).
