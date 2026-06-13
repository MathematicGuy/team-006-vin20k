// server/tests/server.test.js
import '../src/env.js';
process.env.NODE_ENV = 'test';

import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import researchRoute from '../src/routes/research.js';
import papersRoute from '../src/routes/papers.js';
import artifactsRoute from '../src/routes/artifacts.js';
import libraryRoute from '../src/routes/library.js';

let server;
let BASE_URL;
const TEST_SESSION_ID = 'test-session-999';

// Setup isolated server for E2E API tests
test.before(() => {
  const app = express();
  app.use(express.json());
  
  // Mount routes
  app.use('/api/research', researchRoute);
  app.use('/api/papers', papersRoute);
  app.use('/api/artifacts', artifactsRoute);
  app.use('/api/library', libraryRoute);

  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      console.log(`[QA Test] Test server running on ${BASE_URL}`);
      resolve();
    });
  });
});

// Teardown server
test.after(() => {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('[QA Test] Test server shut down cleanly');
      resolve();
    });
  });
});

// -------------------------------------------------------------
// TEST CASES
// -------------------------------------------------------------

test('1. Session Start API Endpoint', async () => {
  const res = await fetch(`${BASE_URL}/api/research/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: TEST_SESSION_ID })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.session_id, TEST_SESSION_ID);
  assert.equal(data.current_step, 1);
});

test('2. Socratic Chat Ask Endpoint (Step 1 Topic Clarification)', async () => {
  const res = await fetch(`${BASE_URL}/api/research/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      prompt: 'How does sleep duration affect academic GPA in university students?',
      step: 'clarify_topic'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  
  assert.ok(data.response);
  assert.equal(data.meta.step, 'clarify_topic');
  assert.ok(data.meta.confidence > 0);
  assert.ok(Array.isArray(data.meta.citations));
  assert.ok(Array.isArray(data.meta.follow_up_questions));
});

test('3. Progress Tracker Endpoint', async () => {
  const res = await fetch(`${BASE_URL}/api/research/progress?session_id=${TEST_SESSION_ID}`);

  assert.equal(res.status, 200);
  const data = await res.json();

  assert.equal(data.current_step, 1);
  assert.ok(data.overallProgress >= 0);
  assert.equal(data.steps.length, 10);
  assert.equal(data.qualityIndicators.papersFound, 0); // Not loaded yet
});

test('4. Papers Database Listing and Seeding', async () => {
  const res = await fetch(`${BASE_URL}/api/papers?session_id=${TEST_SESSION_ID}`);

  assert.equal(res.status, 200);
  const data = await res.json();

  assert.ok(Array.isArray(data.papers));
  assert.equal(data.papers.length, 8); // Seeding returns our 8 mock papers
  assert.equal(data.papers[0].id, 'paper-001');
  assert.equal(data.papers[0].screening_status, 'pending');
});

test('5. Update Paper Screening Status (Include/Exclude)', async () => {
  // Update status to 'included'
  const patchRes = await fetch(`${BASE_URL}/api/papers/paper-001`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      status: 'included'
    })
  });

  assert.equal(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.equal(patchData.success, true);
  assert.equal(patchData.paper.screening_status, 'included');

  // Verify list reflects change
  const listRes = await fetch(`${BASE_URL}/api/papers?session_id=${TEST_SESSION_ID}`);
  const listData = await listRes.json();
  const paper001 = listData.papers.find(p => p.id === 'paper-001');
  assert.equal(paper001.screening_status, 'included');
});

test('6. AI Structured Extraction Endpoint', async () => {
  const extractRes = await fetch(`${BASE_URL}/api/papers/paper-001/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: TEST_SESSION_ID })
  });

  assert.equal(extractRes.status, 200);
  const extractData = await extractRes.json();
  assert.equal(extractData.success, true);
  
  const fields = extractData.paper.extractedFields;
  assert.ok(fields);
  assert.ok(fields.problem);
  assert.ok(fields.method);
  assert.ok(fields.result);
  assert.ok(fields.sourceCitation);
});

test('7. Manual Field Edits & Confidence Reversion', async () => {
  const editRes = await fetch(`${BASE_URL}/api/papers/paper-001/fields`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      fieldName: 'method',
      value: 'Modified Method Value'
    })
  });

  assert.equal(editRes.status, 200);
  const editData = await editRes.json();
  assert.equal(editData.success, true);
  assert.equal(editData.paper.extractedFields.method, 'Modified Method Value');
  assert.equal(editData.paper.confidenceScores.method, -1); // -1 maps to blue user-edited badge
});

test('8. Paper Library Bookmark Actions', async () => {
  // Bookmark paper
  const addRes = await fetch(`${BASE_URL}/api/library/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      paperId: 'paper-001'
    })
  });
  assert.equal(addRes.status, 200);

  // List bookmark
  const listRes = await fetch(`${BASE_URL}/api/library/list?session_id=${TEST_SESSION_ID}`);
  const listData = await listRes.json();
  assert.ok(listData.library.includes('paper-001'));

  // Remove bookmark
  const removeRes = await fetch(`${BASE_URL}/api/library/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      paperId: 'paper-001'
    })
  });
  assert.equal(removeRes.status, 200);
  const removeData = await removeRes.json();
  assert.equal(removeData.library.includes('paper-001'), false);
});

test('9. Artifacts Management & Retrieval', async () => {
  const mockCard = {
    narrowedTopic: 'Topic sleep duration',
    problemStatement: 'Problem statement context',
    gapDescription: 'Gap in literature',
    proposedDirection: 'Direction proposed'
  };

  const saveRes = await fetch(`${BASE_URL}/api/artifacts/synthesis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: TEST_SESSION_ID,
      problemCard: mockCard
    })
  });
  assert.equal(saveRes.status, 200);

  // Retrieve artifacts
  const listRes = await fetch(`${BASE_URL}/api/artifacts?session_id=${TEST_SESSION_ID}`);
  const listData = await listRes.json();
  
  const savedCard = listData.artifacts.find(a => a.type === 'problem_card');
  assert.ok(savedCard);
  assert.equal(savedCard.content.narrowedTopic, 'Topic sleep duration');
});

test('10. API Error Validation (Clarify endpoint missing session_id)', async () => {
  const res = await fetch(`${BASE_URL}/api/research/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Missing session ID',
      step: 'clarify_topic'
    })
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});
