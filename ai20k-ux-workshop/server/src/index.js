import './env.js';

import express from 'express';
import cors from 'cors';
import researchRoute from './routes/research.js';
import papersRoute from './routes/papers.js';
import artifactsRoute from './routes/artifacts.js';
import libraryRoute from './routes/library.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount routes
app.use('/api/research', researchRoute);
app.use('/api/papers', papersRoute);
app.use('/api/artifacts', artifactsRoute);
app.use('/api/library', libraryRoute);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ error: err.message || 'Server error occurred' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Research Navigator server running on http://localhost:${PORT}`);
});
