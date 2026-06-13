# Mẹo từ Coach: Dùng AI trợ lý cho A20

Chào các bạn! Mình chia sẻ vài trick nhỏ giúp các bạn đỡ đau đầu với documentation, standup, và viết docs cho project.

Ý tưởng đơn giản: cho AI tool (Claude Code, Cursor, Codex...) hiểu luật chơi của khóa học → nó tự giúp bạn làm đúng format, tự đọc git log điền sẵn → bạn chỉ cần bổ sung ý kiến cá nhân.

## Có gì?

| Skill | Chức năng |
|---|---|
| **a20** | Viết JOURNAL.md, WORKLOG.md, kiểm tra PR, tạo PR đúng format |
| **standup** | Gợi ý nội dung standup hàng ngày từ git log + GitHub Project |
| **vibedocs** | Viết documentation chuẩn cho project (architecture, API, docs/) |

## Cài đặt (2 phút)

**Bước 1:** Tải folder skill từ `resources/.claude/skills/`

**Bước 2:** Bỏ vào repo project của bạn, tùy tool đang dùng:

| Tool | Bỏ vào đâu |
|---|---|
| Claude Code | `.claude/skills/{tên-skill}/` |
| Cursor | `.cursor/skills/{tên-skill}/` |
| Codex | `.codex/skills/{tên-skill}/` |
| Gemini CLI | `.gemini/skills/{tên-skill}/` |
| Copilot | `.github/skills/{tên-skill}/` |

```bash
# Ví dụ cho Claude Code, cài cả 3 skills:
mkdir -p .claude/skills
cp -r a20 standup vibedocs .claude/skills/
```

Xong. Không cần config gì thêm.

---

## Skill: a20 — Documentation & PR

Nói tiếng Việt bình thường:

| Muốn làm gì | Nói với AI |
|---|---|
| Viết nhật ký tuần | `viết journal tuần này` |
| Ghi quyết định kỹ thuật | `ghi ADR: mình chọn dùng SQLite thay JSON` |
| Tạo bảng phân công | `tạo bảng sprint tuần này` |
| Ghi bug đã fix | `ghi lại bug agent loop vô hạn` |
| Kiểm tra trước PR | `check trước khi tạo PR` |
| Tạo PR | `tạo PR` |

AI tự đọc git log điền sẵn → bạn bổ sung cảm nhận → confirm → ghi file.

---

## Skill: standup — Gợi ý báo cáo hàng ngày

Trước khi nộp standup trên Discord, nói:

```
standup
```

AI sẽ đọc git commits + GitHub Project board → gợi ý nội dung cho 3 mục:
- Hôm qua đã làm gì
- Hôm nay sẽ làm gì
- Blockers

Đây chỉ là **gợi ý** — bạn viết lại bằng lời mình khi nộp. Nhớ bổ sung cả việc ngoài code (thảo luận, nghiên cứu, họp nhóm).

**Mẹo:** Thêm tasks vào GitHub Project → standup sẽ có nhiều gợi ý hơn.

---

## Skill: vibedocs — Viết docs cho project

Khi cần viết documentation cho project (architecture, API, flow...):

```
viết docs cho project này
```

AI sẽ phân tích code → tạo docs theo chuẩn: overview, diagram, tables, cross-references. Phù hợp cho deliverable "Architecture Diagram" và "README đầy đủ".

---

## Nhắc nhỏ

- **Cuối tuần** → `viết journal`
- **Mỗi sáng** → `standup` trước khi nộp Discord
- **Khi quyết định gì** → `ghi ADR`
- **Trước mỗi PR** → `check PR` rồi `tạo PR`
- AI **không tự ghi file** — luôn hỏi bạn OK chưa rồi mới ghi
- Quên viết journal mấy tuần? → `viết journal 3 tuần gần nhất`

Đây chỉ là tool hỗ trợ, không thay thế việc bạn suy nghĩ. AI điền data, bạn điền insight. Chúc các bạn code vui!
