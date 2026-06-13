# Stage 05 - Interface Contract (the seam)

The contract is whatever sits between your core and its consumer. For this web app it is
API endpoints. Written BEFORE any code. Backend cards build TO this table; UI cards
consume FROM it. The #1 AI-build failure is producer/consumer drift - backend ships one
shape, UI assumes another, both look green. This file is the cheap fix.

## Gate - check ALL before `/flow next`
- [x] Every PRD feature maps to at least one endpoint below
- [x] Every endpoint has request AND response shapes written
- [x] Auth column filled for every endpoint (public / token / admin)
- [x] No FILL placeholders remain in this file

## OpenAPI / Swagger rule

This table is the PLANNING source of truth. If the framework serves a spec (FastAPI ->
`/openapi.json` + `/docs`), the served spec is the RUNTIME artifact of this same contract:
- Path/method/shapes here and in the served spec must agree - the contract-test card
  asserts every endpoint in this table exists in the live `/openapi.json` with matching
  request/response shapes.
- Change flows ONE way: amend this file first, then the code, then the spec follows.
- **Docs land with the API, not after**: the served spec is live from the vertical-slice
  card onward, and every backend card's verify checks its endpoints appear in the live
  `/docs` with correct schemas. The contract-test card later asserts full agreement -
  but by then the docs have been growing card by card, never a catch-up task.
- Keep `/docs` enabled at least until v1 ships - it's the free human-readable contract.

## Endpoints

| Method | Path | Auth | Request shape | Response shape |
|---|---|---|---|---|
| POST | `/api/projects` | token | `CreateProjectRequest { title: string, initial_intent?: string }` | `Project { id, title, initial_intent?, current_step, created_at, updated_at }` |
| GET | `/api/projects/{project_id}` | token | path: `project_id` | `ProjectDetail { project, progress, completed_artifacts[], missing_inputs[], next_action }` |
| POST | `/api/research-intents` | token | `ResearchIntentRequest { project_id, entry_type: prompt|task_card|sidebar_tool, text?: string, task_card?: TaskCardKey }` | `ResearchIntentResponse { intent_id, interpreted_task, maturity: vague|scoped|ready, current_step, live_preview[], missing_inputs[], suggested_questions[] }` |
| POST | `/api/clarifications` | token | `ClarificationRequest { project_id, intent_id, answers: ClarificationAnswer[] }` | `ClarificationResponse { refined_question, draft_scope, current_step, completed_artifacts[], missing_inputs[], next_action }` |
| PUT | `/api/screening-criteria` | token | `ScreeningCriteriaRequest { project_id, inclusion: string[], exclusion: string[], notes?: string }` | `ScreeningCriteria { id, project_id, inclusion[], exclusion[], status: draft|confirmed, updated_at }` |
| POST | `/api/screening-criteria/confirm` | token | `ConfirmCriteriaRequest { project_id, criteria_id }` | `ProgressResponse { current_step, completed_artifacts[], missing_inputs[], next_action }` |
| PUT | `/api/search-strategy` | token | `SearchStrategyRequest { project_id, coverage: 20|50|100|custom, custom_limit?: number, sources: SourceKey[], query: string, synonym_expansion: boolean, publication_period: Period }` | `SearchStrategy { id, project_id, coverage, sources[], query, expanded_terms[], publication_period, status: draft|confirmed }` |
| POST | `/api/search-runs` | token | `SearchRunRequest { project_id, strategy_id }` | `SearchRun { id, project_id, status: queued|running|complete|needs_input|failed, papers_found, live_preview[], warnings[] }` |
| GET | `/api/projects/{project_id}/papers` | token | query: `status?: saved|selected|excluded`, `q?: string` | `PaperList { papers: Paper[], total }` |
| POST | `/api/papers/upload` | token | multipart: `project_id`, `file`, `metadata?: PaperMetadataInput` | `Paper { id, project_id, title, authors[], year?, source, url?, citation_status, saved }` |
| PATCH | `/api/papers/{paper_id}` | token | `UpdatePaperRequest { saved?: boolean, selected?: boolean, excluded?: boolean, notes?: string }` | `Paper` |
| POST | `/api/extractions` | token | `ExtractionRequest { project_id, paper_ids: string[], fields: ExtractionFieldKey[] }` | `ExtractionRun { id, status: queued|running|complete|needs_review|failed, matrix_id?, live_preview[] }` |
| GET | `/api/literature-matrix/{matrix_id}` | token | path: `matrix_id` | `LiteratureMatrix { id, project_id, rows: MatrixRow[], status: draft|reviewed, updated_at }` |
| PATCH | `/api/literature-matrix/{matrix_id}/rows/{row_id}` | token | `UpdateMatrixRowRequest { field_values: Record<string,string>, reviewer_note?: string }` | `MatrixRow` |
| POST | `/api/artifacts` | token | `CreateArtifactRequest { project_id, type: research_problem_card|gap_hypothesis|direction_brief|mentor_review_brief, source_matrix_id?: string }` | `Artifact { id, project_id, type, title, body_markdown, citations[], uncertainty[], status: draft|reviewed, created_at }` |
| GET | `/api/projects/{project_id}/artifacts` | token | path: `project_id` | `ArtifactList { artifacts: ArtifactSummary[] }` |
| POST | `/api/artifacts/{artifact_id}/export` | token | `ExportRequest { format: markdown|pdf }` | `ExportResponse { artifact_id, format, download_url, expires_at }` |
| GET | `/api/projects/{project_id}/progress` | token | path: `project_id` | `ProgressResponse { current_step, timeline: ProgressStep[], completed_artifacts[], missing_inputs[], next_action }` |

## Shared shapes (objects used by multiple endpoints)

```text
Project {
  id: string
  title: string
  initial_intent?: string
  current_step: ResearchStepKey
  created_at: datetime
  updated_at: datetime
}

ResearchStepKey =
  clarify_topic | define_scope | build_search_strategy | search_papers |
  screen_papers | extract_data | build_literature_matrix | identify_gap |
  draft_problem_statement | mentor_review

TaskCardKey =
  clarify_topic | review_literature | search_papers | chat_with_pdf |
  extract_paper_data | compare_papers | find_research_gap | prepare_mentor_review

SourceKey = ai_search | my_library | google_scholar | pubmed | arxiv | semantic_scholar | uploaded_papers

ProgressStep {
  key: ResearchStepKey
  label: string
  status: locked | current | complete | needs_input
  artifact_id?: string
}

ClarificationAnswer {
  question_id: string
  answer: string
}

Period {
  preset: any_year | past_2_years | past_5_years | custom
  start_year?: number
  end_year?: number
}

Paper {
  id: string
  project_id: string
  title: string
  authors: string[]
  year?: number
  abstract?: string
  source: SourceKey
  url?: string
  doi?: string
  citation_status: verified | unresolved | needs_review
  saved: boolean
  selected: boolean
  excluded: boolean
}

ExtractionFieldKey =
  problem | method | dataset | metric | result | limitation |
  future_work | relevance | source_citation

MatrixRow {
  id: string
  paper_id: string
  field_values: Record<ExtractionFieldKey,string>
  citations: CitationRef[]
  review_status: needs_review | reviewed
}

CitationRef {
  paper_id: string
  title: string
  url?: string
  doi?: string
  source_passage?: string
  confidence: high | medium | low
}

ArtifactSummary {
  id: string
  type: string
  title: string
  status: draft | reviewed
  created_at: datetime
}

ProgressResponse {
  current_step: ResearchStepKey
  timeline: ProgressStep[]
  completed_artifacts: ArtifactSummary[]
  missing_inputs: string[]
  next_action: string
}
```

## Feature -> endpoint map

- Research-focused landing prompt and task cards -> `POST /api/projects`, `POST /api/research-intents`, `GET /api/projects/{project_id}/progress`
- Socratic topic clarification -> `POST /api/research-intents`, `POST /api/clarifications`
- Right research progress sidebar -> `GET /api/projects/{project_id}`, `GET /api/projects/{project_id}/progress`
- Screening criteria editor -> `PUT /api/screening-criteria`, `POST /api/screening-criteria/confirm`
- Search strategy builder -> `PUT /api/search-strategy`, `POST /api/search-runs`
- Paper table and source preview -> `GET /api/projects/{project_id}/papers`, `POST /api/papers/upload`, `PATCH /api/papers/{paper_id}`
- Structured extraction and literature matrix -> `POST /api/extractions`, `GET /api/literature-matrix/{matrix_id}`, `PATCH /api/literature-matrix/{matrix_id}/rows/{row_id}`
- Citation-backed artifact generation -> `POST /api/artifacts`, `GET /api/projects/{project_id}/artifacts`
- Export research artifacts -> `POST /api/artifacts/{artifact_id}/export`
