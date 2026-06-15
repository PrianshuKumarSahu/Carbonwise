/**
 * @module calculator
 * @description Carbon Footprint Calculator page.
 */

import { navigate } from '../router.js';
import { getState, setState, saveToHistory } from '../state.js';
import { calculateTotal } from '../utils/calculator.js';
import { createFormGroup, createRangeSlider, validateField } from '../components/form-controls.js';
import { validateCalculatorInput } from '../utils/validators.js';
import { showToast } from '../components/toast.js';
import { createIcons } from 'lucide';

export default function render(container) {
  const state = getState();
  const data = state.calculatorData;
  let currentStep = 0;
  
  const steps = [
    { id: 'transport', title: 'Transport', icon: 'car' },
    { id: 'home', title: 'Home Energy', icon: 'home' },
    { id: 'diet', title: 'Diet & Food', icon: 'utensils' },
    { id: 'shopping', title: 'Shopping', icon: 'shopping-bag' }
  ];

  const page = document.createElement('div');
  page.className = 'page-calculator animate-fadeIn';
  
  // Header
  const header = document.createElement('div');
  header.className = 'text-center';
  header.style.marginBottom = 'var(--space-8)';
  header.innerHTML = `
    <h1>Calculate Your Footprint</h1>
    <p style="color: var(--color-fg-muted)">Answer a few questions to get your personalized carbon profile.</p>
  `;
  
  // Progress Bar
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);
  
  // Steps Indicator
  const stepsIndicator = document.createElement('div');
  stepsIndicator.style.display = 'flex';
  stepsIndicator.style.justifyContent = 'space-between';
  stepsIndicator.style.marginBottom = 'var(--space-6)';
  stepsIndicator.style.color = 'var(--color-fg-muted)';
  stepsIndicator.style.fontWeight = '600';
  stepsIndicator.style.fontSize = '0.875rem';
  
  steps.forEach((step, i) => {
    const stepEl = document.createElement('div');
    stepEl.id = `step-indicator-${i}`;
    stepEl.textContent = `${i + 1}. ${step.title}`;
    stepsIndicator.appendChild(stepEl);
  });
  
  // Card Container for Forms
  const formCard = document.createElement('div');
  formCard.className = 'card';
  formCard.style.maxWidth = '700px';
  formCard.style.margin = '0 auto';
  
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
  
  // Form Rendering Logic
  const renderStep = () => {
    cardBody.innerHTML = '';
    
    // Update progress
    const progress = ((currentStep) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update indicators
    steps.forEach((_, i) => {
      const el = document.getElementById(`step-indicator-${i}`);
      if (el) {
        if (i === currentStep) el.style.color = 'var(--color-primary)';
        else if (i < currentStep) el.style.color = 'var(--color-success)';
        else el.style.color = 'var(--color-fg-muted)';
      }
    });
    
    const step = steps[currentStep];
    const section = document.createElement('div');
    section.className = 'animate-slideInRight';
    
    const title = document.createElement('h2');
    title.innerHTML = `<i data-lucide="${step.icon}"></i> ${step.title}`;
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.gap = 'var(--space-2)';
    title.style.borderBottom = '1px solid var(--color-muted)';
    title.style.paddingBottom = 'var(--space-3)';
    title.style.marginBottom = 'var(--space-5)';
    section.appendChild(title);
    
    if (step.id === 'transport') {
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
    else if (step.id === 'home') {
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
    else if (step.id === 'diet') {
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
    else if (step.id === 'shopping') {
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
    
    cardBody.appendChild(section);
    
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    
    if (currentStep === steps.length - 1) {
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
          // Update local data object
          data[step.id][input.id] = val.value;
          validateField(input, () => val);
        } else {
          validateField(input, () => val);
        }
      });
    });
    
    setTimeout(() => createIcons({ root: formCard }), 0);
  };
  
  // Navigation handlers
  const validateCurrentStep = () => {
    let isValid = true;
    const inputs = cardBody.querySelectorAll('input, select');
    const stepId = steps[currentStep].id;
    
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
    
    if (currentStep < steps.length - 1) {
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
  
  return () => {
    // cleanup
  };
}
