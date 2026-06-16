/**
 * @module modal
 * @description Accessible modal component.
 */

import { trapFocus } from '../utils/accessibility.js';

/** @type {Function | null} */
let cleanupTrap = null;

/**
 * @typedef {Object} ModalAction
 * @property {string} label
 * @property {'primary' | 'secondary' | 'danger' | 'ghost'} [variant]
 * @property {function(Event): void} [onClick]
 * @property {boolean} [closeOnClick=true]
 */

/**
 * @typedef {Object} ModalConfig
 * @property {string} title
 * @property {string | HTMLElement} content
 * @property {ModalAction[]} [actions]
 */

/**
 * Opens an accessible modal dialog.
 * @param {ModalConfig} config - Modal configuration.
 * @returns {function(): void} A function to programmatically close the modal.
 */
export function openModal(config) {
  const { title, content, actions = [] } = config;
  
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }
  
  container.innerHTML = '';
  container.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.addEventListener('click', closeModal);
  
  const modalEl = document.createElement('div');
  modalEl.className = 'modal-content';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-labelledby', 'modal-title');
  
  // Header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = 'var(--space-4)';
  
  const titleEl = document.createElement('h3');
  titleEl.id = 'modal-title';
  titleEl.textContent = title;
  titleEl.style.margin = '0';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn-ghost';
  closeBtn.style.padding = '4px';
  closeBtn.setAttribute('aria-label', 'Close dialog');
  closeBtn.innerHTML = '<i data-lucide="x"></i>';
  closeBtn.addEventListener('click', closeModal);
  
  header.appendChild(titleEl);
  header.appendChild(closeBtn);
  
  // Body
  const body = document.createElement('div');
  if (typeof content === 'string') {
    body.textContent = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  // Footer
  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'flex-end';
  footer.style.gap = 'var(--space-2)';
  footer.style.marginTop = 'var(--space-6)';
  
  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = `btn btn-${action.variant || 'primary'}`;
    btn.textContent = action.label;
    btn.addEventListener('click', (e) => {
      if (action.onClick) action.onClick(e);
      if (action.closeOnClick !== false) closeModal();
    });
    footer.appendChild(btn);
  });
  
  if (actions.length === 0) {
    // Default close button if no actions
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Close';
    btn.addEventListener('click', closeModal);
    footer.appendChild(btn);
  }
  
  modalEl.appendChild(header);
  modalEl.appendChild(body);
  modalEl.appendChild(footer);
  
  container.appendChild(overlay);
  container.appendChild(modalEl);
  
  // Import dynamically to avoid circular dep if needed, but we can assume lucide is loaded
  import('lucide').then(({ createIcons }) => createIcons({ root: modalEl }));
  
  cleanupTrap = trapFocus(modalEl);
  
  // Focus first element or modal itself
  setTimeout(() => {
    /** @type {HTMLElement | null} */
    const firstFocusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    else modalEl.focus();
  }, 100);
  
  /**
   * Handles escape key to close modal
   * @param {KeyboardEvent} e
   */
  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleKeydown);
  
  return () => {
    closeModal();
    document.removeEventListener('keydown', handleKeydown);
  };
}

/**
 * Closes the currently active modal.
 */
export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = '';
  }
  document.body.style.overflow = '';
  if (cleanupTrap) {
    cleanupTrap();
    cleanupTrap = null;
  }
}
