import type { Metadata } from "next";
import { PPh21Calc } from "@/components/interactive/PPh21Calc";

export const metadata: Metadata = {
  title: "Kalkulator PPh 21 - Hitung Pajak Penghasilan Indonesia",
  description:
    "Hitung PPh 21 (pajak penghasilan) berdasarkan gaji, status PTKP, potongan BPJS, dan tunjangan. Simulator pajak 2024/2025 untuk karyawan Indonesia.",
  keywords: [
    "PPh 21",
    "pajak penghasilan",
    "kalkulator pajak",
    "PTKP",
    "pajak karyawan",
    "simulasi pajak",
  ],
};

export default function PPh21Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator PPh 21
      </h1>
      <p className="text-gray-600 mb-8">
        Hitung pajak penghasilan (PPh 21) berdasarkan gaji, status PTKP, dan
        potongan BPJS.
      </p>
      <PPh21Calc />
    </div>
  );
}
