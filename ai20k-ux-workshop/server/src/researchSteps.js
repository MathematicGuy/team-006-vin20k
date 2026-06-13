export const RESEARCH_STEPS = [
  {
    step_number: 1,
    key: 'clarify_topic',
    name: 'Clarify Topic',
    purpose: 'Narrow a broad research interest into a specific topic using Socratic questioning.',
    artifact_name: 'Clarified Topic',
    missing_warning: 'Topic not clarified yet'
  },
  {
    step_number: 2,
    key: 'define_problem',
    name: 'Define Research Problem',
    purpose: 'Formulate a specific, answerable research question.',
    artifact_name: 'Research Question',
    missing_warning: 'Research question not defined'
  },
  {
    step_number: 3,
    key: 'build_search_strategy',
    name: 'Build Search Strategy',
    purpose: 'Configure keywords, databases, and search criteria.',
    artifact_name: 'Search Strategy',
    missing_warning: 'Search strategy not built'
  },
  {
    step_number: 4,
    key: 'run_paper_search',
    name: 'Run Paper Search',
    purpose: 'Search databases and retrieve a candidate paper set.',
    artifact_name: 'Candidate Paper Set',
    missing_warning: 'Paper search not executed'
  },
  {
    step_number: 5,
    key: 'screen_papers',
    name: 'Screen Papers',
    purpose: 'Apply inclusion and exclusion criteria to the retrieved papers.',
    artifact_name: 'Screening Criteria',
    missing_warning: 'Screening criteria not confirmed'
  },
  {
    step_number: 6,
    key: 'extract_data',
    name: 'Extract Data',
    purpose: 'Perform structured extraction of key fields from selected papers.',
    artifact_name: 'Extracted Paper Data',
    missing_warning: 'Papers not extracted yet'
  },
  {
    step_number: 7,
    key: 'analyze_gaps',
    name: 'Analyze Gaps',
    purpose: 'Identify research gaps, contradictions, and areas of promise in the matrix.',
    artifact_name: 'Gap Hypothesis',
    missing_warning: 'Gap analysis not run'
  },
  {
    step_number: 8,
    key: 'build_literature_matrix',
    name: 'Build Literature Matrix',
    purpose: 'Compare papers in a structured grid across themes and variables.',
    artifact_name: 'Literature Matrix',
    missing_warning: 'Literature matrix not built'
  },
  {
    step_number: 9,
    key: 'draft_synthesis',
    name: 'Draft Synthesis',
    purpose: 'Generate a narrative synthesis of findings and draft the Research Problem Card.',
    artifact_name: 'Research Problem Card',
    missing_warning: 'Problem card not drafted'
  },
  {
    step_number: 10,
    key: 'mentor_review',
    name: 'Mentor Review',
    purpose: 'Generate a Mentor Review Brief and mark the research cycle complete.',
    artifact_name: 'Mentor Review Brief',
    missing_warning: 'Mentor review brief not generated'
  }
];

export function getStepByNumber(num) {
  return RESEARCH_STEPS.find(s => s.step_number === num);
}

export function getStepByKey(key) {
  return RESEARCH_STEPS.find(s => s.key === key);
}
