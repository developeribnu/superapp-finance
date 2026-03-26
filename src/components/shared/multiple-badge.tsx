interface MultipleBadgeProps {
  value: number | null | undefined;
  label?: string;
}

export function MultipleBadge({ value, label }: MultipleBadgeProps) {
  if (value === null || value === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono text-muted-foreground bg-muted">
        {label ? `${label}: ` : ""}—
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono tabular-nums bg-secondary text-secondary-foreground">
      {label ? `${label}: ` : ""}{value.toFixed(1)}x
    </span>
  );
}
