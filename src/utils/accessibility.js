/**
 * @module accessibility
 * @description Accessibility utilities for screen readers, focus, and motion.
 */

let ariaLiveRegion = null;

/**
 * Announces a message to screen readers
 * @param {string} message The message to announce
 * @param {string} politeness 'polite' or 'assertive'
 */
export function announceToScreenReader(message, politeness = 'polite') {
  if (!ariaLiveRegion) {
    ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.className = 'sr-only';
    ariaLiveRegion.setAttribute('aria-live', politeness);
    ariaLiveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(ariaLiveRegion);
  }
  
  // Clear first to ensure re-announcement of identical text
  ariaLiveRegion.textContent = '';
  setTimeout(() => {
    ariaLiveRegion.textContent = message;
  }, 50);
}

/**
 * Traps focus within a container element
 * @param {HTMLElement} containerEl The container to trap focus in
 * @returns {Function} Cleanup function to remove event listener
 */
export function trapFocus(containerEl) {
  const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = containerEl.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (!focusableElements.length) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  containerEl.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup
  return () => {
    containerEl.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Detects if the user prefers reduced motion
 * @returns {boolean} True if reduced motion preferred
 */
export function detectReducedMotion() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Sets focus to a specific element safely
 * @param {HTMLElement|string} target The element or ID to focus
 */
export function manageFocus(target) {
  let el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  
  // Remove tabindex on blur so it doesn't stay focusable if not normally
  el.addEventListener('blur', () => {
    el.removeAttribute('tabindex');
  }, { once: true });
}

/**
 * Utility to calculate contrast ratio between two hex colors
 * (Simplified for basic checking, not meant for complete WCAG validation in-browser)
 * @param {string} hex1 
 * @param {string} hex2 
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(hex1, hex2) {
  const luminance = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (lightest + 0.05) / (darkest + 0.05);
}
