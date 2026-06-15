import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * Uses DOMPurify under the hood.
 * @param {string} htmlString - The raw HTML string to sanitize.
 * @returns {string} The sanitized HTML string.
 */
export function sanitizeHTML(htmlString) {
  return DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'button', 'svg', 'path', 'circle', 'line', 'polyline', 'rect'],
    ALLOWED_ATTR: ['href', 'class', 'style', 'data-lucide', 'target', 'rel', 'xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'points', 'x', 'y'],
  });
}
