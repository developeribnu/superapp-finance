import { DebtPayoffCalc } from "@/components/interactive/DebtPayoffCalc";

export default function DebtPayoffPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Pelunasan Utang
      </h1>
      <p className="text-gray-600 mb-8">
        Bandingkan strategi Avalanche vs Snowball untuk melunasi utangmu lebih
        cepat.
      </p>
      <DebtPayoffCalc />
    </div>
  );
}
