"use client";

import { Info, AlertTriangle, AlertOctagon, CheckCircle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "success" | "tip";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  { icon: typeof Info; bg: string; border: string; text: string; iconColor: string }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-400",
    text: "text-amber-800",
    iconColor: "text-amber-500",
  },
  danger: {
    icon: AlertOctagon,
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    iconColor: "text-red-500",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    iconColor: "text-green-500",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    iconColor: "text-green-500",
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const { icon: Icon, bg, border, text, iconColor } = config[type];

  return (
    <div className={`${bg} ${border} ${text} border-l-4 rounded-r-lg p-4 my-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} mt-0.5 size-5 shrink-0`} />
        <div className="min-w-0">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
