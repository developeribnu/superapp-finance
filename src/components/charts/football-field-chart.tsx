"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Rectangle,
} from "recharts";
import type { FootballFieldBar } from "@/types/calculations";
import { formatSharePrice } from "@/lib/calculations/formatting";

interface FootballFieldChartProps {
  data: FootballFieldBar[];
  currentPrice: number | null;
  targetName: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium text-sm mb-2">{data.label}</p>
      <div className="space-y-1 font-mono tabular-nums">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Min:</span>
          <span>{formatSharePrice(data.min)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">25th:</span>
          <span>{formatSharePrice(data.percentile25)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-accent-green">Median:</span>
          <span className="text-accent-green">{formatSharePrice(data.median)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Mean:</span>
          <span>{formatSharePrice(data.mean)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">75th:</span>
          <span>{formatSharePrice(data.percentile75)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Max:</span>
          <span>{formatSharePrice(data.max)}</span>
        </div>
      </div>
    </div>
  );
}

export function FootballFieldChart({
  data,
  currentPrice,
  targetName,
}: FootballFieldChartProps) {
  const chartData = useMemo(() => {
    return data.map((bar) => ({
      ...bar,
      // For the full range bar (background)
      fullRange: [bar.min, bar.max],
      // For the IQR bar (foreground)
      iqrRange: [bar.percentile25, bar.percentile75],
    }));
  }, [data]);

  const [domainMin, domainMax] = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const allValues = data.flatMap((d) => [d.min, d.max]);
    if (currentPrice != null) allValues.push(currentPrice);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [data, currentPrice]);

  const chartHeight = Math.max(300, data.length * 70 + 60);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No valuation data available. Run calculations first.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis
            type="number"
            domain={[domainMin, domainMax]}
            tickFormatter={(val) => `$${val.toFixed(0)}`}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fontSize: 11, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {/* Full range bar (min to max) */}
          <Bar dataKey="fullRange" barSize={30} radius={[4, 4, 4, 4]}>
            {chartData.map((_, index) => (
              <Cell key={`full-${index}`} fill="rgba(59, 130, 246, 0.2)" />
            ))}
          </Bar>

          {/* IQR bar (25th to 75th) */}
          <Bar dataKey="iqrRange" barSize={30} radius={[4, 4, 4, 4]}>
            {chartData.map((_, index) => (
              <Cell key={`iqr-${index}`} fill="#3b82f6" />
            ))}
          </Bar>

          {/* Current price reference line */}
          {currentPrice != null && (
            <ReferenceLine
              x={currentPrice}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Current: ${formatSharePrice(currentPrice)}`,
                position: "top",
                fill: "#f59e0b",
                fontSize: 11,
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded-sm" style={{ background: "rgba(59, 130, 246, 0.2)" }} />
          <span>Full Range (Min–Max)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded-sm bg-blue-500" />
          <span>IQR (25th–75th)</span>
        </div>
        {currentPrice != null && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-amber-500" />
            <span>Current Price</span>
          </div>
        )}
      </div>
    </div>
  );
}
