/**
 * @module reduce
 * @description Reduction tips and pledges page.
 *
 * Displays actionable carbon reduction strategies organized by category.
 * Users can pledge to take specific actions and mark them as complete.
 * If calculator results exist, shows projected impact of pledges.
 *
 * @requires ../state.js - For reading/writing pledges and completed actions.
 * @requires ../data/tips.js - Reduction tip definitions.
 * @requires ../utils/formatters.js - CO₂ formatting utilities.
 * @requires ../utils/ui-helpers.js - Reusable card factory functions.
 */

import { getState, setState } from '../state.js';
import { TIPS } from '../data/tips.js';
import { formatCO2 } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';
import {
  createTipCard,
  createPledgeCard,
  createSectionHeading,
  createEmptyState,
} from '../utils/ui-helpers.js';

/** @type {string} Currently selected category filter. */
let currentCategory = 'all';

/**
 * Calculates the total potential CO₂ savings from a list of pledge IDs.
 * @param {string[]} pledgeIds - Array of tip IDs the user has pledged.
 * @returns {number} Total projected savings in kg CO₂e per year.
 */
function calculatePledgeSavings(pledgeIds) {
  return pledgeIds.reduce((acc, pId) => {
    const tip = TIPS.find((t) => t.id === pId);
    return acc + (tip ? tip.savingsKgPerYear : 0);
  }, 0);
}

/**
 * Builds the projected impact box shown in the header.
 * @param {number} currentTotal - Current annual emissions in kg CO₂e.
 * @param {number} newTotal - Projected annual emissions after pledges.
 * @returns {HTMLDivElement} The impact box element.
 */
function buildImpactBox(currentTotal, newTotal) {
  const box = document.createElement('div');
  box.className = 'bg-muted p-4 rounded-lg inline-block mt-4';
  box.innerHTML = sanitizeHTML(`
    <div class="text-muted font-semibold mb-2">Projected Impact of Pledges</div>
    <div class="text-2xl font-extrabold text-primary">
      ${formatCO2(currentTotal)} ${iconSVG('arrow-right', 20, '#10B981')} ${formatCO2(newTotal)}
    </div>
  `);
  return box;
}

/**
 * Builds the category filter tab bar.
 * @param {Function} onSelect - Callback invoked with the selected category string.
 * @returns {HTMLDivElement} The tab list element.
 */
function buildCategoryTabs(onSelect) {
  const tabs = document.createElement('div');
  tabs.className = 'tab-list';

  const categories = ['all', 'transport', 'energy', 'diet', 'shopping', 'lifestyle'];
  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = `tab ${currentCategory === cat ? 'active' : ''}`;
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.addEventListener('click', () => onSelect(cat));
    tabs.appendChild(btn);
  });

  return tabs;
}

/**
 * Renders the Reduce page into the provided container.
 * @param {HTMLElement} container - The parent DOM element to render into.
 * @returns {Function} Cleanup function to remove event listeners.
 */
export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-reduce animate-fadeIn';

  const renderContent = () => {
    const state = getState();
    const pledges = state.pledges || [];
    const completed = state.completedActions || [];

    page.innerHTML = '';

    // ─── Header ──────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'hero pt-8';
    header.innerHTML = `
      <h1>Reduce Your Footprint</h1>
      <p>Pledge to make changes and track your impact.</p>
    `;

    if (state.results) {
      const savings = calculatePledgeSavings(pledges);
      const newTotal = Math.max(0, state.results.totalAnnual - savings);
      header.appendChild(buildImpactBox(state.results.totalAnnual, newTotal));
    }

    page.appendChild(header);

    // ─── Pledged Actions ─────────────────────────────────────────
    if (pledges.length > 0) {
      const pledgeSec = document.createElement('div');
      pledgeSec.className = 'mb-10';
      pledgeSec.appendChild(createSectionHeading('Your Pledges', 'target', '#F59E0B'));

      const pledgeGrid = document.createElement('div');
      pledgeGrid.className = 'grid grid-3';

      pledges.forEach((pId) => {
        const tip = TIPS.find((t) => t.id === pId);
        if (!tip) return;

        const isDone = completed.includes(pId);
        const card = createPledgeCard(tip, isDone, () => {
          if (isDone) {
            setState({ completedActions: completed.filter((id) => id !== pId) });
          } else {
            setState({ completedActions: [...completed, pId] });
            showToast('Action completed! Great job.', 'success');
          }
          renderContent();
        });

        pledgeGrid.appendChild(card);
      });

      pledgeSec.appendChild(pledgeGrid);
      page.appendChild(pledgeSec);
    }

    // ─── Discover Tips ───────────────────────────────────────────
    const discSec = document.createElement('div');
    discSec.appendChild(createSectionHeading('Discover Actions'));
    discSec.appendChild(buildCategoryTabs((cat) => {
      currentCategory = cat;
      renderContent();
    }));

    const tipGrid = document.createElement('div');
    tipGrid.className = 'grid grid-3';

    const filteredTips = TIPS
      .filter((t) => currentCategory === 'all' || t.category === currentCategory)
      .filter((t) => !pledges.includes(t.id));

    if (filteredTips.length === 0) {
      tipGrid.appendChild(createEmptyState('You\'ve pledged all actions in this category!'));
    }

    filteredTips.forEach((tip) => {
      const card = createTipCard(tip);

      const pledgeBtn = document.createElement('button');
      pledgeBtn.className = 'btn btn-outline w-full';
      pledgeBtn.innerHTML = `${iconSVG('heart', 16)} Pledge Action`;
      pledgeBtn.addEventListener('click', () => {
        setState({ pledges: [...pledges, tip.id] });
        showToast('Pledge added!', 'success');
        renderContent();
      });

      card.appendChild(pledgeBtn);
      tipGrid.appendChild(card);
    });

    discSec.appendChild(tipGrid);
    page.appendChild(discSec);

    if (!page.parentNode) {
      container.appendChild(page);
    }

    setTimeout(() => createIcons({ root: page }), 0);
  };

  renderContent();

  return () => {};
}
