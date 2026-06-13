# Stage 02 - Scope (go/no-go)

Scope = features chosen by IMPACT x COST, inside your time budget.
KILL here is cheap and smart. Killing a weak idea at this gate is a SUCCESS outcome.

## Impact rubric (business value - score BEFORE looking at cost)

| Impact | Meaning |
|---|---|
| H | moves money or the core promise: gets users in (acquisition), gets them paying (revenue), or delivers the one job they came for |
| M | keeps users / saves real time weekly (retention, operations) |
| L | nice-to-have; nobody would pay for or switch over it |

Decision matrix: **H-impact features justify B/C cost** (via the C-paths below).
**L-impact features must be grade A or they're cut** - and even grade-A L-features are
cut when the budget is tight. The classic failure is a v1 full of A-grade L-impact
features: cheap to build, worthless to sell.

## AI coding grade rubric

| Grade | Meaning | Examples |
|---|---|---|
| A | cheap for AI | CRUD, forms, dashboards, content sites, API wrappers |
| B | moderate | file processing, 3rd-party integrations, auth via library, single LLM call, HITL AI drafts |
| C | expensive | realtime, payments from scratch, custom auth, autonomous agentic AI pipelines, heavy concurrency |

**Grade is a COST estimate, not a permission.** The gate is fit(grades, budget), not "no C allowed."
When a C feature is the real need, three honest paths:
1. **The C feature IS the product** -> invert the cut: C goes FIRST (riskiest assumption first),
   everything else is minimized to serve it, and the budget is renegotiated against reality.
   But: one C proves the value prop - its siblings are v2 cards, not v1 scope.
2. **Re-architect C down to B** (highest-leverage move): multi-step agent -> single LLM call;
   auto-send -> human-approves-draft; custom pipeline -> managed service / library.
   Same user value, one grade cheaper.
3. **Irreducible C that doesn't fit the budget** -> KILL or re-budget. Both are honest.

## Gate - check ALL before `/flow next`
- [x] Every feature below has an IMPACT (H/M/L with the business reason) AND a grade (A/B/C)
- [x] No L-impact feature above grade A survives in v1
- [x] The suggested-features section was actually considered (each suggestion has an in/out decision)
- [x] fit(grades, budget) holds - every C in scope is justified as path 1, 2, or 3 above (written next to the feature)
- [x] If the product IS a C feature: it is FIRST in build order, and its sibling C features are on the cut list
- [x] The cut list is written (what I am NOT building in v1)
- [x] GO / KILL decision is written below
- [x] No FILL placeholders remain in this file

## Time budget

40-60 focused hours for an MVP that proves the guided research workflow on a small paper set.

## Features in v1 (each with impact AND grade)

- Research-focused landing prompt and task cards - impact H (acquisition/core job: beginners can start without knowing the perfect prompt) - grade A - static UI plus task selection state.
- Socratic topic clarification - impact H (core job: turns vague topics into a usable research question and scope) - grade B - implemented as a single guided LLM call with fixed question schema, not an autonomous agent.
- Right research progress sidebar - impact H (core job/retention: keeps the student aware of current step, completed artifact, missing inputs, and next action) - grade A - deterministic state model and UI.
- Screening criteria editor - impact H (core job: student confirms inclusion/exclusion before search) - grade A - forms and saved criteria.
- Search strategy builder - impact H (core job: controls sources, terms, paper coverage, and publication period) - grade B - API-backed metadata search plus manual upload fallback.
- Paper table and source preview - impact H (core job: inspect, filter, compare, save papers before extraction) - grade B - table, filters, source detail panel, library save.
- Structured extraction to literature matrix - impact H (core job: converts papers into problem/method/dataset/metric/result/limitation/future-work/citation fields) - grade B - HITL AI drafts with source passage links.
- Citation-backed artifact generation - impact H (core job/trust: produces research problem card, gap hypothesis, direction brief, and mentor review brief) - grade B - generated drafts must carry citation references and uncertainty.
- Export research artifacts - impact M (retention: student can bring outputs to mentor or continue outside the app) - grade A - Markdown/PDF export.

## Suggested features (impact-first - proposed, not decided)

Up to 3 features NOT in the original idea, each chosen for business impact (how does this
get users in / get money in / keep users?). Grounded in the stage-01 GTM findings - e.g.
the first-10-users channel often implies a share/invite/referral surface; the pricing
research often implies an upsell or a paid tier. Default is OUT; each needs an explicit
decision.

- Mentor share link - impact M (retention/acquisition: a mentor-review package can bring advisors into the loop) - grade B - OUT for v1; export is enough for first validation.
- Project workspace with saved library - impact M (retention: lets students return to a research project) - grade B - IN only as minimal saved papers/artifacts, not full collaboration.
- Paid tier / team seats - impact M (revenue: competitors monetize deeper research and collaboration) - grade B - OUT for v1; validate workflow usefulness before payment.

## Cut list (NOT in v1 - deferred, not deleted)

- Citation graph and relationship visualization - deferred because it is L/M impact for the first workflow and adds graph UI complexity.
- Workflow gallery / agent marketplace - deferred because the source truth says the main product is guided research workflow, not autonomous agents.
- Autonomous research agent - deferred because source truth requires human review for scope, screening criteria, extracted fields, and mentor review.
- Code execution and advanced multi-agent planning - deferred because it is outside the main research-cycle guidance promise.
- Advanced collaboration, roles, billing, and custom auth - deferred because the first proof can run with simple project/session persistence.

## Decision

GO - the MVP has a clear first-10-user channel and can be reduced to a guided, human-reviewed research workflow without taking on autonomous-agent or graph-visualization complexity.
