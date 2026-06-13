import { nanoid } from 'nanoid';
import { RESEARCH_STEPS } from './researchSteps.js';

// In-memory collections
const sessions = new Map();
const papers = new Map(); // session_id -> array of papers
const artifacts = new Map(); // session_id -> array of artifacts
const savedLibraries = new Map(); // session_id -> Set of paper_ids
const chatHistories = new Map(); // session_id -> array of messages { role, text, meta }

export function getOrCreateSession(sessionId) {
  const id = sessionId || nanoid(8);
  if (!sessions.has(id)) {
    sessions.set(id, {
      id,
      title: 'New Research Session',
      current_step: 1,
      status: 'active',
      criteria: {
        dateFrom: '',
        dateTo: '',
        domains: '',
        includeKeywords: '',
        excludeKeywords: ''
      },
      search_strategy: null,
      gap_analysis: null,
      problem_card: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    papers.set(id, []);
    artifacts.set(id, []);
    savedLibraries.set(id, new Set());
    chatHistories.set(id, []);
  }
  return sessions.get(id);
}

export function updateSessionStep(sessionId, stepNum) {
  const session = getOrCreateSession(sessionId);
  session.current_step = Math.max(1, Math.min(10, stepNum));
  session.updated_at = new Date().toISOString();
  return session;
}

export function updateSessionCriteria(sessionId, criteria) {
  const session = getOrCreateSession(sessionId);
  session.criteria = { ...session.criteria, ...criteria };
  session.updated_at = new Date().toISOString();
  return session;
}

export function updateSessionSearchStrategy(sessionId, strategy) {
  const session = getOrCreateSession(sessionId);
  session.search_strategy = strategy;
  session.updated_at = new Date().toISOString();
  return session;
}

export function getHistory(sessionId) {
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, []);
  }
  return chatHistories.get(sessionId);
}

export function addHistory(sessionId, { role, text, meta }) {
  const history = getHistory(sessionId);
  const msg = {
    id: nanoid(8),
    role,
    text,
    meta: meta || null,
    created_at: new Date().toISOString()
  };
  history.push(msg);
  // Keep history reasonable (e.g. 12 turns)
  if (history.length > 24) {
    chatHistories.set(sessionId, history.slice(-24));
  }
  return msg;
}

export function clearHistory(sessionId) {
  chatHistories.set(sessionId, []);
}

export function getPapers(sessionId) {
  getOrCreateSession(sessionId);
  return papers.get(sessionId) || [];
}

export function addPapers(sessionId, papersList) {
  getOrCreateSession(sessionId);
  const currentPapers = papers.get(sessionId) || [];
  const added = [];
  
  for (const p of papersList) {
    const paper = {
      id: p.id || nanoid(8),
      session_id: sessionId,
      source: p.source || 'Simulated Database',
      title: p.title || 'Untitled Paper',
      authors: Array.isArray(p.authors) ? p.authors : [p.authors || 'Unknown Author'],
      year: parseInt(p.year) || new Date().getFullYear(),
      abstract: p.abstract || '',
      url: p.url || '',
      screening_status: p.screening_status || 'pending', // pending | included | excluded
      relevance_score: typeof p.relevance_score === 'number' ? p.relevance_score : 0.5,
      extractedFields: p.extractedFields || null, // will hold the 9 fields when extracted
      added_at: new Date().toISOString()
    };
    currentPapers.push(paper);
    added.push(paper);
  }
  
  papers.set(sessionId, currentPapers);
  return added;
}

export function updatePaperStatus(sessionId, paperId, status) {
  const currentPapers = getPapers(sessionId);
  const paper = currentPapers.find(p => p.id === paperId);
  if (paper) {
    paper.screening_status = status; // pending | included | excluded
  }
  return paper;
}

export function updatePaperFields(sessionId, paperId, fields) {
  const currentPapers = getPapers(sessionId);
  const paper = currentPapers.find(p => p.id === paperId);
  if (paper) {
    paper.extractedFields = {
      ...(paper.extractedFields || {}),
      ...fields
    };
  }
  return paper;
}

export function getLibrary(sessionId) {
  getOrCreateSession(sessionId);
  return Array.from(savedLibraries.get(sessionId) || []);
}

export function addToLibrary(sessionId, paperId) {
  getOrCreateSession(sessionId);
  const lib = savedLibraries.get(sessionId);
  if (lib) {
    lib.add(paperId);
  }
  return Array.from(lib || []);
}

export function removeFromLibrary(sessionId, paperId) {
  getOrCreateSession(sessionId);
  const lib = savedLibraries.get(sessionId);
  if (lib) {
    lib.delete(paperId);
  }
  return Array.from(lib || []);
}

export function getArtifacts(sessionId) {
  getOrCreateSession(sessionId);
  return artifacts.get(sessionId) || [];
}

export function saveArtifact(sessionId, { type, content, step_number }) {
  getOrCreateSession(sessionId);
  const currentArtifacts = artifacts.get(sessionId) || [];
  
  // Update if exists, otherwise add
  const existingIdx = currentArtifacts.findIndex(a => a.type === type);
  const artifact = {
    id: existingIdx !== -1 ? currentArtifacts[existingIdx].id : nanoid(8),
    session_id: sessionId,
    type,
    content,
    step_number: step_number || 1,
    created_at: existingIdx !== -1 ? currentArtifacts[existingIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    currentArtifacts[existingIdx] = artifact;
  } else {
    currentArtifacts.push(artifact);
  }
  
  artifacts.set(sessionId, currentArtifacts);
  
  // Sync back to session shortcut fields if applicable
  const session = getOrCreateSession(sessionId);
  if (type === 'scope') session.criteria = content;
  if (type === 'search_strategy') session.search_strategy = content;
  if (type === 'gap_hypothesis') session.gap_analysis = content;
  if (type === 'problem_card') session.problem_card = content;

  return artifact;
}

export function resetSession(sessionId) {
  if (sessionId) {
    sessions.delete(sessionId);
    papers.delete(sessionId);
    artifacts.delete(sessionId);
    savedLibraries.delete(sessionId);
    chatHistories.delete(sessionId);
  }
}

export const _debug = { sessions, papers, artifacts, savedLibraries, chatHistories };
