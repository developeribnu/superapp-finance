import { EmergencyFundCalc } from "@/components/interactive/EmergencyFundCalc";

export default function DanaDaruratPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Dana Darurat
      </h1>
      <p className="text-gray-600 mb-8">
        Hitung target dana darurat ideal berdasarkan status dan pengeluaran
        bulananmu.
      </p>
      <EmergencyFundCalc />
    </div>
  );
}
