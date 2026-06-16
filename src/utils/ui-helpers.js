/**
 * @module ui-helpers
 * @description Reusable UI component factory functions for consistent DOM creation.
 * Centralizes common UI patterns to reduce code duplication across page modules.
 */

import { sanitizeHTML } from './sanitize.js';
import { iconSVG } from './icon-helper.js';
import { formatCO2 } from './formatters.js';

/**
 * Maps an impact level string to the corresponding badge color class.
 * @param {'high' | 'medium' | 'low'} impact - The impact level.
 * @returns {'success' | 'info' | 'warning'} The badge color variant.
 */
export function getImpactBadgeColor(impact) {
  if (impact === 'high') return 'success';
  if (impact === 'medium') return 'info';
  return 'warning';
}

/**
 * Creates a styled tip/action card element.
 * @param {object} tip - The tip data object.
 * @param {string} tip.icon - Lucide icon name.
 * @param {string} tip.impact - Impact level ('high', 'medium', 'low').
 * @param {string} tip.title - Tip title.
 * @param {string} tip.description - Tip description.
 * @param {number} tip.savingsKgPerYear - Annual CO2 savings in kg.
 * @param {string} tip.difficulty - Difficulty level.
 * @param {object} [options] - Rendering options.
 * @param {boolean} [options.showDescription=true] - Whether to show the description text.
 * @param {boolean} [options.showDifficulty=true] - Whether to show the difficulty badge.
 * @returns {HTMLDivElement} The constructed card element (without action buttons).
 */
export function createTipCard(tip, options = {}) {
  const { showDescription = true, showDifficulty = true } = options;
  const badgeColor = getImpactBadgeColor(tip.impact);

  const card = document.createElement('div');
  card.className = 'card action-card p-5';

  card.innerHTML = sanitizeHTML(`
    <div class="flex-between-start mb-3">
      <div class="icon-wrapper mb-0" style="width:40px; height:40px;">${iconSVG(tip.icon, 20, '#10B981')}</div>
      <span class="badge badge-${badgeColor}">${tip.impact} Impact</span>
    </div>
    <h3 class="text-lg mb-2">${tip.title}</h3>
    ${showDescription ? `<p class="text-muted text-sm mb-2 flex-1">${tip.description}</p>` : ''}
    <div class="flex-between mb-4 text-sm font-semibold">
      <span class="text-primary">~${formatCO2(tip.savingsKgPerYear)}/yr</span>
      ${showDifficulty ? `<span class="text-muted">Difficulty: ${tip.difficulty}</span>` : ''}
    </div>
  `);

  return card;
}

/**
 * Creates a pledged action card with a toggle button.
 * @param {object} tip - The tip data object.
 * @param {boolean} isDone - Whether the pledge has been completed.
 * @param {Function} onToggle - Callback when the toggle button is clicked.
 * @returns {HTMLDivElement} The constructed pledge card element.
 */
export function createPledgeCard(tip, isDone, onToggle) {
  const badgeColor = getImpactBadgeColor(tip.impact);

  const card = document.createElement('div');
  card.className = `card action-card p-5 ${isDone ? 'done' : ''}`;
  if (isDone) {
    card.classList.add('opacity-muted', 'bg-muted');
  }

  card.innerHTML = sanitizeHTML(`
    <div class="flex-between-start mb-3">
      <div class="icon-wrapper mb-0" style="width:40px; height:40px;">${iconSVG(tip.icon, 20, '#10B981')}</div>
      <span class="badge badge-${badgeColor}">${tip.impact} Impact</span>
    </div>
    <h3 class="text-lg mb-2">${tip.title}</h3>
    <p class="text-muted text-sm mb-4 flex-1">Saves ~${formatCO2(tip.savingsKgPerYear)} / year</p>
  `);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = `btn btn-${isDone ? 'secondary' : 'primary'} w-full`;
  toggleBtn.innerHTML = isDone
    ? `${iconSVG('check-circle', 20)} Completed`
    : `${iconSVG('circle', 20)} Mark Complete`;
  toggleBtn.addEventListener('click', onToggle);

  card.appendChild(toggleBtn);
  return card;
}

/**
 * Creates a section heading element with an optional icon.
 * @param {string} text - The heading text.
 * @param {string} [iconName] - Optional Lucide icon name.
 * @param {string} [iconColor='#10B981'] - Icon stroke color.
 * @param {number} [iconSize=28] - Icon size in pixels.
 * @returns {HTMLHeadingElement} The heading element.
 */
export function createSectionHeading(text, iconName, iconColor = '#10B981', iconSize = 28) {
  const heading = document.createElement('h2');
  heading.className = 'flex items-center gap-2';
  if (iconName) {
    heading.innerHTML = `${iconSVG(iconName, iconSize, iconColor)} ${text}`;
  } else {
    heading.textContent = text;
  }
  return heading;
}

/**
 * Creates an empty-state placeholder message for grids.
 * @param {string} message - The message to display.
 * @returns {HTMLDivElement} The empty-state element.
 */
export function createEmptyState(message) {
  const el = document.createElement('div');
  el.className = 'col-span-full text-center p-8 text-muted';
  el.textContent = message;
  return el;
}
