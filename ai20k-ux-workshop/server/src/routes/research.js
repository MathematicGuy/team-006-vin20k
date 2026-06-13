import express from 'express';
import { getOrCreateSession, updateSessionStep, addHistory, getHistory, updateSessionCriteria, getPapers } from '../store.js';
import { askResearch } from '../llmService.js';
import { RESEARCH_STEPS } from '../researchSteps.js';

const router = express.Router();

// Start a new session
router.post('/start', (req, res) => {
  const { session_id } = req.body;
  const session = getOrCreateSession(session_id);
  res.json({
    session_id: session.id,
    current_step: session.current_step,
    criteria: session.criteria,
    title: session.title
  });
});

// Main Socratic chat endpoint
router.post('/ask', async (req, res) => {
  const { prompt, step, context, session_id } = req.body;
  
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const session = getOrCreateSession(session_id);
  const currentStep = step || session.current_step || 'clarify_topic';

  // Update criteria if passed in context
  if (context) {
    updateSessionCriteria(session_id, context);
  }

  // Get conversation history
  const history = getHistory(session_id);

  try {
    // Add user message to history
    addHistory(session_id, { role: 'user', text: prompt });

    // Call LLM hinge service
    const result = await askResearch({
      prompt,
      currentStep,
      history,
      criteria: session.criteria
    });

    // Add assistant response to history
    addHistory(session_id, {
      role: 'assistant',
      text: result.text,
      meta: {
        step: result.step,
        suggestedNext: result.suggestedNext,
        confidence: result.confidence,
        citations: result.citations,
        follow_up_questions: result.follow_up_questions
      }
    });

    // Update session step if LLM suggests a valid step change or progress
    // Wait, let's keep session's current step in sync
    const matchingStep = RESEARCH_STEPS.find(s => s.key === result.step);
    if (matchingStep) {
      updateSessionStep(session_id, matchingStep.step_number);
    }

    res.json({
      response: result.text,
      meta: {
        step: result.step,
        suggestedNext: result.suggestedNext,
        citations: result.citations,
        confidence: result.confidence,
        follow_up_questions: result.follow_up_questions
      }
    });

  } catch (err) {
    console.error('[research.js error]', err);
    res.status(500).json({ error: err.message || 'LLM error occurred' });
  }
});

// Retrieve progress timeline and quality indicators
router.get('/progress', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const session = getOrCreateSession(session_id);
  const allPapers = getPapers(session_id);
  const includedPapers = allPapers.filter(p => p.screening_status === 'included');
  const extractedCount = includedPapers.filter(p => p.extractedFields !== null).length;

  // Compile step list with status
  const stepsProgress = RESEARCH_STEPS.map(s => {
    let status = 'upcoming';
    if (s.step_number < session.current_step) {
      status = 'completed';
    } else if (s.step_number === session.current_step) {
      status = 'current';
    }
    return {
      step_number: s.step_number,
      key: s.key,
      name: s.name,
      status
    };
  });

  // Simple overall progress percentage calculation
  const progressPercent = Math.round(((session.current_step - 1) / RESEARCH_STEPS.length) * 100);

  // Derive research question clarity from LLM history if possible, otherwise default to Medium
  let questionClarity = 'Low';
  if (session.current_step > 1) questionClarity = 'Medium';
  if (session.current_step > 2) questionClarity = 'High';

  res.json({
    current_step: session.current_step,
    overallProgress: progressPercent,
    steps: stepsProgress,
    qualityIndicators: {
      papersFound: allPapers.length,
      papersScreened: allPapers.filter(p => p.screening_status !== 'pending').length,
      papersIncluded: includedPapers.length,
      fieldsExtracted: extractedCount,
      questionClarity
    }
  });
});

export default router;
