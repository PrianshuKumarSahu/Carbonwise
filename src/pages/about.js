/**
 * @module about
 * @description About and methodology page with inline SVG icons.
 */


import { iconSVG } from '../utils/icon-helper.js';

export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-about animate-fadeIn';
  
  const header = document.createElement('div');
  header.className = 'hero';
  header.style.paddingTop = 'var(--space-8)';
  header.innerHTML = `
    <h1>About CarbonWise</h1>
    <p>Understanding our methodology, sources, and mission.</p>
  `;
  page.appendChild(header);
  
  const content = document.createElement('div');
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  
  // Mission
  const mission = document.createElement('section');
  mission.className = 'section reveal';
  mission.style.paddingTop = '0';
  mission.innerHTML = `
    <h2 style="display:flex; align-items:center; gap:var(--space-2);">${iconSVG('Target', 28, '#10B981')} Our Mission</h2>
    <div class="card card-body">
      <p>CarbonWise was created to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.</p>
      <p style="margin-bottom:0;">We believe that while systemic change is essential to combat climate change, individual awareness and action play a crucial role in driving that systemic shift.</p>
    </div>
  `;
  
  // Methodology
  const method = document.createElement('section');
  method.className = 'section reveal';
  method.innerHTML = `
    <h2 style="display:flex; align-items:center; gap:var(--space-2);">${iconSVG('BarChart', 28, '#10B981')} Methodology</h2>
    <div class="card card-body">
      <p>Our carbon footprint calculator uses established emission factors to provide a reliable estimate of your annual climate impact.</p>
      <ul style="list-style: none; margin-bottom: var(--space-4);">
        <li style="display:flex; align-items:flex-start; gap:var(--space-2); margin-bottom:var(--space-3);">
          ${iconSVG('Car', 20, '#10B981')}
          <span><strong>Transport:</strong> Based on vehicle type averages and distance.</span>
        </li>
        <li style="display:flex; align-items:flex-start; gap:var(--space-2); margin-bottom:var(--space-3);">
          ${iconSVG('Home', 20, '#0891B2')}
          <span><strong>Home Energy:</strong> Based on grid averages, with discounts for renewable sourcing.</span>
        </li>
        <li style="display:flex; align-items:flex-start; gap:var(--space-2); margin-bottom:var(--space-3);">
          ${iconSVG('Utensils', 20, '#F59E0B')}
          <span><strong>Diet:</strong> Baseline diets (vegan to high-meat) adjusted for food waste and local sourcing.</span>
        </li>
        <li style="display:flex; align-items:flex-start; gap:var(--space-2); margin-bottom:var(--space-3);">
          ${iconSVG('ShoppingBag', 20, '#7C3AED')}
          <span><strong>Shopping:</strong> Averages for clothing and electronics, adjusted for recycling habits.</span>
        </li>
      </ul>
      <div class="badge badge-warning" style="display:inline-flex; align-items:center; gap:4px;">${iconSVG('AlertTriangle', 14, '#92400E')} Disclaimer</div>
      <p style="margin-top: var(--space-2); font-size: 0.875rem; color: var(--color-fg-muted);">This calculator provides an educational estimate. True carbon accounting requires complex lifecycle analysis beyond the scope of a personal calculator.</p>
    </div>
  `;
  
  // Sources
  const sources = document.createElement('section');
  sources.className = 'section reveal';
  sources.innerHTML = `
    <h2 style="display:flex; align-items:center; gap:var(--space-2);">${iconSVG('BookOpen', 28, '#10B981')} Data Sources</h2>
    <div class="card card-body">
      <p>Emission factors and averages are sourced from reputable environmental organizations:</p>
      <div class="grid grid-2" style="margin-top:var(--space-4);">
        <a href="https://www.epa.gov/ghgemissions" target="_blank" rel="noopener" class="btn btn-outline" style="justify-content: flex-start;">
          ${iconSVG('ExternalLink', 16)} US EPA
        </a>
        <a href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions" target="_blank" rel="noopener" class="btn btn-outline" style="justify-content: flex-start;">
          ${iconSVG('ExternalLink', 16)} Our World in Data
        </a>
        <a href="https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" target="_blank" rel="noopener" class="btn btn-outline" style="justify-content: flex-start;">
          ${iconSVG('ExternalLink', 16)} UK DEFRA
        </a>
        <a href="https://www.unep.org/" target="_blank" rel="noopener" class="btn btn-outline" style="justify-content: flex-start;">
          ${iconSVG('ExternalLink', 16)} UNEP
        </a>
      </div>
    </div>
  `;
  
  // Tech Stack & Code
  const tech = document.createElement('section');
  tech.className = 'section reveal';
  tech.innerHTML = `
    <h2 style="display:flex; align-items:center; gap:var(--space-2);">${iconSVG('Code', 28, '#10B981')} Technology & Open Source</h2>
    <div class="card card-body text-center">
      <div style="display:flex; justify-content:center; gap:var(--space-6); flex-wrap:wrap; margin-bottom:var(--space-6);">
        <div style="text-align:center;">
          ${iconSVG('Zap', 32, '#F59E0B')}
          <div style="margin-top:var(--space-2); font-weight:600;">Vite</div>
        </div>
        <div style="text-align:center;">
          ${iconSVG('FileCode', 32, '#10B981')}
          <div style="margin-top:var(--space-2); font-weight:600;">Vanilla JS</div>
        </div>
        <div style="text-align:center;">
          ${iconSVG('BarChart2', 32, '#0891B2')}
          <div style="margin-top:var(--space-2); font-weight:600;">Chart.js</div>
        </div>
        <div style="text-align:center;">
          ${iconSVG('Cloud', 32, '#7C3AED')}
          <div style="margin-top:var(--space-2); font-weight:600;">Firebase</div>
        </div>
      </div>
      <p>Design system powered by UI/UX Pro Max parameters.</p>
      <a href="https://github.com/PrianshuKumarSahu/Carbonwise" target="_blank" rel="noopener" class="btn btn-secondary" style="margin-top: var(--space-4);">
        ${iconSVG('Github', 20)} View Source on GitHub
      </a>
    </div>
  `;
  
  content.appendChild(mission);
  content.appendChild(method);
  content.appendChild(sources);
  content.appendChild(tech);
  
  page.appendChild(content);
  container.appendChild(page);

  // Intersection observer for scroll-reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.1 });
  page.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  return () => { observer.disconnect(); };
}
