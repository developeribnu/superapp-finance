"use client";

type RiskLevel = "rendah" | "sedang" | "tinggi" | "sangat-tinggi";

interface RiskBadgeProps {
  level: RiskLevel;
}

const colorMap: Record<RiskLevel, string> = {
  rendah: "#22C55E",
  sedang: "#3B82F6",
  tinggi: "#F59E0B",
  "sangat-tinggi": "#DC2626",
};

const labelMap: Record<RiskLevel, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  "sangat-tinggi": "Sangat Tinggi",
};

export function RiskBadge({ level }: RiskBadgeProps) {
  const color = colorMap[level];
  const label = labelMap[level];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: `${color}1A`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      Risiko {label}
    </span>
  );
}
