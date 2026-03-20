"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { YearResult } from "@/lib/calculator";
import { Card } from "./ui/Card";

interface ResultsChartProps {
  data: YearResult[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-md text-sm">
        <p className="font-bold mb-2">Rok {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ color: entry.color }} className="mb-1">
            {entry.name}: {formatCurrency(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ResultsChart({ data }: ResultsChartProps) {
  return (
    <Card className="p-4 h-[400px] w-full bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Prognoza wartości kapitału</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorBond" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{fontSize: 12}} />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat("pl-PL", { notation: "compact", compactDisplay: "short" }).format(value)} 
            tick={{fontSize: 12}}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Order matters for z-index? No, usually last is on top. */}
          {/* We want Bonds on top if they are highest. */}
          
          <Area
            type="monotone"
            dataKey="cashValue"
            name="Skarpeta"
            stroke="#9ca3af"
            fillOpacity={1}
            fill="url(#colorCash)"
          />
          <Area
            type="monotone"
            dataKey="depositValue"
            name="Lokata"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorDeposit)"
          />
          <Area
            type="monotone"
            dataKey="bondValue"
            name="Obligacje"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorBond)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
