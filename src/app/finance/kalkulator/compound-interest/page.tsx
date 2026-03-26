import type { Metadata } from "next";
import { CompoundInterestCalc } from "@/components/interactive/CompoundInterestCalc";

export const metadata: Metadata = {
  title: "Kalkulator Compound Interest - Finansial Nexus",
  description:
    "Hitung kekuatan bunga berbunga (compound interest) dan simulasikan pertumbuhan investasimu seiring waktu dengan kalkulator interaktif kami.",
  keywords: [
    "compound interest",
    "bunga berbunga",
    "kalkulator investasi",
    "pertumbuhan investasi",
    "simulasi investasi",
  ],
};

export default function CompoundInterestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Compound Interest
      </h1>
      <p className="text-gray-600 mb-8">
        Hitung kekuatan bunga berbunga dan lihat bagaimana investasimu bisa
        bertumbuh seiring waktu.
      </p>
      <CompoundInterestCalc />
    </div>
  );
}
