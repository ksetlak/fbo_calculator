import React from "react";
import { SliderInput } from "./SliderInput";
import { SettingsAccordion } from "./SettingsAccordion";
import { CalculatorInputs } from "@/lib/calculator";
import { Card } from "./ui/Card";

interface InputSectionProps {
  inputs: CalculatorInputs;
  onChange: (field: keyof CalculatorInputs, value: number) => void;
}

export function InputSection({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6 bg-white shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Parametry Twoich Oszczędności</h2>
        
        <SliderInput
          label="Kwota oszczędności"
          value={inputs.initialCapital}
          onChange={(val) => onChange("initialCapital", val)}
          min={1000}
          max={1000000}
          step={1000}
          unit="zł"
        />

        <SliderInput
          label="Średnia inflacja (rocznie)"
          value={inputs.expectedInflation}
          onChange={(val) => onChange("expectedInflation", val)}
          min={0}
          max={20}
          step={0.1}
          unit="%"
        />

        <SliderInput
          label="Oprocentowanie lokaty (brutto)"
          value={inputs.depositRate}
          onChange={(val) => onChange("depositRate", val)}
          min={0}
          max={15}
          step={0.1}
          unit="%"
        />
      </Card>

      <SettingsAccordion title="Ustawienia Zaawansowane" className="shadow-sm">
        <SliderInput
          label="Oprocentowanie obligacji (1. rok)"
          value={inputs.bondFirstYearRate}
          onChange={(val) => onChange("bondFirstYearRate", val)}
          min={0}
          max={15}
          step={0.1}
          unit="%"
        />

        <SliderInput
          label="Marża obligacji (lata 2-4)"
          value={inputs.bondMargin}
          onChange={(val) => onChange("bondMargin", val)}
          min={0}
          max={10}
          step={0.05}
          unit="%"
        />

        <SliderInput
          label="Podatek Belki"
          value={inputs.taxRate}
          onChange={(val) => onChange("taxRate", val)}
          min={0}
          max={100}
          step={1}
          unit="%"
        />
      </SettingsAccordion>
    </div>
  );
}
