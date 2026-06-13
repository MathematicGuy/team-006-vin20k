// client/src/components/LeftSidebar.jsx

import React from 'react';
import { colors, spacing, radius, typography, stepColor } from '../styles/theme.js';

export default function LeftSidebar({
  currentStep,
  progress,
  libraryCount,
  activeRoute,
  onNavigateStep
}) {
  const navItems = [
    { id: 'home', label: 'Home', path: '#/' },
    { id: 'papers', label: 'Paper Review', path: '#/papers' },
    { id: 'preview', label: 'Cycle Preview', path: '#/preview' }
  ];

  return (
    <div style={{
      width: '240px',
      backgroundColor: colors.bgWhite,
      borderRight: `1px solid ${colors.border}`,
      padding: `${spacing.lg}px ${spacing.base}px`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* App Logo */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: `${spacing.xl}px`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '22px' }}>🧭</span>
        Research Navigator
      </div>

      {/* Navigation Tools */}
      <div style={{ marginBottom: `${spacing.xl}px` }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: `${spacing.sm}px`
        }}>
          Navigation
        </div>
        
        {navItems.map(item => {
          const isActive = activeRoute === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '40px',
                padding: `0 ${spacing.md}px`,
                borderRadius: `${radius.sm}px`,
                textDecoration: 'none',
                fontSize: `${typography.sizes.sm}px`,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? colors.primary : colors.textDark,
                backgroundColor: isActive ? colors.primaryLight : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.primary}` : 'none',
                marginBottom: `${spacing.xs}px`,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.id === 'home' ? '🏠' : (item.id === 'papers' ? '📚' : '🔍')}</span>
                {item.label}
              </div>
              
              {item.id === 'papers' && libraryCount > 0 && (
                <span style={{
                  backgroundColor: colors.accent,
                  color: colors.bgWhite,
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {libraryCount}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Research Modules */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: `${spacing.sm}px`
        }}>
          Research Cycle
        </div>

        {progress.steps.map((step) => {
          const isActive = currentStep === step.step_number && activeRoute === 'home';
          const isCompleted = step.status === 'completed';
          const isClickable = isCompleted || step.step_number === currentStep;

          let dotSymbol = '○';
          if (step.status === 'completed') dotSymbol = '●';
          else if (step.status === 'current') dotSymbol = '◉';

          return (
            <div
              key={step.key}
              onClick={() => isClickable && onNavigateStep(step.step_number)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: `${radius.sm}px`,
                fontSize: '13px',
                color: isActive ? colors.primary : (isClickable ? colors.textDark : colors.textLight),
                backgroundColor: isActive ? colors.accentLight : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.accent}` : 'none',
                marginBottom: `${spacing.xs}px`,
                cursor: isClickable ? 'pointer' : 'not-allowed',
                fontWeight: isActive ? '600' : '400',
                transition: 'background-color 0.2s'
              }}
              title={step.purpose}
            >
              {/* Dot icon */}
              <span style={{
                color: stepColor(step.status),
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {dotSymbol}
              </span>
              
              <span style={{
                textDecoration: isCompleted ? 'none' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {step.step_number}. {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
