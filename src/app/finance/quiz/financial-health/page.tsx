import { FinancialHealthScore } from "@/components/interactive/FinancialHealthScore";

export default function FinancialHealthPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Financial Health Score
      </h1>
      <p className="text-gray-600 mb-8">
        Cek kesehatan keuanganmu dengan mengisi data keuangan di bawah ini.
      </p>
      <FinancialHealthScore />
    </div>
  );
}
