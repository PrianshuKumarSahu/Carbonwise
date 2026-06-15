/**
 * @module dashboard
 * @description Dashboard page module showing carbon footprint results.
 */

import { navigate } from '../router.js';
import { getState, loadHistory } from '../state.js';
import { formatCO2, formatPercent, formatComparison, formatDate } from '../utils/formatters.js';
import { createDoughnutChart, createLineChart, createBarChart, createRadialGauge } from '../components/charts.js';
import { AVERAGES } from '../data/emission-factors.js';
import { TIPS } from '../data/tips.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';

export default function render(container) {
  const state = getState();
  const results = state.results;
  
  const page = document.createElement('div');
  page.className = 'page-dashboard animate-fadeIn';
  
  if (!results) {
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
  
  const history = loadHistory();
  const charts = [];
  
  // Header
  const header = document.createElement('div');
  header.style.marginBottom = 'var(--space-8)';
  header.innerHTML = `<h1>Your Personal Dashboard</h1>`;
  page.appendChild(header);
  
  // Top Stats Row
  const topStats = document.createElement('div');
  topStats.className = 'grid grid-3';
  topStats.style.marginBottom = 'var(--space-8)';
  
  // 1. Total Gauge
  const totalCard = document.createElement('div');
  totalCard.className = 'card card-body text-center';
  const gaugeContainer = document.createElement('div');
  gaugeContainer.className = 'chart-container';
  gaugeContainer.style.height = '200px';
  const gaugeCanvas = document.createElement('canvas');
  gaugeContainer.appendChild(gaugeCanvas);
  
  const totalVal = document.createElement('div');
  totalVal.style.fontSize = '2.5rem';
  totalVal.style.fontWeight = '800';
  totalVal.style.color = 'var(--color-fg)';
  totalVal.style.marginTop = '-50px';
  totalVal.textContent = formatCO2(results.totalAnnual);
  
  const totalLabel = document.createElement('div');
  totalLabel.className = 'label';
  totalLabel.style.color = 'var(--color-fg-muted)';
  totalLabel.textContent = 'Total Annual Emissions';
  
  totalCard.appendChild(gaugeContainer);
  totalCard.appendChild(totalVal);
  totalCard.appendChild(totalLabel);
  topStats.appendChild(totalCard);
  
  // 2. vs World
  const worldComp = formatComparison(results.totalAnnual, AVERAGES.WORLD_AVERAGE_ANNUAL);
  const worldCard = document.createElement('div');
  worldCard.className = 'card stats-card';
  worldCard.innerHTML = `
    <div class="value" style="color: var(--color-${worldComp.color}); font-size: 2.5rem;">
      ${worldComp.label === 'above' ? '+' : '-'}${worldComp.percent}
    </div>
    <div class="label">vs. World Average</div>
    <p style="font-size: 0.875rem; margin-top: var(--space-2); color: var(--color-fg-muted);">
      You are ${worldComp.label} the global average of ${formatCO2(AVERAGES.WORLD_AVERAGE_ANNUAL)}.
    </p>
  `;
  topStats.appendChild(worldCard);
  
  // 3. Tracking Entries
  const trackingCard = document.createElement('div');
  trackingCard.className = 'card stats-card';
  trackingCard.innerHTML = `
    <div class="value" style="color: var(--color-info);">${history.length}</div>
    <div class="label">Tracking Entries</div>
    <p style="font-size: 0.875rem; margin-top: var(--space-2); color: var(--color-fg-muted);">
      ${history.length > 1 ? `Last updated: ${formatDate(history[history.length-1].date)}` : 'Keep tracking to see trends!'}
    </p>
  `;
  topStats.appendChild(trackingCard);
  
  page.appendChild(topStats);
  
  // Charts Row 2
  const grid2 = document.createElement('div');
  grid2.className = 'grid grid-2';
  grid2.style.marginBottom = 'var(--space-8)';
  
  // Breakdown
  const breakdownCard = document.createElement('div');
  breakdownCard.className = 'card';
  breakdownCard.innerHTML = `<div class="card-header"><h3>Category Breakdown</h3></div>`;
  const breakdownBody = document.createElement('div');
  breakdownBody.className = 'card-body';
  const breakdownCanvasContainer = document.createElement('div');
  breakdownCanvasContainer.className = 'chart-container';
  const breakdownCanvas = document.createElement('canvas');
  breakdownCanvasContainer.appendChild(breakdownCanvas);
  breakdownBody.appendChild(breakdownCanvasContainer);
  breakdownCard.appendChild(breakdownBody);
  grid2.appendChild(breakdownCard);
  
  // Trend (or Comparison if no history)
  const trendCard = document.createElement('div');
  trendCard.className = 'card';
  const trendBody = document.createElement('div');
  trendBody.className = 'card-body';
  const trendCanvasContainer = document.createElement('div');
  trendCanvasContainer.className = 'chart-container';
  const trendCanvas = document.createElement('canvas');
  trendCanvasContainer.appendChild(trendCanvas);
  trendBody.appendChild(trendCanvasContainer);
  trendCard.appendChild(trendBody);
  
  if (history.length > 1) {
    trendCard.insertAdjacentHTML('afterbegin', '<div class="card-header"><h3>Your Carbon Trend</h3></div>');
    grid2.appendChild(trendCard);
  } else {
    trendCard.insertAdjacentHTML('afterbegin', '<div class="card-header"><h3>Global Comparison</h3></div>');
    grid2.appendChild(trendCard);
  }
  
  page.appendChild(grid2);
  
  // Insights Section
  const insightsSection = document.createElement('div');
  insightsSection.style.marginBottom = 'var(--space-8)';
  insightsSection.innerHTML = `<h2>Personalized Insights</h2>`;
  
  const insightsGrid = document.createElement('div');
  insightsGrid.className = 'grid grid-3';
  
  // Determine top categories
  const cats = Object.entries(results.categories).sort((a, b) => b[1] - a[1]);
  const topCats = cats.slice(0, 3);
  
  topCats.forEach(([catName, value], index) => {
    // Find relevant tips for this category
    const catTips = TIPS.filter(t => 
      t.category === catName || 
      (catName === 'shopping' && t.category === 'lifestyle') ||
      (catName === 'home' && t.category === 'energy')
    ).sort((a, b) => b.savingsKgPerYear - a.savingsKgPerYear);
    
    const tip = catTips[0] || TIPS[index];
    
    const card = document.createElement('div');
    card.className = 'card action-card p-5';
    card.style.padding = 'var(--space-5)';
    
    card.innerHTML = `
      <div class="icon-wrapper">${iconSVG(tip.icon ? tip.icon.charAt(0).toUpperCase() + tip.icon.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : 'Lightbulb', 24, '#10B981')}</div>
      <h3 style="margin-bottom: var(--space-2); text-transform: capitalize;">${catName} Impact</h3>
      <p style="color: var(--color-fg-muted); margin-bottom: var(--space-4);">
        This accounts for ${formatPercent((value / results.totalAnnual) * 100)} of your footprint.
      </p>
      <div style="background: var(--color-muted); padding: var(--space-3); border-radius: var(--radius-md); margin-top: auto;">
        <div style="font-weight: 600; font-size: 0.875rem; color: var(--color-primary); margin-bottom: var(--space-1); display:flex; align-items:center; gap:4px;">${iconSVG('Lightbulb', 16, '#F59E0B')} Top Tip:</div>
        <div style="font-weight: 600;">${tip.title}</div>
        <div style="font-size: 0.875rem; color: var(--color-fg-muted);">${tip.description}</div>
      </div>
    `;
    insightsGrid.appendChild(card);
  });
  
  insightsSection.appendChild(insightsGrid);
  
  const reduceCta = document.createElement('div');
  reduceCta.className = 'text-center';
  reduceCta.style.marginTop = 'var(--space-6)';
  reduceCta.innerHTML = `
    <button class="btn btn-primary" onclick="window.location.hash='#/reduce'">
      ${iconSVG('ArrowRight', 20)} Explore All Reduction Strategies
    </button>
  `;
  insightsSection.appendChild(reduceCta);
  
  page.appendChild(insightsSection);
  
  container.appendChild(page);
  
  // Render Charts safely after DOM insertion
  setTimeout(() => {
    // Gauge
    charts.push(createRadialGauge(gaugeCanvas, results.totalAnnual, AVERAGES.WORLD_AVERAGE_ANNUAL * 2, 'Your Footprint'));
    
    // Doughnut
    charts.push(createDoughnutChart(
      breakdownCanvas, 
      ['Transport', 'Home Energy', 'Diet', 'Shopping'],
      [results.categories.transport, results.categories.home, results.categories.diet, results.categories.shopping]
    ));
    
    // Trend or Bar
    if (history.length > 1) {
      const labels = history.map(h => formatDate(h.date).split(',')[0]);
      const data = history.map(h => h.totalAnnual);
      charts.push(createLineChart(trendCanvas, labels, [{ label: 'Total kg CO₂e', data }]));
    } else {
      charts.push(createBarChart(
        trendCanvas,
        ['You', 'World', 'US', 'EU', 'India', 'UK'],
        [results.totalAnnual, AVERAGES.WORLD_AVERAGE_ANNUAL, AVERAGES.US_AVERAGE_ANNUAL, AVERAGES.EU_AVERAGE_ANNUAL, AVERAGES.INDIA_AVERAGE_ANNUAL, AVERAGES.UK_AVERAGE_ANNUAL],
        ['#059669', '#64748B', '#64748B', '#64748B', '#64748B', '#64748B']
      ));
    }
    
    createIcons({ root: page });
  }, 0);
  
  return () => {
    charts.forEach(chart => chart && chart.destroy());
  };
}
