/**
 * @module dashboard
 * @description Dashboard page displaying carbon footprint calculation results.
 *
 * Renders three main sections:
 * 1. **Stats Row** — Total emissions gauge, world comparison, and tracking entries.
 * 2. **Charts Row** — Category breakdown doughnut and trend/comparison bar chart.
 * 3. **Insights** — Personalized reduction tips based on highest-impact categories.
 *
 * All Chart.js instances are tracked for proper cleanup on page teardown.
 *
 * @requires ../router.js - Hash-based navigation.
 * @requires ../state.js - Application state management.
 * @requires ../utils/formatters.js - Number and CO₂ formatting utilities.
 * @requires ../components/charts.js - Chart.js wrapper functions.
 * @requires ../data/emission-factors.js - Global emission averages.
 * @requires ../data/tips.js - Reduction tip definitions.
 * @requires ../utils/sanitize.js - XSS-safe HTML injection.
 * @requires ../utils/icon-helper.js - Inline SVG icon rendering.
 */


import { getState, loadHistory } from '../state.js';
import { formatCO2, formatPercent, formatComparison, formatDate } from '../utils/formatters.js';
import {
  createDoughnutChart,
  createLineChart,
  createBarChart,
  createRadialGauge,
} from '../components/charts.js';
import { AVERAGES } from '../data/emission-factors.js';
import { TIPS } from '../data/tips.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';

/**
 * Renders a "no data" prompt when the user hasn't calculated their footprint yet.
 * @param {HTMLElement} container - The parent DOM element.
 * @returns {Function} No-op cleanup function.
 */
function renderEmptyState(container) {
  const page = document.createElement('div');
  page.className = 'page-dashboard animate-fadeIn';
  page.innerHTML = `
    <div class="hero">
      <h2>You haven't calculated your footprint yet!</h2>
      <p>Take our quick calculator to see your personalized dashboard.</p>
      <button class="btn btn-primary" onclick="window.location.hash='#/calculator'">
        Calculate Now
      </button>
    </div>
  `;
  container.appendChild(page);
  return () => {};
}

/**
 * Creates a canvas element wrapped inside a chart container div.
 * @param {string} [height='200px'] - CSS height for the container.
 * @returns {{ container: HTMLDivElement, canvas: HTMLCanvasElement }}
 */
function createChartCanvas(height = '200px') {
  const container = document.createElement('div');
  container.className = 'chart-container';
  container.style.height = height;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  return { container, canvas };
}

/**
 * Builds the total emissions gauge card.
 * @param {number} totalAnnual - Total annual emissions in kg CO₂e.
 * @returns {{ card: HTMLDivElement, canvas: HTMLCanvasElement }}
 */
function buildGaugeCard(totalAnnual) {
  const card = document.createElement('div');
  card.className = 'card card-body text-center';

  const { container, canvas } = createChartCanvas('200px');

  const valueEl = document.createElement('div');
  valueEl.className = 'text-3xl font-extrabold';
  valueEl.style.marginTop = '-50px';
  valueEl.textContent = formatCO2(totalAnnual);

  const labelEl = document.createElement('div');
  labelEl.className = 'label text-muted';
  labelEl.textContent = 'Total Annual Emissions';

  card.appendChild(container);
  card.appendChild(valueEl);
  card.appendChild(labelEl);

  return { card, canvas };
}

/**
 * Builds a comparison stats card (e.g., vs. World Average).
 * @param {number} totalAnnual - User's annual emissions.
 * @param {number} average - The comparison average.
 * @param {string} label - Comparison label (e.g., "World Average").
 * @returns {HTMLDivElement} The stats card element.
 */
function buildComparisonCard(totalAnnual, average, label) {
  const comp = formatComparison(totalAnnual, average);
  const card = document.createElement('div');
  card.className = 'card stats-card';
  card.innerHTML = `
    <div class="value text-3xl" style="color: var(--color-${comp.color});">
      ${comp.label === 'above' ? '+' : '-'}${comp.percent}
    </div>
    <div class="label">vs. ${label}</div>
    <p class="text-sm mt-2 text-muted">
      You are ${comp.label} the global average of ${formatCO2(average)}.
    </p>
  `;
  return card;
}

/**
 * Builds the tracking entries stats card.
 * @param {Array} history - Array of historical calculation entries.
 * @returns {HTMLDivElement} The stats card element.
 */
function buildTrackingCard(history) {
  const card = document.createElement('div');
  card.className = 'card stats-card';
  card.innerHTML = `
    <div class="value" style="color: var(--color-info);">${history.length}</div>
    <div class="label">Tracking Entries</div>
    <p class="text-sm mt-2 text-muted">
      ${history.length > 1
        ? `Last updated: ${formatDate(history[history.length - 1].date)}`
        : 'Keep tracking to see trends!'}
    </p>
  `;
  return card;
}

/**
 * Builds the personalized insights section with top-category tips.
 * @param {object} results - Calculation results with categories.
 * @returns {HTMLDivElement} The insights section element.
 */
function buildInsightsSection(results) {
  const section = document.createElement('div');
  section.className = 'mb-8';
  section.innerHTML = '<h2>Personalized Insights</h2>';

  const grid = document.createElement('div');
  grid.className = 'grid grid-3';

  const sortedCategories = Object.entries(results.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  sortedCategories.forEach(([catName, value], index) => {
    const catTips = TIPS
      .filter((t) =>
        t.category === catName ||
        (catName === 'shopping' && t.category === 'lifestyle') ||
        (catName === 'home' && t.category === 'energy')
      )
      .sort((a, b) => b.savingsKgPerYear - a.savingsKgPerYear);

    const tip = catTips[0] || TIPS[index];

    const card = document.createElement('div');
    card.className = 'card action-card p-5';

    const iconName = tip.icon
      ? tip.icon.charAt(0).toUpperCase() + tip.icon.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      : 'Lightbulb';

    card.innerHTML = sanitizeHTML(`
      <div class="icon-wrapper">${iconSVG(iconName, 24, '#10B981')}</div>
      <h3 class="mb-2 capitalize">${catName} Impact</h3>
      <p class="text-muted mb-4">
        This accounts for ${formatPercent((value / results.totalAnnual) * 100)} of your footprint.
      </p>
      <div class="bg-muted p-3 rounded-md" style="margin-top: auto;">
        <div class="font-semibold text-sm text-primary mb-1 flex items-center gap-2">
          ${iconSVG('Lightbulb', 16, '#F59E0B')} Top Tip:
        </div>
        <div class="font-semibold">${tip.title}</div>
        <div class="text-sm text-muted">${tip.description}</div>
      </div>
    `);

    grid.appendChild(card);
  });

  section.appendChild(grid);

  // CTA button
  const cta = document.createElement('div');
  cta.className = 'text-center mt-6';
  cta.innerHTML = sanitizeHTML(`
    <button class="btn btn-primary" onclick="window.location.hash='#/reduce'">
      ${iconSVG('ArrowRight', 20)} Explore All Reduction Strategies
    </button>
  `);
  section.appendChild(cta);

  return section;
}

/**
 * Renders the Dashboard page into the provided container.
 * @param {HTMLElement} container - The parent DOM element to render into.
 * @returns {Function} Cleanup function that destroys all Chart.js instances.
 */
export default function render(container) {
  const state = getState();
  const results = state.results;

  if (!results) return renderEmptyState(container);

  const page = document.createElement('div');
  page.className = 'page-dashboard animate-fadeIn';

  const history = loadHistory();
  /** @type {import('chart.js').Chart[]} Active chart instances for cleanup. */
  const charts = [];

  // ─── Header ────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = '<h1>Your Personal Dashboard</h1>';
  page.appendChild(header);

  // ─── Top Stats Row ─────────────────────────────────────────────
  const topStats = document.createElement('div');
  topStats.className = 'grid grid-3 mb-8';

  const { card: gaugeCard, canvas: gaugeCanvas } = buildGaugeCard(results.totalAnnual);
  topStats.appendChild(gaugeCard);
  topStats.appendChild(buildComparisonCard(results.totalAnnual, AVERAGES.WORLD_AVERAGE_ANNUAL, 'World Average'));
  topStats.appendChild(buildTrackingCard(history));
  page.appendChild(topStats);

  // ─── Charts Row ────────────────────────────────────────────────
  const chartsRow = document.createElement('div');
  chartsRow.className = 'grid grid-2 mb-8';

  // Breakdown doughnut
  const breakdownCard = document.createElement('div');
  breakdownCard.className = 'card';
  breakdownCard.innerHTML = '<div class="card-header"><h3>Category Breakdown</h3></div>';
  const breakdownBody = document.createElement('div');
  breakdownBody.className = 'card-body';
  const { container: breakdownContainer, canvas: breakdownCanvas } = createChartCanvas();
  breakdownBody.appendChild(breakdownContainer);
  breakdownCard.appendChild(breakdownBody);
  chartsRow.appendChild(breakdownCard);

  // Trend or comparison
  const trendCard = document.createElement('div');
  trendCard.className = 'card';
  const trendTitle = history.length > 1 ? 'Your Carbon Trend' : 'Global Comparison';
  trendCard.insertAdjacentHTML('afterbegin', `<div class="card-header"><h3>${trendTitle}</h3></div>`);
  const trendBody = document.createElement('div');
  trendBody.className = 'card-body';
  const { container: trendContainer, canvas: trendCanvas } = createChartCanvas();
  trendBody.appendChild(trendContainer);
  trendCard.appendChild(trendBody);
  chartsRow.appendChild(trendCard);
  page.appendChild(chartsRow);

  // ─── Insights ──────────────────────────────────────────────────
  page.appendChild(buildInsightsSection(results));
  container.appendChild(page);

  // ─── Render Charts (after DOM insertion) ───────────────────────
  setTimeout(() => {
    charts.push(
      createRadialGauge(gaugeCanvas, results.totalAnnual, AVERAGES.WORLD_AVERAGE_ANNUAL * 2, 'Your Footprint'),
    );

    charts.push(
      createDoughnutChart(
        breakdownCanvas,
        ['Transport', 'Home Energy', 'Diet', 'Shopping'],
        [results.categories.transport, results.categories.home, results.categories.diet, results.categories.shopping],
      ),
    );

    if (history.length > 1) {
      const labels = history.map((h) => formatDate(h.date).split(',')[0]);
      const data = history.map((h) => h.totalAnnual);
      charts.push(createLineChart(trendCanvas, labels, [{ label: 'Total kg CO₂e', data }]));
    } else {
      charts.push(
        createBarChart(
          trendCanvas,
          ['You', 'World', 'US', 'EU', 'India', 'UK'],
          [
            results.totalAnnual,
            AVERAGES.WORLD_AVERAGE_ANNUAL,
            AVERAGES.US_AVERAGE_ANNUAL,
            AVERAGES.EU_AVERAGE_ANNUAL,
            AVERAGES.INDIA_AVERAGE_ANNUAL,
            AVERAGES.UK_AVERAGE_ANNUAL,
          ],
          ['#059669', '#64748B', '#64748B', '#64748B', '#64748B', '#64748B'],
        ),
      );
    }

    createIcons({ root: page });
  }, 0);

  return () => {
    charts.forEach((chart) => chart && chart.destroy());
  };
}
