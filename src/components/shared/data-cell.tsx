import { formatCurrency, formatMultiple, formatPercent, formatNumber, formatSharePrice } from "@/lib/calculations/formatting";
import { cn } from "@/lib/utils";

type DataType = "currency" | "multiple" | "percent" | "number" | "price";

interface DataCellProps {
  value: number | null | undefined;
  type: DataType;
  colorize?: boolean;
  currency?: string;
  decimals?: number;
  className?: string;
  compact?: boolean;
}

export function DataCell({
  value,
  type,
  colorize = false,
  currency = "USD",
  decimals = 1,
  className,
  compact = true,
}: DataCellProps) {
  const formatted = (() => {
    switch (type) {
      case "currency": return formatCurrency(value, currency, compact);
      case "multiple": return formatMultiple(value);
      case "percent": return formatPercent(value);
      case "number": return formatNumber(value, decimals);
      case "price": return formatSharePrice(value);
      default: return "—";
    }
  })();

  const colorClass = colorize && value != null
    ? value > 0 ? "text-accent-green" : value < 0 ? "text-accent-red" : ""
    : "";

  const isNull = value === null || value === undefined;

  return (
    <span
      className={cn(
        "font-mono tabular-nums text-right",
        isNull && "text-muted-foreground",
        colorClass,
        className
      )}
    >
      {formatted}
    </span>
  );
}
