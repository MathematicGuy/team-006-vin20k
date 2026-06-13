// client/src/components/TaskCards.jsx

import React from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';

export default function TaskCards({ onCardClick }) {
  const groups = [
    {
      title: 'I want to...',
      color: colors.primary,
      cards: [
        { title: 'Clarify my topic', desc: 'Socratic narrowing of your research area', template: 'I want to clarify my research topic about ' },
        { title: 'Search for papers', desc: 'Identify academic papers and literature sources', template: 'I want to search for papers about ' },
        { title: 'Screen papers', desc: 'Apply inclusion/exclusion criteria to papers', template: 'I want to screen retrieved papers regarding ' },
        { title: 'Compare papers', desc: 'Analyze methods and metrics side-by-side', template: 'I want to compare research papers on ' },
        { title: 'Find research gap', desc: 'Pinpoint limitations in existing studies', template: 'I want to analyze research gaps in ' }
      ]
    },
    {
      title: 'Use...',
      color: colors.accent,
      cards: [
        { title: 'My Library', desc: 'Query your bookmarked papers', template: 'I want to search my saved library papers for ' },
        { title: 'PubMed', desc: 'Retrieve biomedical and life sciences research', template: 'I want to search PubMed for ' },
        { title: 'arXiv', desc: 'Explore CS, physics, and math preprints', template: 'I want to search arXiv for ' },
        { title: 'Google Scholar', desc: 'Broad search across academic literature', template: 'I want to search Google Scholar for ' },
        { title: 'Semantic Scholar', desc: 'AI-backed citation impact and analysis', template: 'I want to search Semantic Scholar for ' }
      ]
    },
    {
      title: 'Make...',
      color: colors.success,
      cards: [
        { title: 'Literature Matrix', desc: 'Build comparative variables tables', template: 'I want to generate a Literature Matrix comparing papers in ' },
        { title: 'Research Problem Card', desc: 'Draft structured problem statements', template: 'I want to make a Research Problem Card focusing on ' },
        { title: 'Mentor Review Brief', desc: 'Compile a progress summary for your advisor', template: 'I want to prepare a Mentor Review Brief summarizing ' }
      ]
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: `${spacing.base}px`,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: `${spacing.lg}px`
    }}>
      {groups.map(group => (
        <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.sm}px` }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: group.color,
            borderBottom: `2px solid ${group.color}`,
            paddingBottom: '4px',
            marginBottom: '4px'
          }}>
            {group.title}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.sm}px` }}>
            {group.cards.map(card => (
              <div
                key={card.title}
                onClick={() => onCardClick(card.template)}
                style={{
                  backgroundColor: colors.bgWhite,
                  border: `1px solid ${colors.border}`,
                  borderRadius: `${radius.card}px`,
                  padding: `${spacing.base}px`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                }}
              >
                {/* Icon Circle */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: colors.bgPage,
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  {card.title.charAt(0)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: colors.textDark
                  }}>
                    {card.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: colors.textMuted,
                    lineHeight: '1.3'
                  }}>
                    {card.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
