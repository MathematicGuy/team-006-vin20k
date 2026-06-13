import express from 'express';
import { saveArtifact, getArtifacts } from '../store.js';

const router = express.Router();

// Get artifacts for a session
router.get('/', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const sessionArtifacts = getArtifacts(session_id);
  res.json({ artifacts: sessionArtifacts });
});

// Get artifacts for a session by URL param
router.get('/:session_id', (req, res) => {
  const { session_id } = req.params;
  const sessionArtifacts = getArtifacts(session_id);
  res.json({ artifacts: sessionArtifacts });
});

// Save a generic artifact
router.post('/', (req, res) => {
  const { session_id, type, content, step_number } = req.body;
  if (!session_id || !type || !content) {
    return res.status(400).json({ error: 'session_id, type, and content are required' });
  }

  const artifact = saveArtifact(session_id, { type, content, step_number });
  res.json({ success: true, artifact });
});

// Specific matrix endpoint
router.post('/matrix', (req, res) => {
  const { session_id, matrix } = req.body;
  if (!session_id || !matrix) {
    return res.status(400).json({ error: 'session_id and matrix are required' });
  }

  const artifact = saveArtifact(session_id, {
    type: 'literature_matrix',
    content: matrix,
    step_number: 8
  });
  res.json({ success: true, artifact });
});

// Specific synthesis / problem-card endpoint
router.post('/synthesis', (req, res) => {
  const { session_id, problemCard } = req.body;
  if (!session_id || !problemCard) {
    return res.status(400).json({ error: 'session_id and problemCard are required' });
  }

  const artifact = saveArtifact(session_id, {
    type: 'problem_card',
    content: problemCard,
    step_number: 9
  });
  res.json({ success: true, artifact });
});

export default router;
