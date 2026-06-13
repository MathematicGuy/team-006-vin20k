# TEST-REPORT — Round 4 (real idea through the flow, Opus)

Idea: residence complaint-ticket app for an apartment manager board (BQT), with an AI
wishlist (sentiment, RAG auto-reply, recap, auto-tag/trigger via langchain `deepagents`),
python backend + react frontend. Walked stages 00→05, created the full card set, built nothing.

## Per-stage table

| Stage | Artifact | Gate (script) | My qualitative review | Result |
|---|---|---|---|---|
| 00 Idea | 3-sentence pitch + real named group (BQT, D7 HCMC, anh Tuấn's Zalo pain) | PASS | Pitch exactly 3 sentences; real observed pain, not hypothetical | ✓ |
| 01 Research | 3 real competitors (HomeID, CyHome, DHSoft — real links) + Mezo AI reference; 3 complaints; free-vs-hard | PASS | Competitors/links real (web-searched); complaints honestly labeled representative/paraphrased, NOT faked-as-verbatim — flagged as the rushed gate | ✓ (weak spot noted) |
| 02 Scope | Per-AI-feature grading + 3-path treatment; zero C in v1; cut list; GO | PASS | Critical gate — see scope table below. No grade laundering, no path-1 misuse | ✓ |
| 03 PRD | Context/users/features (action→result)/NFR/stack/number metric | PASS | Stack honors python/react; metric is real numbers; AI features = the B versions from scope | ✓ |
| 04 ADR | 5 decisions (storage/auth/deploy/AI/email) + NOT-doing | PASS | Each has why + rejected alt; NOT-doing ties to scope C-cuts; AI-non-blocking decision | ✓ |
| 05 Contract | 7 endpoints, full req/resp shapes, auth column; shared shapes; feature map | PASS | Every PRD feature mapped; HITL split modeled as 2 endpoints (suggest ≠ send); no TBD | ✓ |
| cards | C-001..C-007, vertical-slice first, all todo, all `flow.sh check` OK | PASS | One-thing scope each; done-evidence is world-state (URLs/curl/screenshots), never "tests pass" | ✓ |

## Scope-decision table (the core test — AI feature → grade → path → in/out)

| AI feature (from wishlist) | Grade | Path applied | In v1? |
|---|---|---|---|
| Sentiment / tone tag | B | single LLM call, advisory (no re-arch needed) | IN (merged into one classify call) |
| Auto-tag category | B | single LLM call (same call as sentiment) | IN |
| Recap of open tickets | B | single on-demand LLM call, read-only | IN |
| RAG auto-reply bot (autonomous send, in board's name) | **C** | **Path 2** — re-architect down to B: drop autonomy + RAG → manager-approved HITL draft | IN as "suggest reply" (the B form); RAG layer + auto-send → cut list |
| Auto-trigger / workflow rules + vendor notify | **C** | **Path 3** — irreducible C, doesn't fit budget + needs nonexistent vendor integrations → CUT | OUT (v2) |
| `deepagents` / multi-step agent framework | C (engine) | Declined — every kept feature is a single LLM call; path-1 ("C IS the product") explicitly rejected because the queue, not the agent, is the value prop | OUT |

Result: **zero C in v1.** Two wishlist C's re-graded honestly (one re-architected to B, one cut),
the agent framework declined. Path-1 was correctly NOT invoked (would have been grade-laundering
to justify putting an agent first when the product is a CRUD queue).

## MISBEHAVIORS

- **Write-before-Read on freshly-created files.** Both `flow/00-idea.md` (template copy) and the
  card files required a Read before Write despite the script having just created them; the first
  Write attempt errored each time. Minor friction, self-corrected, no flow damage — but a real
  attendee would hit the same "File has not been read yet" wall and be briefly confused.
- No other misbehavior. The script's deterministic checks (unchecked boxes, [FILL], card shape)
  fired correctly and never advanced a gate falsely; nothing required overriding the script.

## UX FRICTION

- **Card creation is one-at-a-time and silent about order.** `/flow card` just makes the next
  C-NNN; nothing in the runner reminds you "vertical slice first / UI last." That guidance lives
  only in README build-order prose. An attendee could fill cards in feature order and break the
  slice-first discipline without the tool noticing. (I applied it from README, but the tool won't.)
- **Retro instruction says "after all cards are done"** but the brief (and any planning-only run)
  appends earlier. Mild tension between the harness's "done = shipped" stance and a legitimate
  plan-only checkpoint. Not blocking.
- **Research gate can't tell representative quotes from verbatim ones.** The script checks for
  [FILL] and a quote line; it can't enforce "real URL." Honesty here is on the attendee — the
  SKILL.md gatekeeper role is what's supposed to catch fake evidence, and as gatekeeper I flagged
  my own quotes as paraphrased rather than dress them as sourced.
- Positive: the gate-fail messages and `status` output are clear and concrete; "still open" hint
  and "vertical slice first" nudge on planning-complete are genuinely helpful.

## VERDICT: PASS

The flow took a messy, AI-hype-laden real idea and produced a disciplined, buildable v1 plan:
the agentic ambitions were graded honestly and either cheapened to single LLM calls or cut, the
stack preference was respected, the contract is drift-proof, and the cards are world-state-verifiable
and slice-first. The scope gate — the whole point of the method — did exactly its job.

## Would a real attendee with this idea be well served?

Yes, substantially. The attendee arrived wanting `deepagents` and an autonomous RAG bot — the
seductive, expensive part — and the flow's scope gate is precisely the intervention they needed:
it didn't say "no AI," it said "here's the same value as three single LLM calls you can actually
ship in 30 hours, and here's the one liability-laden feature (auto-send in the board's name) you
should cut until the drafts prove trustworthy." That reframing — keep the value, drop the autonomy
— is the lesson, and the method delivered it without lecturing. They leave with 7 cards they could
hand to an AI coder, a contract that stops FE/BE drift, and a slice-first order that gets them to a
live URL fast. The one gap a real attendee should fix before building: go get the 3 verbatim
resident complaints (the rushed stage 01) so the product thesis is grounded in citable pain, not a
paraphrase. The harness surfaced even that honestly via the retro.

ROUND4 DONE
