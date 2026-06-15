/**
 * @module reduce
 * @description Reduction tips and pledges page.
 */

import { getState, setState } from '../state.js';
import { TIPS } from '../data/tips.js';
import { formatCO2 } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';

export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-reduce animate-fadeIn';
  
  let currentCategory = 'all';
  
  const renderContent = () => {
    const state = getState();
    const pledges = state.pledges || [];
    const completed = state.completedActions || [];
    
    page.innerHTML = '';
    
    // Header
    const header = document.createElement('div');
    header.className = 'hero';
    header.style.paddingTop = 'var(--space-8)';
    header.innerHTML = `
      <h1>Reduce Your Footprint</h1>
      <p>Pledge to make changes and track your impact.</p>
    `;
    
    if (state.results) {
      const potential = pledges.reduce((acc, pId) => {
        const t = TIPS.find(tip => tip.id === pId);
        return acc + (t ? t.savingsKgPerYear : 0);
      }, 0);
      
      const newTotal = Math.max(0, state.results.totalAnnual - potential);
      
      const impactBox = document.createElement('div');
      impactBox.style.background = 'var(--color-muted)';
      impactBox.style.padding = 'var(--space-4)';
      impactBox.style.borderRadius = 'var(--radius-lg)';
      impactBox.style.display = 'inline-block';
      impactBox.style.marginTop = 'var(--space-4)';
      
      impactBox.innerHTML = sanitizeHTML(`
        <div style="color: var(--color-fg-muted); font-weight: 600; margin-bottom: var(--space-2);">Projected Impact of Pledges</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary);">
          ${formatCO2(state.results.totalAnnual)} ${iconSVG('arrow-right', 20, '#10B981')} ${formatCO2(newTotal)}
        </div>
      `);
      header.appendChild(impactBox);
    }
    
    page.appendChild(header);
    
    // Pledged Actions Section (if any)
    if (pledges.length > 0) {
      const pledgeSec = document.createElement('div');
      pledgeSec.style.marginBottom = 'var(--space-10)';
      pledgeSec.innerHTML = sanitizeHTML(`<h2 style="display:flex; align-items:center; gap:var(--space-2);">${iconSVG('target', 28, '#F59E0B')} Your Pledges</h2>`);
      
      const pledgeGrid = document.createElement('div');
      pledgeGrid.className = 'grid grid-3';
      
      pledges.forEach(pId => {
        const t = TIPS.find(tip => tip.id === pId);
        if (!t) return;
        
        const isDone = completed.includes(pId);
        
        const card = document.createElement('div');
        card.className = `card action-card ${isDone ? 'done' : ''}`;
        card.style.padding = 'var(--space-5)';
        if (isDone) {
          card.style.opacity = '0.7';
          card.style.background = 'var(--color-muted)';
        }
        
        const badgeColor = t.impact === 'high' ? 'success' : t.impact === 'medium' ? 'info' : 'warning';
        
        card.innerHTML = sanitizeHTML(`
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-3);">
            <div class="icon-wrapper" style="margin-bottom:0; width:40px; height:40px;">${iconSVG(t.icon, 20, '#10B981')}</div>
            <span class="badge badge-${badgeColor}">${t.impact} Impact</span>
          </div>
          <h3 style="font-size: 1.1rem; margin-bottom: var(--space-2);">${t.title}</h3>
          <p style="color: var(--color-fg-muted); font-size: 0.875rem; margin-bottom: var(--space-4); flex: 1;">
            Saves ~${formatCO2(t.savingsKgPerYear)} / year
          </p>
        `);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = `btn btn-${isDone ? 'secondary' : 'primary'}`;
        toggleBtn.style.width = '100%';
        toggleBtn.innerHTML = isDone ? `${iconSVG('check-circle', 20)} Completed` : `${iconSVG('circle', 20)} Mark Complete`;
        
        toggleBtn.addEventListener('click', () => {
          if (isDone) {
            setState({ completedActions: completed.filter(id => id !== pId) });
          } else {
            setState({ completedActions: [...completed, pId] });
            showToast('Action completed! Great job.', 'success');
          }
          renderContent();
        });
        
        card.appendChild(toggleBtn);
        pledgeGrid.appendChild(card);
      });
      
      pledgeSec.appendChild(pledgeGrid);
      page.appendChild(pledgeSec);
    }
    
    // Discover Tips Section
    const discSec = document.createElement('div');
    discSec.innerHTML = `<h2>Discover Actions</h2>`;
    
    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'tab-list';
    const categories = ['all', 'transport', 'energy', 'diet', 'shopping', 'lifestyle'];
    
    categories.forEach(c => {
      const btn = document.createElement('button');
      btn.className = `tab ${currentCategory === c ? 'active' : ''}`;
      btn.textContent = c.charAt(0).toUpperCase() + c.slice(1);
      btn.addEventListener('click', () => {
        currentCategory = c;
        renderContent();
      });
      tabs.appendChild(btn);
    });
    
    discSec.appendChild(tabs);
    
    // Grid
    const tipGrid = document.createElement('div');
    tipGrid.className = 'grid grid-3';
    
    const filteredTips = TIPS.filter(t => currentCategory === 'all' || t.category === currentCategory)
                             .filter(t => !pledges.includes(t.id));
    
    if (filteredTips.length === 0) {
      tipGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: var(--space-8); color: var(--color-fg-muted);">You've pledged all actions in this category!</div>`;
    }
    
    filteredTips.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card action-card';
      card.style.padding = 'var(--space-5)';
      
      const badgeColor = t.impact === 'high' ? 'success' : t.impact === 'medium' ? 'info' : 'warning';
      
      card.innerHTML = sanitizeHTML(`
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-3);">
          <div class="icon-wrapper" style="margin-bottom:0; width:40px; height:40px;">${iconSVG(t.icon, 20, '#10B981')}</div>
          <span class="badge badge-${badgeColor}">${t.impact} Impact</span>
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: var(--space-2);">${t.title}</h3>
        <p style="color: var(--color-fg-muted); font-size: 0.875rem; margin-bottom: var(--space-2); flex: 1;">${t.description}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-4); font-size: 0.875rem; font-weight: 600;">
          <span style="color: var(--color-primary);">~${formatCO2(t.savingsKgPerYear)}/yr</span>
          <span style="color: var(--color-fg-muted);">Difficulty: ${t.difficulty}</span>
        </div>
      `);
      
      const pledgeBtn = document.createElement('button');
      pledgeBtn.className = 'btn btn-outline';
      pledgeBtn.style.width = '100%';
      pledgeBtn.innerHTML = `${iconSVG('heart', 16)} Pledge Action`;
      
      pledgeBtn.addEventListener('click', () => {
        setState({ pledges: [...pledges, t.id] });
        showToast('Pledge added!', 'success');
        renderContent();
      });
      
      card.appendChild(pledgeBtn);
      tipGrid.appendChild(card);
    });
    
    discSec.appendChild(tipGrid);
    page.appendChild(discSec);
    
    if (page.parentNode === container) {
      // already appended, just inner updates happened
    } else {
      container.appendChild(page);
    }
    
    setTimeout(() => createIcons({ root: page }), 0);
  };
  
  renderContent();
  
  return () => {};
}
