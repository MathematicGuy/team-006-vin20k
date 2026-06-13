// client/src/components/RightProgressSidebar.jsx

import React from 'react';
import { colors, spacing, radius, typography, stepColor } from '../styles/theme.js';
import { RESEARCH_STEPS } from '../utils/researchSteps.js';

export default function RightProgressSidebar({
  currentStep,
  progress,
  artifacts,
  onNavigateStep
}) {
  const currentStepObj = RESEARCH_STEPS.find(s => s.step_number === currentStep) || RESEARCH_STEPS[0];
  
  // Compile completed artifacts list
  const completedArtifacts = progress.steps
    .filter(s => s.status === 'completed')
    .map(s => {
      const stepInfo = RESEARCH_STEPS.find(r => r.step_number === s.step_number);
      return stepInfo ? stepInfo.artifact_name : s.name;
    });

  // Compile missing inputs list
  const missingInputs = progress.steps
    .filter(s => s.step_number >= currentStep)
    .map(s => {
      const stepInfo = RESEARCH_STEPS.find(r => r.step_number === s.step_number);
      return stepInfo ? stepInfo.missing_warning : s.missing_warning;
    });

  // Find next recommended step
  const nextStepObj = RESEARCH_STEPS.find(s => s.step_number === currentStep + 1);

  return (
    <div style={{
      width: '280px',
      backgroundColor: colors.bgWhite,
      borderLeft: `1px solid ${colors.border}`,
      padding: `${spacing.lg}px ${spacing.base}px`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: `${spacing.base}px`
      }}>
        Research Progress
      </div>

      {/* Current Step Card */}
      <div style={{
        backgroundColor: colors.primaryLight,
        borderLeft: `4px solid ${colors.accent}`,
        borderRadius: `${radius.card}px`,
        padding: `${spacing.md}px`,
        marginBottom: `${spacing.base}px`
      }}>
        <div style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600' }}>
          CURRENT STEP
        </div>
        <div style={{
          fontSize: `${typography.sizes.sm}px`,
          fontWeight: 'bold',
          color: colors.primary,
          marginTop: '4px'
        }}>
          Step {currentStepObj.step_number}: {currentStepObj.name}
        </div>
        <div style={{
          fontSize: '12px',
          color: colors.textMuted,
          marginTop: '4px',
          lineHeight: '1.4'
        }}>
          {currentStepObj.purpose}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: `${spacing.base}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: colors.textMuted, fontWeight: '600' }}>COMPLETION</span>
          <span style={{ color: colors.primary, fontWeight: 'bold' }}>{progress.overallProgress}%</span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: colors.bgMuted,
          borderRadius: `${radius.full}px`,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress.overallProgress}%`,
            backgroundColor: colors.success,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Completed Artifacts */}
      {completedArtifacts.length > 0 && (
        <div style={{ marginBottom: `${spacing.base}px` }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
            Completed Artifacts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {completedArtifacts.map((artName, idx) => (
              <div key={idx} style={{ fontSize: '13px', color: colors.success, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅</span> {artName}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Inputs */}
      {missingInputs.length > 0 && (
        <div style={{ marginBottom: `${spacing.base}px` }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
            Required Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {missingInputs.slice(0, 3).map((warning, idx) => (
              <div key={idx} style={{ fontSize: '13px', color: colors.warning, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Step Suggestion */}
      {nextStepObj && (
        <div style={{
          backgroundColor: colors.bgPage,
          borderRadius: `${radius.card}px`,
          padding: `${spacing.sm}px ${spacing.md}px`,
          marginBottom: `${spacing.lg}px`,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '11px', color: colors.accent, fontWeight: 'bold' }}>
            RECOMMENDED NEXT STEP
          </div>
          <div style={{ fontSize: '13px', color: colors.textDark, marginTop: '2px', fontWeight: '500' }}>
            {nextStepObj.step_number}. {nextStepObj.name}
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, marginBottom: `${spacing.base}px`, textTransform: 'uppercase' }}>
          Timeline
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {progress.steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'current';
            const isClickable = isCompleted;
            
            let dotSymbol = '○';
            let dotBg = colors.bgWhite;
            let dotBorder = `2px solid ${colors.textLight}`;
            let textColor = colors.textLight;
            let fontWeight = '400';

            if (isCompleted) {
              dotSymbol = '✓';
              dotBg = colors.success;
              dotBorder = `2px solid ${colors.success}`;
              textColor = colors.textDark;
            } else if (isActive) {
              dotSymbol = '◉';
              dotBg = colors.bgWhite;
              dotBorder = `2px solid ${colors.accent}`;
              textColor = colors.primary;
              fontWeight = 'bold';
            }

            return (
              <div key={step.key} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                position: 'relative',
                paddingBottom: idx === progress.steps.length - 1 ? '0' : '16px',
                minHeight: '36px'
              }}>
                {/* Connector Line */}
                {idx !== progress.steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '16px',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: isCompleted ? colors.success : colors.border,
                    zIndex: 0
                  }} />
                )}

                {/* Timeline Dot */}
                <div
                  onClick={() => isClickable && onNavigateStep(step.step_number)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: dotBg,
                    border: dotBorder,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isCompleted ? '11px' : '10px',
                    color: isCompleted ? colors.bgWhite : (isActive ? colors.accent : colors.textLight),
                    fontWeight: 'bold',
                    zIndex: 1,
                    cursor: isClickable ? 'pointer' : 'default',
                    flexShrink: 0
                  }}
                >
                  {isCompleted ? '✓' : ''}
                </div>

                {/* Step Name */}
                <div
                  onClick={() => isClickable && onNavigateStep(step.step_number)}
                  style={{
                    fontSize: '13px',
                    color: textColor,
                    fontWeight,
                    cursor: isClickable ? 'pointer' : 'default',
                    userSelect: 'none',
                    lineHeight: '1.3',
                    paddingTop: '1px'
                  }}
                >
                  {step.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
