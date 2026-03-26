"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/calculations/formatting";

interface EVWaterfallProps {
  marketCap: number | null;
  totalDebt: number | null;
  cashAndEquivalents: number | null;
  minorityInterest: number | null;
  preferredStock: number | null;
  enterpriseValue: number | null;
}

export function EVWaterfallChart({
  marketCap,
  totalDebt,
  cashAndEquivalents,
  minorityInterest,
  preferredStock,
  enterpriseValue,
}: EVWaterfallProps) {
  const mc = marketCap ?? 0;
  const debt = totalDebt ?? 0;
  const cash = cashAndEquivalents ?? 0;
  const minority = minorityInterest ?? 0;
  const preferred = preferredStock ?? 0;
  const ev = enterpriseValue ?? (mc + debt - cash + minority + preferred);

  // Build waterfall data: each item has [start, end] for the bar
  const data = [
    { name: "Market Cap", value: mc, range: [0, mc], type: "base" },
    { name: "+ Debt", value: debt, range: [mc, mc + debt], type: "add" },
    { name: "- Cash", value: -cash, range: [mc + debt, mc + debt - cash], type: "subtract" },
    { name: "+ Minority", value: minority, range: [mc + debt - cash, mc + debt - cash + minority], type: "add" },
    { name: "+ Preferred", value: preferred, range: [mc + debt - cash + minority, mc + debt - cash + minority + preferred], type: "add" },
    { name: "= EV", value: ev, range: [0, ev], type: "total" },
  ].filter((item) => item.name === "Market Cap" || item.name === "= EV" || item.value !== 0);

  const colorMap: Record<string, string> = {
    base: "#3b82f6",
    add: "#64748b",
    subtract: "#ef4444",
    total: "#22c55e",
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tickFormatter={(val) => formatCurrency(val, "USD", true)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload;
              return (
                <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-mono tabular-nums mt-1">{formatCurrency(Math.abs(item.value), "USD", true)}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="range" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={colorMap[entry.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
