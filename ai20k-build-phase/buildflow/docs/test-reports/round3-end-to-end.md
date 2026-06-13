# TEST-REPORT — Round 3: full end-to-end validation of buildflow

Run: diligent attendee builds "QR menu for a street-food stall" (cô Hoa). Walked 00→05,
created 3 cards, simulated building C-001 + C-002 (done, world-state evidence), left C-003
todo. Gatekeeper rules applied to own artifacts at every gate. flow.sh + _templates/ untouched.

## Per-step table (expected vs observed)

| Step | Action | Expected | Observed | Result |
|---|---|---|---|---|
| 1 | `status` on empty flow/ | "No stage started… run /flow next" | Exactly that | ✅ |
| 2 | `next` (empty) | Unlock 00-idea | "Stage 00 unlocked → flow/00-idea.md" | ✅ |
| 3 | Fill 00, `next` | Gate ✓, unlock 01 | "Gate ✓ on 00-idea" → 01 unlocked | ✅ |
| 4 | Fill 01, `next` | Gate ✓, unlock 02 | "Gate ✓ on 01-research" → 02 | ✅ |
| 5 | Fill 02 (grades, no laundering), `next` | Gate ✓, unlock 03 | "Gate ✓ on 02-scope" → 03 | ✅ |
| 6 | Fill 03 (numeric metric), `next` | Gate ✓, unlock 04 | "Gate ✓ on 03-prd" → 04 | ✅ |
| 7 | Fill 04, `next` | Gate ✓, unlock 05 | "Gate ✓ on 04-adr" → 05 | ✅ |
| 8 | Fill 05 (contract covers PRD), `next` | Planning complete | "Planning complete — all 6 gates passed" | ✅ |
| 9 | `card` ×3 | C-001, C-002, C-003 created | All three created sequentially | ✅ |
| 10 | Fill C-001 (slice), mark done | `check` passes | "Card OK: C-001", exit 0 | ✅ |
| 11 | Fill C-002 (toggle), mark done | `check` passes | "Card OK: C-002", exit 0 | ✅ |
| 12 | Fill C-003, leave todo | `check` passes + "status not done" note | "Card OK: C-003" + that note, exit 0 | ✅ |
| 13 | Final `status` | 6 gates ✓, C-001/002 done, C-003 todo | Exactly that | ✅ |
| 14 | Append RETRO line | One line appended | Appended below the `---` | ✅ |

## Gate enforcement actually verified

- Each `next` was run ONLY after the artifact's gate boxes were honestly checked and FILL
  markers removed. The script's `gate_problems` (unchecked `- [ ]` under `## Gate`, plus
  `[FILL`) is the mechanical guard; it passed each stage only once the content was real.
- No gate checkbox was ever edited by the gatekeeper to force an advance. No card was set
  `done` without pasted world-state evidence (live URL + curl).
- C-001 is a true vertical slice: ONE read endpoint + one ugly page, deployed URL as
  done-evidence — matches the README "thin slice to a deployed URL first" rule.
- Self-applied qualitative checks that could have failed but didn't:
  - Grade laundering (02): auth/realtime/payments all graded **C** and cut; owner-toggle
    honestly **B** (token check). No C dressed as B.
  - Contract drift (05): every PRD feature maps to an endpoint; all request+response shapes
    concrete (no "TBD"); auth column filled for all 4.
  - Card scope creep: C-002 explicitly excludes the owner page (→ C-003); no card has 2
    things; no done-evidence is "tests pass" / "code merged".

## MISBEHAVIORS

None that block the run. Minor observations about the harness:

1. **ROOT banner shows the symlink path** (`/tmp/bf-test-r3`) while the real dir is
   `/private/tmp/bf-test-r3`. Cosmetic; both resolve to the same files. Not a bug.
2. **`card_problems` done-check asymmetry**: when `status: done`, the script enforces that
   `## Evidence` is non-empty but does NOT re-verify `## Done-evidence` is non-FILL (it's
   already covered by the global `[FILL` scan). Adequate in practice — a done card with a
   FILL'd Done-evidence would still be caught by the FILL scan. No false pass observed.
3. **No mechanical check that a done card's Verify boxes correspond to its Evidence** — the
   script confirms all Verify boxes are checked and Evidence is non-empty, but the *match*
   between them is purely qualitative (gatekeeper's job). Worked here; relies on the human/AI
   reviewer for honesty, which is by design.

## UX FRICTION

1. **`status` doesn't surface cards until planning is 100% complete**, and the "append RETRO"
   nudge only fires when ALL cards are done — so a mixed state (2 done, 1 todo) shows cards
   but no next-action hint. A line like "1 card still todo: C-003" would close the loop.
2. **The card template's `## Done-evidence` vs `## Evidence` distinction is subtle.** Two
   evidence-named sections invite confusion (predicted proof vs pasted proof). The inline
   comments help, but a first-timer could paste real output into Done-evidence by mistake.
3. **No `/flow card` guard against over-creating cards** — I could spawn C-004, C-005… with
   no planning cost. Fine for this method (cards are cheap), but there's no nudge toward
   "build one slice before opening the next card", which the README philosophy advocates.
4. **`next` after planning-complete prints the same "Planning complete" each time** rather
   than pointing only forward; harmless but slightly repetitive.

None of the above changed an outcome or let a hollow artifact through.

## VERDICT

**PASS.** The harness walked a real end-to-end project from empty `flow/` to a partially-shipped
card set. Every gate enforced its mechanical contract; every qualitative trap (grade laundering,
contract drift, scope creep, "tests pass" as done) was catchable and was caught by the
gatekeeper rules. `done` required pasted world-state evidence. flow.sh and templates were never
modified. Friction items are cosmetic / ergonomic, not correctness failures.
