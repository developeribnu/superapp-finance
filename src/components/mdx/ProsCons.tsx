"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h4 className="mb-3 font-semibold text-green-800">Kelebihan</h4>
        <ul className="space-y-2">
          {pros.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h4 className="mb-3 font-semibold text-red-800">Kekurangan</h4>
        <ul className="space-y-2">
          {cons.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
