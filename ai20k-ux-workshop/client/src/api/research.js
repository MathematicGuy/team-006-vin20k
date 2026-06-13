// client/src/api/research.js

async function parseOrThrow(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

// Start research session
export async function startResearch(session_id) {
  const res = await fetch('/api/research/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id })
  });
  return parseOrThrow(res);
}

// Socratic chat query
export async function askResearch(prompt, step, context, session_id, signal) {
  const res = await fetch('/api/research/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, step, context, session_id }),
    signal
  });
  return parseOrThrow(res);
}

// Fetch papers for the session
export async function fetchPapers(session_id) {
  const res = await fetch(`/api/papers?session_id=${encodeURIComponent(session_id)}`);
  return parseOrThrow(res);
}

// Trigger structured AI extraction on a paper
export async function extractPaperFields({ session_id, paperId }) {
  const res = await fetch(`/api/papers/${encodeURIComponent(paperId)}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id })
  });
  return parseOrThrow(res);
}

// Update an individual field value on a paper (manual edit)
export async function savePaperFields({ session_id, paperId, fieldName, value }) {
  const res = await fetch(`/api/papers/${encodeURIComponent(paperId)}/fields`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, fieldName, value })
  });
  return parseOrThrow(res);
}

// Update paper screening status (Include / Exclude / Pending)
export async function updatePaperStatus({ session_id, paperId, status }) {
  const res = await fetch(`/api/papers/${encodeURIComponent(paperId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, status })
  });
  return parseOrThrow(res);
}

// Bookmark a paper (save to library)
export async function saveLibraryPaper({ session_id, paperId }) {
  const res = await fetch('/api/library/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, paperId })
  });
  return parseOrThrow(res);
}

// Remove bookmark (remove from library)
export async function removeLibraryPaper({ session_id, paperId }) {
  const res = await fetch('/api/library/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, paperId })
  });
  return parseOrThrow(res);
}

// Fetch bookmark list
export async function fetchLibraryList(session_id) {
  const res = await fetch(`/api/library/list?session_id=${encodeURIComponent(session_id)}`);
  return parseOrThrow(res);
}

// Fetch step-by-step progress and quality metrics
export async function fetchProgress(session_id) {
  const res = await fetch(`/api/research/progress?session_id=${encodeURIComponent(session_id)}`);
  return parseOrThrow(res);
}

// Save a session artifact
export async function saveArtifact({ session_id, type, content, step_number }) {
  const res = await fetch('/api/artifacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, type, content, step_number })
  });
  return parseOrThrow(res);
}

// Fetch all saved session artifacts
export async function fetchArtifacts(session_id) {
  const res = await fetch(`/api/artifacts?session_id=${encodeURIComponent(session_id)}`);
  return parseOrThrow(res);
}
