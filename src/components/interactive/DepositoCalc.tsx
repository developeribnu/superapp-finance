"use client";

import { useState } from "react";

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

const tenorOptions = [1, 3, 6, 12, 24, 36];

export function DepositoCalc() {
  const [amount, setAmount] = useState<number>(100_000_000);
  const [tenor, setTenor] = useState<number>(12);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [taxRate, setTaxRate] = useState<number>(20);

  const grossInterest = amount * (annualRate / 100) * (tenor / 12);
  const taxAmount = grossInterest * (taxRate / 100);
  const netInterest = grossInterest - taxAmount;
  const effectiveRate = amount > 0 ? (netInterest / amount) * (12 / tenor) * 100 : 0;
  const totalReceived = amount + netInterest;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#1B4332] mb-6">
        Kalkulator Deposito
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Deposito (Rp)
            </label>
            <input
              type="text"
              value={amount.toLocaleString("id-ID")}
              onChange={(e) => setAmount(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenor (bulan)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tenorOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenor(t)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tenor === t
                      ? "bg-[#1B4332] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t} bulan
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suku Bunga Tahunan (%)
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
              Tarif Pajak (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              step="1"
              min="0"
              max="100"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              Pajak deposito standar di Indonesia: 20%
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-[#1B4332] mb-4">
            Hasil Perhitungan
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Bunga Kotor</span>
              <span className="text-base font-semibold text-gray-900">
                {formatRupiah(grossInterest)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Potongan Pajak ({taxRate}%)
              </span>
              <span className="text-base font-semibold text-red-600">
                -{formatRupiah(taxAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Bunga Bersih</span>
              <span className="text-base font-semibold text-green-700">
                {formatRupiah(netInterest)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Suku Bunga Efektif (per tahun)
              </span>
              <span className="text-base font-semibold text-gray-900">
                {effectiveRate.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between items-center py-3 bg-[#1B4332]/5 rounded-lg px-3 mt-2">
              <span className="text-sm font-medium text-[#1B4332]">
                Total Diterima Saat Jatuh Tempo
              </span>
              <span className="text-lg font-bold text-[#1B4332]">
                {formatRupiah(totalReceived)}
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
