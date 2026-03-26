"use client";

import { Scale } from "lucide-react";
import type { ReactNode } from "react";

type Authority = "OJK" | "BI" | "DJP";

interface RegulationNoteProps {
  authority: Authority;
  number?: string;
  children: ReactNode;
}

const authorityLabels: Record<Authority, string> = {
  OJK: "Otoritas Jasa Keuangan (OJK)",
  BI: "Bank Indonesia (BI)",
  DJP: "Direktorat Jenderal Pajak (DJP)",
};

export function RegulationNote({ authority, number, children }: RegulationNoteProps) {
  return (
    <div className="my-6 rounded-lg border border-blue-300 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 size-5 shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold text-blue-800">
            {authorityLabels[authority]}
            {number && (
              <span className="ml-2 text-sm font-normal text-blue-600">No. {number}</span>
            )}
          </p>
          <div className="mt-1 text-sm text-blue-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
