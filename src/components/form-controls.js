/**
 * @module form-controls
 * @description Accessible form inputs.
 */

/**
 * @typedef {Object} SelectOption
 * @property {string} value - The option value.
 * @property {string} label - The visible label.
 */

/**
 * @typedef {Object} FormGroupConfig
 * @property {string} id - The ID for the input.
 * @property {string} label - The input label.
 * @property {string} [type='text'] - The input type (e.g., 'text', 'number', 'select').
 * @property {string} [name] - The input name attribute.
 * @property {number|string} [min] - The minimum value.
 * @property {number|string} [max] - The maximum value.
 * @property {number|string} [step] - The step attribute.
 * @property {string|number} [value] - The initial value.
 * @property {SelectOption[]} [options] - Options for select inputs.
 * @property {string} [placeholder] - Placeholder text.
 * @property {boolean} [required=true] - Whether the field is required.
 * @property {string} [helpText] - Optional helper text.
 * @property {string} [unit] - Optional unit suffix (e.g., 'kg').
 */

/**
 * Creates an accessible form group container with label, input, and error display.
 * @param {FormGroupConfig} config - The configuration for the form group.
 * @returns {HTMLDivElement} The constructed form group element.
 */
export function createFormGroup(config) {
  const { id, label, type = 'text', name, min, max, step, value, options, placeholder, required = true, helpText, unit } = config;
  
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.className = 'form-label';
  labelEl.textContent = label;
  if (required) {
    const reqMark = document.createElement('span');
    reqMark.style.color = 'var(--color-destructive)';
    reqMark.textContent = ' *';
    labelEl.appendChild(reqMark);
  }
  
  const inputContainer = document.createElement('div');
  inputContainer.style.position = 'relative';
  inputContainer.style.display = 'flex';
  inputContainer.style.alignItems = 'center';
  
  /** @type {HTMLInputElement | HTMLSelectElement} */
  let inputEl;
  if (type === 'select') {
    inputEl = document.createElement('select');
    inputEl.className = 'select';
    
    if (placeholder) {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = placeholder;
      defaultOpt.disabled = true;
      if (!value) defaultOpt.selected = true;
      inputEl.appendChild(defaultOpt);
    }
    
    (options || []).forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (value === opt.value) o.selected = true;
      inputEl.appendChild(o);
    });
  } else {
    inputEl = document.createElement('input');
    inputEl.type = type;
    inputEl.className = 'input';
    if (min !== undefined) inputEl.min = String(min);
    if (max !== undefined) inputEl.max = String(max);
    if (step !== undefined) inputEl.step = String(step);
    if (placeholder) inputEl.placeholder = placeholder;
    if (value !== undefined) inputEl.value = String(value);
  }
  
  inputEl.id = id;
  if (name) inputEl.name = name;
  if (required) inputEl.required = true;
  
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  inputEl.setAttribute('aria-describedby', helpText ? `${helpId} ${errorId}` : errorId);
  
  inputContainer.appendChild(inputEl);
  
  if (unit) {
    const unitEl = document.createElement('span');
    unitEl.textContent = unit;
    unitEl.style.marginLeft = 'var(--space-2)';
    unitEl.style.color = 'var(--color-fg-muted)';
    inputContainer.appendChild(unitEl);
  }
  
  group.appendChild(labelEl);
  group.appendChild(inputContainer);
  
  if (helpText) {
    const helpEl = document.createElement('small');
    helpEl.id = helpId;
    helpEl.className = 'form-help';
    helpEl.textContent = helpText;
    group.appendChild(helpEl);
  }
  
  const errorEl = document.createElement('span');
  errorEl.id = errorId;
  errorEl.className = 'form-error';
  errorEl.setAttribute('aria-live', 'polite');
  group.appendChild(errorEl);
  
  return group;
}

/**
 * @typedef {Object} RangeSliderConfig
 * @property {string} id - The ID for the input.
 * @property {string} label - The input label.
 * @property {string} [name] - The input name attribute.
 * @property {number} [min=0] - The minimum value.
 * @property {number} [max=100] - The maximum value.
 * @property {number} [step=1] - The step size.
 * @property {number} [value=50] - The initial value.
 * @property {string} [unit='%'] - The unit to display.
 * @property {boolean} [showValue=true] - Whether to show the current value next to the slider.
 */

/**
 * Creates a range slider with an accessible label and live value display.
 * @param {RangeSliderConfig} config - The configuration for the range slider.
 * @returns {HTMLDivElement} The constructed range slider element.
 */
export function createRangeSlider(config) {
  const { id, label, name, min = 0, max = 100, step = 1, value = 50, unit = '%', showValue = true } = config;
  
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.className = 'form-label';
  labelEl.textContent = label;
  
  const container = document.createElement('div');
  container.className = 'range-container';
  
  const input = document.createElement('input');
  input.type = 'range';
  input.id = id;
  if (name) input.name = name;
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.className = 'range-input';
  
  container.appendChild(input);
  
  if (showValue) {
    const valDisplay = document.createElement('div');
    valDisplay.className = 'range-value';
    valDisplay.textContent = `${value}${unit}`;
    container.appendChild(valDisplay);
    
    input.addEventListener('input', (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      valDisplay.textContent = `${target.value}${unit}`;
    });
  }
  
  group.appendChild(labelEl);
  group.appendChild(container);
  
  return group;
}

/**
 * Validates an input field using a validation function, updating the UI accordingly.
 * @param {HTMLInputElement|HTMLSelectElement} inputEl - The input element to validate.
 * @param {Function} validateFn - The validation function that returns { valid: boolean, error: string }.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateField(inputEl, validateFn) {
  const errorId = `${inputEl.id}-error`;
  const parent = inputEl.parentElement?.parentElement;
  const errorEl = document.getElementById(errorId) || (parent && parent.querySelector('.form-error'));
  
  if (!errorEl) return true;
  
  const val = inputEl.value;
  const result = validateFn(val);
  
  if (!result.valid) {
    inputEl.classList.add('error');
    errorEl.textContent = result.error;
    inputEl.setAttribute('aria-invalid', 'true');
    return false;
  } else {
    inputEl.classList.remove('error');
    errorEl.textContent = '';
    inputEl.removeAttribute('aria-invalid');
    return true;
  }
}
