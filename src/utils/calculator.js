/**
 * @module calculator
 * @description Pure functions for calculating carbon footprints.
 * Follows strict code quality principles: no magic numbers, strong JSDoc typing, and low cyclomatic complexity.
 */

import { EMISSION_FACTORS, FOOD_WASTE_MULTIPLIER, AVERAGES } from '../data/emission-factors.js';

// --- Constants (No Magic Numbers) ---
const WEEKS_IN_YEAR = 52;
const MONTHS_IN_YEAR = 12;
const DEFAULT_FLIGHT_HOURS = 4;
const BASELINE_FOOD_WASTE_PERCENT = 5;
const MAX_LOCAL_FOOD_DISCOUNT = 0.10; // 10% max reduction
const MAX_RECYCLING_DISCOUNT = 0.20; // 20% max reduction
const PERCENT_DIVISOR = 100;

// --- Dictionaries for O(1) lookups instead of if/else chains ---
const CAR_FACTORS = {
  petrol: EMISSION_FACTORS.PETROL_CAR_PER_KM,
  diesel: EMISSION_FACTORS.DIESEL_CAR_PER_KM,
  hybrid: EMISSION_FACTORS.HYBRID_CAR_PER_KM,
  electric: EMISSION_FACTORS.ELECTRIC_CAR_PER_KM,
  none: 0,
};

const DIET_FACTORS = {
  vegan: EMISSION_FACTORS.DIET_VEGAN,
  vegetarian: EMISSION_FACTORS.DIET_VEGETARIAN,
  pescatarian: EMISSION_FACTORS.DIET_PESCATARIAN,
  omnivore: EMISSION_FACTORS.DIET_OMNIVORE,
  'high-meat': EMISSION_FACTORS.DIET_HIGH_MEAT,
};

// --- Type Definitions ---

/**
 * @typedef {Object} TransportData
 * @property {number} carKmPerWeek
 * @property {string} carType
 * @property {number} flightsPerYear
 * @property {number} publicTransitHoursPerWeek
 */

/**
 * @typedef {Object} HomeData
 * @property {number} electricityKwh
 * @property {number} gasKwh
 * @property {number} renewablePercent
 * @property {number} residents
 */

/**
 * @typedef {Object} DietData
 * @property {string} dietType
 * @property {number} foodWastePercent
 * @property {number} localFoodPercent
 */

/**
 * @typedef {Object} ShoppingData
 * @property {number} clothingItemsPerMonth
 * @property {number} electronicsPerYear
 * @property {number} recyclePercent
 */

/**
 * @typedef {Object} CalculatorData
 * @property {TransportData} transport
 * @property {HomeData} home
 * @property {DietData} diet
 * @property {ShoppingData} shopping
 */

// --- Functions ---

/**
 * Calculates transport emissions.
 * @param {TransportData} data Transport data inputs.
 * @returns {{ total: number, breakdown: { car: number, flights: number, publicTransit: number } }}
 */
export function calculateTransport(data) {
  const { carKmPerWeek = 0, carType = 'petrol', flightsPerYear = 0, publicTransitHoursPerWeek = 0 } = data;
  
  const carFactor = CAR_FACTORS[carType] || 0;
  const carEmissions = carKmPerWeek * WEEKS_IN_YEAR * carFactor;
  const flightEmissions = flightsPerYear * DEFAULT_FLIGHT_HOURS * EMISSION_FACTORS.SHORT_FLIGHT_PER_HOUR;
  const transitEmissions = publicTransitHoursPerWeek * WEEKS_IN_YEAR * EMISSION_FACTORS.PUBLIC_TRANSIT_PER_HOUR;

  const total = carEmissions + flightEmissions + transitEmissions;

  return {
    total,
    breakdown: {
      car: carEmissions,
      flights: flightEmissions,
      publicTransit: transitEmissions
    }
  };
}

/**
 * Calculates home energy emissions.
 * @param {HomeData} data Home energy data inputs.
 * @returns {{ total: number, breakdown: { electricity: number, gas: number } }}
 */
export function calculateHome(data) {
  const { electricityKwh = 0, gasKwh = 0, renewablePercent = 0, residents = 1 } = data;
  const validResidents = Math.max(1, residents);
  
  const nonRenewableRatio = 1 - (renewablePercent / PERCENT_DIVISOR);
  const electricityEmissions = (electricityKwh * MONTHS_IN_YEAR * EMISSION_FACTORS.ELECTRICITY_PER_KWH * nonRenewableRatio) / validResidents;
  const gasEmissions = (gasKwh * MONTHS_IN_YEAR * EMISSION_FACTORS.NATURAL_GAS_PER_KWH) / validResidents;

  const total = electricityEmissions + gasEmissions;

  return {
    total,
    breakdown: {
      electricity: electricityEmissions,
      gas: gasEmissions
    }
  };
}

/**
 * Calculates diet emissions.
 * @param {DietData} data Diet data inputs.
 * @returns {{ total: number }}
 */
export function calculateDiet(data) {
  const { dietType = 'omnivore', foodWastePercent = 10, localFoodPercent = 20 } = data;
  
  const baseEmissions = DIET_FACTORS[dietType] || EMISSION_FACTORS.DIET_OMNIVORE;

  // Adjust for food waste (baseline is 5%)
  const wasteAdjustment = Math.max(0, foodWastePercent - BASELINE_FOOD_WASTE_PERCENT) * FOOD_WASTE_MULTIPLIER;
  
  // Adjust for local food (up to 10% reduction for 100% local)
  const localAdjustment = (localFoodPercent / PERCENT_DIVISOR) * MAX_LOCAL_FOOD_DISCOUNT;

  const total = baseEmissions * (1 + wasteAdjustment) * (1 - localAdjustment);

  return { total };
}

/**
 * Calculates shopping and lifestyle emissions.
 * @param {ShoppingData} data Shopping data inputs.
 * @returns {{ total: number, breakdown: { clothing: number, electronics: number } }}
 */
export function calculateShopping(data) {
  const { clothingItemsPerMonth = 0, electronicsPerYear = 0, recyclePercent = 30 } = data;
  
  const clothingEmissions = clothingItemsPerMonth * MONTHS_IN_YEAR * EMISSION_FACTORS.CLOTHING_ITEM_AVG;
  const electronicsEmissions = electronicsPerYear * EMISSION_FACTORS.ELECTRONICS_AVG;
  
  const recyclingAdjustment = (recyclePercent / PERCENT_DIVISOR) * MAX_RECYCLING_DISCOUNT;

  const subtotal = clothingEmissions + electronicsEmissions;
  const total = subtotal * (1 - recyclingAdjustment);

  return {
    total,
    breakdown: {
      clothing: clothingEmissions * (1 - recyclingAdjustment),
      electronics: electronicsEmissions * (1 - recyclingAdjustment)
    }
  };
}

/**
 * Calculates total footprint combining all categories.
 * @param {CalculatorData} calculatorData Complete calculator data.
 * @returns {Object} Comprehensive calculation result.
 */
export function calculateTotal(calculatorData) {
  const transport = calculateTransport(calculatorData.transport || {});
  const home = calculateHome(calculatorData.home || {});
  const diet = calculateDiet(calculatorData.diet || {});
  const shopping = calculateShopping(calculatorData.shopping || {});

  const totalAnnual = transport.total + home.total + diet.total + shopping.total;

  return {
    totalAnnual,
    categories: {
      transport: transport.total,
      home: home.total,
      diet: diet.total,
      shopping: shopping.total
    },
    breakdown: {
      transport: transport.breakdown,
      home: home.breakdown,
      shopping: shopping.breakdown
    },
    comparison: {
      vsWorld: ((totalAnnual - AVERAGES.WORLD_AVERAGE_ANNUAL) / AVERAGES.WORLD_AVERAGE_ANNUAL) * PERCENT_DIVISOR,
      vsUS: ((totalAnnual - AVERAGES.US_AVERAGE_ANNUAL) / AVERAGES.US_AVERAGE_ANNUAL) * PERCENT_DIVISOR,
      vsEU: ((totalAnnual - AVERAGES.EU_AVERAGE_ANNUAL) / AVERAGES.EU_AVERAGE_ANNUAL) * PERCENT_DIVISOR
    }
  };
}
