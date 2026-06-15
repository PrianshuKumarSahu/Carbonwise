import { describe, it, expect } from 'vitest';
import { calculateTransport, calculateHome, calculateDiet, calculateShopping, calculateTotal } from '../src/utils/calculator';
import { EMISSION_FACTORS } from '../src/data/emission-factors';

describe('Calculator', () => {
  describe('calculateTransport', () => {
    it('calculates petrol car emissions correctly', () => {
      const data = { carKmPerWeek: 100, carType: 'petrol' };
      const result = calculateTransport(data);
      expect(result.breakdown.car).toBeCloseTo(100 * 52 * EMISSION_FACTORS.PETROL_CAR_PER_KM);
    });

    it('calculates electric car emissions correctly', () => {
      const data = { carKmPerWeek: 100, carType: 'electric' };
      const result = calculateTransport(data);
      expect(result.breakdown.car).toBeCloseTo(100 * 52 * EMISSION_FACTORS.ELECTRIC_CAR_PER_KM);
    });
  });

  describe('calculateHome', () => {
    it('calculates electricity with renewable discount', () => {
      const data = { electricityKwh: 100, renewablePercent: 50, residents: 1 };
      const result = calculateHome(data);
      // 100 kWh * 12 months * factor * 0.5
      const expected = 100 * 12 * EMISSION_FACTORS.ELECTRICITY_PER_KWH * 0.5;
      expect(result.breakdown.electricity).toBeCloseTo(expected);
    });
  });

  describe('calculateDiet', () => {
    it('calculates vegan diet baseline correctly', () => {
      const result = calculateDiet({ dietType: 'vegan', foodWastePercent: 5, localFoodPercent: 0 });
      expect(result.total).toBeCloseTo(EMISSION_FACTORS.DIET_VEGAN);
    });

    it('applies food waste penalty above 5%', () => {
      const baseline = calculateDiet({ dietType: 'omnivore', foodWastePercent: 5 }).total;
      const wasteful = calculateDiet({ dietType: 'omnivore', foodWastePercent: 15 }).total;
      expect(wasteful).toBeGreaterThan(baseline);
    });
  });

  describe('calculateShopping', () => {
    it('calculates clothing emissions', () => {
      const result = calculateShopping({ clothingItemsPerMonth: 2, electronicsPerYear: 0, recyclePercent: 0 });
      expect(result.breakdown.clothing).toBe(2 * 12 * EMISSION_FACTORS.CLOTHING_ITEM_AVG);
    });
  });
});
