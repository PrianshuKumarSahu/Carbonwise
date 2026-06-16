/**
 * @module calculator
 * @description Carbon Footprint Calculator page.
 *
 * Implements a multi-step form to collect user data across four categories:
 * Transport, Home Energy, Diet & Food, and Shopping. Validates input,
 * updates state, calculates emissions, and saves results to history.
 *
 * @requires ../router.js - Navigation to dashboard after completion.
 * @requires ../state.js - State management and history tracking.
 * @requires ../utils/calculator.js - Core emission calculation logic.
 * @requires ../components/form-controls.js - Accessible form UI components.
 * @requires ../utils/validators.js - Input validation logic.
 * @requires ../components/toast.js - Notification system.
 * @requires lucide - Icon rendering.
 */

import { navigate } from '../router.js';
import { getState, setState, saveToHistory } from '../state.js';
import { calculateTotal } from '../utils/calculator.js';
import { createFormGroup, createRangeSlider, validateField } from '../components/form-controls.js';
import { validateCalculatorInput } from '../utils/validators.js';
import { showToast } from '../components/toast.js';
import { createIcons } from 'lucide';

/**
 * Definition of calculator steps.
 * @type {Array<{id: string, title: string, icon: string}>}
 */
const STEPS = [
  { id: 'transport', title: 'Transport', icon: 'car' },
  { id: 'home', title: 'Home Energy', icon: 'home' },
  { id: 'diet', title: 'Diet & Food', icon: 'utensils' },
  { id: 'shopping', title: 'Shopping', icon: 'shopping-bag' }
];

/**
 * Renders the form controls for a specific step.
 * @param {string} stepId - The ID of the current step.
 * @param {object} data - The current calculator data state.
 * @param {HTMLElement} section - The container to append the form groups to.
 */
function renderFormFields(stepId, data, section) {
  if (stepId === 'transport') {
    section.appendChild(createFormGroup({
      id: 'carType', label: 'What type of car do you drive?', type: 'select', value: data.transport.carType,
      options: [
        { value: 'none', label: 'I don\'t drive' },
        { value: 'petrol', label: 'Petrol / Gasoline' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'electric', label: 'Electric' }
      ]
    }));
    section.appendChild(createFormGroup({
      id: 'carKmPerWeek', label: 'Distance driven per week', type: 'number', min: 0, value: data.transport.carKmPerWeek, unit: 'km'
    }));
    section.appendChild(createFormGroup({
      id: 'publicTransitHoursPerWeek', label: 'Public transit time per week', type: 'number', min: 0, value: data.transport.publicTransitHoursPerWeek, unit: 'hours'
    }));
    section.appendChild(createFormGroup({
      id: 'flightsPerYear', label: 'Flights taken per year (return trips)', type: 'number', min: 0, value: data.transport.flightsPerYear, unit: 'flights'
    }));
  } 
  else if (stepId === 'home') {
    section.appendChild(createFormGroup({
      id: 'residents', label: 'How many people live in your home?', type: 'number', min: 1, max: 20, value: data.home.residents
    }));
    section.appendChild(createFormGroup({
      id: 'electricityKwh', label: 'Monthly electricity usage', type: 'number', min: 0, value: data.home.electricityKwh, unit: 'kWh'
    }));
    section.appendChild(createFormGroup({
      id: 'gasKwh', label: 'Monthly natural gas usage', type: 'number', min: 0, value: data.home.gasKwh, unit: 'kWh'
    }));
    section.appendChild(createRangeSlider({
      id: 'renewablePercent', label: 'Percentage of electricity from renewable sources', min: 0, max: 100, value: data.home.renewablePercent, unit: '%'
    }));
  }
  else if (stepId === 'diet') {
    section.appendChild(createFormGroup({
      id: 'dietType', label: 'What best describes your diet?', type: 'select', value: data.diet.dietType,
      options: [
        { value: 'vegan', label: 'Vegan (No animal products)' },
        { value: 'vegetarian', label: 'Vegetarian (Dairy/eggs, no meat)' },
        { value: 'pescatarian', label: 'Pescatarian (Fish/seafood)' },
        { value: 'omnivore', label: 'Omnivore (Average meat)' },
        { value: 'high-meat', label: 'Meat-heavy (Meat most meals)' }
      ]
    }));
    section.appendChild(createRangeSlider({
      id: 'foodWastePercent', label: 'Estimated food waste', min: 0, max: 50, value: data.diet.foodWastePercent, unit: '%'
    }));
    section.appendChild(createRangeSlider({
      id: 'localFoodPercent', label: 'Percentage of food sourced locally', min: 0, max: 100, value: data.diet.localFoodPercent, unit: '%'
    }));
  }
  else if (stepId === 'shopping') {
    section.appendChild(createFormGroup({
      id: 'clothingItemsPerMonth', label: 'New clothing items bought per month', type: 'number', min: 0, value: data.shopping.clothingItemsPerMonth
    }));
    section.appendChild(createFormGroup({
      id: 'electronicsPerYear', label: 'New electronics/gadgets bought per year', type: 'number', min: 0, value: data.shopping.electronicsPerYear
    }));
    section.appendChild(createRangeSlider({
      id: 'recyclePercent', label: 'How much of your waste do you recycle?', min: 0, max: 100, value: data.shopping.recyclePercent, unit: '%'
    }));
  }
}

/**
 * Renders the Calculator page into the provided container.
 * @param {HTMLElement} container - The parent DOM element to render into.
 * @returns {Function} Cleanup function.
 */
export default function render(container) {
  const state = getState();
  const data = state.calculatorData;
  let currentStep = 0;
  
  const page = document.createElement('div');
  page.className = 'page-calculator animate-fadeIn';
  
  // ─── Header ────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'text-center mb-8';
  header.innerHTML = `
    <h1>Calculate Your Footprint</h1>
    <p class="text-muted">Answer a few questions to get your personalized carbon profile.</p>
  `;
  
  // ─── Progress Bar & Indicators ─────────────────────────────────
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);
  
  const stepsIndicator = document.createElement('div');
  stepsIndicator.className = 'flex-between mb-6 text-muted font-semibold text-sm';
  
  STEPS.forEach((step, i) => {
    const stepEl = document.createElement('div');
    stepEl.id = `step-indicator-${i}`;
    stepEl.textContent = `${i + 1}. ${step.title}`;
    stepsIndicator.appendChild(stepEl);
  });
  
  // ─── Form Card ─────────────────────────────────────────────────
  const formCard = document.createElement('div');
  formCard.className = 'card max-w-medium mx-auto';
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer flex justify-between items-center';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-outline';
  prevBtn.innerHTML = '<i data-lucide="arrow-left"></i> Back';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary';
  nextBtn.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
  
  cardFooter.appendChild(prevBtn);
  cardFooter.appendChild(nextBtn);
  
  formCard.appendChild(cardBody);
  formCard.appendChild(cardFooter);
  
  page.appendChild(header);
  page.appendChild(progressContainer);
  page.appendChild(stepsIndicator);
  page.appendChild(formCard);
  
  container.appendChild(page);
  
  /**
   * Validates all inputs in the current step.
   * @returns {boolean} True if all inputs are valid.
   */
  const validateCurrentStep = () => {
    let isValid = true;
    const inputs = cardBody.querySelectorAll('input, select');
    const stepId = STEPS[currentStep].id;
    
    inputs.forEach(input => {
      const val = validateCalculatorInput(input.id, input.value);
      if (val.valid) {
        data[stepId][input.id] = val.value;
      }
      if (!validateField(input, () => val)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  /** Renders the form fields and updates UI for the current step. */
  const renderStep = () => {
    cardBody.innerHTML = '';
    
    // Update progress
    const progress = (currentStep / (STEPS.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update step indicators
    STEPS.forEach((_, i) => {
      const el = document.getElementById(`step-indicator-${i}`);
      if (el) {
        if (i === currentStep) el.style.color = 'var(--color-primary)';
        else if (i < currentStep) el.style.color = 'var(--color-success)';
        else el.style.color = 'var(--color-fg-muted)';
      }
    });
    
    const step = STEPS[currentStep];
    const section = document.createElement('div');
    section.className = 'animate-slideInRight';
    
    const title = document.createElement('h2');
    title.className = 'flex items-center gap-2 border-muted pb-3 mb-5';
    title.innerHTML = `<i data-lucide="${step.icon}"></i> ${step.title}`;
    section.appendChild(title);
    
    renderFormFields(step.id, data, section);
    
    cardBody.appendChild(section);
    
    // Update button states
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    
    if (currentStep === STEPS.length - 1) {
      nextBtn.innerHTML = 'Calculate Results <i data-lucide="check"></i>';
      nextBtn.className = 'btn btn-accent';
    } else {
      nextBtn.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
      nextBtn.className = 'btn btn-primary';
    }
    
    // Add validation on blur
    const inputs = cardBody.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const val = validateCalculatorInput(input.id, input.value);
        if (val.valid) {
          data[step.id][input.id] = val.value;
        }
        validateField(input, () => val);
      });
    });
    
    setTimeout(() => createIcons({ root: formCard }), 0);
  };
  
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) {
      showToast('Please fix the errors before continuing.', 'error');
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep();
    } else {
      // Final submit
      setState({ calculatorData: data });
      
      const results = calculateTotal(data);
      setState({ results });
      saveToHistory(results);
      
      showToast('Calculation complete!', 'success');
      navigate('dashboard');
    }
  });
  
  renderStep();
  
  return () => {};
}
