/**
 * @module main
 * @description Application entry point. Initializes router, renders global components.
 */

import { registerRoute, initRouter } from './router.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { detectReducedMotion } from './utils/accessibility.js';
import { setState } from './state.js';

// Detect and store motion preference
const prefersReducedMotion = detectReducedMotion();
setState({ preferences: { reducedMotion: prefersReducedMotion } });

if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}

// Register routes with lazy loading
registerRoute('home', () => import('./pages/home.js'), 'Home');
registerRoute('calculator', () => import('./pages/calculator.js'), 'Carbon Calculator');
registerRoute('dashboard', () => import('./pages/dashboard.js'), 'Dashboard');
registerRoute('reduce', () => import('./pages/reduce.js'), 'Reduce Your Footprint');
registerRoute('learn', () => import('./pages/learn.js'), 'Learn');
registerRoute('about', () => import('./pages/about.js'), 'About');

// Render global components
const headerEl = document.getElementById('app-header');
const footerEl = document.getElementById('app-footer');

if (headerEl) renderNavbar(headerEl);
if (footerEl) renderFooter(footerEl);

// Initialize router
const appContainer = document.getElementById('app');
if (appContainer) {
  initRouter(appContainer);
}

// Remove Vite default files if present
const defaultCounter = document.getElementById('counter');
if (defaultCounter) defaultCounter.remove();
