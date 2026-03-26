"use client";

import { useState, useCallback } from "react";

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const parseNumber = (value: string): number => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState<number>(10_000_000);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(1_000_000);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [period, setPeriod] = useState<number>(10);
  const [taxRate, setTaxRate] = useState<number>(0);

  const calculate = useCallback(() => {
    const r = annualRate / 100;
    const n = 12 * period;
    const monthlyRate = r / 12;

    let futureValue: number;
    if (monthlyRate === 0) {
      futureValue = principal + monthlyAddition * n;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, n);
      futureValue =
        principal * compoundFactor +
        monthlyAddition * ((compoundFactor - 1) / monthlyRate);
    }

    const totalInvested = principal + monthlyAddition * n;
    const totalReturn = futureValue - totalInvested;
    const taxAmount = totalReturn * (taxRate / 100);
    const returnAfterTax = totalReturn - taxAmount;
    const finalAfterTax = totalInvested + returnAfterTax;

    return {
      futureValue,
      totalInvested,
      totalReturn,
      returnAfterTax,
      finalAfterTax,
    };
  }, [principal, monthlyAddition, annualRate, period, taxRate]);

  const results = calculate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#1B4332] mb-6">
        Kalkulator Bunga Majemuk
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modal Awal (Rp)
            </label>
            <input
              type="text"
              value={principal.toLocaleString("id-ID")}
              onChange={(e) => setPrincipal(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tambahan Bulanan (Rp)
            </label>
            <input
              type="text"
              value={monthlyAddition.toLocaleString("id-ID")}
              onChange={(e) => setMonthlyAddition(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tingkat Pengembalian Tahunan (%)
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="100"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jangka Waktu (tahun)
            </label>
            <input
              type="number"
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value, 10) || 0)}
              min="1"
              max="50"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pajak atas Imbal Hasil (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="100"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-[#1B4332] mb-4">
            Hasil Perhitungan
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Dana Akhir</span>
              <span className="text-lg font-bold text-[#1B4332]">
                {formatRupiah(results.finalAfterTax)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Investasi</span>
              <span className="text-base font-semibold text-gray-900">
                {formatRupiah(results.totalInvested)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Total Imbal Hasil (Kotor)
              </span>
              <span className="text-base font-semibold text-green-700">
                {formatRupiah(results.totalReturn)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Imbal Hasil Setelah Pajak
              </span>
              <span className="text-base font-semibold text-green-700">
                {formatRupiah(results.returnAfterTax)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        * Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
