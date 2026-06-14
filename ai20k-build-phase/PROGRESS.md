# PROGRESS — ai20k-build-phase

_Last updated: 2026-06-14. Next agent: read this before doing anything._

---

## What this repo is

**`ai20k-build-phase`** is the coaching infrastructure for the AI20K (VinUni) Build Phase course. It is NOT a student project — it is the template hub that students copy FROM.

Two things live here:

| Directory | Purpose |
|---|---|
| `buildflow/` | Reusable 11-stage method (idea → deployed URL). Students `cp -r buildflow/ my-project/` and run `/flow next` inside their own repo. |
| `guide/` | Vietnamese coaching guides — standup, journals, ADR, PR workflow, GitHub Projects setup. |
| `resources/workshop-0422/` | Workshop slides + case-study HTML refs. **Ignored by AGENT.md** — don't touch unless explicitly asked. |

Landing page: `index.html` → deployed at `https://vibery-studio.github.io/ai20k-build-phase/`

---

## buildflow status (in THIS repo)

**Not started.** This repo contains the TEMPLATE, not a live project run.

- `buildflow/flow/` — only `.gitkeep` (no stage files: no 00-idea.md, nothing)
- `buildflow/cards/` — only `.gitkeep` (no cards)
- No `MODE` file at root → defaults to `teach` mode

This means: **no `/flow next` has been run in this repo.** The buildflow template is intact and unmodified (as it should be — `_templates/` and `flow.sh` are Forbidden to edit during a project run).

---

## Current git state (as of session start)

Branch: `main`

### Modified (staged or unstaged)
- `../.gitignore` — parent-level gitignore updated
- `AGENT.md` — says: ignore `resources/workshop-0422`, treat `CLAUDE.md = CODEX.md = GEMINI.md`
- `../eval/docs/architecture_diagram.md` — eval repo docs updated

### Deleted
- `scispace_main_page_user_flow2.md` — removed from this repo
- `../ai20k-ux-workshop/prd-to-screens/nguvan-10-tutor/{GUIDELINE,prompts,screens,stories}.md` — ux-workshop files removed

### Untracked (new, not yet committed)
- `design-preview.html` — new file in repo root (likely a UI preview artifact)
- `../.env.example` — parent-level env example
- `../_bmad-output/` — unknown output directory at parent level
- `../claude_hook_error_log.png` — hook error log image (investigate if hooks are broken)
- `../lumina-wiki/` — new wiki directory at parent
- `../src/core/` — new source directory at parent

**None of these have been committed yet.**

---

## What the user (coach) was doing this session

- Asked `/flow` where they are in the build phase → confirmed: not started (stage 00 not yet created)
- Asked `/context` → checked token usage (17% / 200k, healthy)
- Asked to write this PROGRESS.md so the next agent has full situational awareness

---

## What the next agent should know

1. **This repo is a template/coaching hub, not a student project.** Do not run `/flow next` here unless the user explicitly wants to start a demo run of buildflow in this repo itself.

2. **The untracked files need attention.** Before doing anything else, ask the user what they want to do with the untracked files (`design-preview.html`, `../_bmad-output/`, `../src/core/`, etc.) — they may be artifacts from another workstream.

3. **`claude_hook_error_log.png` exists at parent** — there may be a broken Claude Code hook. Check `.claude/settings.local.json` if hooks are behaving oddly.

4. **The flow skill runner** is at `.skill/flow/runner/flow.sh`. On Windows, Bash commands get backgrounded by the permission system — use the Read tool on directory contents instead of `ls` to inspect state.

5. **AGENT.md rule**: ignore `resources/workshop-0422`. Do not read or modify those files unless the user asks.

6. **Design law**: `buildflow/DESIGN.md` is law for any UI card. `buildflow/CLAUDE.md` is the build-session discipline (auto-loaded into every session). Both apply to any student project using buildflow, not to this repo directly.

---

## Likely next steps (inferred — confirm with user)

- [ ] Decide what to commit from the untracked/modified files
- [ ] Possibly start a demo/real flow run in this repo or copy `buildflow/` to a new student project directory
- [ ] Investigate `../claude_hook_error_log.png` if hook errors are occurring
