import { describe, it, expect } from 'vitest';
import { formatCO2, formatPercent, formatNumber, formatComparison } from '../src/utils/formatters';

describe('Formatters', () => {
  describe('formatCO2', () => {
    it('formats small values as kg', () => {
      expect(formatCO2(500)).toBe('500 kg');
    });

    it('formats large values as tonnes with 1 decimal', () => {
      expect(formatCO2(4700)).toBe('4.7 tonnes');
      expect(formatCO2(1000)).toBe('1.0 tonnes');
    });
    
    it('handles invalid inputs', () => {
      expect(formatCO2(null)).toBe('0 kg');
      expect(formatCO2(NaN)).toBe('0 kg');
    });
  });

  describe('formatPercent', () => {
    it('formats percentage correctly', () => {
      expect(formatPercent(45.6)).toBe('46%');
    });
  });

  describe('formatNumber', () => {
    it('adds commas to large numbers', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });
  });

  describe('formatComparison', () => {
    it('identifies above average', () => {
      const result = formatComparison(6000, 5000);
      expect(result.label).toBe('above');
      expect(result.percent).toBe('20%');
      expect(result.color).toBe('danger');
    });

    it('identifies below average', () => {
      const result = formatComparison(4000, 5000);
      expect(result.label).toBe('below');
      expect(result.percent).toBe('20%');
      expect(result.color).toBe('success');
    });
  });
});
