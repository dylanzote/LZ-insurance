/**
 * Theme Color Constants
 * 
 * Centralized color definitions for consistent design across the app.
 * All colors should be defined here and referenced via theme.
 */

import type { Theme } from './types';

/**
 * Action colors for quick actions, status indicators, etc.
 * These are semantic colors that can be themed.
 */
export const actionColors = {
  // Quick action colors
  claim: '#FF6B6B',
  coverage: '#4ECDC4',
  document: '#45B7D1',
  billing: '#96CEB4',
  driving: '#6C5CE7',
  
  // Support action colors
  contact: '#6C5CE7',
  faq: '#FD79A8',
  chat: '#00B894',
  
  // Policy type colors
  auto: '#FF6B6B',
  home: '#4ECDC4',
  life: '#45B7D1',
  health: '#96CEB4',
  motorcycle: '#6C5CE7',
  travel: '#FD79A8',
} as const;

/**
 * Get action color by key
 */
export const getActionColor = (key: keyof typeof actionColors, theme: Theme): string => {
  // In the future, these could be theme-aware
  // For now, return the constant color
  return actionColors[key];
};

/**
 * Get gradient colors for an action
 */
export const getActionGradient = (key: keyof typeof actionColors): [string, string] => {
  const baseColor = actionColors[key];
  // Generate a lighter variant for gradient
  const lighter = lightenColor(baseColor, 15);
  return [baseColor, lighter];
};

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Status colors that should use theme colors
 */
export const getStatusColor = (status: string, theme: Theme): string => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'active':
    case 'paid':
    case 'approved':
      return theme.colors.success;
    case 'error':
    case 'rejected':
    case 'failed':
    case 'overdue':
      return theme.colors.error;
    case 'warning':
    case 'pending':
    case 'in-review':
      return theme.colors.warning;
    case 'info':
    case 'submitted':
      return theme.colors.info;
    default:
      return theme.colors.textSecondary;
  }
};

