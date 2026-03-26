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
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned === "" ? 0 : parseInt(cleaned, 10);
};

interface RetirementResult {
  futureMonthlyExpenses: number;
  fundNeeded: number;
  currentTrajectory: number;
  gap: number;
  monthlySavingNeeded: number;
}

export function RetirementCalc() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(55);
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("10000000");
  const [inflationRate, setInflationRate] = useState<number>(5);
  const [currentSavings, setCurrentSavings] = useState<string>("50000000");
  const [monthlySaving, setMonthlySaving] = useState<string>("5000000");
  const [investmentReturn, setInvestmentReturn] = useState<number>(8);
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculate = useCallback(() => {
    const years = retirementAge - currentAge;
    if (years <= 0) return;

    const expenses = parseNumber(monthlyExpenses);
    const savings = parseNumber(currentSavings);
    const monthly = parseNumber(monthlySaving);
    const inflation = inflationRate / 100;
    const returnRate = investmentReturn / 100;
    const monthlyReturn = returnRate / 12;

    const futureMonthlyExpenses = expenses * Math.pow(1 + inflation, years);
    const annualExpensesAtRetirement = futureMonthlyExpenses * 12;
    const fundNeeded = annualExpensesAtRetirement / 0.04;

    const savingsGrowth = savings * Math.pow(1 + monthlyReturn, years * 12);
    const totalMonths = years * 12;
    const futureValueContributions =
      monthly *
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    const currentTrajectory = savingsGrowth + futureValueContributions;

    const gap = Math.max(0, fundNeeded - currentTrajectory);

    let monthlySavingNeeded = 0;
    if (gap > 0 && totalMonths > 0 && monthlyReturn > 0) {
      monthlySavingNeeded =
        gap /
        ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    }

    setResult({
      futureMonthlyExpenses,
      fundNeeded,
      currentTrajectory,
      gap,
      monthlySavingNeeded,
    });
  }, [
    currentAge,
    retirementAge,
    monthlyExpenses,
    inflationRate,
    currentSavings,
    monthlySaving,
    investmentReturn,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Kalkulator Dana Pensiun
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usia Saat Ini
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            min={18}
            max={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usia Pensiun
          </label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            min={30}
            max={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pengeluaran Bulanan Saat Ini (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(monthlyExpenses)
            )}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tingkat Inflasi (%)
          </label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            step={0.1}
            min={0}
            max={20}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tabungan Saat Ini (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(currentSavings)
            )}
            onChange={(e) => setCurrentSavings(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kemampuan Menabung per Bulan (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(monthlySaving)
            )}
            onChange={(e) => setMonthlySaving(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ekspektasi Return Investasi (%/tahun)
          </label>
          <input
            type="number"
            value={investmentReturn}
            onChange={(e) => setInvestmentReturn(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            step={0.1}
            min={0}
            max={30}
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
      >
        Hitung Dana Pensiun
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-[#1B4332]/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Pengeluaran Bulanan Saat Pensiun
              </span>
              <span className="font-semibold text-gray-900">
                {formatRupiah(result.futureMonthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Dana Pensiun Dibutuhkan (4% Rule)
              </span>
              <span className="font-bold text-[#1B4332] text-lg">
                {formatRupiah(result.fundNeeded)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Proyeksi Trajectory Saat Ini</span>
              <span className="font-semibold text-gray-900">
                {formatRupiah(result.currentTrajectory)}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray-600">Selisih (Gap)</span>
              <span
                className={`font-bold text-lg ${
                  result.gap > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {result.gap > 0
                  ? `- ${formatRupiah(result.gap)}`
                  : "Tercukupi!"}
              </span>
            </div>
            {result.gap > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tambahan Tabungan Bulanan Dibutuhkan
                </span>
                <span className="font-semibold text-[#1B4332]">
                  {formatRupiah(result.monthlySavingNeeded)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
