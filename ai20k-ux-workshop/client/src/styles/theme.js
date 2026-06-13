// client/src/styles/theme.js

export const colors = {
  // Primary palette
  primary:        '#1E3A5F',   // Deep blue — headers, primary buttons, active nav
  primaryHover:   '#16304F',   // Darker blue on hover
  primaryLight:   '#E8EFF7',   // Light blue tint for selected states

  // Accent
  accent:         '#2BA4A0',   // Teal — current step, confirm buttons, active indicators
  accentLight:    '#E8F4F3',   // Light teal for active step background
  accentHover:    '#239490',   // Darker teal on hover

  // Semantic
  success:        '#4CAF50',   // Green — completed steps, high confidence
  warning:        '#F59E0B',   // Amber — medium confidence, needs-rerun, caution
  danger:         '#EF4444',   // Coral — errors, low confidence, failed steps
  info:           '#3B82F6',   // Blue — edited badges, informational

  // Text
  textDark:       '#1F2937',   // Primary text
  textMuted:      '#6B7280',   // Secondary text, labels, placeholders
  textLight:      '#9CA3AF',   // Disabled text, timestamps

  // Background
  bgPage:         '#F7F9FC',   // Page background
  bgWhite:        '#FFFFFF',   // Card/panel backgrounds
  bgMuted:        '#F3F4F6',   // Subtle section backgrounds
  bgUserInput:    '#EFF6FF',   // User's input highlight

  // Border
  border:         '#E5E7EB',   // Default borders
  borderLight:    '#F3F4F6',   // Subtle dividers
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  base: 16,    // Base unit
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   6,
  card: 8,     // Cards, inputs
  panel: 12,   // Panels, modals
  full: 9999,  // Buttons, badges, pills
};

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  baseFontSize: 16,
  lineHeight: 1.6,
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const shadows = {
  sm:   '0 1px 2px rgba(0,0,0,0.05)',
  md:   '0 4px 6px rgba(0,0,0,0.07)',
  lg:   '0 10px 15px rgba(0,0,0,0.1)',
};

// Step progress color helper
export function stepColor(status) {
  switch (status) {
    case 'completed': return colors.success;     // #4CAF50
    case 'current':   return colors.accent;      // #2BA4A0
    case 'upcoming':  return colors.textMuted;   // #6B7280
    case 'error':     return colors.danger;       // #EF4444
    case 'needs-rerun': return colors.warning;   // #F59E0B
    default:          return colors.textMuted;
  }
}

// Confidence color helper
export function confidenceColor(score) {
  if (score === -1) return colors.info;     // Blue — manually edited
  if (score >= 80) return colors.success;   // Green — high confidence
  if (score >= 50) return colors.warning;   // Amber — medium confidence
  return colors.danger;                     // Coral — low confidence
}

// Confidence label helper
export function confidenceLabel(score) {
  if (score === -1) return 'Verified (Edited)';
  if (score >= 80) return 'High confidence';
  if (score >= 50) return 'Medium confidence';
  return 'Low confidence';
}
