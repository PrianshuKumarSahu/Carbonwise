/**
 * @module validators
 * @description Input validation and sanitization functions.
 */

/**
 * Sanitizes a string by replacing HTML entities
 * @param {string} str Input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * Validates a number input
 * @param {number|string} value Input value
 * @param {number} min Minimum allowed
 * @param {number} max Maximum allowed
 * @returns {Object} { valid, value, error }
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
 * Validates a select input
 * @param {string} value Input value
 * @param {Array<string>} allowedValues Allowed values
 * @returns {Object} { valid, value, error }
 */
export function validateSelect(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    return { valid: false, value: '', error: 'Please select a valid option' };
  }
  return { valid: true, value, error: '' };
}

/**
 * Validates common calculator fields
 * @param {string} field Field name
 * @param {any} value Input value
 * @returns {Object} { valid, value, error }
 */
export function validateCalculatorInput(field, value) {
  switch (field) {
    // Transport
    case 'carKmPerWeek':
      return validateNumber(value, 0, 10000);
    case 'carType':
      return validateSelect(value, ['petrol', 'diesel', 'hybrid', 'electric', 'none']);
    case 'flightsPerYear':
      return validateNumber(value, 0, 100);
    case 'publicTransitHoursPerWeek':
      return validateNumber(value, 0, 168);
      
    // Home
    case 'electricityKwh':
      return validateNumber(value, 0, 20000);
    case 'gasKwh':
      return validateNumber(value, 0, 20000);
    case 'renewablePercent':
      return validateNumber(value, 0, 100);
    case 'residents':
      return validateNumber(value, 1, 20);
      
    // Diet
    case 'dietType':
      return validateSelect(value, ['vegan', 'vegetarian', 'pescatarian', 'omnivore', 'high-meat']);
    case 'foodWastePercent':
      return validateNumber(value, 0, 100);
    case 'localFoodPercent':
      return validateNumber(value, 0, 100);
      
    // Shopping
    case 'clothingItemsPerMonth':
      return validateNumber(value, 0, 100);
    case 'electronicsPerYear':
      return validateNumber(value, 0, 50);
    case 'recyclePercent':
      return validateNumber(value, 0, 100);
      
    default:
      return { valid: true, value, error: '' };
  }
}
