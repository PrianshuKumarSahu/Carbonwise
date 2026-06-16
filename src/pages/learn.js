/**
 * @module learn
 * @description Educational hub page with tabbed content sections.
 *
 * Provides four interactive sections:
 * - **Facts**: Grid of climate-related facts with sources.
 * - **Quiz**: Multi-question interactive quiz with scoring.
 * - **Myths**: Accordion-style myth-buster cards.
 * - **Comparisons**: Visual CO₂ equivalence cards.
 *
 * @requires ../data/facts.js - Educational content datasets.
 * @requires ../state.js - For persisting quiz progress.
 * @requires ../utils/sanitize.js - XSS-safe HTML injection.
 * @requires ../utils/icon-helper.js - Inline SVG icon rendering.
 */

import { CARBON_FACTS, QUIZ_QUESTIONS, MYTH_BUSTERS, COMPARISONS } from '../data/facts.js';

import { createIcons } from 'lucide';
import { iconSVG } from '../utils/icon-helper.js';
import { sanitizeHTML } from '../utils/sanitize.js';

/**
 * Available tab identifiers for the educational hub.
 * @type {string[]}
 */
const TAB_NAMES = ['facts', 'quiz', 'myths', 'comparisons'];

/**
 * Creates a tabbed navigation bar.
 * @param {string} activeTab - The currently active tab name.
 * @param {Function} onSelect - Callback invoked with the selected tab name.
 * @returns {HTMLDivElement} The tab list element.
 */
function buildTabBar(activeTab, onSelect) {
  const tabs = document.createElement('div');
  tabs.className = 'tab-list';

  TAB_NAMES.forEach((name) => {
    const btn = document.createElement('button');
    btn.className = `tab ${activeTab === name ? 'active' : ''}`;
    btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    btn.addEventListener('click', () => onSelect(name));
    tabs.appendChild(btn);
  });

  return tabs;
}

/**
 * Renders the Facts tab content.
 * @param {HTMLElement} panel - The panel element to render into.
 */
function renderFactsTab(panel) {
  const grid = document.createElement('div');
  grid.className = 'grid grid-3';

  CARBON_FACTS.forEach((fact) => {
    const card = document.createElement('div');
    card.className = 'card p-5';

    const content = document.createElement('div');
    content.innerHTML = sanitizeHTML(`
      <div class="flex-between-start">
        <span class="badge badge-info mb-3"><i data-lucide="info" style="width:14px; height:14px; margin-right:4px;"></i>${fact.category}</span>
      </div>
      <div class="text-lg font-semibold mb-3">${fact.fact}</div>
      <div class="text-sm text-primary flex items-center gap-2">
        ${iconSVG('BookOpen', 16, '#059669')} Source: ${fact.source}
      </div>
    `);

    card.appendChild(content);
    grid.appendChild(card);
  });

  panel.appendChild(grid);
}

/**
 * Renders the Quiz tab with interactive question flow.
 * @param {HTMLElement} panel - The panel element to render into.
 */
function renderQuizTab(panel) {
  let qIndex = 0;
  let score = 0;
  let answered = false;

  /** Renders the current quiz question or the results screen. */
  const renderQuestion = () => {
    panel.innerHTML = '';

    if (qIndex >= QUIZ_QUESTIONS.length) {
      renderQuizResults(panel, score, () => {
        qIndex = 0;
        score = 0;
        answered = false;
        renderQuestion();
      });
      return;
    }

    const question = QUIZ_QUESTIONS[qIndex];
    const qCard = document.createElement('div');
    qCard.className = 'card max-w-wide mx-auto';

    // Header
    const qHeader = document.createElement('div');
    qHeader.className = 'card-header';
    qHeader.innerHTML = `
      <div class="text-muted mb-2">Question ${qIndex + 1} of ${QUIZ_QUESTIONS.length}</div>
      <h3>${question.question}</h3>
    `;

    // Body with options
    const qBody = document.createElement('div');
    qBody.className = 'card-body';

    const optsContainer = document.createElement('div');
    question.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;

      if (answered) {
        btn.disabled = true;
        btn.classList.add(idx === question.correctIndex ? 'correct' : 'incorrect');
      } else {
        btn.addEventListener('click', () => {
          answered = true;
          if (idx === question.correctIndex) score++;
          renderQuestion();
        });
      }
      optsContainer.appendChild(btn);
    });
    qBody.appendChild(optsContainer);

    // Explanation (shown after answering)
    if (answered) {
      qBody.appendChild(buildExplanation(question));

      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary w-full mt-4';
      nextBtn.textContent = 'Next Question';
      nextBtn.addEventListener('click', () => {
        qIndex++;
        answered = false;
        renderQuestion();
      });
      qBody.appendChild(nextBtn);
    }

    qCard.appendChild(qHeader);
    qCard.appendChild(qBody);
    panel.appendChild(qCard);
  };

  renderQuestion();
}

/**
 * Builds the explanation element shown after answering a quiz question.
 * @param {object} question - The quiz question object.
 * @returns {HTMLDivElement} The explanation element.
 */
function buildExplanation(question) {
  const el = document.createElement('div');
  el.className = 'mt-4 p-4 bg-muted rounded-md';
  el.innerHTML = sanitizeHTML(`
    <div class="flex-items-start gap-2">
      ${iconSVG('CheckCircle', 24, '#10B981')}
      <div>
        <strong class="text-primary">Explanation</strong>
        <div class="mt-2">${question.explanation}</div>
      </div>
    </div>
  `);
  return el;
}

/**
 * Renders the quiz results screen.
 * @param {HTMLElement} panel - The panel element to render into.
 * @param {number} score - The user's final score.
 * @param {Function} onRetry - Callback to restart the quiz.
 */
function renderQuizResults(panel, score, onRetry) {
  panel.innerHTML = `
    <div class="card text-center max-w-narrow mx-auto p-8">
      <i data-lucide="award" style="width: 64px; height: 64px; color: var(--color-accent); margin-bottom: var(--space-4);"></i>
      <h2>Quiz Complete!</h2>
      <div class="text-4xl font-extrabold text-primary mb-2">${score} / ${QUIZ_QUESTIONS.length}</div>
      <p class="mb-6">Great job expanding your knowledge.</p>
      <button class="btn btn-primary" id="retry-btn">Try Again</button>
    </div>
  `;

  setTimeout(() => createIcons({ root: panel }), 0);
  panel.querySelector('#retry-btn').addEventListener('click', onRetry);
}

/**
 * Renders the Myths tab with accordion-style cards.
 * @param {HTMLElement} panel - The panel element to render into.
 */
function renderMythsTab(panel) {
  const list = document.createElement('div');
  list.className = 'max-w-wide mx-auto flex flex-col gap-4';

  MYTH_BUSTERS.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card p-5';
    let isOpen = false;

    // Clickable header
    const header = document.createElement('div');
    header.className = 'flex-between cursor-pointer';

    const myth = document.createElement('div');
    myth.className = 'flex items-center';
    myth.innerHTML = `
      <span class="text-destructive font-bold" style="margin-right: var(--space-2); display:flex; align-items:center; gap:4px;">
        <i data-lucide="x-circle" style="width:18px; height:18px;"></i> MYTH:
      </span>
      <span class="myth-text text-lg" style="font-weight: 500;">${item.myth}</span>
    `;

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'chevron-down');
    icon.style.transition = 'transform var(--transition-fast)';

    header.appendChild(myth);
    header.appendChild(icon);

    // Expandable content
    const content = document.createElement('div');
    content.className = 'mt-4 pt-4 border-muted';
    content.style.display = 'none';
    content.innerHTML = `
      <div class="flex-items-start gap-2">
        <span class="text-success font-bold" style="display:flex; align-items:center; gap:4px;">
          <i data-lucide="check-circle" style="width:18px; height:18px;"></i> REALITY:
        </span>
        <span class="flex-1">${item.reality}</span>
      </div>
    `;

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

/**
 * Renders the Comparisons tab with equivalence cards.
 * @param {HTMLElement} panel - The panel element to render into.
 */
function renderComparisonsTab(panel) {
  const grid = document.createElement('div');
  grid.className = 'grid grid-2';

  COMPARISONS.forEach((comp) => {
    const card = document.createElement('div');
    card.className = 'card p-5';

    card.innerHTML = sanitizeHTML(`
      <div class="flex-between-start mb-4">
        <h3 class="mb-0">${comp.activity}</h3>
        <div class="text-primary font-extrabold text-xl">${comp.co2Kg} kg CO₂</div>
      </div>
      <div class="text-center text-muted" style="margin: var(--space-4) 0;">
        <i data-lucide="arrow-down" class="mb-2"></i>
        <div>is equivalent to</div>
        <i data-lucide="arrow-down" class="mt-2"></i>
      </div>
      <div class="bg-muted p-4 rounded-md text-center">
        <i data-lucide="${comp.icon}" style="width: 32px; height: 32px; color: var(--color-accent);" class="mb-2"></i>
        <div class="font-semibold text-lg">${comp.equivalent}</div>
      </div>
    `);

    grid.appendChild(card);
  });

  panel.appendChild(grid);
}

/** @type {Record<string, Function>} Maps tab names to their render functions. */
const TAB_RENDERERS = {
  facts: renderFactsTab,
  quiz: renderQuizTab,
  myths: renderMythsTab,
  comparisons: renderComparisonsTab,
};

/**
 * Renders the Learn page into the provided container.
 * @param {HTMLElement} container - The parent DOM element to render into.
 * @returns {Function} Cleanup function.
 */
export default function render(container) {
  const page = document.createElement('div');
  page.className = 'page-learn animate-fadeIn';

  let currentTab = 'facts';

  // ─── Page Header ─────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'hero pt-8';
  header.innerHTML = `
    <h1>Educational Hub</h1>
    <p>Expand your knowledge about carbon footprints and climate change.</p>
  `;
  page.appendChild(header);

  const contentContainer = document.createElement('div');

  /** Re-renders the tab content based on the active tab. */
  const renderContent = () => {
    contentContainer.innerHTML = '';

    contentContainer.appendChild(buildTabBar(currentTab, (tab) => {
      currentTab = tab;
      renderContent();
    }));

    const panel = document.createElement('div');
    panel.className = 'animate-fadeUp';

    const renderer = TAB_RENDERERS[currentTab];
    if (renderer) renderer(panel);

    contentContainer.appendChild(panel);
    setTimeout(() => createIcons({ root: contentContainer }), 0);
  };

  page.appendChild(contentContainer);
  container.appendChild(page);
  renderContent();

  return () => {};
}
