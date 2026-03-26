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

type Status = "single" | "married" | "freelance";

interface StatusOption {
  value: Status;
  label: string;
  minMonths: number;
  maxMonths: number;
}

const statusOptions: StatusOption[] = [
  { value: "single", label: "Lajang", minMonths: 3, maxMonths: 6 },
  { value: "married", label: "Menikah", minMonths: 6, maxMonths: 9 },
  {
    value: "freelance",
    label: "Freelance / Wiraswasta",
    minMonths: 9,
    maxMonths: 12,
  },
];

export function EmergencyFundCalc() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(5_000_000);
  const [status, setStatus] = useState<Status>("single");
  const [dependents, setDependents] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);

  const selectedStatus = statusOptions.find((s) => s.value === status)!;

  // Add extra months for dependents (1 month per dependent, capped)
  const extraMonths = Math.min(dependents, 3);
  const minMonths = selectedStatus.minMonths + extraMonths;
  const maxMonths = selectedStatus.maxMonths + extraMonths;

  const minTarget = monthlyExpenses * minMonths;
  const maxTarget = monthlyExpenses * maxMonths;
  const recommendedTarget = monthlyExpenses * Math.ceil((minMonths + maxMonths) / 2);

  const gap = Math.max(0, recommendedTarget - currentSavings);
  const progressPercent = recommendedTarget > 0
    ? Math.min(100, (currentSavings / recommendedTarget) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#1B4332] mb-6">
        Kalkulator Dana Darurat
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pengeluaran Bulanan (Rp)
            </label>
            <input
              type="text"
              value={monthlyExpenses.toLocaleString("id-ID")}
              onChange={(e) => setMonthlyExpenses(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pekerjaan
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    status === option.value
                      ? "bg-[#1B4332] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                  <span className="text-xs opacity-75 ml-2">
                    ({option.minMonths}-{option.maxMonths} bulan)
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Tanggungan
            </label>
            <input
              type="number"
              value={dependents}
              onChange={(e) =>
                setDependents(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              min="0"
              max="10"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
            {dependents > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                +{extraMonths} bulan tambahan untuk tanggungan
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tabungan Saat Ini (Rp)
            </label>
            <input
              type="text"
              value={currentSavings.toLocaleString("id-ID")}
              onChange={(e) => setCurrentSavings(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-[#1B4332] mb-4">
            Target Dana Darurat
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Target Minimum</span>
              <div className="text-right">
                <span className="text-base font-semibold text-gray-900">
                  {formatRupiah(minTarget)}
                </span>
                <p className="text-xs text-gray-400">{minMonths} bulan pengeluaran</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Target Maksimum</span>
              <div className="text-right">
                <span className="text-base font-semibold text-gray-900">
                  {formatRupiah(maxTarget)}
                </span>
                <p className="text-xs text-gray-400">{maxMonths} bulan pengeluaran</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Target Rekomendasi
              </span>
              <span className="text-lg font-bold text-[#1B4332]">
                {formatRupiah(recommendedTarget)}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progres Anda
              </span>
              <span className="text-sm font-semibold text-[#1B4332]">
                {progressPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {gap > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Kekurangan dana:</span>{" "}
                {formatRupiah(gap)}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Anda masih perlu menabung untuk mencapai target rekomendasi.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-800 font-semibold">
                Dana darurat Anda sudah mencukupi target rekomendasi!
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        * Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
