// client/src/components/PaperTable.jsx

import React, { useState } from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';
import ExtractionView from './ExtractionView.jsx';

export default function PaperTable({
  papers,
  library,
  onToggleStatus,
  onRunExtraction,
  onEditField,
  onToggleLibrary,
  loading
}) {
  const [expandedPaperId, setExpandedPaperId] = useState(null);
  const [viewingExtractionId, setViewingExtractionId] = useState(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [compareMode, setCompareMode] = useState(false);

  // Client-side filtering state
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [relevanceMin, setRelevanceMin] = useState('Any');
  const [searchText, setSearchText] = useState('');

  // Reset detail panel on filters change
  const handleFilterChange = (updater) => {
    updater();
    setExpandedPaperId(null);
    setViewingExtractionId(null);
  };

  // Filter papers
  const filteredPapers = papers.filter(p => {
    // Status Filter
    if (statusFilter !== 'All') {
      const matchStatus = p.screening_status.toLowerCase() === statusFilter.toLowerCase();
      if (!matchStatus) return false;
    }
    // Year range
    if (yearMin && p.year < parseInt(yearMin)) return false;
    if (yearMax && p.year > parseInt(yearMax)) return false;
    // Relevance
    if (relevanceMin !== 'Any') {
      const threshold = parseFloat(relevanceMin) / 100;
      if (p.relevance_score < threshold) return false;
    }
    // Search text
    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(term);
      const matchAuthors = p.authors.some(a => a.toLowerCase().includes(term));
      if (!matchTitle && !matchAuthors) return false;
    }
    return true;
  });

  const handleRowClick = (paperId, e) => {
    // Prevent expanding if clicking interactive elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.getAttribute('data-clickable')) {
      return;
    }
    setExpandedPaperId(expandedPaperId === paperId ? null : paperId);
    setViewingExtractionId(null); // close extraction when toggling row
  };

  const handleCheckboxToggle = (paperId) => {
    setSelectedPaperIds(prev =>
      prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
    );
  };

  const handleClearSelection = () => {
    setSelectedPaperIds([]);
  };

  const cycleStatus = (paper, e) => {
    e.stopPropagation();
    const cycle = {
      pending: 'included',
      included: 'excluded',
      excluded: 'pending'
    };
    const nextStatus = cycle[paper.screening_status] || 'pending';
    onToggleStatus(paper.id, nextStatus);
  };

  // Compare layout fields
  const fieldsKeys = [
    { key: 'problem', label: 'Problem' },
    { key: 'method', label: 'Method' },
    { key: 'dataset', label: 'Dataset' },
    { key: 'metric', label: 'Metric' },
    { key: 'result', label: 'Result' },
    { key: 'limitation', label: 'Limitation' },
    { key: 'futureWork', label: 'Future Work' },
    { key: 'relevance', label: 'Relevance' },
    { key: 'sourceCitation', label: 'Citation' }
  ];

  const comparedPapers = papers.filter(p => selectedPaperIds.includes(p.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.base}px`, width: '100%' }}>
      
      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: colors.bgWhite,
        border: `1px solid ${colors.border}`,
        borderRadius: `${radius.card}px`,
        padding: `${spacing.md}px`,
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search titles or authors..."
          style={{
            minWidth: '200px',
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.sm}px`,
            padding: '6px 12px',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        {/* Status Chips */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Included', 'Excluded', 'Pending'].map(s => {
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => handleFilterChange(() => setStatusFilter(s))}
                style={{
                  backgroundColor: isActive ? colors.primary : colors.bgPage,
                  color: isActive ? colors.bgWhite : colors.textMuted,
                  border: `1px solid ${isActive ? colors.primary : colors.border}`,
                  borderRadius: `${radius.sm}px`,
                  padding: '6px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Year Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: 'bold' }}>YEARS:</span>
          <input
            type="number"
            value={yearMin}
            onChange={(e) => handleFilterChange(() => setYearMin(e.target.value))}
            placeholder="Min"
            style={{ width: '60px', padding: '5px', border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, fontSize: '13px' }}
          />
          <span style={{ fontSize: '12px', color: colors.textLight }}>-</span>
          <input
            type="number"
            value={yearMax}
            onChange={(e) => handleFilterChange(() => setYearMax(e.target.value))}
            placeholder="Max"
            style={{ width: '60px', padding: '5px', border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, fontSize: '13px' }}
          />
        </div>

        {/* Relevance dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: 'bold' }}>RELEVANCE:</span>
          <select
            value={relevanceMin}
            onChange={(e) => handleFilterChange(() => setRelevanceMin(e.target.value))}
            style={{ padding: '5px 8px', border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, fontSize: '13px' }}
          >
            <option value="Any">Any</option>
            <option value="70">≥70%</option>
            <option value="50">≥50%</option>
            <option value="30">≥30%</option>
          </select>
        </div>

        {/* Paper count indicator */}
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: colors.textMuted }}>
          Showing {filteredPapers.length} of {papers.length} papers
        </div>
      </div>

      {/* Main Table View */}
      {!compareMode ? (
        <div style={{
          backgroundColor: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.panel}px`,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ backgroundColor: colors.bgPage, borderBottom: `2px solid ${colors.border}` }}>
                <th style={{ width: '40px', padding: '12px 16px' }}></th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold', color: colors.primary }}>TITLE</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold', color: colors.primary, width: '150px' }}>AUTHORS</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold', color: colors.primary, width: '60px' }}>YEAR</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold', color: colors.primary, width: '100px' }}>RELEVANCE</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold', color: colors.primary, width: '110px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.map((paper, idx) => {
                const isExpanded = expandedPaperId === paper.id;
                const isSaved = library.includes(paper.id);
                const isChecked = selectedPaperIds.includes(paper.id);
                
                // Get Status styles
                let statusBg = '#FFF7ED'; // pending
                let statusColor = '#9A3412';
                let statusText = 'Pending';
                if (paper.screening_status === 'included') {
                  statusBg = '#ECFDF5';
                  statusColor = '#065F46';
                  statusText = 'Included';
                } else if (paper.screening_status === 'excluded') {
                  statusBg = '#FEF2F2';
                  statusColor = '#991B1B';
                  statusText = 'Excluded';
                }

                // Get Relevance Bar styles
                const relevancePct = Math.round(paper.relevance_score * 100);
                let relevanceColor = colors.danger;
                if (paper.relevance_score >= 0.7) relevanceColor = colors.success;
                else if (paper.relevance_score >= 0.4) relevanceColor = colors.warning;

                return (
                  <React.Fragment key={paper.id}>
                    <tr
                      onClick={(e) => handleRowClick(paper.id, e)}
                      style={{
                        backgroundColor: idx % 2 === 1 ? '#FAFBFC' : colors.bgWhite,
                        borderBottom: `1px solid ${colors.border}`,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#FAFBFC' : colors.bgWhite}
                    >
                      {/* Checkbox compare column */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle(paper.id)}
                          style={{ accentColor: colors.accent, width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Title column */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isSaved && <span title="Saved to Library" style={{ fontSize: '15px', color: colors.accent }}>🔖</span>}
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.textDark }}>
                            {paper.title}
                          </span>
                        </div>
                      </td>

                      {/* Authors column */}
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: colors.textMuted, verticalAlign: 'middle' }}>
                        {paper.authors.join(', ')}
                      </td>

                      {/* Year column */}
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: colors.textDark, verticalAlign: 'middle' }}>
                        {paper.year}
                      </td>

                      {/* Relevance bar column */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '50px',
                            height: '6px',
                            backgroundColor: colors.bgMuted,
                            borderRadius: '3px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <div style={{
                              width: `${relevancePct}%`,
                              height: '100%',
                              backgroundColor: relevanceColor
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', color: colors.textDark, fontWeight: '500' }}>
                            {relevancePct}%
                          </span>
                        </div>
                      </td>

                      {/* Cycle status badge column */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <button
                          data-clickable="true"
                          onClick={(e) => cycleStatus(paper, e)}
                          style={{
                            backgroundColor: statusBg,
                            color: statusColor,
                            border: 'none',
                            borderRadius: `${radius.sm}px`,
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'transform 0.1s'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          {statusText}
                        </button>
                      </td>
                    </tr>

                    {/* Inline Expanded Panel */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" style={{
                          backgroundColor: '#F8FAFC',
                          borderBottom: `1px solid ${colors.border}`,
                          padding: '16px 24px'
                        }}>
                          {viewingExtractionId !== paper.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: colors.primary }}>FULL TITLE</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: colors.textDark }}>{paper.title}</p>
                              </div>
                              
                              <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: colors.primary }}>ABSTRACT PREVIEW</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: colors.textDark, lineHeight: '1.5', fontStyle: 'italic' }}>
                                  {paper.abstract}
                                </p>
                              </div>

                              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button
                                  onClick={() => setViewingExtractionId(paper.id)}
                                  style={{
                                    backgroundColor: colors.accent,
                                    color: colors.bgWhite,
                                    border: 'none',
                                    borderRadius: `${radius.full}px`,
                                    padding: '8px 20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  View Structured Extraction
                                </button>
                                <button
                                  onClick={() => onToggleLibrary(paper.id)}
                                  style={{
                                    border: `1px solid ${colors.primary}`,
                                    backgroundColor: 'transparent',
                                    color: colors.primary,
                                    borderRadius: `${radius.full}px`,
                                    padding: '8px 20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isSaved ? 'Remove Bookmark' : 'Bookmark / Save to Library'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {/* Show Back Link */}
                              <button
                                onClick={() => setViewingExtractionId(null)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: colors.accent,
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  marginBottom: '12px',
                                  padding: 0
                                }}
                              >
                                ← Back to Abstract View
                              </button>
                              
                              <ExtractionView
                                paper={paper}
                                onRunExtraction={onRunExtraction}
                                onEditField={onEditField}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredPapers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{
                    textAlign: 'center',
                    padding: '32px',
                    color: colors.textLight,
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    No papers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Side by Side Comparative view */
        <div style={{
          backgroundColor: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          borderRadius: `${radius.panel}px`,
          padding: `${spacing.lg}px`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: colors.primary, fontSize: '18px' }}>
              📚 Side-by-Side Paper Comparison
            </h3>
            <button
              onClick={() => setCompareMode(false)}
              style={{
                backgroundColor: colors.primary,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.full}px`,
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Exit Comparison
            </button>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            minWidth: `${200 + comparedPapers.length * 250}px`
          }}>
            <thead>
              <tr style={{ backgroundColor: colors.primary, color: colors.bgWhite }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', width: '160px' }}>Field</th>
                {comparedPapers.map(p => (
                  <th key={p.id} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 'bold' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '11px', color: colors.accentLight, fontWeight: '400', marginTop: '2px' }}>
                      {p.authors[0]} ({p.year})
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldsKeys.map((f, idx) => (
                <tr key={f.key} style={{
                  borderBottom: `1px solid ${colors.border}`,
                  backgroundColor: idx % 2 === 1 ? '#FAFBFC' : colors.bgWhite
                }}>
                  <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'bold', color: colors.primary }}>
                    {f.label}
                  </td>
                  {comparedPapers.map(p => {
                    const value = p.extractedFields?.[f.key];
                    const score = p.confidenceScores?.[f.key] || 0;
                    
                    // Cells confidence tinting
                    let cellBg = colors.bgWhite;
                    if (value) {
                      if (score === -1) cellBg = '#EFF6FF'; // manually edited tint
                      else if (score >= 80) cellBg = '#ECFDF5'; // high
                      else if (score >= 50) cellBg = '#FFFBEB'; // medium
                      else cellBg = '#FEF2F2'; // low
                    }

                    return (
                      <td key={p.id} style={{
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: colors.textDark,
                        lineHeight: '1.4',
                        backgroundColor: cellBg,
                        verticalAlign: 'top'
                      }}>
                        {value ? value : <span style={{ color: colors.textLight, fontStyle: 'italic' }}>Not extracted</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Selection Bar */}
      {selectedPaperIds.length >= 2 && !compareMode && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.bgWhite,
          border: `1px solid ${colors.accent}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: `${radius.panel}px`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 100
        }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.primary }}>
            {selectedPaperIds.length} papers selected for comparison
          </span>
          <button
            onClick={() => setCompareMode(true)}
            style={{
              backgroundColor: colors.accent,
              color: colors.bgWhite,
              border: 'none',
              borderRadius: `${radius.full}px`,
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={handleClearSelection}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '13px',
              padding: 0
            }}
          >
            Clear Selection
          </button>
        </div>
      )}

    </div>
  );
}
