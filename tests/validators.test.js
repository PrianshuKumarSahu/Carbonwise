import { describe, it, expect } from 'vitest';
import { sanitizeString, validateNumber, validateSelect } from '../src/utils/validators';

describe('Validators', () => {
  describe('sanitizeString', () => {
    it('escapes HTML tags', () => {
      expect(sanitizeString('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    });
    
    it('returns empty string for non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('validateNumber', () => {
    it('validates a number within range', () => {
      const result = validateNumber(50, 0, 100);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(50);
    });

    it('rejects a number below minimum', () => {
      const result = validateNumber(-10, 0, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('least 0');
    });

    it('rejects a number above maximum', () => {
      const result = validateNumber(150, 0, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('no more than 100');
    });

    it('handles string numbers correctly', () => {
      const result = validateNumber('25', 0, 100);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(25);
    });
  });

  describe('validateSelect', () => {
    it('accepts valid options', () => {
      const result = validateSelect('vegan', ['vegan', 'omnivore']);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid options', () => {
      const result = validateSelect('carnivore', ['vegan', 'omnivore']);
      expect(result.valid).toBe(false);
    });
  });
});
