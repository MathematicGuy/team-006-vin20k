// client/src/components/LiteratureMatrix.jsx

import React, { useState } from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';

export default function LiteratureMatrix({ papers }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fields = [
    { key: 'problem', label: 'Problem' },
    { key: 'method', label: 'Method' },
    { key: 'dataset', label: 'Dataset' },
    { key: 'metric', label: 'Metric' },
    { key: 'result', label: 'Result' }
  ];

  // Filter papers that are "included" for the matrix
  const includedPapers = papers.filter(p => p.screening_status === 'included');

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      borderRadius: `${radius.panel}px`,
      overflow: 'hidden',
      marginBottom: `${spacing.lg}px`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
    }}>
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${spacing.base}px`,
          backgroundColor: colors.bgPage,
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: colors.primary }}>
            Literature Matrix ({includedPapers.length} Included Papers)
          </span>
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: colors.textMuted,
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ padding: `${spacing.base}px` }}>
          {includedPapers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '24px',
              color: colors.textLight,
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              No papers have been included in your screening list yet. Please screen papers to "Included" first.
            </div>
          ) : (
            <div style={{
              overflowX: 'auto',
              border: `1px solid ${colors.border}`,
              borderRadius: `${radius.sm}px`
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: colors.primary,
                    color: colors.bgWhite,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    <th style={{
                      padding: '12px 16px',
                      position: 'sticky',
                      top: 0,
                      backgroundColor: colors.primary,
                      width: '200px',
                      zIndex: 2
                    }}>
                      PAPER TITLE
                    </th>
                    {fields.map(f => (
                      <th key={f.key} style={{
                        padding: '12px 16px',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: colors.primary
                      }}>
                        {f.label.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {includedPapers.map((paper, idx) => (
                    <tr key={paper.id} style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: idx % 2 === 1 ? '#FAFBFC' : colors.bgWhite
                    }}>
                      {/* Title Cell */}
                      <td style={{
                        padding: '12px 16px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: colors.textDark,
                        lineHeight: '1.4',
                        maxWidth: '200px',
                        wordBreak: 'break-word'
                      }}>
                        {paper.title}
                        <div style={{ fontSize: '11px', color: colors.textMuted, fontWeight: 'normal', marginTop: '2px' }}>
                          {paper.authors[0]} ({paper.year})
                        </div>
                      </td>

                      {/* Data Cells */}
                      {fields.map(f => {
                        const value = paper.extractedFields?.[f.key];
                        const score = paper.confidenceScores?.[f.key] || 0;
                        
                        // Truncate cell text to 50 chars
                        const displayVal = value
                          ? (value.length > 50 ? value.substring(0, 50) + '...' : value)
                          : '—';

                        // Apply cell confidence color tint
                        let cellBg = 'transparent';
                        if (value) {
                          if (score === -1) cellBg = '#EFF6FF'; // manually edited tint
                          else if (score >= 80) cellBg = '#ECFDF5'; // high
                          else if (score >= 50) cellBg = '#FFFBEB'; // medium
                          else cellBg = '#FEF2F2'; // low
                        }

                        return (
                          <td
                            key={f.key}
                            style={{
                              padding: '12px 16px',
                              fontSize: '13px',
                              color: value ? colors.textDark : colors.textLight,
                              backgroundColor: cellBg,
                              lineHeight: '1.4',
                              verticalAlign: 'top',
                              transition: 'background-color 0.2s'
                            }}
                            title={value || ''}
                          >
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
