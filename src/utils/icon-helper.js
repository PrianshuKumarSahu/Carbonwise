/**
 * @module icon-helper
 * @description Shared utility for rendering Lucide icons as inline SVG strings.
 */

import { icons } from 'lucide';

/**
 * Converts a kebab-case icon name to PascalCase for Lucide lookup
 * @param {string} name - e.g. 'arrow-right' or 'ArrowRight'
 * @returns {string} PascalCase name
 */
function toPascalCase(name) {
  if (!name) return '';
  // Already PascalCase
  if (name[0] === name[0].toUpperCase() && !name.includes('-')) return name;
  return name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

/**
 * Render a Lucide icon as an inline SVG string.
 * Works reliably regardless of DOM state (unlike data-lucide + createIcons).
 * @param {string} name - Icon name (kebab-case or PascalCase)
 * @param {number} size - Icon size in px
 * @param {string} color - Stroke color
 * @returns {string} SVG markup string
 */
export function iconSVG(name, size = 24, color = 'currentColor') {
  const pascalName = toPascalCase(name);
  const iconData = icons[pascalName] || icons[name];
  
  if (!iconData || !Array.isArray(iconData)) {
    return `<span style="display:inline-block;width:${size}px;height:${size}px;"></span>`;
  }

  const svgChildren = iconData.map(([tag, attrs]) => {
    if (!tag || !attrs) return '';
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
    return `<${tag} ${attrStr}/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;">${svgChildren}</svg>`;
}
