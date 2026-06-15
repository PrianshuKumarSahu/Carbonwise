/**
 * @module form-controls
 * @description Accessible form inputs.
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
    if (min !== undefined) inputEl.min = min;
    if (max !== undefined) inputEl.max = max;
    if (step !== undefined) inputEl.step = step;
    if (placeholder) inputEl.placeholder = placeholder;
    if (value !== undefined) inputEl.value = value;
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
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  input.className = 'range-input';
  
  container.appendChild(input);
  
  let valDisplay;
  if (showValue) {
    valDisplay = document.createElement('div');
    valDisplay.className = 'range-value';
    valDisplay.textContent = `${value}${unit}`;
    container.appendChild(valDisplay);
    
    input.addEventListener('input', (e) => {
      valDisplay.textContent = `${e.target.value}${unit}`;
    });
  }
  
  group.appendChild(labelEl);
  group.appendChild(container);
  
  return group;
}

export function validateField(inputEl, validateFn) {
  const errorId = `${inputEl.id}-error`;
  const errorEl = document.getElementById(errorId) || inputEl.parentNode.parentNode.querySelector('.form-error');
  
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
