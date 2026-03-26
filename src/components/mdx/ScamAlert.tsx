"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface ScamAlertProps {
  title: string;
  children: ReactNode;
}

export function ScamAlert({ title, children }: ScamAlertProps) {
  return (
    <div className="my-6 rounded-lg border-2 border-red-500 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-6 shrink-0 text-red-600" />
        <div>
          <p className="text-lg font-bold text-red-800">{title}</p>
          <div className="mt-2 text-sm text-red-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
