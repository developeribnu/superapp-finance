"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { formatMultiple, formatPercent, formatCurrency } from "@/lib/calculations/formatting";

interface ScatterDataPoint {
  name: string;
  ticker: string;
  revenueGrowth: number;
  multiple: number;
  marketCap: number;
  isTarget?: boolean;
}

interface ScatterPlotProps {
  data: ScatterDataPoint[];
  xLabel?: string;
  yLabel?: string;
}

export function ScatterPlot({
  data,
  xLabel = "Revenue Growth NTM (%)",
  yLabel = "EV/EBITDA NTM",
}: ScatterPlotProps) {
  const compData = data.filter((d) => !d.isTarget);
  const targetData = data.filter((d) => d.isTarget);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="revenueGrowth"
            name="Revenue Growth"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(val) => `${val.toFixed(0)}%`}
            label={{ value: xLabel, position: "bottom", offset: 0, style: { fontSize: 10, fill: "var(--muted-foreground)" } }}
          />
          <YAxis
            type="number"
            dataKey="multiple"
            name="Multiple"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(val) => `${val.toFixed(1)}x`}
            label={{ value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "var(--muted-foreground)" } }}
          />
          <ZAxis type="number" dataKey="marketCap" range={[40, 400]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              if (!d) return null;
              return (
                <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs">
                  <p className="font-medium">{d.name} ({d.ticker})</p>
                  <div className="mt-1 space-y-0.5 font-mono tabular-nums">
                    <p>Growth: {formatPercent(d.revenueGrowth)}</p>
                    <p>Multiple: {formatMultiple(d.multiple)}</p>
                    <p>Mkt Cap: {formatCurrency(d.marketCap)}</p>
                  </div>
                </div>
              );
            }}
          />
          <Scatter data={compData} fill="#3b82f6" />
          {targetData.length > 0 && (
            <Scatter data={targetData} fill="#f59e0b" shape="diamond" />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
