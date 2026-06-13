# Consensus UI Audit

Using pattern-foundry `AUDIT_MODE`.

Source: https://consensus.app/

Evidence captured:

- Desktop full-page screenshot: `consensus-desktop-full.png`
- Desktop accessibility snapshot: `consensus-desktop-snapshot.md`
- DOM extraction: `consensus-dom-audit.json`
- Clean 390px mobile screenshot: `consensus-mobile-390-full.png`
- Clean 390px mobile accessibility snapshot: `consensus-mobile-390-snapshot.md`
- Sidebar-session responsive artifact: `consensus-sidebar-session-full.png`

## Assumptions

- Audit focuses on the public landing/search entry page as rendered on June 13, 2026.
- No authenticated flows were evaluated.
- Console errors/warnings were observed but not root-caused because this is a UX audit, not an application debugging pass.
- The sidebar-session capture is treated as a responsive-state risk, not conclusive proof of a production bug.

## 1. Scorecard

| Dimension | Score | Evidence | Impact |
|---|---:|---|---|
| Originality | 6/10 | Clean academic SaaS layout, grayscale UI shell, common logo-grid proof pattern. | Credible but not highly ownable or memorable. |
| Hierarchy | 7/10 | Strong central query box and concise H1; repeated "Research starts here" as H1 and H2 weakens structure. | Users understand search-first intent, but the page narrative feels shallow above the fold. |
| Spacing consistency | 8/10 | Generous whitespace, regular section dividers, consistent card/list rhythm. | Professional and low cognitive load. |
| CTA clarity | 6/10 | Above-fold actions include search, Sign up, Deep, Filter, submit, and prompt chips. | First-time users may hesitate between searching, signing up, or exploring examples. |
| Trust sequencing | 7/10 | Strong proof: publisher logos, institution logos, 250M+ papers, 170+ libraries, 10M users. | Trust is strong but arrives mostly below the hero search action. |
| Responsiveness | 7/10 | Clean 390px capture keeps the search usable; session resize also produced a sidebar-open state. | Mobile is mostly usable, but shell/sidebar behavior needs regression coverage. |
| Accessibility | 5/10 | DOM extraction found unlabeled textareas, empty visible links/buttons, icon-only controls, and 32px support chat target. | Screen reader and keyboard users face avoidable ambiguity. |
| Component coherence | 8/10 | Buttons, chips, lists, icons, and cards share consistent radius, grayscale palette, and density. | Interface feels mature and production-grade. |
| Motion restraint | 8/10 | No distracting ambient animation observed in passive audit. | Fits a research credibility posture. |
| Implementation cleanliness | 6/10 | Console errors/warnings observed; accessibility tree includes generic and unnamed controls. | Visual polish is stronger than semantic polish. |

Ship threshold target: every score should reach at least 7/10 before considering the page fully polished.

## 2. Top 5 Issues By Impact

1. High severity: accessibility naming gaps

   The main search textarea has placeholder copy but no visible or accessible label in the extracted DOM. Several visible controls also appear empty or icon-only without clear names. This creates friction for screen readers, keyboard-only users, voice control, and automated testing.

   Consequence: reduced accessibility compliance and weaker quality signals for an academic/trust-heavy product.

2. High severity: primary CTA ambiguity

   The page uses a powerful search-first layout, but "Sign up" competes with the search box, prompt chips, Deep, Filter, and submit controls. The conversion action is generic and does not explain the value or risk level.

   Consequence: lower activation for first-time visitors who are not yet ready to create an account.

3. Medium severity: trust proof is not close enough to the hero action

   Consensus has excellent trust assets, including 250M+ papers, publisher logos, university logos, 170+ libraries, and 10M users. Most of that proof is visually separated from the first search action.

   Consequence: the hero asks users to trust the search box before showing the strongest reasons to trust it.

4. Medium severity: app shell competes with landing-page persuasion

   The persistent sidebar helps demonstrate product reality, but on desktop it consumes attention and adds navigation options before the visitor has committed to the search flow.

   Consequence: the page can feel like a logged-in app screen rather than a focused acquisition/onboarding surface.

5. Medium severity: feature sections repeat the same pattern

   Deep Search, Medical mode, natural-language filters, and Consensus Meter all use title, paragraph, and three example prompts. This is understandable but visually repetitive.

   Consequence: users may skim past feature differences instead of understanding which feature solves which research job.

## 3. Upgraded Spec

### Revised IA

1. Hero/search entry
   - Logo and H1: "Research starts here"
   - Subhead: "Search, analyze, and synthesize peer-reviewed literature from 250M+ papers."
   - Primary control: labeled research query box
   - Primary CTA: "Search the evidence"
   - Secondary CTA: "Try an example"

2. Hero trust strip
   - "250M+ papers"
   - "Licensed full-text publisher content"
   - "170+ university library partners"
   - "Used by 10M researchers, students, and clinicians"

3. Example tasks
   - Literature review
   - Clinical question
   - Evidence comparison
   - Consensus/disagreement check

4. Publisher proof
   - Wiley, Taylor & Francis, Sage, ACS Publications
   - Short copy explaining full-text/license value.

5. Institution proof
   - University logo grid
   - Short copy explaining library partnerships and daily academic use.

6. Feature narrative
   - Deep Search: automate literature review
   - Medical mode: constrain to trusted clinical sources
   - Natural-language filters: apply constraints from the prompt
   - Consensus Meter: visualize agreement/disagreement

7. Final conversion band
   - CTA: "Start researching free"
   - Risk reducer: "No credit card required" if true.

### Token Updates

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #fafafa;
  --color-surface-raised: #ffffff;
  --color-border: #e4e4e7;
  --color-text: #18181b;
  --color-muted: #71717b;
  --color-action: #0877d8;
  --color-action-hover: #0666ba;
  --color-evidence: #0f766e;
  --radius-control: 12px;
  --radius-card: 18px;
  --shadow-card: 0 2px 12px rgba(24, 24, 27, 0.08);
  --shadow-lift: 0 10px 30px rgba(24, 24, 27, 0.12);
  --space-section: clamp(48px, 8vw, 96px);
  --container-main: 768px;
  --focus-ring: 0 0 0 3px rgba(8, 119, 216, 0.28);
}
```

### Component Updates

Search composer:

- Use a visible label or screen-reader-only label: "Ask a research question".
- Keep placeholder as example text only.
- Add states: default, focus, typing, submitting, error, disabled.
- Add helper copy under the box: "Ask a question, compare treatments, or request a literature review."
- Keep submit button disabled until input has non-whitespace content.

Prompt chips:

- Add heading: "Try an example"
- Group by intent:
  - "Summarize a field"
  - "Compare approaches"
  - "Check agreement"
  - "Find clinical evidence"
- Ensure chips remain at least 44px tall on mobile.

Trust strip:

- Place directly under the search composer.
- Use numeric hierarchy: large number, small descriptor.
- Avoid burying proof in paragraph copy.

Sidebar:

- Desktop landing mode: collapsed by default or visually de-emphasized.
- Product/app mode: expanded only after search or authenticated entry.
- Mobile: never overlay content on first load; expose as a menu button with `aria-expanded`.

Support chat:

- Minimum size: 44x44px.
- Ensure `aria-label="Open support chat"` remains present.
- Avoid overlapping lower content cards on mobile.

### Accessibility Baseline

- First body focusable element: skip link to `#main-content`.
- One H1 only.
- Sequential headings: H1, then H2 section headings, H3 feature headings.
- All textareas have accessible labels.
- Icon-only buttons have `aria-label`.
- Logo links have accessible names.
- `:focus-visible` styles are never removed.
- Mobile touch targets are at least 44x44px.
- Sidebar/drawer uses `aria-expanded`, `aria-controls`, focus trap when modal, and Escape close.
- Reduced-motion override exists for all transitions.

## 4. Implementation Plan

| Phase | Tasks | Effort | Risk | Acceptance criteria |
|---|---|---:|---|---|
| 1. Semantic/accessibility pass | Label textareas, name empty links/buttons, fix heading duplication, enlarge support chat target. | Small | Low | Accessibility snapshot has no unnamed interactive controls; keyboard tab order is understandable. |
| 2. CTA simplification | Replace "Sign up" with value-led copy, clarify search submit, reduce competing hero controls. | Small-Medium | Medium | In a 5-second test, users identify one primary action: ask/search. |
| 3. Hero trust relocation | Move 250M+/licensed content/user proof directly under search. | Medium | Medium | Primary action has a proof signal within 2 visual units. |
| 4. Feature differentiation | Replace repetitive feature blocks with distinct output previews for each research job. | Medium-Large | Medium | Each feature communicates a unique outcome without relying on paragraph reading. |
| 5. Responsive regression | Test 390px, 768px, 1024px, 1440px; include resize/reload/sidebar state checks. | Small | Low | No sidebar overlay blocks first-load mobile content; search remains usable at 390px. |

## 5. Quick Wins In 60 Minutes

1. Add labels to both textarea controls.
2. Rename generic "Sign up" CTAs to "Start researching free" or "Try Consensus free".
3. Add a hero trust line below the search: "250M+ papers - licensed full text - used by 10M researchers".
4. Rename the duplicate H2 "Research starts here" to "Trusted by researchers and institutions".
5. Increase the support chat button from 32x32 to at least 44x44.
6. Add accessible names to empty logo links and icon-only buttons.

## Suggested Regression Checks

Manual checks:

- Desktop 1440px: verify hero, search, trust strip, and sidebar visual priority.
- Mobile 390px: verify search composer fits, prompt chips wrap, no horizontal scroll.
- Keyboard: tab from page start through sidebar/nav/search/chips/support chat.
- Screen reader smoke: confirm textarea label and CTA names are announced.
- Resize: load desktop, resize to mobile, reload mobile, resize back to desktop.

Automated checks:

```bash
npx playwright test consensus.spec.ts
npx axe https://consensus.app/
```

Target assertions:

- Exactly one H1.
- All `input`, `textarea`, and `select` controls have accessible names.
- All visible `button` and `a[href]` elements have accessible names.
- No interactive element below 44x44px on mobile, except inline text links.
- Main content is not obscured by sidebar/drawer at 390px.

## Design Direction

Consensus should preserve the restrained academic tone, but make the first-run path more decisive:

- Lead with search as the product, not account creation.
- Attach trust proof directly to the search moment.
- Make example prompts feel like user jobs, not generic chips.
- Use accessibility semantics as part of the trust posture.
- Treat the sidebar as product scaffolding, not the primary landing-page frame.
