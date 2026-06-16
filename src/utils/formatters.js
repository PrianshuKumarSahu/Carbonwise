/**
 * @module formatters
 * @description Formatting functions for UI display.
 */

const KG_PER_TONNE = 1000;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;
const PERCENT_MULTIPLIER = 100;

/**
 * Formats CO2 equivalent values.
 * @param {number} kg Kilograms of CO2e.
 * @returns {string} Formatted string.
 */
export function formatCO2(kg) {
  if (typeof kg !== 'number' || isNaN(kg)) return '0 kg';
  
  if (kg >= KG_PER_TONNE) {
    const tonnes = (kg / KG_PER_TONNE).toFixed(1);
    return `${tonnes} tonnes`;
  }
  
  return `${Math.round(kg)} kg`;
}

/**
 * Formats a percentage.
 * @param {number} value Percentage value.
 * @returns {string} Formatted string.
 */
export function formatPercent(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}

/**
 * Formats general numbers with commas.
 * @param {number} num Number to format.
 * @returns {string} Formatted string.
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

/**
 * Formats a date string to a readable format.
 * @param {string} dateStr ISO date string.
 * @returns {string} Formatted string.
 */
export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.warn('Invalid date format:', error);
    return 'Unknown date';
  }
}

/**
 * Returns a relative time string (e.g. "3 days ago").
 * @param {string} dateStr ISO date string.
 * @returns {string} Formatted string.
 */
export function getRelativeTime(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / MS_PER_DAY);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < DAYS_PER_WEEK) return `${diffDays} days ago`;
    if (diffDays < DAYS_PER_MONTH) return `${Math.floor(diffDays / DAYS_PER_WEEK)} weeks ago`;
    if (diffDays < DAYS_PER_YEAR) return `${Math.floor(diffDays / DAYS_PER_MONTH)} months ago`;
    return `${Math.floor(diffDays / DAYS_PER_YEAR)} years ago`;
  } catch (error) {
    console.warn('Invalid date for relative time:', error);
    return 'Unknown time';
  }
}

/**
 * @typedef {Object} ComparisonResult
 * @property {string} percent
 * @property {'above' | 'below' | 'equal to'} label
 * @property {'danger' | 'success' | 'info'} color
 */

/**
 * Formats a comparison between user and average.
 * @param {number} userKg User's CO2.
 * @param {number} avgKg Average CO2.
 * @returns {ComparisonResult} Comparison data.
 */
export function formatComparison(userKg, avgKg) {
  if (!userKg || !avgKg) return { percent: '0%', label: 'equal to', color: 'info' };
  
  const diff = userKg - avgKg;
  const percentChange = Math.abs((diff / avgKg) * PERCENT_MULTIPLIER);
  const formattedPercent = formatPercent(percentChange);
  
  if (diff > 0) {
    return { percent: formattedPercent, label: 'above', color: 'danger' };
  } else if (diff < 0) {
    return { percent: formattedPercent, label: 'below', color: 'success' };
  }
  
  return { percent: '0%', label: 'equal to', color: 'info' };
}
