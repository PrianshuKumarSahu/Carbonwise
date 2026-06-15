/**
 * @module calculator
 * @description Pure functions for calculating carbon footprints.
 */

import { EMISSION_FACTORS, FOOD_WASTE_MULTIPLIER, AVERAGES } from '../data/emission-factors.js';

/**
 * Calculates transport emissions
 * @param {Object} data Transport data
 * @returns {Object} Total and breakdown in kg CO₂e/year
 */
export function calculateTransport(data) {
  const { carKmPerWeek = 0, carType = 'petrol', flightsPerYear = 0, publicTransitHoursPerWeek = 0 } = data;
  
  let carFactor = 0;
  if (carType === 'petrol') carFactor = EMISSION_FACTORS.PETROL_CAR_PER_KM;
  else if (carType === 'diesel') carFactor = EMISSION_FACTORS.DIESEL_CAR_PER_KM;
  else if (carType === 'hybrid') carFactor = EMISSION_FACTORS.HYBRID_CAR_PER_KM;
  else if (carType === 'electric') carFactor = EMISSION_FACTORS.ELECTRIC_CAR_PER_KM;

  const carEmissions = carKmPerWeek * 52 * carFactor;
  // Assume average flight is 4 hours, mostly short-haul equivalent for general estimation
  const flightEmissions = flightsPerYear * 4 * EMISSION_FACTORS.SHORT_FLIGHT_PER_HOUR;
  const transitEmissions = publicTransitHoursPerWeek * 52 * EMISSION_FACTORS.PUBLIC_TRANSIT_PER_HOUR;

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
 * Calculates home energy emissions
 * @param {Object} data Home energy data
 * @returns {Object} Total and breakdown in kg CO₂e/year
 */
export function calculateHome(data) {
  const { electricityKwh = 0, gasKwh = 0, renewablePercent = 0, residents = 1 } = data;
  
  // Apply renewable discount to electricity
  const nonRenewableRatio = 1 - (renewablePercent / 100);
  const electricityEmissions = (electricityKwh * 12 * EMISSION_FACTORS.ELECTRICITY_PER_KWH * nonRenewableRatio) / residents;
  const gasEmissions = (gasKwh * 12 * EMISSION_FACTORS.NATURAL_GAS_PER_KWH) / residents;

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
 * Calculates diet emissions
 * @param {Object} data Diet data
 * @returns {Object} Total in kg CO₂e/year
 */
export function calculateDiet(data) {
  const { dietType = 'omnivore', foodWastePercent = 10, localFoodPercent = 20 } = data;
  
  let baseEmissions = EMISSION_FACTORS.DIET_OMNIVORE;
  if (dietType === 'vegan') baseEmissions = EMISSION_FACTORS.DIET_VEGAN;
  else if (dietType === 'vegetarian') baseEmissions = EMISSION_FACTORS.DIET_VEGETARIAN;
  else if (dietType === 'pescatarian') baseEmissions = EMISSION_FACTORS.DIET_PESCATARIAN;
  else if (dietType === 'high-meat') baseEmissions = EMISSION_FACTORS.DIET_HIGH_MEAT;

  // Adjust for food waste (baseline is 5%)
  const wasteAdjustment = Math.max(0, foodWastePercent - 5) * FOOD_WASTE_MULTIPLIER;
  
  // Adjust for local food (up to 10% reduction for 100% local)
  const localAdjustment = (localFoodPercent / 100) * 0.10;

  const total = baseEmissions * (1 + wasteAdjustment) * (1 - localAdjustment);

  return { total };
}

/**
 * Calculates shopping and lifestyle emissions
 * @param {Object} data Shopping data
 * @returns {Object} Total and breakdown in kg CO₂e/year
 */
export function calculateShopping(data) {
  const { clothingItemsPerMonth = 0, electronicsPerYear = 0, recyclePercent = 30 } = data;
  
  const clothingEmissions = clothingItemsPerMonth * 12 * EMISSION_FACTORS.CLOTHING_ITEM_AVG;
  const electronicsEmissions = electronicsPerYear * EMISSION_FACTORS.ELECTRONICS_AVG;
  
  // Simple recycling adjustment (reduces overall shopping impact by up to 20%)
  const recyclingAdjustment = (recyclePercent / 100) * 0.20;

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
 * Calculates total footprint
 * @param {Object} calculatorData Complete calculator data
 * @returns {Object} Comprehensive calculation result
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
      vsWorld: ((totalAnnual - AVERAGES.WORLD_AVERAGE_ANNUAL) / AVERAGES.WORLD_AVERAGE_ANNUAL) * 100,
      vsUS: ((totalAnnual - AVERAGES.US_AVERAGE_ANNUAL) / AVERAGES.US_AVERAGE_ANNUAL) * 100,
      vsEU: ((totalAnnual - AVERAGES.EU_AVERAGE_ANNUAL) / AVERAGES.EU_AVERAGE_ANNUAL) * 100
    }
  };
}
