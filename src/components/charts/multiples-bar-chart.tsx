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
import { formatMultiple } from "@/lib/calculations/formatting";

interface MultiplesBarChartProps {
  data: Array<{
    name: string;
    ticker: string;
    value: number | null;
    isTarget?: boolean;
    isOutlier?: boolean;
  }>;
  multipleName: string;
  mean?: number | null;
  median?: number | null;
}

export function MultiplesBarChart({
  data,
  multipleName,
  mean,
  median,
}: MultiplesBarChartProps) {
  const chartData = data
    .filter((d) => d.value != null)
    .map((d) => ({ ...d, value: d.value! }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No data available for {multipleName}
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="ticker"
            tick={{ fontSize: 10, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tickFormatter={(val) => `${val.toFixed(1)}x`}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload;
              return (
                <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-mono tabular-nums mt-1">{formatMultiple(item.value)}</p>
                  {item.isOutlier && <p className="text-accent-amber mt-1">Outlier</p>}
                </div>
              );
            }}
          />
          {median != null && (
            <ReferenceLine
              y={median}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label={{ value: `Median: ${formatMultiple(median)}`, position: "right", fill: "#22c55e", fontSize: 10 }}
            />
          )}
          {mean != null && (
            <ReferenceLine
              y={mean}
              stroke="#64748b"
              strokeDasharray="3 3"
              label={{ value: `Mean: ${formatMultiple(mean)}`, position: "right", fill: "#64748b", fontSize: 10 }}
            />
          )}
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.isTarget
                    ? "#f59e0b"
                    : entry.isOutlier
                      ? "#ef4444"
                      : "#3b82f6"
                }
                opacity={entry.isOutlier ? 0.6 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
