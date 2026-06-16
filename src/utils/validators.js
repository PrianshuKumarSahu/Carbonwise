/**
 * @module validators
 * @description Input validation and sanitization functions.
 */

/**
 * Sanitizes a string by replacing HTML entities.
 * @param {string} str Input string.
 * @returns {string} Sanitized string.
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '\'': '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {any} value
 * @property {string} error
 */

/**
 * Validates a number input.
 * @param {number|string} value Input value.
 * @param {number} [min=0] Minimum allowed.
 * @param {number} [max=Infinity] Maximum allowed.
 * @returns {ValidationResult}
 */
export function validateNumber(value, min = 0, max = Infinity) {
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num)) {
    return { valid: false, value: 0, error: 'Must be a valid number' };
  }
  
  if (num < min) {
    return { valid: false, value: num, error: `Must be at least ${min}` };
  }
  
  if (num > max) {
    return { valid: false, value: num, error: `Must be no more than ${max}` };
  }
  
  return { valid: true, value: num, error: '' };
}

/**
 * Validates a select input.
 * @param {string} value Input value.
 * @param {string[]} allowedValues Allowed values.
 * @returns {ValidationResult}
 */
export function validateSelect(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    return { valid: false, value: '', error: 'Please select a valid option' };
  }
  return { valid: true, value, error: '' };
}

/**
 * Registry of validation rules for calculator inputs to avoid high cyclomatic complexity.
 * @type {Record<string, Function>}
 */
const CALCULATOR_VALIDATORS = {
  // Transport
  carKmPerWeek: (v) => validateNumber(v, 0, 10000),
  carType: (v) => validateSelect(v, ['petrol', 'diesel', 'hybrid', 'electric', 'none']),
  flightsPerYear: (v) => validateNumber(v, 0, 100),
  publicTransitHoursPerWeek: (v) => validateNumber(v, 0, 168),
  // Home
  electricityKwh: (v) => validateNumber(v, 0, 20000),
  gasKwh: (v) => validateNumber(v, 0, 20000),
  renewablePercent: (v) => validateNumber(v, 0, 100),
  residents: (v) => validateNumber(v, 1, 20),
  // Diet
  dietType: (v) => validateSelect(v, ['vegan', 'vegetarian', 'pescatarian', 'omnivore', 'high-meat']),
  foodWastePercent: (v) => validateNumber(v, 0, 100),
  localFoodPercent: (v) => validateNumber(v, 0, 100),
  // Shopping
  clothingItemsPerMonth: (v) => validateNumber(v, 0, 100),
  electronicsPerYear: (v) => validateNumber(v, 0, 50),
  recyclePercent: (v) => validateNumber(v, 0, 100),
};

/**
 * Validates common calculator fields dynamically.
 * @param {string} field Field name.
 * @param {any} value Input value.
 * @returns {ValidationResult}
 */
export function validateCalculatorInput(field, value) {
  const validator = CALCULATOR_VALIDATORS[field];
  if (validator) {
    return validator(value);
  }
  return { valid: true, value, error: '' };
}
