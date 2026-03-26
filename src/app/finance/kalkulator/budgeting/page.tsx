import type { Metadata } from "next";
import { BudgetPlanner } from "@/components/interactive/BudgetPlanner";

export const metadata: Metadata = {
  title: "Kalkulator Budgeting 50/30/20 - Finansial Nexus",
  description:
    "Alokasikan pendapatan bulananmu dengan metode 50/30/20 untuk kebutuhan, keinginan, dan tabungan. Lihat breakdown pengeluaran ideal dengan kalkulator interaktif kami.",
  keywords: [
    "budgeting",
    "50/30/20 rule",
    "alokasi pendapatan",
    "perencanaan keuangan",
    "budget planning",
  ],
};

export default function BudgetingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Budgeting 50/30/20
      </h1>
      <p className="text-gray-600 mb-8">
        Alokasikan pendapatan bulananmu dengan metode 50/30/20 untuk kebutuhan,
        keinginan, dan tabungan/investasi.
      </p>
      <BudgetPlanner />
    </div>
  );
}
