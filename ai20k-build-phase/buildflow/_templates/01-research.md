# Stage 01 - Research (inspect first)

Rule: INSPECT what already exists. Evidence required - links, quotes, screenshots.
"I think there's nothing like this" without searching = gate fail.

Source of truth for product flow: `scispace_main_page_user_flow2.md`.

## Gate - check ALL before `/flow next`
- [x] I actually OPENED 3 existing tools/competitors (links below, with one honest note each)
- [x] I found 3 REAL user complaints online and quoted them (with source links)
- [x] I wrote what competitors CHARGE (real prices) and who is paying them
- [x] I named the ONE channel my first 10 users come from (a place, not "social media")
- [x] I wrote why those users would pick this over the status quo (one honest paragraph)
- [x] I wrote what is technically free vs hard for this idea
- [x] No FILL placeholders remain in this file

## What exists already (3 - open them, don't guess)

1. [SciSpace](https://scispace.com/pricing) - strong research-task router with Literature Review, Chat with PDF, AI Writer, Extract Data, Citation Generator, and a prompt-led workflow. It falls short for this MVP because the source-of-truth product needs beginner research-cycle orientation: current step, missing inputs, produced artifact, and next recommended step in a right progress sidebar.
2. [Elicit](https://elicit.com/pricing) - strong systematic-review workflow, paper search, extraction tables, reports, alerts, and source-backed answers. It falls short for this MVP because it is optimized for deeper research execution, while this product must first help a beginner decide whether they are clarifying a topic, defining scope, building a search strategy, screening papers, extracting data, finding a gap, or preparing mentor review.
3. [Semantic Scholar API](https://www.semanticscholar.org/product/api) - strong scholarly data layer with Academic Graph, recommendations, datasets, and free public access. It is infrastructure, not a guided student-facing workflow, so it does not solve the "what should I do next in my research cycle?" problem by itself.

## What users say (3 real complaints, quoted, with source)

1. > "As scientific literature grows, this becomes increasingly challenging." - [Relatedly: Scaffolding Literature Reviews with Existing Related Work Sections](https://arxiv.org/abs/2302.06754)
2. > "the methods used to construct search strategies can be complex, time consuming, resource intensive and error prone." - [Search Strategy Formulation for Systematic Reviews](https://arxiv.org/abs/2112.09424)
3. > "incoming graduate students... often felt unprepared to make it" and perceived "an overall lack of guidance and structure" - [Physics PhD student perspectives on finding a research group](https://arxiv.org/abs/2311.04176)

## GTM & business reality

Building is the cheap part now. Distribution and willingness-to-pay are where ideas die -
research them BEFORE planning, not after shipping.

### Who pays today, and how much (pricing reference points)

- SciSpace -> pricing page emphasizes Premium and Teams plans for individual researchers and teams; the page was opened, but the accessible HTML did not expose the current dollar amount, so use it as a product-positioning reference rather than a price anchor: https://scispace.com/pricing.
- Elicit -> Basic is free; Plus is listed at $7/user/month billed yearly for deeper research; Pro is listed at $29/user/month billed yearly on the industry yearly view and $49/user/month on the monthly/academia view; Scale is listed at $49/user/month billed yearly on the industry yearly view and $169/user/month on the monthly/academia view; buyers are researchers, systematic reviewers, teams, companies, and schools: https://elicit.com/pricing.
- Semantic Scholar -> free AI-powered literature search and free/open API resources; unauthenticated public endpoints are rate-limited and API keys start with limited throughput; buyers do not pay Semantic Scholar directly for basic use, but downstream products pay in development, integration, hosting, and UX around the data: https://www.semanticscholar.org/product/api.

### The first-10-users channel (one, named)

The first 10 users come from the AI20K / VIN researcher-student cohort using this build-phase repo and related research-practice workshops. This is reachable because the product is already framed around students learning how research works, and the source document uses examples like "I want to research anomaly detection", "I want to do AI in education", and "I have 5 papers but do not know the gap."

### Why switch (vs the status quo)

The status quo is a patchwork of Google Scholar/Semantic Scholar searches, generic ChatGPT prompts, PDF chat, spreadsheets, and ad-hoc mentor feedback. New researchers would switch because this product does not merely answer a paper question; it keeps them oriented in the research cycle, forces human review before scope/search/extraction decisions, makes missing inputs visible, and turns each step into a mentor-reviewable artifact with citation evidence.

## Technically free vs hard

- Free (solved by libraries/platforms): paper metadata search through Semantic Scholar or similar APIs; PDF upload and text extraction; LLM-based clarification questions; basic citation-backed answer generation; CRUD for projects, papers, criteria, extraction fields, and artifacts; static export to Markdown/PDF; simple right-sidebar progress state.
- Hard (custom work, real risk): reliable citation grounding; preventing invented novelty claims; mapping vague user intent to the correct research-cycle step; making extracted fields auditable against source passages; designing a beginner-friendly workflow that does not become a rigid wizard; keeping AI suggestions subordinate to student and mentor review.
