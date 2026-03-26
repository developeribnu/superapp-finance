"use client";

import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="my-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold text-amber-800">Disclaimer</p>
          <p className="mt-1 text-sm text-amber-700">
            Disclaimer: Konten ini bersifat edukatif dan informatif, bukan merupakan saran
            keuangan profesional. Selalu lakukan riset sendiri dan konsultasikan dengan
            perencana keuangan berlisensi sebelum membuat keputusan investasi.
          </p>
        </div>
      </div>
    </div>
  );
}
