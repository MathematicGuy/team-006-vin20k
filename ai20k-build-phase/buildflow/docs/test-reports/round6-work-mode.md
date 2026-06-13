# TEST-REPORT — Round 6: WORK MODE rehearsal

## Timing-feel per stage

| Stage | Feel | Note |
|---|---|---|
| 00 idea | instant | Interview pre-supplied; pitch was a 3-sentence rewrite. |
| 01 research | slowest, correctly | 3 real web searches → real sourced quotes + competitor notes. This is the one stage with genuine latency, and it should be. |
| 02 scope | medium | Real grading work + writing SCOPE-CONFIRM.md. The deliberate pause point. |
| 03 PRD | fast | Mechanical expansion of scope into user-action/result + numeric metric. |
| 04 ADR | fast | 6 decisions w/ rejected-alts; the NOT-doing list reused the cut list cleanly. |
| 05 contract | medium | The load-bearing stage — endpoint table + shapes. Where drift is prevented. |
| cards ×7 | medium | One read-before-write per fresh template; otherwise quick. |

Overall: planning 00→05 + 7 cards in one uninterrupted pass with exactly one pause. The
shape the protocol promises ("interview once → one scope pause → one summary") held.

## Where the work-mode protocol was ambiguous

1. **Card count vs the 7-step standard sequence.** SKILL.md says "finish with the full
   card set" but doesn't say how many cards. The CLAUDE.md standard sequence is 7 steps;
   I had to decide whether scaffold+slice are one card or two (folded to C-001) and whether
   frontend+e2e split (split to C-006/C-007). A line mapping "standard sequence → default
   card count" would remove the judgment call.
2. **Who writes SCOPE-CONFIRM.md / what filename.** The brief named it; the protocol just
   says "present the graded table + GO/KILL via AskUserQuestion." In a real (non-rehearsal)
   run I'd use AskUserQuestion, not a file. The protocol could state the canonical artifact
   for the scope pause.
3. **Self-checking gate boxes.** SKILL.md permits checking boxes on self-authored artifacts;
   the runner unlocks purely on box-state, so an agent *could* check boxes on hollow work.
   The honesty is on the agent, not enforced — fine by design, worth flagging.

## MISBEHAVIORS

- **One self-inflicted slip:** I duplicated the `status: todo` line when first writing
  C-002 and had to fix it. Caught and corrected; final card validates. No protocol fault.
- **Read-before-write friction:** flow.sh creates fresh card templates, but each must be
  Read before Write (editor rule, documented in SKILL.md "Mechanical note"). Mild but
  expected; not a misbehavior, just overhead.
- No gate was laundered, no card shipped two things, no done-status set without evidence,
  templates/flow.sh untouched. Forbidden list respected.

## Demo-ability (live audience)

**Yes, demo-able** — and it's a strong demo: idea → 6 gated stages → 7 cards → one summary,
visibly self-gating, with the one human decision (scope) surfaced cleanly. The `/flow status`
tree at the end (all gates ✓, 8/8 contract coverage) is a great closing beat.

**What I'd trim for a live run:**
- **Pre-warm stage 01's searches.** Live web search is the only multi-second wait; either
  pre-run it or narrate over it. Everything else is fast enough to show live.
- **Show 2 cards in full, summarize the other 5.** Authoring 7 cards live is repetitive;
  read C-001 + C-005 (slice + the approval-gate card) aloud, then flash the `/flow status`
  tree for the rest.
- **Skip the SCOPE-CONFIRM.md write on stage; speak the table instead** and show the
  AskUserQuestion scope prompt — the pause is the story, the file is the artifact.
- Keep the duplicate-line fix OUT of the demo (or own it in one line as "self-gating
  catches my own slips too").

Total live time if trimmed: ~6–8 min.

## VERDICT

**PASS.** Work mode behaved to spec: interview consumed (no re-asking), stages 00→05
drafted with real evidence and honest self-gating, exactly one scope pause, full 7-card set
with 8/8 contract coverage, a single operator-facing PLAN-SUMMARY, and zero builds /
template edits. Ambiguities found are documentation-level, not behavioral.
