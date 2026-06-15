/**
 * @module navbar
 * @description Responsive navigation bar component.
 */

import { createIcons } from 'lucide';

export function renderNavbar(container) {
  container.innerHTML = '';
  
  const nav = document.createElement('nav');
  nav.className = 'nav';
  
  const navContainer = document.createElement('div');
  navContainer.className = 'nav-container';
  
  // Logo
  const logo = document.createElement('a');
  logo.href = '#/home';
  logo.className = 'nav-logo';
  
  const logoIcon = document.createElement('i');
  logoIcon.setAttribute('data-lucide', 'leaf');
  
  const logoText = document.createTextNode(' CarbonWise 🌿');
  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  
  // Desktop Links
  const linksContainer = document.createElement('div');
  linksContainer.className = 'nav-links';
  
  const links = [
    { path: 'home', label: 'Home' },
    { path: 'calculator', label: 'Calculator' },
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'reduce', label: 'Reduce' },
    { path: 'learn', label: 'Learn' },
    { path: 'about', label: 'About' }
  ];
  
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = `#/${link.path}`;
    a.className = 'nav-link';
    a.setAttribute('data-nav-link', link.path);
    a.textContent = link.label;
    linksContainer.appendChild(a);
  });
  
  // Mobile Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');
  
  const hamburgerIcon = document.createElement('i');
  hamburgerIcon.setAttribute('data-lucide', 'menu');
  hamburger.appendChild(hamburgerIcon);
  
  // Mobile Overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'nav-hamburger';
  closeBtn.style.alignSelf = 'flex-end';
  closeBtn.setAttribute('aria-label', 'Close navigation menu');
  
  const closeIcon = document.createElement('i');
  closeIcon.setAttribute('data-lucide', 'x');
  closeBtn.appendChild(closeIcon);
  
  const mobileLinks = linksContainer.cloneNode(true);
  
  overlay.appendChild(closeBtn);
  overlay.appendChild(mobileLinks);
  
  navContainer.appendChild(logo);
  navContainer.appendChild(linksContainer);
  navContainer.appendChild(hamburger);
  
  nav.appendChild(navContainer);
  
  container.appendChild(nav);
  document.body.appendChild(overlay);
  
  // Initialize icons
  setTimeout(() => createIcons({ attrs: { class: 'icon', width: 24, height: 24 } }), 0);
  
  // Event Listeners
  const toggleMenu = () => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };
  
  hamburger.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  mobileLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', toggleMenu);
  });
  
  // Close on Escape
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      toggleMenu();
    }
  };
  document.addEventListener('keydown', handleKeydown);
  
  // Scroll listener
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Cleanup function
  return () => {
    hamburger.removeEventListener('click', toggleMenu);
    closeBtn.removeEventListener('click', toggleMenu);
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', handleScroll);
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  };
}
