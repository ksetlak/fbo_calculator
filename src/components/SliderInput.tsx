import React from "react";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  className?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  className,
}: SliderInputProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    // Allow typing, but maybe clamp on blur? For now just raw input.
    // If we clamp immediately, it's hard to type.
    onChange(val);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-24 text-right pr-8"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="w-full accent-blue-600"
      />
    </div>
  );
}
