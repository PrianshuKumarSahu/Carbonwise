/**
 * @module learn
 * @description Educational hub page.
 */

import { CARBON_FACTS, QUIZ_QUESTIONS, MYTH_BUSTERS, COMPARISONS } from '../data/facts.js';
import { getState, setState } from '../state.js';
import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';
import { sanitizeHTML } from '../utils/sanitize.js';

export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-learn animate-fadeIn';
  
  let currentTab = 'facts';
  
  const header = document.createElement('div');
  header.className = 'hero';
  header.style.paddingTop = 'var(--space-8)';
  header.innerHTML = `
    <h1>Educational Hub</h1>
    <p>Expand your knowledge about carbon footprints and climate change.</p>
  `;
  page.appendChild(header);
  
  const contentContainer = document.createElement('div');
  
  const renderContent = () => {
    contentContainer.innerHTML = '';
    
    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'tab-list';
    const tabNames = ['facts', 'quiz', 'myths', 'comparisons'];
    
    tabNames.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `tab ${currentTab === t ? 'active' : ''}`;
      btn.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      btn.addEventListener('click', () => {
        currentTab = t;
        renderContent();
      });
      tabs.appendChild(btn);
    });
    
    contentContainer.appendChild(tabs);
    
    const panel = document.createElement('div');
    panel.className = 'animate-fadeUp';
    
    if (currentTab === 'facts') {
      const grid = document.createElement('div');
      grid.className = 'grid grid-3';
      
      CARBON_FACTS.forEach(fact => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = 'var(--space-5)';
        const factEl = document.createElement('div');
        factEl.innerHTML = sanitizeHTML(`
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <span class="badge badge-info" style="margin-bottom: var(--space-3);"><i data-lucide="info" style="width:14px; height:14px; margin-right:4px;"></i>${fact.category}</span>
          </div>
          <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: var(--space-3);">${fact.fact}</div>
          <div style="font-size: 0.875rem; color: var(--color-primary); display:flex; align-items:center; gap:4px;">
            ${iconSVG('BookOpen', 16, '#059669')} Source: ${fact.source}
          </div>
        `);
        card.appendChild(factEl);
        grid.appendChild(card);
      });
      
      panel.appendChild(grid);
    } 
    else if (currentTab === 'quiz') {
      let qIndex = 0;
      let score = 0;
      let answered = false;
      
      const renderQuiz = () => {
        panel.innerHTML = '';
        
        if (qIndex >= QUIZ_QUESTIONS.length) {
          // Results
          panel.innerHTML = `
            <div class="card text-center" style="max-width: 600px; margin: 0 auto; padding: var(--space-8);">
              <i data-lucide="award" style="width: 64px; height: 64px; color: var(--color-accent); margin-bottom: var(--space-4);"></i>
              <h2>Quiz Complete!</h2>
              <div style="font-size: 3rem; font-weight: 800; color: var(--color-primary); margin-bottom: var(--space-2);">${score} / ${QUIZ_QUESTIONS.length}</div>
              <p style="margin-bottom: var(--space-6);">Great job expanding your knowledge.</p>
              <button class="btn btn-primary" id="retry-btn">Try Again</button>
            </div>
          `;
          setTimeout(() => createIcons({ root: panel }), 0);
          panel.querySelector('#retry-btn').addEventListener('click', () => {
            qIndex = 0;
            score = 0;
            answered = false;
            renderQuiz();
          });
          return;
        }
        
        const q = QUIZ_QUESTIONS[qIndex];
        
        const qCard = document.createElement('div');
        qCard.className = 'card';
        qCard.style.maxWidth = '800px';
        qCard.style.margin = '0 auto';
        
        const qHeader = document.createElement('div');
        qHeader.className = 'card-header';
        qHeader.innerHTML = `<div style="color: var(--color-fg-muted); margin-bottom: var(--space-2);">Question ${qIndex + 1} of ${QUIZ_QUESTIONS.length}</div><h3>${q.question}</h3>`;
        
        const qBody = document.createElement('div');
        qBody.className = 'card-body';
        
        const optsContainer = document.createElement('div');
        
        q.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'quiz-option';
          btn.textContent = opt;
          
          if (answered) {
            btn.disabled = true;
            if (idx === q.correctIndex) btn.classList.add('correct');
            else btn.classList.add('incorrect');
          } else {
            btn.addEventListener('click', () => {
              answered = true;
              if (idx === q.correctIndex) score++;
              renderQuiz();
            });
          }
          optsContainer.appendChild(btn);
        });
        
        qBody.appendChild(optsContainer);
        
        if (answered) {
          const isCorrect = (q.correctIndex !== null); // Placeholder for correctness check
          const explanationEl = document.createElement('div');
          explanationEl.style.marginTop = 'var(--space-4)';
          explanationEl.style.padding = 'var(--space-4)';
          explanationEl.style.background = 'var(--color-muted)';
          explanationEl.style.borderRadius = 'var(--radius-md)';
          explanationEl.innerHTML = sanitizeHTML(`
            <div style="display:flex; align-items:flex-start; gap:var(--space-2);">
              ${isCorrect ? iconSVG('CheckCircle', 24, '#10B981') : iconSVG('AlertCircle', 24, '#DC2626')}
              <div>
                <strong style="color: ${isCorrect ? 'var(--color-primary)' : 'var(--color-destructive)'}">${isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
                <div style="margin-top:var(--space-1);">${q.explanation}</div>
              </div>
            </div>
          `);
          qBody.appendChild(explanationEl);
          
          const nextBtn = document.createElement('button');
          nextBtn.className = 'btn btn-primary';
          nextBtn.style.marginTop = 'var(--space-4)';
          nextBtn.style.width = '100%';
          nextBtn.textContent = 'Next Question';
          nextBtn.addEventListener('click', () => {
            qIndex++;
            answered = false;
            renderQuiz();
          });
          qBody.appendChild(nextBtn);
        }
        
        qCard.appendChild(qHeader);
        qCard.appendChild(qBody);
        panel.appendChild(qCard);
      };
      
      renderQuiz();
    }
    else if (currentTab === 'myths') {
      const list = document.createElement('div');
      list.style.maxWidth = '800px';
      list.style.margin = '0 auto';
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = 'var(--space-4)';
      
      MYTH_BUSTERS.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = 'var(--space-5)';
        
        let isOpen = false;
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'pointer';
        
        const myth = document.createElement('div');
        myth.style.display = 'flex';
        myth.style.alignItems = 'center';
        myth.innerHTML = `<span style="color: var(--color-destructive); font-weight: 700; margin-right: var(--space-2); display:flex; align-items:center; gap:4px;"><i data-lucide="x-circle" style="width:18px; height:18px;"></i> MYTH:</span><span class="myth-text" style="font-size: 1.1rem; font-weight: 500;">${item.myth}</span>`;
        
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'chevron-down');
        icon.style.transition = 'transform var(--transition-fast)';
        
        header.appendChild(myth);
        header.appendChild(icon);
        
        const content = document.createElement('div');
        content.style.display = 'none';
        content.style.marginTop = 'var(--space-4)';
        content.style.paddingTop = 'var(--space-4)';
        content.style.borderTop = '1px solid var(--color-muted)';
        content.innerHTML = `<div style="display:flex; align-items:flex-start; gap:var(--space-2);"><span style="color: var(--color-success); font-weight: 700; display:flex; align-items:center; gap:4px;"><i data-lucide="check-circle" style="width:18px; height:18px;"></i> REALITY:</span><span style="flex:1;">${item.reality}</span></div>`;
        
        header.addEventListener('click', () => {
          isOpen = !isOpen;
          content.style.display = isOpen ? 'block' : 'none';
          icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0)';
          myth.querySelector('.myth-text').style.textDecoration = isOpen ? 'line-through' : 'none';
        });
        
        card.appendChild(header);
        card.appendChild(content);
        list.appendChild(card);
      });
      
      panel.appendChild(list);
    }
    else if (currentTab === 'comparisons') {
      const grid = document.createElement('div');
      grid.className = 'grid grid-2';
      
      COMPARISONS.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = 'var(--space-5)';
        
        card.innerHTML = sanitizeHTML(`
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-4);">
            <h3 style="margin:0;">${comp.activity}</h3>
            <div style="color: var(--color-primary); font-weight:800; font-size:1.25rem;">${comp.co2Kg} kg CO₂</div>
          </div>
          <div style="text-align: center; color: var(--color-fg-muted); margin: var(--space-4) 0;">
            <i data-lucide="arrow-down" style="margin-bottom: var(--space-2);"></i>
            <div>is equivalent to</div>
            <i data-lucide="arrow-down" style="margin-top: var(--space-2);"></i>
          </div>
          <div style="background: var(--color-muted); padding: var(--space-4); border-radius: var(--radius-md); text-align:center;">
            <i data-lucide="${comp.icon}" style="width: 32px; height: 32px; color: var(--color-accent); margin-bottom: var(--space-2);"></i>
            <div style="font-weight: 600; font-size: 1.1rem;">${comp.equivalent}</div>
          </div>
        `);
        
        grid.appendChild(card);
      });
      
      panel.appendChild(grid);
    }
    
    contentContainer.appendChild(panel);
    setTimeout(() => createIcons({ root: contentContainer }), 0);
  };
  
  page.appendChild(contentContainer);
  container.appendChild(page);
  
  renderContent();
  
  return () => {};
}
