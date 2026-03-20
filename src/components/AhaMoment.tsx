import React from "react";
import { cn } from "@/lib/utils";

interface AhaMomentProps {
  summary: {
    cash: number;
    deposit: number;
    bond: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
};

export function AhaMoment({ summary }: AhaMomentProps) {
  const diffDeposit = summary.bond - summary.deposit;
  const diffCash = summary.bond - summary.cash;

  // Handle negative difference if bond performs worse (unlikely with defaults but possible)
  const isBetterThanDeposit = diffDeposit >= 0;
  
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-md">
      <p className="text-gray-800 text-lg leading-relaxed">
        Wybierając obligacje, po 4 latach zyskujesz na rękę o{" "}
        <span className="font-bold text-green-700">{formatCurrency(diffDeposit)}</span>{" "}
        więcej niż na zwykłej lokacie, i aż o{" "}
        <span className="font-bold text-green-700">{formatCurrency(diffCash)}</span>{" "}
        więcej niż trzymając gotówkę w skarpecie. Skutecznie chronisz swoje oszczędności przed wzrostem cen.
      </p>
    </div>
  );
}
