import { describe, it, expect } from 'vitest';
import { calculateScenarios, CalculatorInputs } from './calculator';

describe('calculateScenarios', () => {
  it('calculates Cash scenario correctly (flat line)', () => {
    const inputs: CalculatorInputs = {
      initialCapital: 10000,
      expectedInflation: 5,
      depositRate: 4,
      bondFirstYearRate: 6.5,
      bondMargin: 1.25,
      taxRate: 19,
    };

    const result = calculateScenarios(inputs);
    expect(result.summary.cash).toBe(10000);
    expect(result.chartData[4].cashValue).toBe(10000);
    expect(result.chartData[0].cashValue).toBe(10000);
  });

  it('calculates Deposit scenario correctly', () => {
    // 10000 * 4% = 400 gross. Tax 19% = 76. Net = 324.
    // Y1 = 10324.
    // Y2 = 10324 * 1.04 = ...
    const inputs: CalculatorInputs = {
      initialCapital: 10000,
      expectedInflation: 0,
      depositRate: 4,
      bondFirstYearRate: 0,
      bondMargin: 0,
      taxRate: 19,
    };

    const result = calculateScenarios(inputs);
    const expectedY1 = 10000 + (10000 * 0.04 * (1 - 0.19));
    expect(result.chartData[1].depositValue).toBeCloseTo(expectedY1, 2);
  });

  it('calculates Bond scenario correctly (Deferred Tax)', () => {
    // Y1: 6.5% of 10000 = 650. Gross Y1 = 10650.
    // Y2: Inflation 5% + Margin 1.25% = 6.25%. 
    // Interest Y2 = 10650 * 0.0625 = 665.625. Gross Y2 = 11315.625.
    // Y3: Rate 6.25%. Interest Y3 = 11315.625 * 0.0625 = 707.226... Gross Y3 = 12022.85...
    // Y4: Rate 6.25%. Interest Y4 = 12022.85 * 0.0625 = 751.428... Gross Y4 = 12774.28...
    // Total Interest = 650 + 665.625 + 707.226 + 751.428 = 2774.28
    // Tax = 2774.28 * 0.19 = 527.11
    // Net = 10000 + 2774.28 - 527.11 = 12247.17
    
    const inputs: CalculatorInputs = {
      initialCapital: 10000,
      expectedInflation: 5,
      depositRate: 0,
      bondFirstYearRate: 6.5,
      bondMargin: 1.25,
      taxRate: 19,
    };

    const result = calculateScenarios(inputs);
    
    // Check intermediate gross values (Year 1)
    expect(result.chartData[1].bondValue).toBe(10650);

    // Check final net value
    // Let's verify precisely
    const y1 = 10650;
    const rate = 0.0625;
    const i2 = y1 * rate; 
    const y2 = y1 + i2;
    const i3 = y2 * rate;
    const y3 = y2 + i3;
    const i4 = y3 * rate;
    const y4Gross = y3 + i4;
    
    const totalInterest = y4Gross - 10000;
    const tax = totalInterest * 0.19;
    const expectedNet = 10000 + totalInterest - tax;

    expect(result.summary.bond).toBeCloseTo(expectedNet, 2);
    expect(result.chartData[4].bondValue).toBeCloseTo(expectedNet, 2);
  });
});
