import { RetirementCalc } from "@/components/interactive/RetirementCalc";

export default function RetirementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Kalkulator Dana Pensiun
      </h1>
      <p className="text-gray-600 mb-8">
        Proyeksikan kebutuhan dana pensiunmu dan cek apakah tabunganmu sudah
        cukup.
      </p>
      <RetirementCalc />
    </div>
  );
}
