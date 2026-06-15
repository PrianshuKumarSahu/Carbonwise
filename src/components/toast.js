/**
 * @module toast
 * @description Toast notification system.
 */

import { createIcons } from 'lucide';

export function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('i');
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  icon.setAttribute('data-lucide', iconName);
  
  const textContainer = document.createElement('div');
  textContainer.style.flex = '1';
  textContainer.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn-ghost';
  closeBtn.style.padding = '4px';
  closeBtn.setAttribute('aria-label', 'Close notification');
  
  const closeIcon = document.createElement('i');
  closeIcon.setAttribute('data-lucide', 'x');
  closeBtn.appendChild(closeIcon);
  
  toast.appendChild(icon);
  toast.appendChild(textContainer);
  toast.appendChild(closeBtn);
  
  container.appendChild(toast);
  
  setTimeout(() => createIcons({ root: toast }), 0);
  
  const dismiss = () => {
    toast.classList.add('exiting');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    });
  };
  
  closeBtn.addEventListener('click', dismiss);
  
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}
