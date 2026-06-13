// client/src/components/ResearchProblemCard.jsx

import React from 'react';
import { colors, spacing, radius, typography, shadows } from '../styles/theme.js';

export default function ResearchProblemCard({ problemCard, onSave, disabled }) {
  // Safe defaults
  const cardData = problemCard || {
    narrowedTopic: 'No topic defined yet',
    domainClassification: 'General',
    problemStatement: '',
    significance: '',
    gapDescription: '',
    proposedDirection: '',
    citations: []
  };

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      borderRadius: `${radius.panel}px`,
      padding: `${spacing.lg}px`,
      boxShadow: shadows.md,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.base}px`,
      marginBottom: `${spacing.lg}px`
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{
            backgroundColor: colors.primaryLight,
            color: colors.primary,
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '4px 8px',
            borderRadius: `${radius.sm}px`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {cardData.domainClassification || 'General'}
          </span>
          <h3 style={{ margin: '8px 0 0 0', color: colors.primary, fontSize: '18px', fontWeight: 'bold' }}>
            📋 Research Problem Card
          </h3>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: `${spacing.base}px` }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase' }}>
          Narrowed Research Topic
        </h4>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: colors.textDark, lineHeight: '1.4' }}>
          {cardData.narrowedTopic}
        </div>
      </div>

      {/* Grid of details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: `${spacing.base}px` }}>
        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.primary, fontWeight: 'bold' }}>
            1. Problem Statement
          </h4>
          <div style={{
            backgroundColor: colors.bgPage,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.sm}px`,
            padding: `${spacing.md}px`,
            fontSize: '14px',
            color: colors.textDark,
            lineHeight: '1.5',
            minHeight: '50px'
          }}>
            {cardData.problemStatement || 'Explain what specific issue in this topic needs to be investigated...'}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.primary, fontWeight: 'bold' }}>
            2. Significance & Context
          </h4>
          <div style={{
            backgroundColor: colors.bgPage,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.sm}px`,
            padding: `${spacing.md}px`,
            fontSize: '14px',
            color: colors.textDark,
            lineHeight: '1.5',
            minHeight: '50px'
          }}>
            {cardData.significance || 'Why does this problem matter? Who is affected?'}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.primary, fontWeight: 'bold' }}>
            3. Identified Literature Gap
          </h4>
          <div style={{
            backgroundColor: colors.bgPage,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.sm}px`,
            padding: `${spacing.md}px`,
            fontSize: '14px',
            color: colors.textDark,
            lineHeight: '1.5',
            minHeight: '50px'
          }}>
            {cardData.gapDescription || 'What is missing in existing studies? (Derived from literature matrix)'}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.primary, fontWeight: 'bold' }}>
            4. Proposed Research Direction
          </h4>
          <div style={{
            backgroundColor: colors.bgPage,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.sm}px`,
            padding: `${spacing.md}px`,
            fontSize: '14px',
            color: colors.textDark,
            lineHeight: '1.5',
            minHeight: '50px'
          }}>
            {cardData.proposedDirection || 'How do you plan to address the gap in your proposed research?'}
          </div>
        </div>
      </div>

      {cardData.citations && cardData.citations.length > 0 && (
        <div style={{ marginTop: `${spacing.sm}px` }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase' }}>
            Supporting Citations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {cardData.citations.map((cite, idx) => (
              <div key={idx} style={{ fontSize: '13px', color: colors.textDark }}>
                📌 <em>{cite}</em>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
