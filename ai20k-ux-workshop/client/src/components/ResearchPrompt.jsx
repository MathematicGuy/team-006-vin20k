// client/src/components/ResearchPrompt.jsx

import React, { useState, useEffect } from 'react';
import { colors, spacing, radius, typography } from '../styles/theme.js';
import { RESEARCH_STEPS } from '../utils/researchSteps.js';

export default function ResearchPrompt({
  currentStep,
  onSubmit,
  disabled,
  initialValue = ''
}) {
  const [value, setValue] = useState(initialValue);
  const [warning, setWarning] = useState(null);

  // Sync initialValue changes (like when clicking task cards or chips)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Handle warnings as user types
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 10) {
      setWarning({
        type: 'short',
        text: 'Your question is too short — add more detail so the agent can help effectively'
      });
    } else if (trimmed.length > 2000) {
      setWarning({
        type: 'long',
        text: 'Your question is very long — consider focusing on one aspect at a time'
      });
    } else {
      setWarning(null);
    }
  }, [value]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length >= 10 && !disabled) {
      onSubmit(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Select placeholder based on current step
  const getPlaceholder = () => {
    switch (currentStep) {
      case 1:
        return "What research topic are you exploring today? For example: 'How does sleep duration affect academic performance in university students?'";
      case 2:
        return "Formulate or refine your research question. Respond to the Socratic questions above...";
      case 3:
        return "Suggest search strategy adjustments, edit query synonyms, or write your query...";
      case 5:
        return "Enter additional screening criteria or confirm the inclusion/exclusion criteria above...";
      case 7:
        return "Add notes to the gap analysis or refine the suggested research direction...";
      case 9:
        return "Refine the drafted Research Problem Card or write your problem statement...";
      default:
        return "Ask the research agent a question or enter details for the active step...";
    }
  };

  const isButtonDisabled = value.trim().length < 10 || disabled;

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.sm}px`,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: `${spacing.base}px`
    }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: `${spacing.base}px`,
            borderRadius: `${radius.card}px`,
            border: `1px solid ${colors.border}`,
            fontSize: `${typography.sizes.base}px`,
            fontFamily: typography.fontFamily,
            lineHeight: typography.lineHeight,
            color: colors.textDark,
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
          }}
          onFocus={(e) => e.target.style.borderColor = colors.accent}
          onBlur={(e) => e.target.style.borderColor = colors.border}
        />
      </div>

      {/* Warning display */}
      {warning && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: `${spacing.sm}px ${spacing.md}px`,
          backgroundColor: '#FFFBEB',
          borderLeft: `3px solid ${colors.warning}`,
          borderRadius: `${radius.sm}px`,
          fontSize: `${typography.sizes.sm}px`,
          color: '#92400E'
        }}>
          <span>⚠️</span>
          <span>{warning.text}</span>
        </div>
      )}

      {/* Submit button bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{
            backgroundColor: isButtonDisabled ? colors.textLight : colors.primary,
            color: colors.bgWhite,
            border: 'none',
            borderRadius: `${radius.full}px`,
            padding: '10px 24px',
            fontSize: `${typography.sizes.sm}px`,
            fontWeight: '600',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            if (!isButtonDisabled) e.target.style.backgroundColor = colors.primaryHover;
          }}
          onMouseOut={(e) => {
            if (!isButtonDisabled) e.target.style.backgroundColor = colors.primary;
          }}
        >
          {currentStep === 1 ? 'Start Exploring' : 'Submit Response'}
        </button>
      </div>
    </form>
  );
}
