// client/src/components/MentorReviewBrief.jsx

import React from 'react';
import { colors, spacing, radius, typography, shadows } from '../styles/theme.js';

export default function MentorReviewBrief({
  sessionCriteria,
  papers,
  problemCard,
  onExportMarkdown,
  onExportJson
}) {
  const includedPapers = papers.filter(p => p.screening_status === 'included');

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      borderRadius: `${radius.panel}px`,
      padding: `${spacing.lg}px`,
      boxShadow: shadows.lg,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.base}px`,
      marginBottom: `${spacing.lg}px`
    }}>
      {/* Header */}
      <div>
        <h3 style={{ margin: '0 0 4px 0', color: colors.primary, fontSize: '18px', fontWeight: 'bold' }}>
          🎓 Mentor Review Brief Preview
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>
          This packages your current session progress and artifacts for export and review by your advisor.
        </p>
      </div>

      {/* Summary Matrix Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        backgroundColor: colors.bgPage,
        padding: '16px',
        borderRadius: `${radius.card}px`,
        border: `1px solid ${colors.border}`
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted }}>DATE RANGE</span>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.textDark, marginTop: '2px' }}>
            {sessionCriteria?.dateFrom ? `${sessionCriteria.dateFrom} - ${sessionCriteria.dateTo}` : 'Not set'}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted }}>DOMAINS</span>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.textDark, marginTop: '2px' }}>
            {sessionCriteria?.domains || 'Not set'}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted }}>INCLUDED PAPERS</span>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.textDark, marginTop: '2px' }}>
            {includedPapers.length} papers
          </div>
        </div>
      </div>

      {/* Draft Question */}
      <div>
        <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: colors.primary, fontWeight: 'bold' }}>
          Research Question
        </h4>
        <div style={{
          fontSize: '14px',
          color: colors.textDark,
          borderLeft: `3px solid ${colors.accent}`,
          paddingLeft: '12px',
          fontStyle: 'italic'
        }}>
          {problemCard?.narrowedTopic || 'Not defined yet'}
        </div>
      </div>

      {/* Problem Card Highlights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', color: colors.primary, fontWeight: 'bold' }}>
          Proposed Problem Statement
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: colors.textDark, lineHeight: '1.5' }}>
          {problemCard?.problemStatement || 'Problem card not yet finalized.'}
        </p>

        <h4 style={{ margin: '8px 0 2px 0', fontSize: '14px', color: colors.primary, fontWeight: 'bold' }}>
          Identified Literature Gap
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: colors.textDark, lineHeight: '1.5' }}>
          {problemCard?.gapDescription || 'Gap description not yet finalized.'}
        </p>
      </div>

      {/* Export Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        borderTop: `1px solid ${colors.border}`,
        paddingTop: `${spacing.base}px`,
        marginTop: '8px'
      }}>
        <button
          onClick={onExportJson}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${colors.primary}`,
            color: colors.primary,
            borderRadius: `${radius.full}px`,
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Export Research Package (JSON)
        </button>
        <button
          onClick={onExportMarkdown}
          style={{
            backgroundColor: colors.primary,
            color: colors.bgWhite,
            border: 'none',
            borderRadius: `${radius.full}px`,
            padding: '8px 24px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Export Brief (Markdown)
        </button>
      </div>
    </div>
  );
}
