/**
 * @module formatters
 * @description Formatting functions for UI display.
 */

/**
 * Formats CO2 equivalent values
 * @param {number} kg Kilograms of CO2e
 * @returns {string} Formatted string
 */
export function formatCO2(kg) {
  if (typeof kg !== 'number' || isNaN(kg)) return '0 kg';
  
  if (kg >= 1000) {
    const tonnes = (kg / 1000).toFixed(1);
    return `${tonnes} tonnes`;
  }
  
  return `${Math.round(kg)} kg`;
}

/**
 * Formats percentage
 * @param {number} value Percentage value
 * @returns {string} Formatted string
 */
export function formatPercent(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}

/**
 * Formats general numbers with commas
 * @param {number} num Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

/**
 * Formats a date string to a readable format
 * @param {string} dateStr ISO date string
 * @returns {string} Formatted string
 */
export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return 'Unknown date';
  }
}

/**
 * Returns a relative time string (e.g. "3 days ago")
 * @param {string} dateStr ISO date string
 * @returns {string} Formatted string
 */
export function getRelativeTime(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return 'Unknown time';
  }
}

/**
 * Formats a comparison between user and average
 * @param {number} userKg User's CO2
 * @param {number} avgKg Average CO2
 * @returns {Object} Comparison data
 */
export function formatComparison(userKg, avgKg) {
  if (!userKg || !avgKg) return { percent: '0%', label: 'equal to', color: 'info' };
  
  const diff = userKg - avgKg;
  const percentChange = Math.abs((diff / avgKg) * 100);
  const formattedPercent = formatPercent(percentChange);
  
  if (diff > 0) {
    return { percent: formattedPercent, label: 'above', color: 'danger' };
  } else if (diff < 0) {
    return { percent: formattedPercent, label: 'below', color: 'success' };
  }
  
  return { percent: '0%', label: 'equal to', color: 'info' };
}
