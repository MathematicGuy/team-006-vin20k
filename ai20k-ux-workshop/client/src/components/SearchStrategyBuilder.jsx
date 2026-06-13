// client/src/components/SearchStrategyBuilder.jsx

import React, { useState } from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';

export default function SearchStrategyBuilder({
  initialStrategy,
  onConfirmSearch,
  disabled
}) {
  const [databases, setDatabases] = useState({
    PubMed: true,
    SemanticScholar: true,
    GoogleScholar: true,
    arXiv: true,
    Scopus: false
  });

  const [keywords, setKeywords] = useState(
    initialStrategy?.suggestedKeywords || ['sleep duration', 'academic performance', 'university students', 'GPA', 'sleep quality']
  );
  const [newKeyword, setNewKeyword] = useState('');
  
  const [query, setQuery] = useState(
    initialStrategy?.queryString || '(sleep duration OR sleep quality) AND (academic performance OR GPA) AND (university students OR undergraduates)'
  );
  const [isQueryEditable, setIsQueryEditable] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleDb = (db) => {
    setDatabases(prev => ({ ...prev, [db]: !prev[db] }));
  };

  const removeKeyword = (idx) => {
    setKeywords(prev => prev.filter((_, i) => i !== idx));
  };

  const addKeyword = (e) => {
    e.preventDefault();
    const val = newKeyword.trim().toLowerCase();
    if (val && !keywords.includes(val) && keywords.length < 10) {
      setKeywords(prev => [...prev, val]);
      setNewKeyword('');
    }
  };

  const selectedDbsCount = Object.values(databases).filter(Boolean).length;

  const handlePreConfirm = () => {
    if (selectedDbsCount === 0) {
      alert('Please select at least one database to search.');
      return;
    }
    setShowConfirm(true);
  };

  const handleExecute = () => {
    onConfirmSearch({
      databases: Object.keys(databases).filter(k => databases[k]),
      query,
      keywords
    });
    setShowConfirm(false);
  };

  return (
    <div style={{
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      borderRadius: `${radius.panel}px`,
      padding: `${spacing.lg}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.base}px`,
      boxSizing: 'border-box',
      marginBottom: `${spacing.lg}px`
    }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: colors.primary }}>
        🔍 Build Search Strategy
      </div>

      {/* Database Selectors */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textDark, display: 'block', marginBottom: '8px' }}>
          SELECT DATABASES
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {Object.keys(databases).map(db => (
            <label key={db} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: colors.textDark,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={databases[db]}
                onChange={() => toggleDb(db)}
                disabled={disabled || showConfirm}
                style={{ accentColor: colors.accent, width: '16px', height: '16px' }}
              />
              {db === 'SemanticScholar' ? 'Semantic Scholar' : db === 'GoogleScholar' ? 'Google Scholar' : db}
            </label>
          ))}
        </div>
      </div>

      {/* Keywords synonyms */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textDark, display: 'block', marginBottom: '8px' }}>
          KEYWORD SYNONYMS (Max 10)
        </label>
        
        {/* Keyword pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {keywords.map((kw, idx) => (
            <div key={kw} style={{
              backgroundColor: colors.primaryLight,
              color: colors.primary,
              border: `1px solid ${colors.border}`,
              borderRadius: `${radius.sm}px`,
              padding: '4px 8px 4px 10px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>{kw}</span>
              {!disabled && !showConfirm && (
                <button
                  type="button"
                  onClick={() => removeKeyword(idx)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: colors.danger,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: 0
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add keyword form */}
        {!disabled && !showConfirm && keywords.length < 10 && (
          <div style={{ display: 'flex', gap: '8px', maxWidth: '300px' }}>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              style={{
                flex: 1,
                border: `1px solid ${colors.border}`,
                borderRadius: `${radius.sm}px`,
                padding: '6px 10px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={addKeyword}
              style={{
                backgroundColor: colors.accent,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.sm}px`,
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Boolean Query editor */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textDark }}>
            BOOLEAN QUERY STRING
          </label>
          {!disabled && !showConfirm && (
            <button
              onClick={() => setIsQueryEditable(!isQueryEditable)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isQueryEditable ? 'Done Editing' : '✏️ Edit Query'}
            </button>
          )}
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          readOnly={!isQueryEditable || disabled || showConfirm}
          style={{
            width: '100%',
            height: '60px',
            backgroundColor: isQueryEditable ? colors.bgWhite : colors.bgPage,
            border: `1px solid ${isQueryEditable ? colors.accent : colors.border}`,
            borderRadius: `${radius.card}px`,
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: colors.textDark,
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Confirmation and trigger gates */}
      {!showConfirm ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handlePreConfirm}
            disabled={disabled}
            style={{
              backgroundColor: disabled ? colors.textLight : colors.accent,
              color: colors.bgWhite,
              border: 'none',
              borderRadius: `${radius.full}px`,
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            Run Search Strategy
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: `1px solid ${colors.warning}`,
          borderRadius: `${radius.card}px`,
          padding: `${spacing.md}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${spacing.sm}px`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#92400E', fontWeight: 'bold' }}>
            Ready to search {selectedDbsCount} databases with this query?
          </div>
          <div style={{ display: 'flex', gap: `${spacing.sm}px` }}>
            <button
              onClick={handleExecute}
              style={{
                backgroundColor: colors.success,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.full}px`,
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Run Search
            </button>
            <button
              onClick={() => setShowConfirm(false)}
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
              Edit First
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
