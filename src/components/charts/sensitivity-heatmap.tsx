"use client";

import { useMemo } from "react";
import { formatSharePrice } from "@/lib/calculations/formatting";
import { cn } from "@/lib/utils";

interface SensitivityHeatmapProps {
  rowLabels: string[];
  colLabels: string[];
  values: number[][];
  currentPrice: number | null;
  rowHeader: string;
  colHeader: string;
  baseRowIndex?: number;
  baseColIndex?: number;
}

function getCellColor(value: number, currentPrice: number | null): string {
  if (currentPrice == null || currentPrice === 0) return "transparent";
  const ratio = (value - currentPrice) / currentPrice;
  const clamped = Math.max(-0.5, Math.min(0.5, ratio));

  if (clamped > 0) {
    const intensity = clamped / 0.5;
    const r = Math.round(34 - 34 * intensity);
    const g = Math.round(197 * intensity);
    const b = Math.round(94 * intensity);
    return `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.35})`;
  } else if (clamped < 0) {
    const intensity = Math.abs(clamped) / 0.5;
    const r = Math.round(239 * intensity);
    const g = Math.round(68 * intensity);
    const b = Math.round(68 * intensity);
    return `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.35})`;
  }
  return "transparent";
}

export function SensitivityHeatmap({
  rowLabels,
  colLabels,
  values,
  currentPrice,
  rowHeader,
  colHeader,
  baseRowIndex,
  baseColIndex,
}: SensitivityHeatmapProps) {
  if (values.length === 0 || colLabels.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No sensitivity data. Configure and generate the table first.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono tabular-nums">
        <thead>
          <tr>
            <th className="px-3 py-1.5 text-left text-muted-foreground font-medium bg-muted/50 border border-border">
              {rowHeader} \ {colHeader}
            </th>
            {colLabels.map((label, i) => (
              <th
                key={i}
                className={cn(
                  "px-3 py-1.5 text-right font-medium bg-muted/50 border border-border",
                  i === baseColIndex && "bg-accent-blue/20 text-accent-blue"
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td
                className={cn(
                  "px-3 py-1.5 font-medium border border-border bg-muted/30",
                  rowIdx === baseRowIndex && "bg-accent-blue/20 text-accent-blue"
                )}
              >
                {rowLabels[rowIdx]}
              </td>
              {row.map((val, colIdx) => {
                const isBase = rowIdx === baseRowIndex && colIdx === baseColIndex;
                return (
                  <td
                    key={colIdx}
                    className={cn(
                      "px-3 py-1.5 text-right border border-border heatmap-cell",
                      isBase && "ring-2 ring-accent-blue font-bold",
                      val > (currentPrice ?? 0) ? "text-accent-green" : "text-accent-red"
                    )}
                    style={{ backgroundColor: getCellColor(val, currentPrice) }}
                  >
                    {formatSharePrice(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {currentPrice != null && (
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>Current Price: <span className="font-mono text-accent-amber">{formatSharePrice(currentPrice)}</span></span>
          <span className="text-accent-green">Green = Above current price</span>
          <span className="text-accent-red">Red = Below current price</span>
        </div>
      )}
    </div>
  );
}
