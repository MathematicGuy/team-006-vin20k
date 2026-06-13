// client/src/components/ScreeningCriteriaEditor.jsx

import React, { useState, useEffect, useRef } from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';

export default function ScreeningCriteriaEditor({
  initialCriteria,
  onApply,
  disabled
}) {
  const [criteria, setCriteria] = useState({
    dateFrom: initialCriteria?.dateFrom || '',
    dateTo: initialCriteria?.dateTo || '',
    domains: initialCriteria?.domains || '',
    includeKeywords: initialCriteria?.includeKeywords || '',
    excludeKeywords: initialCriteria?.excludeKeywords || ''
  });

  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState(null);

  // Undo/Redo stacks
  const historyRef = useRef([]);
  const redoRef = useRef([]);
  const toastTimerRef = useRef(null);

  // Add listener for Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [criteria]);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 6000); // 6 seconds auto-dismiss
  };

  const pushState = (nextState) => {
    historyRef.current.push(JSON.stringify(criteria));
    if (historyRef.current.length > 10) {
      historyRef.current.shift();
    }
    redoRef.current = []; // clear redo on new edit
    setCriteria(nextState);
  };

  const handleChange = (field, val) => {
    if (disabled || confirmed) return;
    const nextState = { ...criteria, [field]: val };
    pushState(nextState);
  };

  const handleUndo = () => {
    if (historyRef.current.length === 0 || disabled || confirmed) return;
    const prev = historyRef.current.pop();
    redoRef.current.push(JSON.stringify(criteria));
    setCriteria(JSON.parse(prev));
    showToast('Criterion change undone');
  };

  const handleRedo = () => {
    if (redoRef.current.length === 0 || disabled || confirmed) return;
    const next = redoRef.current.pop();
    historyRef.current.push(JSON.stringify(criteria));
    setCriteria(JSON.parse(next));
    setToast(null);
  };

  const handleReset = () => {
    if (disabled || confirmed) return;
    const defaults = {
      dateFrom: '2018',
      dateTo: '2026',
      domains: 'Medicine, Engineering, Computer Science',
      includeKeywords: 'sleep, performance, academic, GPA',
      excludeKeywords: 'animals, infants, clinical trial'
    };
    pushState(defaults);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onApply(criteria);
  };

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${confirmed ? colors.success : colors.border}`,
      borderRadius: `${radius.panel}px`,
      padding: `${spacing.lg}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.base}px`,
      boxSizing: 'border-box',
      marginBottom: `${spacing.lg}px`,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: colors.primary }}>
          📋 Define Screening & Scope Criteria
        </div>
        
        {/* Undo / Redo Toolbar */}
        {!disabled && !confirmed && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleUndo}
              disabled={historyRef.current.length === 0}
              title="Undo (Ctrl+Z)"
              style={{
                background: 'none',
                border: 'none',
                color: historyRef.current.length === 0 ? colors.textLight : colors.accent,
                cursor: historyRef.current.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              ↶
            </button>
            <button
              onClick={handleRedo}
              disabled={redoRef.current.length === 0}
              title="Redo"
              style={{
                background: 'none',
                border: 'none',
                color: redoRef.current.length === 0 ? colors.textLight : colors.accent,
                cursor: redoRef.current.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              ↷
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${spacing.base}px` }}>
        {/* Left Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.md}px` }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textDark, display: 'block', marginBottom: '4px' }}>
              DATE RANGE (YEARS)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={criteria.dateFrom}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                placeholder="From (e.g. 2020)"
                disabled={disabled || confirmed}
                style={{
                  flex: 1,
                  border: `1px solid ${colors.border}`,
                  borderRadius: `${radius.sm}px`,
                  padding: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="number"
                value={criteria.dateTo}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                placeholder="To (e.g. 2026)"
                disabled={disabled || confirmed}
                style={{
                  flex: 1,
                  border: `1px solid ${colors.border}`,
                  borderRadius: `${radius.sm}px`,
                  padding: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textDark, display: 'block', marginBottom: '4px' }}>
              RESEARCH DOMAINS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={criteria.domains}
              onChange={(e) => handleChange('domains', e.target.value)}
              placeholder="e.g. Medicine, Psychology, CS"
              disabled={disabled || confirmed}
              style={{
                width: '100%',
                border: `1px solid ${colors.border}`,
                borderRadius: `${radius.sm}px`,
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Right Col: Inclusion/Exclusion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.md}px` }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.success, display: 'block', marginBottom: '4px' }}>
              INCLUDE IF KEYWORDS PRESENT
            </label>
            <input
              type="text"
              value={criteria.includeKeywords}
              onChange={(e) => handleChange('includeKeywords', e.target.value)}
              placeholder="e.g. sleep, gpa, academic"
              disabled={disabled || confirmed}
              style={{
                width: '100%',
                border: `1px solid ${colors.success}`,
                borderRadius: `${radius.sm}px`,
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#F0FDF4'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.danger, display: 'block', marginBottom: '4px' }}>
              EXCLUDE IF KEYWORDS PRESENT
            </label>
            <input
              type="text"
              value={criteria.excludeKeywords}
              onChange={(e) => handleChange('excludeKeywords', e.target.value)}
              placeholder="e.g. animals, medical trial"
              disabled={disabled || confirmed}
              style={{
                width: '100%',
                border: `1px solid ${colors.danger}`,
                borderRadius: `${radius.sm}px`,
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#FEF2F2'
              }}
            />
          </div>
        </div>
      </div>

      {/* Undo Toast Notify */}
      {toast && (
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
          zIndex: 1000
        }}>
          <span>{toast}</span>
          <button
            onClick={handleRedo}
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
            Redo
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
        {!confirmed ? (
          <>
            <button
              onClick={handleReset}
              disabled={disabled}
              style={{
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bgWhite,
                color: colors.textDark,
                borderRadius: `${radius.full}px`,
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleConfirm}
              disabled={disabled}
              style={{
                backgroundColor: colors.accent,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.full}px`,
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔒 Confirm Criteria & Start Screening
            </button>
          </>
        ) : (
          <div style={{
            color: colors.success,
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>✔️</span> Criteria Locked & Confirmed
          </div>
        )}
      </div>
    </div>
  );
}
