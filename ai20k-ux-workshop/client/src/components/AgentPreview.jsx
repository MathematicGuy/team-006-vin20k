// client/src/components/AgentPreview.jsx

import React, { useEffect, useState } from 'react';
import { colors, spacing, radius, typography, shadows } from '../styles/theme.js';

export default function AgentPreview({
  loading,
  error,
  latestMessage,
  onStop,
  onRetry,
  onRetrySimplified,
  onChipClick,
  currentStep
}) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Loading timer
  useEffect(() => {
    let timer;
    if (loading) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [loading]);

  // Format markdown-like text to React nodes
  const formatMarkdown = (text) => {
    if (!text) return '';
    
    const parseItalic = (str) => {
      const parts = str.split('*');
      return parts.map((part, i) => {
        if (i % 2 === 1) return <em key={i}>{part}</em>;
        return part;
      });
    };

    const parseInline = (str) => {
      const parts = str.split('**');
      return parts.map((part, i) => {
        if (i % 2 === 1) return <strong key={i} style={{ color: colors.primary }}>{part}</strong>;
        return parseItalic(part);
      });
    };

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;
    let listType = 'ul'; // ul or ol

    const flushList = (key) => {
      if (listItems.length > 0) {
        const Tag = listType;
        elements.push(
          <Tag key={`list-${key}`} style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
            {listItems}
          </Tag>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      
      // Unordered list checks
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        if (!inList || listType !== 'ul') {
          flushList(idx);
          inList = true;
          listType = 'ul';
        }
        const content = line.substring(line.indexOf(' ') + 1);
        listItems.push(<li key={`li-${idx}`} style={{ marginBottom: '6px', fontSize: '14px', color: colors.textDark }}>{parseInline(content)}</li>);
      }
      // Ordered list checks
      else if (trimmedLine.match(/^\d+\.\s/)) {
        if (!inList || listType !== 'ol') {
          flushList(idx);
          inList = true;
          listType = 'ol';
        }
        const content = line.substring(line.indexOf(' ') + 1);
        listItems.push(<li key={`li-${idx}`} style={{ marginBottom: '6px', fontSize: '14px', color: colors.textDark, listStyleType: 'decimal' }}>{parseInline(content)}</li>);
      }
      // Empty lines
      else if (trimmedLine === '') {
        flushList(idx);
        elements.push(<div key={`space-${idx}`} style={{ height: '8px' }} />);
      }
      // Normal paragraphs
      else {
        flushList(idx);
        elements.push(
          <p key={`p-${idx}`} style={{
            margin: '0 0 12px 0',
            fontSize: `${typography.sizes.base}px`,
            color: colors.textDark,
            lineHeight: typography.lineHeight
          }}>
            {parseInline(line)}
          </p>
        );
      }
    });

    flushList('final');
    return elements;
  };

  // Error Card Renders
  if (error) {
    const isTimeout = error.toLowerCase().includes('timeout') || error.toLowerCase().includes('too long');
    return (
      <div style={{
        borderLeft: `4px solid ${colors.danger}`,
        backgroundColor: '#FEF2F2',
        borderRadius: `${radius.card}px`,
        padding: `${spacing.base}px`,
        marginBottom: `${spacing.lg}px`,
        boxSizing: 'border-box'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: colors.danger,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span>⚠️</span> Something went wrong
        </div>
        <div style={{
          fontSize: '14px',
          color: colors.textMuted,
          marginBottom: `${spacing.base}px`
        }}>
          {isTimeout
            ? 'The research agent is taking too long to respond. This usually means the question is too broad.'
            : error}
        </div>
        <div style={{ display: 'flex', gap: `${spacing.sm}px`, marginBottom: '8px' }}>
          <button
            onClick={onRetry}
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
            Retry
          </button>
          <button
            onClick={onRetrySimplified}
            style={{
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bgWhite,
              color: colors.textDark,
              borderRadius: `${radius.full}px`,
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Simplify & Retry
          </button>
        </div>
        <div style={{ fontSize: '12px', color: colors.textLight, fontStyle: 'italic' }}>
          If this keeps happening, try breaking your question into smaller parts.
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div style={{
        borderLeft: `4px solid ${colors.accent}`,
        backgroundColor: '#F0FDFA',
        borderRadius: `${radius.card}px`,
        padding: `${spacing.base}px`,
        marginBottom: `${spacing.lg}px`,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Pulsing indicator */}
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.accent }}>
              {currentStep === 4 ? 'Searching databases...' : 'Analyzing your research intent...'} ({elapsedTime}s)
            </span>
          </div>

          <button
            onClick={onStop}
            style={{
              backgroundColor: colors.danger,
              color: colors.bgWhite,
              border: 'none',
              borderRadius: `${radius.full}px`,
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Stop
          </button>
        </div>
        
        {/* Animated Indeterminate Progress Bar */}
        <div style={{
          height: '4px',
          width: '100%',
          backgroundColor: '#CCFBF1',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: colors.accent,
            width: '30%',
            animation: 'loading-slide 1.5s infinite ease-in-out'
          }} />
        </div>

        {/* Global style injection for keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
          }
          @keyframes loading-slide {
            0% { left: -30%; }
            50% { left: 40%; width: 40%; }
            100% { left: 100%; }
          }
        `}} />
      </div>
    );
  }

  // Base Empty state
  if (!latestMessage) {
    return (
      <div style={{
        backgroundColor: colors.bgWhite,
        border: `1px solid ${colors.border}`,
        borderRadius: `${radius.panel}px`,
        padding: `${spacing.xl}px`,
        textAlign: 'center',
        color: colors.textLight,
        fontStyle: 'italic',
        fontSize: '14px'
      }}>
        💡 Select a task card above or type a topic in the prompt to begin.
      </div>
    );
  }

  const { text, meta } = latestMessage;
  const confidence = meta?.confidence || 0;
  const isLowConfidence = confidence < 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.base}px` }}>
      {/* Low Confidence Warning */}
      {isLowConfidence && (
        <div style={{
          backgroundColor: '#FFFBEB',
          borderLeft: `4px solid ${colors.warning}`,
          borderRadius: `${radius.card}px`,
          padding: `${spacing.md}px`,
          fontSize: '14px',
          color: '#92400E',
          lineHeight: '1.4'
        }}>
          ⚠️ <strong>Low confidence</strong> — the agent is not sure about this response. Consider rephrasing your question or providing more context.
        </div>
      )}

      {/* Response Card Container */}
      <div style={{
        backgroundColor: isLowConfidence ? '#FFFBEB' : colors.bgWhite,
        border: `1px solid ${isLowConfidence ? '#FDE68A' : colors.border}`,
        borderRadius: `${radius.panel}px`,
        padding: `${spacing.lg}px`,
        boxShadow: shadows.sm
      }}>
        {/* Render markdown content */}
        <div>{formatMarkdown(text)}</div>

        {/* Socratic chips (follow-up suggestions) */}
        {meta?.follow_up_questions && meta.follow_up_questions.length > 0 && (
          <div style={{
            marginTop: `${spacing.base}px`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {meta.follow_up_questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onChipClick(q)}
                style={{
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  border: 'none',
                  borderRadius: `${radius.full}px`,
                  padding: '8px 16px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                  lineHeight: '1.3',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#D4E2F0'}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.primaryLight}
              >
                💡 {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sources list */}
      {meta?.citations && meta.citations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.sm}px` }}>
          <div style={{
            fontSize: '12px',
            color: colors.textLight,
            fontStyle: 'italic',
            marginLeft: '4px'
          }}>
            Sources — AI-generated, verify before citing
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: `${spacing.sm}px`
          }}>
            {meta.citations.map((cite, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: colors.bgWhite,
                  border: `1px solid ${colors.border}`,
                  borderRadius: `${radius.card}px`,
                  padding: `${spacing.md}px`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: '4px'
                }}>
                  {cite.source_name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textMuted,
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  "{cite.excerpt}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
