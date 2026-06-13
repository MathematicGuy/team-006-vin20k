// client/src/hooks/useResearch.js

import { useState, useEffect, useRef, useCallback } from 'react';
import * as api from '../api/research.js';

function generateSessionId() {
  return 'sess-' + Math.random().toString(36).slice(2, 10);
}

export function useResearch() {
  const [sessionId, setSessionId] = useState(() => {
    const cached = localStorage.getItem('research_session_id');
    if (cached) return cached;
    const newId = generateSessionId();
    localStorage.setItem('research_session_id', newId);
    return newId;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [papers, setPapers] = useState([]);
  const [library, setLibrary] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [progress, setProgress] = useState({
    current_step: 1,
    overallProgress: 0,
    steps: [],
    qualityIndicators: {
      papersFound: 0,
      papersScreened: 0,
      papersIncluded: 0,
      fieldsExtracted: 0,
      questionClarity: 'Low'
    }
  });

  const abortControllerRef = useRef(null);
  const lastPromptRef = useRef('');

  // Start/Initialize session on server
  const initializeSession = useCallback(async (sid) => {
    try {
      const data = await api.startResearch(sid);
      setCurrentStep(data.current_step);
      fetchProgressInfo(sid);
      fetchPapersList(sid);
      fetchLibrary(sid);
      fetchArtifactsList(sid);
      
      // Seed initial welcoming message if empty
      setChatMessages([
        {
          role: 'assistant',
          text: "Welcome to your guided research journey. What topic or research question are you exploring today?\n\n*For example: 'How does sleep duration affect academic performance in university students?'*",
          meta: {
            step: 'clarify_topic',
            suggestedNext: 'define_problem',
            confidence: 100,
            citations: [],
            follow_up_questions: ['Explore a research topic', 'A specific paper or resource', 'A literature review summary']
          }
        }
      ]);
    } catch (err) {
      setError('Failed to initialize session: ' + err.message);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      initializeSession(sessionId);
    }
  }, [sessionId, initializeSession]);

  const fetchProgressInfo = async (sid = sessionId) => {
    try {
      const data = await api.fetchProgress(sid);
      setProgress(data);
      setCurrentStep(data.current_step);
    } catch (err) {
      console.warn('Progress fetch failed:', err.message);
    }
  };

  const fetchPapersList = async (sid = sessionId) => {
    try {
      const data = await api.fetchPapers(sid);
      setPapers(data.papers || []);
    } catch (err) {
      console.warn('Papers fetch failed:', err.message);
    }
  };

  const fetchLibrary = async (sid = sessionId) => {
    try {
      const data = await api.fetchLibraryList(sid);
      setLibrary(data.library || []);
    } catch (err) {
      console.warn('Library fetch failed:', err.message);
    }
  };

  const fetchArtifactsList = async (sid = sessionId) => {
    try {
      const data = await api.fetchArtifacts(sid);
      setArtifacts(data.artifacts || []);
    } catch (err) {
      console.warn('Artifacts fetch failed:', err.message);
    }
  };

  // Socratic Ask logic
  const ask = useCallback(async (promptText, stepOverride = null, criteriaOverride = null) => {
    const trimmed = (promptText || '').trim();
    if (!trimmed || loading) return;

    setError(null);
    lastPromptRef.current = trimmed;
    
    // Add User Message to local state
    setChatMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const activeStepKey = stepOverride || progress.steps[currentStep - 1]?.key || 'clarify_topic';

    try {
      const data = await api.askResearch(
        trimmed,
        activeStepKey,
        criteriaOverride,
        sessionId,
        controller.signal
      );

      // Add Agent Message to local state
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.response,
          meta: data.meta
        }
      ]);

      // Sync progress indicators and state
      await fetchProgressInfo(sessionId);
      await fetchArtifactsList(sessionId);
      await fetchPapersList(sessionId);

    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: '⚠️ *Operation stopped by user.*',
            meta: {
              step: activeStepKey,
              suggestedNext: activeStepKey,
              confidence: 100,
              citations: [],
              follow_up_questions: []
            }
          }
        ]);
      } else {
        setError(err.message || 'The research agent could not process your request');
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, [sessionId, loading, currentStep, progress]);

  // Abort operation
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Retry last query
  const retry = useCallback(() => {
    if (lastPromptRef.current) {
      ask(lastPromptRef.current);
    }
  }, [ask]);

  // Simplify and Retry (Recovery logic)
  const retrySimplified = useCallback(() => {
    if (lastPromptRef.current) {
      const simplified = lastPromptRef.current.slice(0, 150) + '... (simplified)';
      ask(simplified);
    }
  }, [ask]);

  // Start new research session
  const startNewSession = useCallback(() => {
    const newId = generateSessionId();
    localStorage.setItem('research_session_id', newId);
    setChatMessages([]);
    setPapers([]);
    setLibrary([]);
    setArtifacts([]);
    setError(null);
    setSessionId(newId);
  }, []);

  // Set current step manually (control logic)
  const navigateToStep = useCallback(async (stepNum) => {
    try {
      // Advance step on server
      const res = await fetch(`/api/research/progress?session_id=${sessionId}`);
      const data = await res.json();
      
      // Ensure we cannot skip uncompleted steps (though we can always go back)
      if (stepNum <= data.current_step + 1) {
        setCurrentStep(stepNum);
        // We can hit update step endpoint if needed
        await fetch(`/api/research/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }, [sessionId]);

  // Paper table status switcher
  const togglePaperStatus = useCallback(async (paperId, status) => {
    try {
      await api.updatePaperStatus({ session_id: sessionId, paperId, status });
      await fetchPapersList(sessionId);
      await fetchProgressInfo(sessionId);
    } catch (err) {
      setError('Failed to update paper status: ' + err.message);
    }
  }, [sessionId]);

  // Run AI Structured Extraction
  const runPaperExtraction = useCallback(async (paperId) => {
    try {
      await api.extractPaperFields({ session_id: sessionId, paperId });
      await fetchPapersList(sessionId);
      await fetchProgressInfo(sessionId);
    } catch (err) {
      // Propagate error to trigger inline failure card
      throw err;
    }
  }, [sessionId]);

  // Manual edits to extracted fields
  const editPaperField = useCallback(async (paperId, fieldName, value) => {
    try {
      await api.savePaperFields({ session_id: sessionId, paperId, fieldName, value });
      await fetchPapersList(sessionId);
    } catch (err) {
      setError('Failed to save manual edits: ' + err.message);
    }
  }, [sessionId]);

  // Saved Library (Bookmark)
  const toggleSavedLibrary = useCallback(async (paperId) => {
    const isSaved = library.includes(paperId);
    try {
      if (isSaved) {
        await api.removeLibraryPaper({ session_id: sessionId, paperId });
      } else {
        await api.saveLibraryPaper({ session_id: sessionId, paperId });
      }
      await fetchLibrary(sessionId);
    } catch (err) {
      setError('Failed to update library: ' + err.message);
    }
  }, [sessionId, library]);

  // Save artifact
  const saveSessionArtifact = useCallback(async (type, content, stepNum) => {
    try {
      await api.saveArtifact({ session_id: sessionId, type, content, step_number: stepNum });
      await fetchArtifactsList(sessionId);
      await fetchProgressInfo(sessionId);
    } catch (err) {
      setError('Failed to save artifact: ' + err.message);
    }
  }, [sessionId]);

  return {
    sessionId,
    currentStep,
    loading,
    error,
    chatMessages,
    papers,
    library,
    artifacts,
    progress,
    ask,
    stop,
    retry,
    retrySimplified,
    startNewSession,
    navigateToStep,
    togglePaperStatus,
    runPaperExtraction,
    editPaperField,
    toggleSavedLibrary,
    saveSessionArtifact,
    refetchPapers: () => fetchPapersList(sessionId),
    clearError: () => setError(null)
  };
}
