import React from "react";
import { Card } from "./ui/Card";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  initialCapital: number;
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

const formatGain = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCurrency(value)}`;
};

export function SummaryCards({ initialCapital, summary }: SummaryCardsProps) {
  const cashGain = summary.cash - initialCapital;
  const depositGain = summary.deposit - initialCapital;
  const bondGain = summary.bond - initialCapital;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Cash Card */}
      <Card className="p-4 flex flex-col items-center justify-center text-center bg-gray-50 border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Gotówka (Skarpeta)</h3>
        <p className="text-2xl font-bold text-gray-700">{formatCurrency(summary.cash)}</p>
        <p className="text-sm text-gray-400 mt-1">{formatGain(cashGain)} zysku</p>
      </Card>

      {/* Deposit Card */}
      <Card className="p-4 flex flex-col items-center justify-center text-center bg-blue-50 border-blue-200">
        <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Lokata Bankowa</h3>
        <p className="text-2xl font-bold text-blue-800">{formatCurrency(summary.deposit)}</p>
        <p className="text-sm text-blue-600 mt-1">{formatGain(depositGain)} zysku</p>
      </Card>

      {/* Bond Card - Highlighted */}
      <Card className="p-4 flex flex-col items-center justify-center text-center bg-green-50 border-green-300 ring-2 ring-green-500 shadow-lg transform md:-translate-y-2 transition-transform">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          POLECANE
        </div>
        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-2">Obligacje (COI)</h3>
        <p className="text-3xl font-extrabold text-green-800">{formatCurrency(summary.bond)}</p>
        <p className="text-sm font-medium text-green-600 mt-1">{formatGain(bondGain)} zysku</p>
      </Card>
    </div>
  );
}
