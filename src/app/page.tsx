"use client";

import React, { useState, useMemo } from "react";
import { InputSection } from "@/components/InputSection";
import { ResultsChart } from "@/components/ResultsChart";
import { SummaryCards } from "@/components/SummaryCards";
import { AhaMoment } from "@/components/AhaMoment";
import { calculateScenarios, CalculatorInputs } from "@/lib/calculator";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialCapital: 10000,
    expectedInflation: 5.0,
    depositRate: 4.0,
    bondFirstYearRate: 6.5,
    bondMargin: 1.25,
    taxRate: 19.0,
  });

  const handleChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => calculateScenarios(inputs), [inputs]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-blue-600">FBO</span> Kalkulator Obligacji
          </h1>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32 lg:pb-8">
        {/* Left Column: Inputs (Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <InputSection inputs={inputs} onChange={handleChange} />
          <div className="hidden lg:block">
             <AhaMoment summary={results.summary} />
          </div>
        </div>

        {/* Right Column: Chart & Summary (Desktop) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          <ResultsChart data={results.chartData} />
          
          <div className="hidden lg:block">
            <SummaryCards initialCapital={inputs.initialCapital} summary={results.summary} />
          </div>
        </div>
        
        {/* Mobile Only: Aha Moment (Between Inputs and Sticky Footer if needed, or just below inputs) */}
        <div className="lg:hidden col-span-1">
           <AhaMoment summary={results.summary} />
        </div>
      </div>

      {/* Mobile Sticky Footer for Summary Cards */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        {/* On mobile, we might want a compact version or carousel? 
            The spec says "sticky-cards z wynikami na dole ekranu".
            3 cards might be too wide for one row on mobile. 
            Let's make them scrollable horizontally or stacked compactly.
            The `SummaryCards` component uses grid-cols-1 md:grid-cols-3.
            Let's modify SummaryCards to be flexible or wrap it here.
        */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
           <div className="flex gap-4 min-w-[max-content] md:min-w-0 md:grid md:grid-cols-3">
             {/* We can reuse the component but the styling in it is grid-cols-1. 
                 We need to override or pass className.
                 The component has specific classes. Let's adjust the component to be responsive.
                 Wait, I can't easily change the component's internal grid behavior from outside without props.
                 But I can make the container here scrollable.
             */}
              <Card className="min-w-[140px] p-3 flex flex-col items-center justify-center text-center bg-gray-50 border-gray-200 shrink-0">
                <h3 className="text-xs font-medium text-gray-500 uppercase">Gotówka</h3>
                <p className="text-lg font-bold text-gray-700">
                  {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(results.summary.cash)}
                </p>
                <p className="text-xs text-gray-400">0 zł zysku</p>
              </Card>

              <Card className="min-w-[140px] p-3 flex flex-col items-center justify-center text-center bg-blue-50 border-blue-200 shrink-0">
                <h3 className="text-xs font-medium text-blue-600 uppercase">Lokata</h3>
                <p className="text-lg font-bold text-blue-800">
                   {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(results.summary.deposit)}
                </p>
                <p className="text-xs text-blue-600">
                  +{new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(results.summary.deposit - inputs.initialCapital)} zysku
                </p>
              </Card>

              <Card className="min-w-[160px] p-3 flex flex-col items-center justify-center text-center bg-green-50 border-green-300 ring-2 ring-green-500 shadow-lg shrink-0 relative overflow-visible">
                <div className="absolute top-0 right-0 -mt-3 -mr-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  POLECANE
                </div>
                <h3 className="text-xs font-bold text-green-700 uppercase">Obligacje</h3>
                <p className="text-xl font-extrabold text-green-800">
                   {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(results.summary.bond)}
                </p>
                <p className="text-xs font-medium text-green-600">
                  +{new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(results.summary.bond - inputs.initialCapital)} zysku
                </p>
              </Card>
           </div>
        </div>
      </div>
    </main>
  );
}
