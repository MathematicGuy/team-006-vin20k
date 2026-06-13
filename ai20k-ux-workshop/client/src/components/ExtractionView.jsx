// client/src/components/ExtractionView.jsx

import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, radius, typography, confidenceColor, confidenceLabel } from '../styles/theme.js';

export default function ExtractionView({
  paper,
  onRunExtraction,
  onEditField
}) {
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractError, setExtractError] = useState(null);

  // Editing state
  const [editingField, setEditingField] = useState(null); // name of the field currently in edit mode
  const [editText, setEditText] = useState('');
  const prevValueRef = useRef(null);
  const prevConfidenceRef = useRef(null);

  // Verify popover state
  const [popoverField, setPopoverField] = useState(null); // field name for popover
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  // Toast state for undo
  const [undoToast, setUndoToast] = useState(null);
  const toastTimerRef = useRef(null);

  const fieldsKeys = [
    { key: 'problem', label: 'Problem' },
    { key: 'method', label: 'Method' },
    { key: 'dataset', label: 'Dataset' },
    { key: 'metric', label: 'Metric' },
    { key: 'result', label: 'Result' },
    { key: 'limitation', label: 'Limitation' },
    { key: 'futureWork', label: 'Future Work' },
    { key: 'relevance', label: 'Relevance' },
    { key: 'sourceCitation', label: 'Source Citation' }
  ];

  const handleRun = async () => {
    setExtractLoading(true);
    setExtractError(null);
    try {
      await onRunExtraction(paper.id);
    } catch (err) {
      setExtractError('Extraction failed for this paper. Network error or timeout.');
    } finally {
      setExtractLoading(false);
    }
  };

  const handleEditClick = (fieldName, currentVal) => {
    setEditingField(fieldName);
    setEditText(currentVal || '');
  };

  const handleSave = async (fieldName) => {
    const originalVal = paper.extractedFields?.[fieldName];
    const originalConf = paper.confidenceScores?.[fieldName];
    
    prevValueRef.current = originalVal;
    prevConfidenceRef.current = originalConf;

    try {
      await onEditField(paper.id, fieldName, editText);
      setEditingField(null);
      
      // Trigger Undo Toast
      showUndoToast(fieldName);
    } catch (err) {
      alert('Save failed');
    }
  };

  const showUndoToast = (fieldName) => {
    setUndoToast(fieldName);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 6000);
  };

  const handleUndo = async () => {
    if (!undoToast) return;
    const fieldName = undoToast;
    const prevVal = prevValueRef.current;
    
    try {
      // Revert field
      await onEditField(paper.id, fieldName, prevVal);
      // Wait, we need to revert confidence from -1 back to previous, which we can do by saving confidence score locally
      if (paper.confidenceScores) {
        paper.confidenceScores[fieldName] = prevConfidenceRef.current;
      }
      setUndoToast(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openVerifyPopover = (fieldName, e) => {
    setPopoverField(fieldName);
    setPopoverAnchor(e.currentTarget.getBoundingClientRect());
  };

  const handleVerifyCorrect = async (fieldName) => {
    // Upgrades confidence score to 100 (high)
    if (paper.confidenceScores) {
      paper.confidenceScores[fieldName] = 95;
    }
    setPopoverField(null);
  };

  const handleVerifyIncorrect = (fieldName) => {
    // Flag for review (adds a badge)
    if (!paper.flaggedFields) {
      paper.flaggedFields = {};
    }
    paper.flaggedFields[fieldName] = true;
    setPopoverField(null);
    handleEditClick(fieldName, paper.extractedFields?.[fieldName]);
  };

  // Close verify popover on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverField && !e.target.closest('[data-popover="true"]') && !e.target.closest('[data-verify-link="true"]')) {
        setPopoverField(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [popoverField]);

  if (!paper.extractedFields) {
    return (
      <div style={{
        border: `1px solid ${extractError ? colors.danger : colors.border}`,
        backgroundColor: extractError ? '#FEF2F2' : colors.bgWhite,
        borderRadius: `${radius.card}px`,
        padding: '24px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {extractLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: `3px solid ${colors.accentLight}`,
              borderTop: `3px solid ${colors.accent}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: '14px', color: colors.textMuted, fontStyle: 'italic' }}>
              Running structured AI extraction...
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}} />
          </div>
        ) : extractError ? (
          <div>
            <div style={{ fontSize: '15px', color: colors.danger, fontWeight: 'bold', marginBottom: '8px' }}>
              ⚠️ Extraction failed for this paper
            </div>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 16px 0' }}>
              {extractError}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                onClick={handleRun}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.bgWhite,
                  border: 'none',
                  borderRadius: `${radius.full}px`,
                  padding: '6px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Retry Extraction
              </button>
              <button
                onClick={() => onEditField(paper.id, 'problem', '')}
                style={{
                  backgroundColor: colors.bgWhite,
                  border: `1px solid ${colors.border}`,
                  color: colors.textDark,
                  borderRadius: `${radius.full}px`,
                  padding: '6px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fill Manually
              </button>
            </div>
            <div style={{ fontSize: '11px', color: colors.textLight, marginTop: '8px', fontStyle: 'italic' }}>
              Extraction failed twice. You can fill in the fields manually or skip this paper.
            </div>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: colors.textMuted }}>
              Extract structured parameters (problem, method, dataset, result, limitation, future work) using Gemini AI.
            </p>
            <button
              onClick={handleRun}
              style={{
                backgroundColor: colors.accent,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.full}px`,
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Run AI Extraction
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      borderRadius: `${radius.card}px`,
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: colors.primary, fontSize: '16px' }}>
        🔬 Extracted Parameters
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {fieldsKeys.map(({ key, label }) => {
          const value = paper.extractedFields[key];
          const isEditing = editingField === key;
          const score = paper.confidenceScores?.[key] || 0;
          const isFlagged = paper.flaggedFields?.[key];

          return (
            <div key={key} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              gridColumn: key === 'sourceCitation' ? 'span 2' : 'auto'
            }}>
              {/* Field Label + Tools */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Confidence Dot Indicator */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: confidenceColor(score),
                      flexShrink: 0
                    }}
                    title={confidenceLabel(score)}
                  />
                  
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                  </span>

                  {isFlagged && (
                    <span style={{
                      backgroundColor: '#FEE2E2',
                      color: colors.danger,
                      fontSize: '9px',
                      fontWeight: 'bold',
                      padding: '2px 4px',
                      borderRadius: '3px'
                    }}>
                      ⚠️ Flagged
                    </span>
                  )}
                </div>

                {!isEditing && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a
                      href="#"
                      data-verify-link="true"
                      onClick={(e) => { e.preventDefault(); openVerifyPopover(key, e); }}
                      style={{ fontSize: '11px', color: colors.accent, textDecoration: 'underline' }}
                    >
                      Verify
                    </a>
                    
                    <button
                      onClick={() => handleEditClick(key, value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.textLight,
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0
                      }}
                      title="Edit field"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              {/* Field Value Display / Form */}
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      border: `1.5px solid ${colors.accent}`,
                      borderRadius: `${radius.sm}px`,
                      padding: '8px',
                      fontSize: '13px',
                      color: colors.textDark,
                      fontFamily: typography.fontFamily,
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleSave(key)}
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.bgWhite,
                        border: 'none',
                        borderRadius: `${radius.sm}px`,
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${colors.border}`,
                        color: colors.textMuted,
                        borderRadius: `${radius.sm}px`,
                        padding: '4px 10px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: colors.bgPage,
                  border: `1px solid ${colors.border}`,
                  borderRadius: `${radius.sm}px`,
                  padding: '10px',
                  fontSize: '13px',
                  color: value ? colors.textDark : colors.textLight,
                  minHeight: '40px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}>
                  {value || 'Not yet extracted'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification Popover */}
      {popoverField && popoverAnchor && (
        <div
          data-popover="true"
          style={{
            position: 'fixed',
            left: `${Math.min(window.innerWidth - 320, popoverAnchor.left - 100)}px`,
            top: `${popoverAnchor.bottom + 8}px`,
            width: '300px',
            backgroundColor: colors.bgWhite,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radius.card}px`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: `${spacing.base}px`,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.primary }}>
            🔎 SOURCE PASSAGE
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textMuted,
            fontStyle: 'italic',
            lineHeight: '1.4',
            backgroundColor: colors.bgPage,
            padding: '8px',
            borderRadius: `${radius.sm}px`
          }}>
            "{paper.sourcePassages?.[0] || 'From the paper abstract...'}"
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button
              onClick={() => handleVerifyCorrect(popoverField)}
              style={{
                backgroundColor: colors.success,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.sm}px`,
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Looks Correct
            </button>
            <button
              onClick={() => handleVerifyIncorrect(popoverField)}
              style={{
                backgroundColor: colors.danger,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.sm}px`,
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Incorrect
            </button>
          </div>
        </div>
      )}

      {/* Undo Toast */}
      {undoToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1F2937',
          color: colors.bgWhite,
          padding: '12px 20px',
          borderRadius: `${radius.card}px`,
          fontSize: '14px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1001
        }}>
          <span>Field updated</span>
          <button
            onClick={handleUndo}
            style={{
              background: 'none',
              border: 'none',
              color: colors.accent,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: 0
            }}
          >
            Undo
          </button>
        </div>
      )}

    </div>
  );
}
