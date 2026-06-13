// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useResearch } from './hooks/useResearch.js';
import { colors, spacing, radius, typography } from './styles/theme.js';

import LeftSidebar from './components/LeftSidebar.jsx';
import RightProgressSidebar from './components/RightProgressSidebar.jsx';
import ResearchPrompt from './components/ResearchPrompt.jsx';
import TaskCards from './components/TaskCards.jsx';
import AgentPreview from './components/AgentPreview.jsx';
import PaperTable from './components/PaperTable.jsx';
import LiteratureMatrix from './components/LiteratureMatrix.jsx';
import ScreeningCriteriaEditor from './components/ScreeningCriteriaEditor.jsx';
import SearchStrategyBuilder from './components/SearchStrategyBuilder.jsx';
import ResearchProblemCard from './components/ResearchProblemCard.jsx';
import MentorReviewBrief from './components/MentorReviewBrief.jsx';
import CyclePreview from './components/CyclePreview.jsx';

export default function App() {
  const route = useHashRoute();
  const research = useResearch();

  const [promptInput, setPromptInput] = useState('');
  const [sessionCriteria, setSessionCriteria] = useState({
    dateFrom: '',
    dateTo: '',
    domains: '',
    includeKeywords: '',
    excludeKeywords: ''
  });

  const handleCardClick = (templateText) => {
    setPromptInput(templateText);
  };

  const handleChipClick = (questionText) => {
    setPromptInput(questionText);
  };

  const handlePromptSubmit = (text) => {
    research.ask(text, null, sessionCriteria);
    setPromptInput('');
  };

  const handleCriteriaApply = (criteriaData) => {
    setSessionCriteria(criteriaData);
    research.saveSessionArtifact('scope', criteriaData, 2);
    // Ask LLM to advance to Step 3
    research.ask('Confirm scope and date range criteria.', 'define_problem', criteriaData);
  };

  const handleConfirmSearch = (strategy) => {
    research.saveSessionArtifact('search_strategy', strategy, 3);
    // Execute simulated search and proceed to Step 4
    research.ask(`Execute paper search with query: ${strategy.query}`, 'build_search_strategy', sessionCriteria);
  };

  const handleExportMarkdown = () => {
    const includedPapers = research.papers.filter(p => p.screening_status === 'included');
    
    let content = `# Mentor Review Brief — ${research.artifacts.find(a => a.type === 'problem_card')?.content?.narrowedTopic || 'New Research'}\n\n`;
    content += `**Date Range:** ${sessionCriteria.dateFrom} - ${sessionCriteria.dateTo}\n`;
    content += `**Domains:** ${sessionCriteria.domains || 'Not specified'}\n\n`;
    content += `## Research Question\n${research.artifacts.find(a => a.type === 'problem_card')?.content?.narrowedTopic || 'None'}\n\n`;
    content += `## Problem Statement\n${research.artifacts.find(a => a.type === 'problem_card')?.content?.problemStatement || 'None'}\n\n`;
    content += `## Literature Matrix Summary\nWe analyzed ${includedPapers.length} included papers.\n\n`;
    
    includedPapers.forEach((p, idx) => {
      content += `### [${idx+1}] ${p.title} (${p.year})\n`;
      content += `- **Problem:** ${p.extractedFields?.problem || 'N/A'}\n`;
      content += `- **Method:** ${p.extractedFields?.method || 'N/A'}\n`;
      content += `- **Result:** ${p.extractedFields?.result || 'N/A'}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mentor_Review_Brief_${research.sessionId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const data = {
      sessionId: research.sessionId,
      criteria: sessionCriteria,
      papers: research.papers.filter(p => p.screening_status === 'included'),
      problemCard: research.artifacts.find(a => a.type === 'problem_card')?.content || null
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Research_Package_${research.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut listener for Esc (stops loading)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && research.loading) {
        research.stop();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [research.loading, research.stop]);

  // Extract latest message response metadata
  const latestMessage = research.chatMessages[research.chatMessages.length - 1] || null;
  const draftProblemCard = research.artifacts.find(a => a.type === 'problem_card')?.content || null;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: colors.bgPage,
      fontFamily: typography.fontFamily,
      overflow: 'hidden'
    }}>
      {/* Left Sidebar */}
      <LeftSidebar
        currentStep={research.currentStep}
        progress={research.progress}
        libraryCount={research.library.length}
        activeRoute={route}
        onNavigateStep={research.navigateToStep}
      />

      {/* Center Action Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: colors.bgWhite,
          borderBottom: `1px solid ${colors.border}`,
          padding: `${spacing.base}px ${spacing.lg}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: colors.primary
            }}>
              {route === 'preview' ? 'Research Cycle Explorer' : route === 'papers' ? 'Literature Discovery Hub' : 'Research Workspace'}
            </h1>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '12px',
              color: colors.textMuted
            }}>
              Session: {research.sessionId}
            </p>
          </div>

          <button
            onClick={research.startNewSession}
            style={{
              backgroundColor: colors.bgWhite,
              border: `1px solid ${colors.primary}`,
              color: colors.primary,
              borderRadius: `${radius.full}px`,
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryLight}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.bgWhite}
          >
            🔄 New Research
          </button>
        </div>

        {/* Content Pane */}
        <div style={{
          padding: `${spacing.lg}px`,
          flex: 1,
          boxSizing: 'border-box'
        }}>
          
          {route === 'preview' ? (
            <CyclePreview
              currentStep={research.currentStep}
              stepsProgress={research.progress.steps}
              onNavigate={(stepNum) => {
                research.navigateToStep(stepNum);
                window.location.hash = '#/';
              }}
            />
          ) : route === 'papers' ? (
            /* =========================================================
               ROUTE: /papers (Paper Review & Extraction Screen)
               ========================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.lg}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: colors.primary, fontWeight: 'bold' }}>
                  Paper Review & Extraction
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: colors.textMuted }}>
                  Review search results, toggle inclusion status, run structured AI extractions, and inspect the matrix.
                </p>
              </div>

              <PaperTable
                papers={research.papers}
                library={research.library}
                onToggleStatus={research.togglePaperStatus}
                onRunExtraction={research.runPaperExtraction}
                onEditField={research.editPaperField}
                onToggleLibrary={research.toggleSavedLibrary}
                loading={research.loading}
              />

              <LiteratureMatrix papers={research.papers} />
            </div>
          ) : (
            /* =========================================================
               ROUTE: / (Home Workspace / Socratic Scaffolding Screen)
               ========================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.base}px`, maxWidth: '800px', margin: '0 auto' }}>
              
              {/* Back navigation warning banner */}
              {research.currentStep < research.progress.current_step && (
                <div style={{
                  backgroundColor: '#FFFBEB',
                  borderLeft: `4px solid ${colors.warning}`,
                  padding: '12px 16px',
                  borderRadius: `${radius.card}px`,
                  fontSize: '13px',
                  color: '#92400E',
                  fontWeight: '500'
                }}>
                  ⚠️ You are reviewing Step {research.currentStep}. Changes here will affect downstream steps.
                </div>
              )}

              {/* Step 2 Scope / Screening Criteria Builder */}
              {research.currentStep === 2 && (
                <ScreeningCriteriaEditor
                  initialCriteria={sessionCriteria}
                  onApply={handleCriteriaApply}
                  disabled={research.loading}
                />
              )}

              {/* Step 3 Search Strategy Builder */}
              {research.currentStep === 3 && (
                <SearchStrategyBuilder
                  initialStrategy={latestMessage?.meta}
                  onConfirmSearch={handleConfirmSearch}
                  disabled={research.loading}
                />
              )}

              {/* Step 9 Co-draft Problem statement Card */}
              {research.currentStep === 9 && (
                <ResearchProblemCard
                  problemCard={draftProblemCard || {
                    narrowedTopic: latestMessage?.meta?.narrowedTopic || '',
                    domainClassification: latestMessage?.meta?.domainClassification || 'Health Sciences',
                    problemStatement: latestMessage?.text || ''
                  }}
                  disabled={research.loading}
                />
              )}

              {/* Step 10 Mentor review Brief */}
              {research.currentStep === 10 && (
                <MentorReviewBrief
                  sessionCriteria={sessionCriteria}
                  papers={research.papers}
                  problemCard={draftProblemCard}
                  onExportMarkdown={handleExportMarkdown}
                  onExportJson={handleExportJson}
                />
              )}

              {/* Standard text input (hidden for Step 10 complete preview) */}
              {research.currentStep !== 10 && (
                <ResearchPrompt
                  currentStep={research.currentStep}
                  onSubmit={handlePromptSubmit}
                  disabled={research.loading}
                  initialValue={promptInput}
                />
              )}

              {/* Task Cards group (only visible on initial welcomes) */}
              {research.chatMessages.length <= 1 && research.currentStep === 1 && (
                <TaskCards onCardClick={handleCardClick} />
              )}

              {/* Socratic Output Agent Preview Card */}
              <AgentPreview
                loading={research.loading}
                error={research.error}
                latestMessage={latestMessage}
                onStop={research.stop}
                onRetry={research.retry}
                onRetrySimplified={research.retrySimplified}
                onChipClick={handleChipClick}
                currentStep={research.currentStep}
              />

            </div>
          )}
        </div>
      </div>

      {/* Right Progress Timeline Sidebar */}
      <RightProgressSidebar
        currentStep={research.currentStep}
        progress={research.progress}
        artifacts={research.artifacts}
        onNavigateStep={research.navigateToStep}
      />
    </div>
  );
}
