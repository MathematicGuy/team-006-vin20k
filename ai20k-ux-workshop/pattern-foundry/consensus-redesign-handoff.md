# Research Search Landing Redesign Handoff

Using pattern-foundry `PAGE_GEN_MODE`.

This is an original redesign direction derived from the Consensus audit. It preserves the useful pattern of "research starts with a query" but does not clone Consensus branding, copy, or exact layout.

## 1. Page Objective And Target User

Objective: convert first-time visitors into active research searches by making the query composer the primary action, attaching trust proof to that action, and showing the product's evidence workflow before asking for account creation.

Target users:

- Researchers starting a literature review.
- Clinicians checking evidence direction.
- Students trying to understand agreement and disagreement in peer-reviewed literature.
- Institutional buyers evaluating credibility and adoption signals.

Primary user question:

"Can I trust this AI research tool enough to ask my real question?"

Primary page answer:

"Yes: ask now, see sourced evidence, and verify the scope before signing up."

## 2. Section-By-Section Blueprint

### Section 1: Search-First Hero

Purpose: make the page immediately usable.

Layout:

- Centered max-width content, no persistent sidebar on first landing view.
- Small product mark above H1.
- H1: "Start with the evidence"
- Subhead: "Ask a research question and get a sourced map of findings, agreement, and gaps from peer-reviewed literature."
- Query composer with a visible label.
- Primary CTA inside composer: "Search evidence"
- Secondary text action: "Try a sample question"

Trust-adjacent proof:

- "250M+ indexed papers"
- "Publisher full-text partnerships"
- "Used by university libraries"
- "Transparent source links"

Interaction:

- Empty state: submit disabled with helper text.
- Typing state: show query quality hints.
- Submit state: button changes to loading with "Searching".

### Section 2: Example Research Jobs

Purpose: help users self-identify the right starting behavior.

Layout:

- Four cards in a 2x2 grid on desktop, stacked on mobile.
- Each card has a job label, example prompt, and expected output preview.

Cards:

- Literature review: "Summarize points of agreement and disagreement."
- Clinical evidence: "Find guideline-backed treatment evidence."
- Method filter: "Limit to randomized or systematic-review evidence."
- Consensus check: "Show where studies agree, disagree, or remain uncertain."

CTA:

- Each card uses "Use this prompt" and fills the hero composer.

### Section 3: Trust Proof Strip

Purpose: make credibility scannable.

Layout:

- Horizontal proof cards on desktop.
- 2x2 grid on tablet.
- Stacked compact rows on mobile.

Proof hierarchy:

- Number/stat first.
- Descriptor second.
- Short source/context third.

Example:

- "250M+"
- "Research papers indexed"
- "Peer-reviewed literature plus licensed full text where available."

### Section 4: Evidence Workflow

Purpose: explain how the product thinks without long marketing copy.

Layout:

- Three-step process with a sample query traveling through the workflow.

Steps:

1. Scope the question
   - Detect population, intervention, comparison, outcome, dates, and study type.
2. Retrieve and rank evidence
   - Show source cards, study design, citation count, and journal/source metadata.
3. Summarize agreement
   - Show claim clusters, disagreement flags, and "what would change this answer".

Interaction:

- Hover or tap a step to update the preview panel.
- Reduced-motion mode swaps animated transitions for instant state changes.

### Section 5: Feature Modules

Purpose: show differentiated value without repeating the same card pattern.

Modules:

- Deep Review
  - Visual: search strategy tree and citation graph.
  - Promise: turns vague topics into a structured review plan.

- Medical Mode
  - Visual: source-quality filter stack.
  - Promise: narrows to high-quality clinical sources.

- Natural-Language Filters
  - Visual: prompt text becomes applied filter chips.
  - Promise: constraints stay visible and editable.

- Agreement Meter
  - Visual: evidence split bar with "supports", "mixed", "opposes", "insufficient".
  - Promise: fast read on whether the literature converges.

### Section 6: Institution Proof

Purpose: support buyer/user trust after product value is understood.

Layout:

- Publisher logos in one row.
- University/library proof in a separate muted panel.
- One paragraph explaining institutional use.

CTA:

- "Explore university access"
- "Contact research partnerships"

### Section 7: Final Conversion Band

Purpose: close with the same primary behavior as the hero.

Layout:

- Short headline: "Bring a real question."
- Query composer repeated or compact CTA group.
- Primary CTA: "Start researching free"
- Secondary CTA: "See an example result"

Risk reducers:

- "No credit card required" if true.
- "Sources shown before summary" if true.
- "Exportable citations" if true.

## 3. Token Map

### Color

```css
:root {
  --pf-color-bg: #fbfaf7;
  --pf-color-surface: #ffffff;
  --pf-color-surface-muted: #f2f5f4;
  --pf-color-text: #171717;
  --pf-color-text-muted: #66706d;
  --pf-color-border: #dce5e2;
  --pf-color-action: #0b78d0;
  --pf-color-action-hover: #075fa7;
  --pf-color-evidence: #0f766e;
  --pf-color-caution: #b45309;
  --pf-color-disagreement: #be123c;
  --pf-color-focus: rgba(11, 120, 208, 0.28);
}
```

Rules:

- Action blue is reserved for primary search/submit controls.
- Evidence teal marks source-backed proof, not decorative accents.
- Caution amber marks uncertainty, conflicts, or filters requiring review.
- Disagreement red is used sparingly and only for evidence-state semantics.

### Type

```css
:root {
  --pf-font-display: "Fraunces", Georgia, serif;
  --pf-font-ui: "IBM Plex Sans", "Segoe UI", sans-serif;
  --pf-text-hero: clamp(2.5rem, 6vw, 5.25rem);
  --pf-text-h2: clamp(1.75rem, 3vw, 3rem);
  --pf-text-h3: 1.25rem;
  --pf-text-body: 1rem;
  --pf-line-tight: 1.05;
  --pf-line-heading: 1.18;
  --pf-line-body: 1.55;
}
```

Rules:

- Display serif only for major page narrative.
- UI sans for controls, source metadata, chips, and dense evidence content.
- No all-caps CTA labels.

### Spacing

```css
:root {
  --pf-space-1: 4px;
  --pf-space-2: 8px;
  --pf-space-3: 12px;
  --pf-space-4: 16px;
  --pf-space-6: 24px;
  --pf-space-8: 32px;
  --pf-space-12: 48px;
  --pf-space-16: 64px;
  --pf-section-compact: clamp(48px, 7vw, 80px);
  --pf-section-large: clamp(72px, 10vw, 128px);
}
```

Rules:

- Use only compact and large section padding on this page.
- Composer-to-trust distance should be no more than `--pf-space-6`.
- Mobile side padding: 16px.

### Radius And Elevation

```css
:root {
  --pf-radius-control: 12px;
  --pf-radius-chip: 999px;
  --pf-radius-card: 20px;
  --pf-radius-panel: 28px;
  --pf-shadow-rest: 0 2px 12px rgba(23, 23, 23, 0.07);
  --pf-shadow-lift: 0 14px 36px rgba(23, 23, 23, 0.12);
}
```

Rules:

- Inputs and buttons use control radius.
- Marketing cards use card/panel radius.
- Hover lift applies only to clickable cards.

### Motion

```css
:root {
  --pf-duration-fast: 150ms;
  --pf-duration-base: 220ms;
  --pf-duration-spatial: 420ms;
  --pf-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Rules:

- Use motion to reveal relationships: query to filters, sources to summary.
- Avoid ambient loops.

## 4. Component Map

### Research Composer

Elements:

- `<label for="research-query">Ask a research question</label>`
- Textarea with placeholder example.
- Source/corpus selector.
- Filter button.
- Submit button.
- Helper or validation text.

States:

- Default: empty, submit disabled.
- Focus: visible focus ring around composer.
- Typing: show "Press Enter to search; Shift+Enter for new line".
- Ready: submit enabled.
- Loading: submit spinner and "Searching evidence".
- Error: inline message with retry.
- Disabled: reduced opacity, no hover lift.

### Example Job Card

Elements:

- Job label.
- One-sentence user problem.
- Example prompt.
- Expected output badge.
- "Use this prompt" action.

States:

- Default.
- Hover: `translateY(-3px)` plus lift shadow.
- Focus-visible: ring and outline.
- Active: slight scale down or shadow reduction.

### Trust Stat

Elements:

- Large stat.
- Descriptor.
- Context line.

States:

- Static by default.
- If clickable, add visible link affordance and accessible name.

### Workflow Step

Elements:

- Step number.
- Mechanism title.
- Mechanism explanation.
- Linked preview panel.

States:

- Default.
- Selected.
- Hover/focus.
- Reduced-motion static selected state.

### Agreement Meter

Elements:

- Segmented bar.
- Legend.
- Confidence/limitations text.
- "View source studies" link.

States:

- Loading skeleton.
- Sufficient evidence.
- Mixed evidence.
- Insufficient evidence.
- Error retrieving sources.

## 5. Build Handoff

### Semantic HTML Structure

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header">
    <nav aria-label="Primary navigation">
      <a aria-label="Home" href="/">...</a>
      <a href="/examples">Examples</a>
      <a href="/institutions">Institutions</a>
      <a class="button-secondary" href="/sign-in">Sign in</a>
      <a class="button-primary" href="/start">Start researching free</a>
    </nav>
  </header>

  <main id="main-content">
    <section aria-labelledby="hero-title" class="hero">
      <p class="eyebrow">Evidence-first AI research</p>
      <h1 id="hero-title">Start with the evidence</h1>
      <p class="hero-subhead">Ask a research question and get a sourced map of findings, agreement, and gaps from peer-reviewed literature.</p>
      <form class="research-composer" role="search">
        <label for="research-query">Ask a research question</label>
        <textarea id="research-query" name="query" placeholder="Does intermittent fasting improve long-term weight loss?"></textarea>
        <button type="button">Add filters</button>
        <button type="submit">Search evidence</button>
      </form>
      <ul class="trust-strip" aria-label="Research coverage and trust signals">...</ul>
    </section>

    <section aria-labelledby="jobs-title">
      <h2 id="jobs-title">Choose a research job</h2>
      ...
    </section>

    <section aria-labelledby="workflow-title">
      <h2 id="workflow-title">From question to evidence map</h2>
      ...
    </section>

    <section aria-labelledby="features-title">
      <h2 id="features-title">Built for evidence work</h2>
      ...
    </section>

    <section aria-labelledby="proof-title">
      <h2 id="proof-title">Trusted in academic workflows</h2>
      ...
    </section>

    <section aria-labelledby="final-cta-title">
      <h2 id="final-cta-title">Bring a real question</h2>
      ...
    </section>
  </main>
</body>
```

### Tailwind-Ready Structure

```tsx
export function ResearchLandingPage() {
  return (
    <main id="main-content" className="bg-[var(--pf-color-bg)] text-[var(--pf-color-text)]">
      <HeroSearch />
      <ResearchJobGrid />
      <TrustProofStrip />
      <EvidenceWorkflow />
      <FeatureModules />
      <InstitutionProof />
      <FinalSearchCta />
    </main>
  );
}
```

### Checklist

- One H1 only.
- Textarea has visible or screen-reader label.
- All icon-only buttons have `aria-label`.
- Submit is disabled until query has content.
- Trust proof appears within 24px of primary composer.
- Mobile composer fits at 390px without horizontal scroll.
- Touch targets are at least 44x44px.
- Sidebar/drawer is absent or collapsed on first landing view.
- Reduced-motion media query exists.
- Keyboard tab order follows the visual order.
- Loading and error states are implemented before launch.

## Acceptance Criteria

- A first-time visitor can identify the primary action in under 5 seconds.
- Search can be initiated without account creation if the product supports public trial behavior.
- Every visible interactive element has an accessible name.
- The hero includes trust proof near the composer.
- Mobile 390px layout has no obscuring overlay and no horizontal scroll.
- The design remains academically restrained while making the conversion path more decisive.
