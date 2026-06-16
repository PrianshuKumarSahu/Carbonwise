/**
 * @module state
 * @description Lightweight reactive state management with localStorage persistence.
 * Stores carbon footprint data, user preferences, and tracking history.
 */

const STATE_KEY = 'carbonwise_state';
const HISTORY_KEY = 'carbonwise_history';
const MAX_HISTORY_ENTRIES = 52; // 1 year of weekly tracking

/** @type {Set<Function>} */
const listeners = new Set();

/**
 * @typedef {import('./utils/calculator.js').CalculatorData} CalculatorData
 */

/**
 * @typedef {Object} AppState
 * @property {CalculatorData} calculatorData
 * @property {Object|null} results
 * @property {string[]} pledges
 * @property {string[]} completedActions
 * @property {number[]} quizScores
 * @property {{ reducedMotion: boolean }} preferences
 */

/**
 * Default state shape
 * @returns {AppState}
 */
function getDefaultState() {
  return {
    calculatorData: {
      transport: { carKmPerWeek: 0, carType: 'petrol', flightsPerYear: 0, publicTransitHoursPerWeek: 0 },
      home: { electricityKwh: 0, gasKwh: 0, renewablePercent: 0, residents: 1 },
      diet: { dietType: 'omnivore', foodWastePercent: 10, localFoodPercent: 20 },
      shopping: { clothingItemsPerMonth: 0, electronicsPerYear: 0, recyclePercent: 30 },
    },
    results: null,
    pledges: [],
    completedActions: [],
    quizScores: [],
    preferences: {
      reducedMotion: false,
    },
  };
}

/**
 * Load state from localStorage with validation
 * @returns {AppState}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return getDefaultState();

    // Merge with defaults to ensure all keys exist
    const defaults = getDefaultState();
    return {
      ...defaults,
      ...parsed,
      calculatorData: {
        ...defaults.calculatorData,
        ...(parsed.calculatorData || {}),
        transport: { ...defaults.calculatorData.transport, ...(parsed.calculatorData?.transport || {}) },
        home: { ...defaults.calculatorData.home, ...(parsed.calculatorData?.home || {}) },
        diet: { ...defaults.calculatorData.diet, ...(parsed.calculatorData?.diet || {}) },
        shopping: { ...defaults.calculatorData.shopping, ...(parsed.calculatorData?.shopping || {}) },
      },
      pledges: Array.isArray(parsed.pledges) ? parsed.pledges : [],
      completedActions: Array.isArray(parsed.completedActions) ? parsed.completedActions : [],
      quizScores: Array.isArray(parsed.quizScores) ? parsed.quizScores : [],
      preferences: { ...defaults.preferences, ...(parsed.preferences || {}) },
    };
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return getDefaultState();
  }
}

/** @type {AppState} The current app state */
let state = loadState();

/**
 * Get current state (immutable copy)
 * @returns {AppState}
 */
export function getState() {
  return JSON.parse(JSON.stringify(state));
}

/**
 * Update state with partial changes and persist
 * @param {Partial<AppState>} updates - Partial state to merge
 */
export function setState(updates) {
  state = deepMerge(state, updates);
  persist();
  notify();
}

/**
 * Reset state to defaults
 */
export function resetState() {
  state = getDefaultState();
  persist();
  notify();
}

/**
 * Subscribe to state changes
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Save a carbon calculation result to history
 * @param {Object} result
 */
export function saveToHistory(result) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) throw new TypeError('Invalid history format');

    history.push({
      ...result,
      date: new Date().toISOString(),
    });

    const trimmed = history.slice(-MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to save history, resetting:', error);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([{ ...result, date: new Date().toISOString() }]));
  }
}

/**
 * Load carbon history
 * @returns {Array}
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const history = JSON.parse(raw);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
}

/**
 * Deep merge utility
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;
  
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

/** Persist state to localStorage */
function persist() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Storage full or unavailable:', error);
  }
}

/** Notify all subscribers */
function notify() {
  for (const fn of listeners) {
    try {
      fn(getState());
    } catch (error) {
      console.error('Listener failed:', error);
    }
  }
}
