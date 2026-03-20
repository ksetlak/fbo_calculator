export interface CalculatorInputs {
  initialCapital: number;
  expectedInflation: number; // percentage (e.g., 5.0 for 5%)
  depositRate: number; // percentage
  bondFirstYearRate: number; // percentage
  bondMargin: number; // percentage
  taxRate: number; // percentage (usually 19)
}

export interface YearResult {
  year: number;
  cashValue: number;
  depositValue: number;
  bondValue: number;
}

export interface CalculationResult {
  chartData: YearResult[];
  summary: {
    cash: number;
    deposit: number;
    bond: number;
  };
}

export function calculateScenarios(inputs: CalculatorInputs): CalculationResult {
  const {
    initialCapital,
    expectedInflation,
    depositRate,
    bondFirstYearRate,
    bondMargin,
    taxRate,
  } = inputs;

  const inflation = expectedInflation / 100;
  const depRate = depositRate / 100;
  const bondRateY1 = bondFirstYearRate / 100;
  const bondMarginRate = bondMargin / 100;
  const tax = taxRate / 100;

  const results: YearResult[] = [];

  // Year 0
  results.push({
    year: 0,
    cashValue: initialCapital,
    depositValue: initialCapital,
    bondValue: initialCapital,
  });

  let currentDepositValue = initialCapital;
  let currentBondValue = initialCapital;
  let accumulatedBondInterest = 0;

  for (let year = 1; year <= 4; year++) {
    // Scenario A: Cash (Nominal value constant)
    const cashValue = initialCapital;

    // Scenario B: Deposit (Annual Capitalization & Tax)
    const depositInterest = currentDepositValue * depRate;
    const depositTax = depositInterest * tax;
    currentDepositValue += (depositInterest - depositTax);

    // Scenario C: Bonds (COI)
    // Interest capitalizes annually, but tax is deferred.
    let currentYearBondRate = 0;
    if (year === 1) {
      currentYearBondRate = bondRateY1;
    } else {
      currentYearBondRate = inflation + bondMarginRate;
    }

    const bondInterest = currentBondValue * currentYearBondRate;
    accumulatedBondInterest += bondInterest;
    currentBondValue += bondInterest;

    // For the chart, we need to show the value.
    // However, the bond value shown on chart usually includes accrued interest.
    // But the tax is not paid yet.
    // The spec says: "Ostateczny wynik netto po 4 latach".
    // For intermediate years, showing the gross value is standard for COI until redemption.
    // BUT to be fair comparison "on hand", we should probably estimate net value if redeemed?
    // Spec says: "WynikObligacji = K + SumaOdsetekBrutto - Podatek" (at end).
    // Let's store the GROSS value for years 1-3, and NET value for year 4.
    // Actually, to make the chart smooth, we should probably stick to one consistent view.
    // If we drop the tax bomb at year 4, the line might drop or not rise as fast.
    // Let's look at the spec: "V_n = V_{n-1} + OdsetkiBrutto_n" for years 1-4.
    // And then "Ostateczny wynik netto po 4 latach: WynikObligacji = K + SumaOdsetekBrutto - Podatek".
    // This implies the intermediate values V_n are GROSS.
    // If we plot Gross vs Net Deposit, it's comparing apples to oranges.
    // However, COI bonds *do* work this way - you have that value on your account.
    // Let's stick to the algo description in the spec for V_n.
    // Wait, the spec for C says:
    // Rok 1..4: V_n = V_{n-1} + OdsetkiBrutto_n
    // Then "Rozliczenie końcowe (po 4 roku): ... Ostateczny wynik netto ...".
    // This suggests the chart might show Gross for bonds?
    // "Wykres główny ... Serie danych ... 3. Obligacje"
    // If I show Gross for bonds and Net for Deposit, Bond line will be artificially high.
    // But if the spec defines V_n loop for bonds as Gross, I will follow that for the series data,
    // BUT for the final result (Year 4), I must use the Net value.
    
    // Let's adjust the Year 4 value in the results array to be the Net Value to match the "Summary Cards".
    // Or should the chart show the "account state"?
    // The spec "Scenariusz C" section defines V_n as accumulating Gross interest.
    // It only calculates Tax at the very end.
    // I will calculate V_n (Gross) for the loop.
    // BUT for the `results` array which feeds the chart, if I put Gross for Y4, it won't match the summary card.
    // User wants "Aha! Moment" showing gain "on hand".
    // So Year 4 Bond Value MUST be Net.
    // What about Year 1-3?
    // If I show Net (simulated exit), I'd have to pay tax if I exited early?
    // Actually, early exit from COI has a penalty fee (0.70 zł).
    // The spec doesn't mention early exit penalty.
    // It assumes holding for 4 years.
    // To avoid confusion, I will plot the 'Value if held to maturity' which is... tricky.
    // Let's follow the Spec's V_n definition for the loop.
    // And for the final Year 4 point, strictly apply the Net formula.
    // This means the chart might have a "kink" at the end if we just switch to Net.
    // Let's calculate the Net Value for Year 4 specifically.
    
    // Bond Logic Implementation:
    // We already updated `currentBondValue` (which is Gross) above.
    
    let chartBondValue = currentBondValue;
    
    if (year === 4) {
      const totalInterest = currentBondValue - initialCapital;
      const taxAmount = totalInterest * tax;
      chartBondValue = initialCapital + totalInterest - taxAmount;
    }
    
    // Wait, if I do this, the line might drop from Y3 to Y4 if the tax is large enough?
    // No, usually growth > tax.
    // But it might look weird if the slope changes drastically.
    // Let's trust the math. 
    
    results.push({
      year,
      cashValue,
      depositValue: currentDepositValue,
      bondValue: chartBondValue
    });
  }

  return {
    chartData: results,
    summary: {
      cash: results[4].cashValue,
      deposit: results[4].depositValue,
      bond: results[4].bondValue,
    }
  };
}
