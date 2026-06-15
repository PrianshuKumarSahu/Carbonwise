/**
 * @module router
 * @description Hash-based SPA router with lazy loading and accessibility.
 * Manages page transitions, focus management, and screen reader announcements.
 */

import { announceToScreenReader } from './utils/accessibility.js';

/** @type {Map<string, {loader: Function, title: string}>} */
const routes = new Map();

/** @type {string} */
let currentRoute = '';

/** @type {HTMLElement|null} */
let appContainer = null;

/** @type {Function|null} */
let currentCleanup = null;

/**
 * Register a route
 * @param {string} path - Route hash path (e.g., 'home')
 * @param {Function} loader - Async function that returns the page module
 * @param {string} title - Page title for <title> and screen reader
 */
export function registerRoute(path, loader, title) {
  routes.set(path, { loader, title });
}

/**
 * Initialize the router
 * @param {HTMLElement} container - The app container element
 */
export function initRouter(container) {
  appContainer = container;

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

/**
 * Navigate to a route
 * @param {string} path - Route path
 */
export function navigate(path) {
  window.location.hash = `#/${path}`;
}

/**
 * Get current route name
 * @returns {string}
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Handle route changes
 */
async function handleRouteChange() {
  const hash = window.location.hash.slice(2) || 'home';
  const route = routes.get(hash);

  if (!route) {
    navigate('home');
    return;
  }

  if (hash === currentRoute) return;
  currentRoute = hash;

  // Cleanup previous page
  if (currentCleanup && typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch { /* ignore cleanup errors */ }
  }
  currentCleanup = null;

  // Clear container
  if (appContainer) {
    appContainer.innerHTML = '';
    appContainer.classList.add('page-transition-enter');
  }

  try {
    // Lazy load the page module
    const module = await route.loader();
    const renderFn = module.default || module.render;

    if (renderFn && appContainer) {
      const cleanup = await renderFn(appContainer);
      if (typeof cleanup === 'function') {
        currentCleanup = cleanup;
      }
    }

    // Update document title
    document.title = `${route.title} — CarbonWise`;

    // Announce page change to screen readers
    announceToScreenReader(`Navigated to ${route.title}`);

    // Focus management: move focus to main content
    if (appContainer) {
      appContainer.setAttribute('tabindex', '-1');
      appContainer.focus({ preventScroll: true });
      appContainer.removeAttribute('tabindex');
    }

    // Trigger enter animation
    requestAnimationFrame(() => {
      if (appContainer) {
        appContainer.classList.remove('page-transition-enter');
        appContainer.classList.add('page-transition-active');
        setTimeout(() => appContainer?.classList.remove('page-transition-active'), 300);
      }
    });
  } catch (error) {
    console.error(`Failed to load route "${hash}":`, error);
    if (appContainer) {
      const errorEl = document.createElement('div');
      errorEl.className = 'error-page';
      errorEl.setAttribute('role', 'alert');
      errorEl.textContent = 'Something went wrong loading this page. Please try again.';
      appContainer.appendChild(errorEl);
    }
  }

  // Update active nav link
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const isActive = link.getAttribute('data-nav-link') === hash;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
