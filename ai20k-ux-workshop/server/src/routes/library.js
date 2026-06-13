import express from 'express';
import { addToLibrary, getLibrary, removeFromLibrary } from '../store.js';

const router = express.Router();

// Add paper to library
router.post('/add', (req, res) => {
  const { session_id, paperId } = req.body;
  if (!session_id || !paperId) {
    return res.status(400).json({ error: 'session_id and paperId are required' });
  }

  const library = addToLibrary(session_id, paperId);
  res.json({ success: true, library });
});

// Get library saved papers
router.get('/list', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const library = getLibrary(session_id);
  res.json({ library });
});

// Remove paper from library
router.post('/remove', (req, res) => {
  const { session_id, paperId } = req.body;
  if (!session_id || !paperId) {
    return res.status(400).json({ error: 'session_id and paperId are required' });
  }

  const library = removeFromLibrary(session_id, paperId);
  res.json({ success: true, library });
});

export default router;
