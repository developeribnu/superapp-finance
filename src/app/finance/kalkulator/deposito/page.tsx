import { DepositoCalc } from "@/components/interactive/DepositoCalc";

export default function DepositoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Deposito
      </h1>
      <p className="text-gray-600 mb-8">
        Hitung return deposito setelah pajak dan bandingkan dengan instrumen
        lainnya.
      </p>
      <DepositoCalc />
    </div>
  );
}
