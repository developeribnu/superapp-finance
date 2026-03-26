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

export function GoalPlannerCalc() {
  const [targetAmount, setTargetAmount] = useState<number>(500_000_000);
  const [timeline, setTimeline] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);

  const monthlyRate = expectedReturn / 100 / 12;
  const totalMonths = timeline * 12;

  let monthlySaving: number;
  if (monthlyRate === 0) {
    monthlySaving = targetAmount / totalMonths;
  } else {
    // PMT = FV * r / ((1+r)^n - 1)
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
    monthlySaving = targetAmount * monthlyRate / (compoundFactor - 1);
  }

  const totalInvested = monthlySaving * totalMonths;
  const totalReturns = targetAmount - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#1B4332] mb-6">
        Perencana Target Keuangan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Dana (Rp)
            </label>
            <input
              type="text"
              value={targetAmount.toLocaleString("id-ID")}
              onChange={(e) => setTargetAmount(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jangka Waktu (tahun)
            </label>
            <input
              type="number"
              value={timeline}
              onChange={(e) =>
                setTimeline(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              min="1"
              max="50"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ekspektasi Imbal Hasil Tahunan (%)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) =>
                setExpectedReturn(parseFloat(e.target.value) || 0)
              }
              step="0.5"
              min="0"
              max="100"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Target cepat:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "DP Rumah", value: 200_000_000 },
                { label: "Dana Nikah", value: 150_000_000 },
                { label: "Dana Pensiun", value: 5_000_000_000 },
                { label: "Dana Pendidikan", value: 500_000_000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTargetAmount(preset.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-[#1B4332] hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-[#1B4332] mb-4">
            Rencana Tabungan Anda
          </h4>

          <div className="bg-[#1B4332] text-white rounded-xl p-5 mb-4">
            <p className="text-sm opacity-80">Tabungan bulanan yang dibutuhkan</p>
            <p className="text-2xl font-bold mt-1">
              {formatRupiah(monthlySaving)}
            </p>
            <p className="text-xs opacity-60 mt-1">per bulan selama {timeline} tahun</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Target Dana</span>
              <span className="text-base font-semibold text-[#1B4332]">
                {formatRupiah(targetAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Uang Ditabung</span>
              <span className="text-base font-semibold text-gray-900">
                {formatRupiah(totalInvested)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Keuntungan dari Investasi
              </span>
              <span className="text-base font-semibold text-green-700">
                {formatRupiah(totalReturns)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Persentase Keuntungan
              </span>
              <span className="text-base font-semibold text-green-700">
                {returnPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Visual breakdown */}
          <div className="pt-4">
            <p className="text-xs text-gray-500 mb-2">Komposisi dana akhir</p>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#1B4332] transition-all duration-300"
                style={{
                  width: `${targetAmount > 0 ? (totalInvested / targetAmount) * 100 : 0}%`,
                }}
              />
              <div
                className="bg-emerald-400 transition-all duration-300"
                style={{
                  width: `${targetAmount > 0 ? (totalReturns / targetAmount) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
                <span className="text-xs text-gray-500">Modal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-500">Imbal Hasil</span>
              </div>
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
