/**
 * @module footer
 * @description Application footer component.
 */

export function renderFooter(container) {
  container.innerHTML = '';
  
  const footer = document.createElement('footer');
  footer.className = 'footer';
  
  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  
  // Section 1: Brand
  const brandSection = document.createElement('div');
  brandSection.className = 'footer-section';
  
  const brandTitle = document.createElement('h3');
  brandTitle.textContent = 'CarbonWise 🌿';
  
  const brandDesc = document.createElement('p');
  brandDesc.textContent = 'Understand, Track & Reduce Your Carbon Footprint through personalized insights and science-backed data.';
  
  brandSection.appendChild(brandTitle);
  brandSection.appendChild(brandDesc);
  
  // Section 2: Links
  const linksSection = document.createElement('div');
  linksSection.className = 'footer-section footer-links';
  
  const linksTitle = document.createElement('h3');
  linksTitle.textContent = 'Quick Links';
  linksSection.appendChild(linksTitle);
  
  const links = [
    { path: 'home', label: 'Home' },
    { path: 'calculator', label: 'Calculator' },
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'learn', label: 'Learn' },
    { path: 'about', label: 'About' }
  ];
  
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = `#/${link.path}`;
    a.textContent = link.label;
    linksSection.appendChild(a);
  });
  
  // Section 3: Data & Info
  const infoSection = document.createElement('div');
  infoSection.className = 'footer-section';
  
  const infoTitle = document.createElement('h3');
  infoTitle.textContent = 'Information';
  
  const infoText = document.createElement('p');
  infoText.textContent = 'Calculations based on verified emission factors from the EPA, DEFRA, and Our World in Data.';
  
  const a11yLink = document.createElement('a');
  a11yLink.href = '#/about';
  a11yLink.textContent = 'Accessibility Statement';
  a11yLink.style.display = 'block';
  a11yLink.style.marginTop = '1rem';
  a11yLink.style.color = '#cbd5e1';
  
  infoSection.appendChild(infoTitle);
  infoSection.appendChild(infoText);
  infoSection.appendChild(a11yLink);
  
  // Bottom copyright
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  const year = new Date().getFullYear();
  bottom.textContent = `© ${year} CarbonWise. All rights reserved.`;
  
  grid.appendChild(brandSection);
  grid.appendChild(linksSection);
  grid.appendChild(infoSection);
  
  footer.appendChild(grid);
  footer.appendChild(bottom);
  
  container.appendChild(footer);
}
