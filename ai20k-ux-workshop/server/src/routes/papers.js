import express from 'express';
import { getPapers, addPapers, updatePaperStatus, updatePaperFields, getOrCreateSession } from '../store.js';
import { extractPaperFields } from '../llmService.js';

const router = express.Router();

const MOCK_PAPERS_SEED = [
  {
    id: 'paper-001',
    title: 'Impact of Sleep Duration on Cumulative GPA in Undergraduate Students',
    authors: ['J. Smith', 'A. Johnson'],
    year: 2021,
    abstract: 'This study investigates the relationship between nightly sleep duration and cumulative GPA among undergraduate cohorts. A survey of 150 students was conducted over a 16-week semester. Our regression analysis showed a significant positive correlation (r=0.45, p<0.01) between consistent 7-8 hour sleep duration and higher cumulative GPA. Self-reported sleep quality was also positively associated with academic persistence. Limitations include self-report recall bias.',
    relevance_score: 0.88,
    screening_status: 'pending',
    source: 'PubMed'
  },
  {
    id: 'paper-002',
    title: 'Efficacy of Sleep Quality versus Sleep Quantity in Academic Success',
    authors: ['M. Davis', 'R. Miller'],
    year: 2022,
    abstract: 'Prior research emphasizes sleep quantity, but sleep quality remains under-studied. We tracked sleep consistency and latency using mobile wrist-actigraphs in 80 college freshmen. Results suggest bedtime consistency (regular sleep-wake cycles) predicts higher exam scores and lower stress levels, even when sleep quantity falls below 7 hours. However, small sample size limits generalizability.',
    relevance_score: 0.79,
    screening_status: 'pending',
    source: 'Google Scholar'
  },
  {
    id: 'paper-003',
    title: 'Academic Burnout, Bedtime Consistency, and Examination Performance',
    authors: ['F. Garcia', 'L. Martinez'],
    year: 2023,
    abstract: 'Sleep disruptions are common in rigorous engineering programs. This study assesses how weekly bedtime variations affect end-of-semester exam performance. We found that students with more than 90 minutes of bedtime variability on weekends showed a 12% drop in cognitive processing speeds during Monday morning exams. The study recommends sleep hygiene education.',
    relevance_score: 0.68,
    screening_status: 'pending',
    source: 'arXiv'
  },
  {
    id: 'paper-004',
    title: 'Adolescent Mental Health and Screen Time: A Systematic Review',
    authors: ['L. Thompson'],
    year: 2020,
    abstract: 'A meta-analysis of 45 studies investigating digital media exposure and teen anxiety. The review shows a small but significant association between screen time exceeding 4 hours daily and elevated anxiety indicators. However, longitudinal evidence is weak, and many studies fail to distinguish between active creation and passive scrolling.',
    relevance_score: 0.45,
    screening_status: 'pending',
    source: 'Semantic Scholar'
  },
  {
    id: 'paper-005',
    title: 'Instagram Usage Patterns and Self-Reported Anxiety in Teens',
    authors: ['E. Watson', 'T. Brown'],
    year: 2022,
    abstract: 'We surveyed 300 teenagers aged 13-18 about their social media preferences and mental health. Instagram usage was positively correlated with self-reported social anxiety scores (p<0.05). In particular, passive scrolling through peer profiles was associated with higher fear of missing out (FOMO) and body image concerns. Limitations include cross-sectional design.',
    relevance_score: 0.52,
    screening_status: 'pending',
    source: 'PubMed'
  },
  {
    id: 'paper-006',
    title: 'Early Diagnosis of Type 2 Diabetes via Random Forest Classifiers',
    authors: ['K. Patel', 'S. Kim'],
    year: 2023,
    abstract: 'Machine learning offers promise for predictive clinical modeling. We applied Random Forest and Gradient Boosted trees to electronic health records (EHR) of 5,000 pre-diabetic patients. The Random Forest classifier achieved 89% accuracy in predicting Type 2 diabetes onset within 3 years. Key features included BMI, fasting glucose, and family history.',
    relevance_score: 0.35,
    screening_status: 'pending',
    source: 'IEEE Xplore'
  },
  {
    id: 'paper-007',
    title: 'Southeast Asian Rice Agriculture and Rising Global Temperatures',
    authors: ['N. Nguyen', 'P. Sharma'],
    year: 2021,
    abstract: 'Rice crop yields in the Mekong Delta are highly sensitive to climate fluctuations. We model temperature increases and saline intrusion on crop yields over two decades. Projections suggest a 15% reduction in crop yields by 2040 without adaptive agronomy. Salinity-tolerant strains show some promise but require high capital investment.',
    relevance_score: 0.30,
    screening_status: 'pending',
    source: 'Google Scholar'
  },
  {
    id: 'paper-008',
    title: 'Adaptation Strategies for Salinity-Intruded Paddy Fields in Vietnam',
    authors: ['T. Tran', 'H. Sato'],
    year: 2022,
    abstract: 'This paper examines localized adaptation strategies among rice farmers in salinity-threatened coastal provinces. Utilizing crop rotation (rice-shrimp farming) and rainwater harvesting, smallholders mitigated up to 40% of crop losses during the dry season. The findings advocate for localized water management cooperatives.',
    relevance_score: 0.42,
    screening_status: 'pending',
    source: 'Semantic Scholar'
  }
];

// Get all papers for the session (seeds them if empty)
router.get('/', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'session_id query parameter is required' });
  }

  const session = getOrCreateSession(session_id);
  let sessionPapers = getPapers(session_id);

  if (sessionPapers.length === 0) {
    // Seed papers
    sessionPapers = addPapers(session_id, MOCK_PAPERS_SEED);
  }

  res.json({ papers: sessionPapers });
});

// Run AI structured extraction on a specific paper
router.post('/:id/extract', async (req, res) => {
  const { id } = req.params;
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const sessionPapers = getPapers(session_id);
  const paper = sessionPapers.find(p => p.id === id);

  if (!paper) {
    return res.status(404).json({ error: 'Paper not found in session' });
  }

  try {
    const extraction = await extractPaperFields({
      title: paper.title,
      abstract: paper.abstract,
      authors: paper.authors,
      year: paper.year
    });

    // Save back to paper fields in store
    const updatedPaper = updatePaperFields(session_id, id, extraction.fields);
    
    // Attach confidence scores and source passages to the updated paper response
    updatedPaper.confidenceScores = extraction.confidenceScores;
    updatedPaper.sourcePassages = extraction.sourcePassages;

    res.json({
      success: true,
      paper: updatedPaper
    });

  } catch (err) {
    console.error('[extract error]', err);
    res.status(500).json({ error: err.message || 'AI extraction failed' });
  }
});

// Edit extracted fields manually
router.put('/:id/fields', (req, res) => {
  const { id } = req.params;
  const { session_id, fieldName, value } = req.body;

  if (!session_id || !fieldName) {
    return res.status(400).json({ error: 'session_id and fieldName are required' });
  }

  const sessionPapers = getPapers(session_id);
  const paper = sessionPapers.find(p => p.id === id);

  if (!paper) {
    return res.status(404).json({ error: 'Paper not found in session' });
  }

  // Update field value
  updatePaperFields(session_id, id, { [fieldName]: value });

  // Update confidence to manual (represented as 100 or special value, 100 is primary blue / high)
  if (!paper.confidenceScores) {
    paper.confidenceScores = {};
  }
  // We use -1 to indicate "edited by user" in backend, frontend maps this to the blue dot
  paper.confidenceScores[fieldName] = -1;

  res.json({ success: true, paper });
});

// Update paper status (include / exclude / pending)
// Handles PATCH /api/papers/:id or PATCH /api/papers/:id/screen
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { session_id, status } = req.body;

  if (!session_id || !status) {
    return res.status(400).json({ error: 'session_id and status are required' });
  }

  const paper = updatePaperStatus(session_id, id, status);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }

  res.json({ success: true, paper });
});

export default router;
