/**
 * Unit tests for RF calculation functions
 *
 * Run with: npx vitest run
 */

import { describe, it, expect } from 'vitest';
import {
  interpolateAttenuation,
  calculateTotalAttenuation,
  dbToLossPercent,
  calculateOutputPower,
  ratioToDb,
  dbToRatio,
  calculateAll,
  validateInputs
} from '../src/lib/rf-calculations.js';

// Sample attenuation data (similar to RG-213)
const sampleData = [
  { frequencyMHz: 1, dbPer100m: 0.6 },
  { frequencyMHz: 10, dbPer100m: 1.9 },
  { frequencyMHz: 50, dbPer100m: 4.1 },
  { frequencyMHz: 144, dbPer100m: 7.2 },
  { frequencyMHz: 432, dbPer100m: 13.0 },
  { frequencyMHz: 1296, dbPer100m: 24.0 }
];

describe('interpolateAttenuation', () => {
  it('returns exact match when frequency matches a data point', () => {
    expect(interpolateAttenuation(sampleData, 1)).toBe(0.6);
    expect(interpolateAttenuation(sampleData, 144)).toBe(7.2);
    expect(interpolateAttenuation(sampleData, 1296)).toBe(24.0);
  });

  it('interpolates between two points using log-log interpolation', () => {
    // Between 10 MHz (1.9 dB) and 50 MHz (4.1 dB)
    const result = interpolateAttenuation(sampleData, 28);
    // Should be between 1.9 and 4.1
    expect(result).toBeGreaterThan(1.9);
    expect(result).toBeLessThan(4.1);
    // Log-log interpolation: more accurate than linear
    // At 28 MHz, expect around 3.0-3.2 dB
    expect(result).toBeCloseTo(3.1, 0);
  });

  it('extrapolates below minimum frequency', () => {
    const result = interpolateAttenuation(sampleData, 0.5);
    // Should be less than 0.6 dB (the value at 1 MHz)
    expect(result).toBeLessThan(0.6);
    expect(result).toBeGreaterThan(0);
  });

  it('extrapolates above maximum frequency', () => {
    const result = interpolateAttenuation(sampleData, 2000);
    // Should be greater than 24.0 dB (the value at 1296 MHz)
    expect(result).toBeGreaterThan(24.0);
  });

  it('handles unsorted data', () => {
    const unsorted = [
      { frequencyMHz: 50, dbPer100m: 4.1 },
      { frequencyMHz: 1, dbPer100m: 0.6 },
      { frequencyMHz: 144, dbPer100m: 7.2 }
    ];
    expect(interpolateAttenuation(unsorted, 1)).toBe(0.6);
    expect(interpolateAttenuation(unsorted, 144)).toBe(7.2);
  });

  it('throws error for invalid frequency', () => {
    expect(() => interpolateAttenuation(sampleData, 0)).toThrow();
    expect(() => interpolateAttenuation(sampleData, -10)).toThrow();
  });

  it('throws error for empty data', () => {
    expect(() => interpolateAttenuation([], 100)).toThrow();
    expect(() => interpolateAttenuation(null, 100)).toThrow();
  });
});

describe('calculateTotalAttenuation', () => {
  it('calculates correctly for 100m', () => {
    expect(calculateTotalAttenuation(3.0, 100)).toBe(3.0);
  });

  it('calculates correctly for other lengths', () => {
    expect(calculateTotalAttenuation(3.0, 50)).toBe(1.5);
    expect(calculateTotalAttenuation(3.0, 200)).toBe(6.0);
    expect(calculateTotalAttenuation(3.0, 25)).toBe(0.75);
  });

  it('returns 0 for zero length', () => {
    expect(calculateTotalAttenuation(3.0, 0)).toBe(0);
  });

  it('throws error for negative length', () => {
    expect(() => calculateTotalAttenuation(3.0, -10)).toThrow();
  });
});

describe('dbToLossPercent', () => {
  it('converts common dB values correctly', () => {
    // 3 dB = 50% loss (half power)
    expect(dbToLossPercent(3)).toBeCloseTo(50, 0);

    // 10 dB = 90% loss
    expect(dbToLossPercent(10)).toBeCloseTo(90, 0);

    // 0 dB = 0% loss
    expect(dbToLossPercent(0)).toBe(0);

    // 1 dB ≈ 20.6% loss
    expect(dbToLossPercent(1)).toBeCloseTo(20.6, 0);

    // 6 dB ≈ 75% loss (quarter power)
    expect(dbToLossPercent(6)).toBeCloseTo(75, 0);
  });

  it('caps at 100% for very high attenuation', () => {
    expect(dbToLossPercent(100)).toBeCloseTo(100, 5);
    expect(dbToLossPercent(1000)).toBe(100);
  });

  it('throws error for negative attenuation', () => {
    expect(() => dbToLossPercent(-3)).toThrow();
  });
});

describe('calculateOutputPower', () => {
  it('calculates output power correctly', () => {
    // 3 dB loss = half power
    expect(calculateOutputPower(100, 3)).toBeCloseTo(50, 0);

    // 10 dB loss = 1/10 power
    expect(calculateOutputPower(100, 10)).toBeCloseTo(10, 0);

    // 0 dB loss = full power
    expect(calculateOutputPower(100, 0)).toBe(100);

    // 6 dB loss = quarter power
    expect(calculateOutputPower(100, 6)).toBeCloseTo(25, 0);
  });

  it('works with different input powers', () => {
    // 3 dB = 10^(-0.3) ≈ 0.5012 (not exactly 0.5)
    expect(calculateOutputPower(5, 3)).toBeCloseTo(2.506, 2);
    expect(calculateOutputPower(10, 3)).toBeCloseTo(5.01, 1);
    expect(calculateOutputPower(1000, 3)).toBeCloseTo(501.2, 0);
  });

  it('throws error for negative input power', () => {
    expect(() => calculateOutputPower(-10, 3)).toThrow();
  });

  it('throws error for negative attenuation', () => {
    expect(() => calculateOutputPower(10, -3)).toThrow();
  });
});

describe('ratioToDb and dbToRatio', () => {
  it('are inverse functions', () => {
    expect(dbToRatio(ratioToDb(0.5))).toBeCloseTo(0.5, 10);
    expect(dbToRatio(ratioToDb(0.1))).toBeCloseTo(0.1, 10);
    expect(dbToRatio(ratioToDb(1))).toBeCloseTo(1, 10);
    expect(ratioToDb(dbToRatio(3))).toBeCloseTo(3, 10);
    expect(ratioToDb(dbToRatio(10))).toBeCloseTo(10, 10);
  });

  it('converts standard values correctly', () => {
    expect(ratioToDb(0.5)).toBeCloseTo(-3.01, 1); // Half power = -3 dB
    expect(ratioToDb(0.1)).toBeCloseTo(-10, 1);   // 1/10 power = -10 dB
    expect(ratioToDb(0.25)).toBeCloseTo(-6.02, 1); // Quarter power = -6 dB
    expect(dbToRatio(3)).toBeCloseTo(2, 1);        // +3 dB = double
    expect(dbToRatio(-3)).toBeCloseTo(0.5, 1);     // -3 dB = half
  });

  it('throws error for non-positive ratio', () => {
    expect(() => ratioToDb(0)).toThrow();
    expect(() => ratioToDb(-1)).toThrow();
  });
});

describe('calculateAll', () => {
  it('returns all expected fields', () => {
    const result = calculateAll({
      attenuationData: sampleData,
      frequencyMHz: 144,
      lengthMeters: 20,
      inputPowers: [5, 10, 100]
    });

    expect(result).toHaveProperty('dbPer100m');
    expect(result).toHaveProperty('totalAttenuationDb');
    expect(result).toHaveProperty('lossPercent');
    expect(result).toHaveProperty('efficiency');
    expect(result).toHaveProperty('outputPowers');
    expect(result.outputPowers).toHaveLength(3);
  });

  it('calculates correct values for 20m of cable at 144 MHz', () => {
    const result = calculateAll({
      attenuationData: sampleData,
      frequencyMHz: 144,
      lengthMeters: 20,
      inputPowers: [100]
    });

    // 7.2 dB per 100m at 144 MHz
    expect(result.dbPer100m).toBe(7.2);

    // 20m = 0.2 * 7.2 = 1.44 dB
    expect(result.totalAttenuationDb).toBeCloseTo(1.44, 2);

    // Loss percent + efficiency = 100
    expect(result.lossPercent + result.efficiency).toBeCloseTo(100, 5);

    // Output power for 100W input
    const outputPower = result.outputPowers[0];
    expect(outputPower.inputWatts).toBe(100);
    expect(outputPower.outputWatts).toBeCloseTo(71.8, 0);
    expect(outputPower.lostWatts).toBeCloseTo(28.2, 0);
  });

  it('efficiency and loss are complementary', () => {
    const result = calculateAll({
      attenuationData: sampleData,
      frequencyMHz: 432,
      lengthMeters: 50,
      inputPowers: [10]
    });

    expect(result.lossPercent + result.efficiency).toBeCloseTo(100, 10);
  });
});

describe('validateInputs', () => {
  it('accepts valid inputs', () => {
    const result = validateInputs({
      frequencyMHz: 145,
      lengthMeters: 20
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects zero frequency', () => {
    const result = validateInputs({
      frequencyMHz: 0,
      lengthMeters: 20
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects negative frequency', () => {
    const result = validateInputs({
      frequencyMHz: -100,
      lengthMeters: 20
    });
    expect(result.isValid).toBe(false);
  });

  it('rejects negative length', () => {
    const result = validateInputs({
      frequencyMHz: 145,
      lengthMeters: -10
    });
    expect(result.isValid).toBe(false);
  });

  it('accepts zero length', () => {
    const result = validateInputs({
      frequencyMHz: 145,
      lengthMeters: 0
    });
    expect(result.isValid).toBe(true);
  });

  it('rejects very high frequency', () => {
    const result = validateInputs({
      frequencyMHz: 50000,
      lengthMeters: 20
    });
    expect(result.isValid).toBe(false);
  });

  it('rejects very long cable', () => {
    const result = validateInputs({
      frequencyMHz: 145,
      lengthMeters: 100000
    });
    expect(result.isValid).toBe(false);
  });

  it('handles missing values', () => {
    expect(validateInputs({ frequencyMHz: null, lengthMeters: 20 }).isValid).toBe(false);
    expect(validateInputs({ frequencyMHz: 145, lengthMeters: null }).isValid).toBe(false);
    expect(validateInputs({ frequencyMHz: '', lengthMeters: 20 }).isValid).toBe(false);
  });
});
