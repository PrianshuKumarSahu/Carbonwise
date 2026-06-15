/**
 * @module emission-factors
 * @description Emission factors for carbon footprint calculations.
 * Values are in kg CO₂e (Carbon Dioxide Equivalent) per unit.
 * Sources: EPA, DEFRA, Our World in Data.
 */

export const EMISSION_FACTORS = {
  // Transport
  PETROL_CAR_PER_KM: 0.21,
  DIESEL_CAR_PER_KM: 0.171,
  ELECTRIC_CAR_PER_KM: 0.053,
  HYBRID_CAR_PER_KM: 0.12,
  BUS_PER_KM: 0.089,
  TRAIN_PER_KM: 0.041,
  SHORT_FLIGHT_PER_HOUR: 255, // domestic
  LONG_FLIGHT_PER_HOUR: 195,  // international (more efficient per hour)
  PUBLIC_TRANSIT_PER_HOUR: 2.6, // average bus/train per hour

  // Home Energy
  ELECTRICITY_PER_KWH: 0.433, // UK grid average
  NATURAL_GAS_PER_KWH: 0.184,

  // Diet (annual per person kg CO₂e)
  DIET_VEGAN: 1500,
  DIET_VEGETARIAN: 1700,
  DIET_PESCATARIAN: 1900,
  DIET_OMNIVORE: 2500,
  DIET_HIGH_MEAT: 3300,

  // Shopping
  CLOTHING_ITEM_AVG: 25, // kg CO2 per garment
  ELECTRONICS_AVG: 300, // kg CO2 per device
};

export const FOOD_WASTE_MULTIPLIER = 0.0025; // 0.25% extra per 1% food waste above baseline 5%

export const AVERAGES = {
  WORLD_AVERAGE_ANNUAL: 4700, // kg CO2 per person
  US_AVERAGE_ANNUAL: 15200,
  EU_AVERAGE_ANNUAL: 6800,
  INDIA_AVERAGE_ANNUAL: 1900,
  UK_AVERAGE_ANNUAL: 5500,
};
