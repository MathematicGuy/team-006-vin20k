# TEST-REPORT — Round 5 (Opus): real idea + fix verification

Idea: badminton court booking (4 courts, hourly). Walked 00→05 + full card set, no build. Budget ~3 weekends.

## Per-stage table

| Stage | Artifact | Gate result | Notes |
|---|---|---|---|
| 00 idea | flow/00-idea.md | ✓ pass | 3-sentence pitch; named real group (~30 "Cầu lông tối thứ 5" Zalo regulars + self as owner). |
| 01 research | flow/01-research.md | ✓ pass | 3 competitors (Matchi, Playtomic, Sheet+Zalo) w/ honest notes; 3 quoted complaints w/ sources; free-vs-hard split. |
| 02 scope | flow/02-scope.md | ✓ pass | All 3 traps graded + routed (see scope table). GO. C (no-double-book) re-architected to A, sequenced first. |
| 03 prd | flow/03-prd.md | ✓ pass | 6 user-centric features (action→result); numeric success metric (≥20 bookings/2wk, 0 double-books, ≥80% paid <1h). |
| 04 adr | flow/04-adr.md | ✓ pass | 4 decisions w/ why + rejected; explicit NOT-doing list. |
| 05 contract | flow/05-contract.md | ✓ pass | 6 endpoints, all req+resp shapes concrete, auth column filled, 409 = double-book seam. **Drift caught later: missing player_email (see retro).** |
| cards | C-001..C-006 | all `check` OK, all `todo` | Full v1 set covering all 6 endpoints. Not built (per brief). |

## Scope-decision table (the traps)

| Trap feature | Honest grade | Path | In/Out v1 |
|---|---|---|---|
| Online payment (VietQR) | display=B, auto-reconcile=C | **Path 2**: split — display QR (B) in, auto-confirm collapsed to owner "mark paid" (HITL) | **IN** (display + manual confirm); auto-reconciliation OUT (cut list, v2) |
| Realtime no-double-book | "realtime"=C; real need=correctness=A | **Path 2**: realtime push → `UNIQUE(court_id, slot_start)` + atomic insert | **IN** as grade-A constraint; websocket/live-presence OUT (cut) |
| AI chatbot ("is 7pm free?") | agentic=C; single-call=B | **Path 2 deferred**: grid already answers the job in one glance | **OUT** (cut list); if revived, single LLM call not agent |

No grade laundering: every C is named C, then justified via an explicit path; deferred Cs are on the cut list; the kept-down C (no-double-book) is FIRST in build order (C-001).

## F1 — read-before-edit (Mechanical note)

- Every unlocked template AND every created card was **Read before first Edit** (00,01,02,03,04,05 templates; C-001..C-006 cards). Pattern each time: `flow.sh` creates → Read → Edit.
- **Zero "File has not been read yet" errors occurred.** All edits succeeded first try. F1: **PASS.**

## F2 — order-rule + one-at-a-time messaging

- **C-001 ORDER RULE** printed (quoted verbatim):
  > "ORDER RULE: C-001 is the VERTICAL SLICE — one endpoint + one ugly page that calls it, deployed to a real URL. Prove the seam works in production before going wide. UI layer last."
- **C-002 (and C-003..C-006) one-at-a-time NOTE** printed (quoted from C-002):
  > "NOTE: you have 1 unfinished card(s). The method is BUILD ONE CARD AT A TIME — planning all cards up front is fine; building in parallel is not."
  Count incremented correctly per card (1→5 unfinished). F2: **PASS.**

## MISBEHAVIORS

- None from the harness. Gate checks, qualitative-review prompts, card shape, and messaging all behaved correctly.
- Self-introduced (not a harness fault): contract omitted `player_email` despite email being a v1 feature — caught while writing C-005, recorded in retro and folded into the card (which amends 05 before build). This is exactly the drift stage 05 is meant to surface; the method's structure made it cheap to catch.

## UX FRICTION

- Minor: `flow.sh card` doesn't echo which contract endpoints remain uncovered, so tracking "did I card every endpoint?" is manual. A `flow.sh status` line like "endpoints covered: 6/6 across cards" would close the loop.
- Minor: the one-at-a-time NOTE could read as discouraging the brief-sanctioned "plan all cards first" — but the message explicitly says "planning all cards up front is fine," which resolves it. Good wording.
- Otherwise smooth: templates carry their own gate at the top, messages are specific, `check` is reassuring.

## VERDICT: **PASS**

All 6 planning gates passed with non-hollow content; traps graded honestly and routed via path 2 (no laundering); full card set is single-scope with world-state done-evidence; F1 and F2 both verified PASS; no harness misbehavior.

## Would a real attendee be well served?

Yes. The flow forced the genuinely valuable move: it made me confront that "realtime so 2 people don't double-book" is really a one-line DB constraint, not a websocket project — turning the scariest item into the cheapest and sequencing it first. It cut the AI chatbot honestly instead of grade-laundering it in. The contract gate would have caught the email-field drift on a more careful pass, and even caught late it cost one amended card instead of a shipped-broken form. An owner with ~3 weekends ends planning with a buildable, correctly-ordered slice plan and a real success metric — well served.
