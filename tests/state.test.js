import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getState, setState, resetState } from '../src/state';

describe('State Management', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    resetState();
  });

  it('provides default state initially', () => {
    const state = getState();
    expect(state.calculatorData).toBeDefined();
    expect(state.results).toBeNull();
    expect(state.pledges).toEqual([]);
  });

  it('updates state and persists to localStorage', () => {
    setState({ pledges: ['t1'] });
    
    // Check memory state
    const state = getState();
    expect(state.pledges).toEqual(['t1']);
    
    // Check localStorage
    const saved = JSON.parse(localStorage.getItem('carbonwise_state'));
    expect(saved.pledges).toEqual(['t1']);
  });

  it('deep merges calculator data correctly', () => {
    setState({
      calculatorData: {
        transport: { carKmPerWeek: 500 }
      }
    });
    
    const state = getState();
    expect(state.calculatorData.transport.carKmPerWeek).toBe(500);
    // Other values should remain untouched
    expect(state.calculatorData.transport.carType).toBe('petrol');
  });
});
