// client/src/components/CyclePreview.jsx

import React, { useState } from 'react';
import { colors, spacing, radius, typography, stepColor } from '../styles/theme.js';

const PREVIEW_STEPS = [
  {
    step_number: 1,
    name: 'Clarify Topic',
    icon: '💡',
    purpose: 'Narrow down a broad research interest into a specific, structured topic using progressive Socratic questioning.',
    artifact: 'Clarified Topic Concept',
    exit_conditions: [
      'Input an initial research interest or prompt on the landing page.',
      'Answer the AI coach\'s subsequent Socratic clarification questions.',
      'AI successfully identifies the research domain and key variables with confidence.'
    ],
    tcr_features: {
      transparency: 'Live agent preview status and domain classification confidence score.',
      control: 'Ability to click Socratic suggestion chips to auto-fill responses.',
      recovery: 'Simplify & Retry action panel if the input is too complex or ambiguous.'
    }
  },
  {
    step_number: 2,
    name: 'Define Research Problem',
    icon: '❓',
    purpose: 'Formulate a specific, answerable, and feasible research question (e.g., using PICO/scoping frames).',
    artifact: 'Research Question (RQ)',
    exit_conditions: [
      'AI drafts a candidate research question based on clarified topic parameters.',
      'Student reviews, refines, and edits the drafted question variables.',
      'Student explicitly locks and saves the final research question.'
    ],
    tcr_features: {
      transparency: 'Visual distinction between AI-drafted question and manual student edits.',
      control: 'Student can manually override the research question textbox at any time.',
      recovery: 'Ctrl+Z / Undo action stack to revert changes to the question statement.'
    }
  },
  {
    step_number: 3,
    name: 'Build Search Strategy',
    icon: '🛠️',
    purpose: 'Configure keywords, synonyms, selected databases, and publication filters.',
    artifact: 'Boolean Search Query & Databases',
    exit_conditions: [
      'Define inclusion/exclusion criteria (e.g., year range, domains).',
      'Refine the AI-generated synonym tags and search query.',
      'Click the "Confirm Strategy & Build" button.'
    ],
    tcr_features: {
      transparency: 'Syntax highlighting of the compiled Boolean query logic.',
      control: 'Database checkboxes (PubMed, arXiv, Google Scholar) and keyword tag additions.',
      recovery: 'Reset query to default AI suggestion if custom keywords yield zero matches.'
    }
  },
  {
    step_number: 4,
    name: 'Run Paper Search',
    icon: '🚀',
    purpose: 'Query selected databases and pull down matching candidate paper metadata.',
    artifact: 'Candidate Paper Set',
    exit_conditions: [
      'Search executes across selected database API gateways.',
      'Backend returns matching candidate papers with titles, years, and abstracts.',
      'The UI transitions to the Screening Table view.'
    ],
    tcr_features: {
      transparency: 'Real-time database query progress indicators and count of papers found.',
      control: 'Stop execution button to cancel query and return to strategy step.',
      recovery: 'Automatic fallback to mock literature database if network timeouts occur.'
    }
  },
  {
    step_number: 5,
    name: 'Screen Papers',
    icon: '📋',
    purpose: 'Apply the verified inclusion and exclusion criteria to the retrieved papers.',
    artifact: 'Screened & Selected Papers',
    exit_conditions: [
      'Review relevance scores calculated for each paper.',
      'Set screening status (Included / Excluded) for all candidate papers.',
      'Approve a subset of papers to forward to the extraction queue.'
    ],
    tcr_features: {
      transparency: 'Relevance score explanations and highlighted matching keywords in abstracts.',
      control: 'Manual override toggles for include/exclude buttons on each row.',
      recovery: 'Restore previously excluded papers from the hidden logs panel.'
    }
  },
  {
    step_number: 6,
    name: 'Extract Data',
    icon: '📊',
    purpose: 'Analyze approved papers to extract key structured research parameters.',
    artifact: 'Extracted Research Fields',
    exit_conditions: [
      'Click "Run Extraction" on each selected paper to trigger LLM parsing.',
      'Extract 9 fields: Problem, Method, Dataset, Metric, Result, Limitation, Future Work, Relevance, Citation.',
      'Verify and correct any field extractions manually.'
    ],
    tcr_features: {
      transparency: 'AI extraction confidence levels (color-coded) and verbatim source passages.',
      control: 'Direct inline editing of any extracted field via double-click or pencil trigger.',
      recovery: 'Re-run extraction trigger for individual papers if parsing fails.'
    }
  },
  {
    step_number: 7,
    name: 'Analyze Gaps',
    icon: '🔍',
    purpose: 'Identify research gaps, limitations, and areas of promise in the existing literature.',
    artifact: 'Gap Hypothesis & Research Direction',
    exit_conditions: [
      'System analyzes all verified extraction fields across papers.',
      'AI summarizes limitations and suggests gaps (e.g., missing cohorts, unaddressed confounders).',
      'Student confirms or edits the formulated gap hypothesis.'
    ],
    tcr_features: {
      transparency: 'Source trail linking suggested gaps back to paper citations.',
      control: 'Reject AI-suggested gaps and write a custom gap hypothesis.',
      recovery: 'Re-generate gap directions with adjusted thematic filters.'
    }
  },
  {
    step_number: 8,
    name: 'Build Literature Matrix',
    icon: '📅',
    purpose: 'Compare selected papers side-by-side in a comparative grid across themes.',
    artifact: 'Literature Comparison Matrix',
    exit_conditions: [
      'Review all included papers mapped onto the grid rows.',
      'Ensure comparative fields (Method, Result, Dataset) compile cleanly.',
      'Confirm matrix structure is complete.'
    ],
    tcr_features: {
      transparency: 'Cell highlighting matching extraction confidence scores.',
      control: 'Select which extraction fields to show as matrix columns.',
      recovery: 'Restore matrix backup after structural resets.'
    }
  },
  {
    step_number: 9,
    name: 'Draft Synthesis',
    icon: '✍️',
    purpose: 'Synthesize literature findings and draft a structured Research Problem Card.',
    artifact: 'Research Problem Card',
    exit_conditions: [
      'Draft the problem statement, significance, and proposed research direction.',
      'Confirm the reference citation list matches included papers.',
      'Click the "Lock and Save Problem Card" button.'
    ],
    tcr_features: {
      transparency: 'Clear warning banner indicating how edits propagate downstream.',
      control: 'Full text-editing capabilities for all card sections.',
      recovery: 'Draft version history backups to restore previous text states.'
    }
  },
  {
    step_number: 10,
    name: 'Mentor Review',
    icon: '🎓',
    purpose: 'Compile all completed artifacts into a unified package for advisor review.',
    artifact: 'Mentor Review Brief Package',
    exit_conditions: [
      'Review the checklist of completed artifacts (Matrix, Problem Card, Search Query).',
      'Confirm all required steps have a "completed" status.',
      'Export the final package as Markdown or JSON.'
    ],
    tcr_features: {
      transparency: 'Completed step checklist showing missing/pending artifacts.',
      control: 'Choose file export format (Markdown format vs raw JSON data).',
      recovery: 'Session reloading keeps all exported artifacts in memory for updates.'
    }
  }
];

export default function CyclePreview({ currentStep, stepsProgress, onNavigate }) {
  const [selectedStepIndex, setSelectedStepIndex] = useState(currentStep - 1);
  const step = PREVIEW_STEPS[selectedStepIndex];
  
  // Find step progress info from current session
  const sessionStepProgress = stepsProgress?.find(s => s.step_number === step.step_number);
  const status = sessionStepProgress?.status || 'upcoming';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.lg}px`,
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* Header Panel */}
      <div style={{
        backgroundColor: colors.bgWhite,
        borderRadius: `${radius.panel}px`,
        padding: `${spacing.lg}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: colors.primary, fontWeight: 'bold' }}>
          Interactive Research Cycle Preview
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: colors.textMuted, lineHeight: '1.6' }}>
          Review the complete 10-step academic research cycle. Inspect the purpose, produced artifacts, 
          and the **explicit exit/end conditions** required to transition between steps.
        </p>
      </div>

      {/* Main Layout: 2 Columns */}
      <div style={{
        display: 'flex',
        gap: `${spacing.lg}px`,
        alignItems: 'stretch'
      }}>
        {/* Left Timeline Panel */}
        <div style={{
          width: '320px',
          backgroundColor: colors.bgWhite,
          borderRadius: `${radius.panel}px`,
          border: `1px solid ${colors.border}`,
          padding: `${spacing.base}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${spacing.xs}px`
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingLeft: '12px',
            marginBottom: '8px'
          }}>
            Steps Timeline
          </div>

          {PREVIEW_STEPS.map((s, idx) => {
            const isSelected = selectedStepIndex === idx;
            const stepProg = stepsProgress?.find(p => p.step_number === s.step_number);
            const stepStatus = stepProg?.status || 'upcoming';
            
            let badgeText = 'Upcoming';
            let badgeColor = colors.textMuted;
            let badgeBg = colors.bgMuted;
            
            if (stepStatus === 'completed') {
              badgeText = 'Completed';
              badgeColor = colors.success;
              badgeBg = '#E8F5E9';
            } else if (stepStatus === 'current') {
              badgeText = 'Current';
              badgeColor = colors.accent;
              badgeBg = colors.accentLight;
            }

            return (
              <div
                key={s.step_number}
                onClick={() => setSelectedStepIndex(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                  borderRadius: `${radius.sm}px`,
                  border: `1px solid ${isSelected ? colors.accent : 'transparent'}`,
                  backgroundColor: isSelected ? colors.accentLight : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? colors.primary : colors.textDark
                  }}>
                    {s.step_number}. {s.name}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: badgeColor,
                    backgroundColor: badgeBg
                  }}>
                    {badgeText}
                  </span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textMuted,
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {s.purpose}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Details Panel */}
        <div style={{
          flex: 1,
          backgroundColor: colors.bgWhite,
          borderRadius: `${radius.panel}px`,
          border: `1px solid ${colors.border}`,
          padding: `${spacing.lg}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${spacing.base}px`
        }}>
          {/* Header Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: `${spacing.base}px`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{step.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: colors.primary, fontWeight: 'bold' }}>
                  Step {step.step_number}: {step.name}
                </h3>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: stepColor(status),
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Status: {status}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate(step.step_number)}
              style={{
                backgroundColor: colors.primary,
                color: colors.bgWhite,
                border: 'none',
                borderRadius: `${radius.full}px`,
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryHover}
              onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
            >
              🚀 Jump to Step in Demo
            </button>
          </div>

          {/* Purpose */}
          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Core Purpose
            </h4>
            <p style={{ margin: 0, fontSize: '15px', color: colors.textDark, lineHeight: '1.6' }}>
              {step.purpose}
            </p>
          </div>

          {/* Exit/End Conditions */}
          <div style={{
            backgroundColor: '#F0FDFA',
            borderLeft: `4px solid ${colors.accent}`,
            borderRadius: `${radius.card}px`,
            padding: `${spacing.base}px`
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
              🎯 Exit & End Conditions
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: colors.textMuted, fontStyle: 'italic' }}>
              To complete this step and proceed to the next phase, the researcher must satisfy the following:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {step.exit_conditions.map((cond, idx) => (
                <li key={idx} style={{ fontSize: '14px', color: '#0F766E', lineHeight: '1.5' }}>
                  <strong>{cond}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Artifact Produced */}
          <div style={{
            border: `1px dashed ${colors.primary}`,
            borderRadius: `${radius.card}px`,
            padding: `${spacing.base}px`,
            backgroundColor: '#F8FAFC'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📦 Artifact Produced
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '20px' }}>📦</span>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: colors.primary }}>
                {step.artifact}
              </span>
            </div>
          </div>

          {/* TCR Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              T·C·R (Transparency, Control, Recovery) Patterns
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.primary }}>🔍 Transparency</div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', lineHeight: '1.4' }}>
                  {step.tcr_features.transparency}
                </div>
              </div>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.accent }}>🎛️ Control</div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', lineHeight: '1.4' }}>
                  {step.tcr_features.control}
                </div>
              </div>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: `${radius.sm}px`, padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.danger }}>🛡️ Recovery</div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', lineHeight: '1.4' }}>
                  {step.tcr_features.recovery}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
