# TEST-REPORT — Round 1: happy-path attendee

Project used: "workshop feedback collector" (feedbackr). Driver: `bash .claude/skills/flow/runner/flow.sh <cmd>` (the `/flow` skill was not registered in the session, so the documented fallback was used).

## Per-stage behavior

| Stage / command | Expected | Observed | OK? |
|---|---|---|---|
| `status` (fresh) | Show 00 open, rest locked, list blockers | Correct: listed all 3 unchecked boxes + all 4 [FILL] lines with line numbers | ✓ |
| `next` on unfilled 00 | Refuse | `GATE FAIL`, exit 1, itemized problems, "kill is valid" reminder | ✓ |
| `card` before planning done | Refuse | `REFUSED — cards open only after ALL planning gates pass`, exit 1 | ✓ |
| `next` on filled 00 | Advance | Gate ✓, copied `flow/01-research.md` template | ✓ |
| `next` on filled 01 | Advance | Gate ✓, unlocked 02 | ✓ |
| `next` on 02 with boxes checked but one [FILL] left | Refuse | `GATE FAIL` naming exactly `placeholder at line 23` — caught dishonest checkbox | ✓ |
| `next` on fixed 02, 03, 04 | Advance | Gate ✓ each time, clear "fill it, check boxes, /flow next" instruction | ✓ |
| `next` on filled 05 | Declare planning complete | "Planning complete — all 6 gates passed. Next: /flow card (vertical slice first)" | ✓ |
| `card` ×2 | Create C-001, C-002 | Created with sequential IDs, ID substituted into title line | ✓ |
| `check C-001` unfilled | Fail | `CARD FAIL`, all 5 [FILL] markers listed, exit 1 | ✓ |
| `check C-001` filled + status done + evidence pasted | Pass | `Card OK: C-001`, exit 0 | ✓ |
| `check C-002` filled, status todo | Pass with reminder | `Card OK` + "(status is not 'done' — set it only when Evidence holds real world-state proof)" | ✓ |
| `check` on a done card with unchecked Verify + empty Evidence (throwaway copy) | Fail | Both violations reported: "Verify has unchecked boxes", "Evidence has no pasted proof" | ✓ |
| `status` at end | Show cards with statuses | `[done] C-001`, `[todo] C-002` with titles | ✓ |

Messages were consistently clear: every refusal said exactly what was wrong, at which line, and what to do next. Exit codes matched the documented contract (0 pass / 1 fail).

## MISBEHAVIORS

(none — every gate refused when it should, advanced when it should, and reported precisely)

## UX FRICTION

1. **README step 1 vs reality.** README says "Open `flow/00-idea.md`, fill it" — the file did exist pre-seeded here, but `cmd_status` with no stage says "run: /flow next" to create it. Minor ambiguity about whether 00 is pre-created or must be unlocked; harmless either way, but a first-timer may wonder.
2. **README promises 11 stages (Idea → … → Retro) but the harness only gates 6 planning stages + cards.** Build/Review/Deploy/Verify-live have no gate commands; an attendee expecting `/flow next` to carry them through shipping discovers the harness ends at the contract. A line in README saying "stages 06-10 live inside cards, not flow.sh" would set expectations.
3. **`status` exit code is always 0**, even when the current gate is failing. Fine interactively, but anyone scripting on it must use `next`'s exit code instead. Worth a doc note at most.
4. **The "3 sentences, no more" pitch rule is self-attested** — the gate can't count sentences, only the checkbox. Acceptable for a lite harness, just know honesty is load-bearing there (the placeholder check is the only mechanical backstop).
5. **`check <id>` error duplication**: the failing card is named in the header but problems aren't prefixed with line context for missing-section errors (only [FILL]s get line numbers). Cosmetic.

## VERDICT

**PASS** — no misbehaviors; the gates are strict, the refusal messages are actionable, and the dishonest-checkbox case (checked box + leftover placeholder) is mechanically caught.
