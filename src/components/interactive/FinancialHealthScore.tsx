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

interface Dimension {
  name: string;
  value: number;
  target: string;
  score: number;
  status: "baik" | "cukup" | "kurang";
  tip: string;
}

interface HealthResult {
  dimensions: Dimension[];
  overallScore: number;
  grade: string;
  netWorth: number;
}

function getDimensionScore(
  ratio: number,
  target: number,
  higherIsBetter: boolean
): number {
  if (higherIsBetter) {
    if (ratio >= target) return 20;
    if (ratio >= target * 0.75) return 15;
    if (ratio >= target * 0.5) return 10;
    if (ratio >= target * 0.25) return 5;
    return 0;
  } else {
    if (ratio <= target) return 20;
    if (ratio <= target * 1.25) return 15;
    if (ratio <= target * 1.5) return 10;
    if (ratio <= target * 2) return 5;
    return 0;
  }
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C+";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getStatus(score: number): "baik" | "cukup" | "kurang" {
  if (score >= 15) return "baik";
  if (score >= 10) return "cukup";
  return "kurang";
}

const STATUS_COLORS: Record<string, string> = {
  baik: "text-green-600 bg-green-50",
  cukup: "text-yellow-600 bg-yellow-50",
  kurang: "text-red-600 bg-red-50",
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-600",
  "B+": "text-green-500",
  B: "text-blue-600",
  "C+": "text-yellow-600",
  C: "text-yellow-500",
  D: "text-orange-600",
  F: "text-red-600",
};

export function FinancialHealthScore() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>("15000000");
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("10000000");
  const [totalSavings, setTotalSavings] = useState<string>("50000000");
  const [totalDebt, setTotalDebt] = useState<string>("20000000");
  const [totalInvestments, setTotalInvestments] = useState<string>("30000000");
  const [emergencyFund, setEmergencyFund] = useState<string>("25000000");
  const [result, setResult] = useState<HealthResult | null>(null);

  const calculate = useCallback(() => {
    const income = parseNumber(monthlyIncome);
    const expenses = parseNumber(monthlyExpenses);
    const savings = parseNumber(totalSavings);
    const debt = parseNumber(totalDebt);
    const investments = parseNumber(totalInvestments);
    const emergency = parseNumber(emergencyFund);

    if (income <= 0) return;

    // 1. Saving ratio: (income - expenses) / income, target >= 20%
    const savingRatio = (income - expenses) / income;
    const savingScore = getDimensionScore(savingRatio, 0.2, true);

    // 2. Debt ratio: debt_payments / income, target <= 30%
    const debtRatio = debt / income;
    const debtScore = getDimensionScore(debtRatio, 0.3, false);

    // 3. Liquidity: emergency_fund / monthly_expenses, target >= 6
    const liquidity = expenses > 0 ? emergency / expenses : 0;
    const liquidityScore = getDimensionScore(liquidity, 6, true);

    // 4. Investment ratio: investments / income, target >= 10%
    const investmentRatio = investments / income;
    const investmentScore = getDimensionScore(investmentRatio, 0.1, true);

    // 5. Net worth: assets - liabilities
    const netWorth = savings + investments + emergency - debt;
    const netWorthRatio = netWorth / (income * 12);
    const netWorthScore = getDimensionScore(
      Math.max(0, netWorthRatio),
      1,
      true
    );

    const dimensions: Dimension[] = [
      {
        name: "Rasio Tabungan",
        value: savingRatio * 100,
        target: ">= 20%",
        score: savingScore,
        status: getStatus(savingScore),
        tip:
          savingScore < 15
            ? "Coba kurangi pengeluaran atau tambah pendapatan untuk menaikkan rasio tabungan."
            : "Rasio tabungan Anda sudah sehat. Pertahankan!",
      },
      {
        name: "Rasio Hutang",
        value: debtRatio * 100,
        target: "<= 30%",
        score: debtScore,
        status: getStatus(debtScore),
        tip:
          debtScore < 15
            ? "Cicilan terlalu besar. Pertimbangkan strategi pelunasan hutang."
            : "Rasio hutang Anda terkendali dengan baik.",
      },
      {
        name: "Likuiditas (Dana Darurat)",
        value: liquidity,
        target: ">= 6 bulan",
        score: liquidityScore,
        status: getStatus(liquidityScore),
        tip:
          liquidityScore < 15
            ? "Prioritaskan membangun dana darurat minimal 6 bulan pengeluaran."
            : "Dana darurat Anda sudah memadai.",
      },
      {
        name: "Rasio Investasi",
        value: investmentRatio * 100,
        target: ">= 10%",
        score: investmentScore,
        status: getStatus(investmentScore),
        tip:
          investmentScore < 15
            ? "Mulai investasi rutin minimal 10% dari pendapatan."
            : "Alokasi investasi Anda sudah baik.",
      },
      {
        name: "Kekayaan Bersih",
        value: netWorthRatio * 100,
        target: "> 0 (positif)",
        score: netWorthScore,
        status: getStatus(netWorthScore),
        tip:
          netWorth <= 0
            ? "Kekayaan bersih negatif. Fokus lunasi hutang terlebih dahulu."
            : "Kekayaan bersih positif. Terus tingkatkan aset Anda.",
      },
    ];

    const overallScore = dimensions.reduce((sum, d) => sum + d.score, 0);
    const grade = getGrade(overallScore);

    setResult({ dimensions, overallScore, grade, netWorth });
  }, [
    monthlyIncome,
    monthlyExpenses,
    totalSavings,
    totalDebt,
    totalInvestments,
    emergencyFund,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Skor Kesehatan Keuangan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penghasilan Bulanan (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(monthlyIncome)
            )}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pengeluaran Bulanan (Rp)
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
            Total Tabungan (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(totalSavings)
            )}
            onChange={(e) => setTotalSavings(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Hutang (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(totalDebt)
            )}
            onChange={(e) => setTotalDebt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Investasi (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(totalInvestments)
            )}
            onChange={(e) => setTotalInvestments(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dana Darurat (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(emergencyFund)
            )}
            onChange={(e) => setEmergencyFund(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
      >
        Hitung Skor Kesehatan Keuangan
      </button>

      {result && (
        <div className="mt-6 space-y-6">
          {/* Overall Score */}
          <div className="text-center bg-[#1B4332]/5 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-2">
              Skor Kesehatan Keuangan Anda
            </p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <span className="text-5xl font-bold text-[#1B4332]">
                  {result.overallScore}
                </span>
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              <div
                className={`text-4xl font-bold ${GRADE_COLORS[result.grade] ?? "text-gray-600"}`}
              >
                {result.grade}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Kekayaan Bersih:{" "}
                <span
                  className={`font-bold ${result.netWorth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatRupiah(result.netWorth)}
                </span>
              </p>
            </div>
          </div>

          {/* Score Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-500 bg-[#1B4332]"
              style={{ width: `${result.overallScore}%` }}
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">
              Detail 5 Dimensi Keuangan
            </h3>
            {result.dimensions.map((dim, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {dim.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[dim.status]}`}
                    >
                      {dim.status === "baik"
                        ? "Baik"
                        : dim.status === "cukup"
                          ? "Cukup"
                          : "Perlu Perbaikan"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#1B4332]">
                      {dim.score}
                    </span>
                    <span className="text-sm text-gray-400">/20</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div
                    className="h-2.5 rounded-full bg-[#1B4332] transition-all duration-300"
                    style={{ width: `${(dim.score / 20) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Nilai:{" "}
                  {dim.name === "Likuiditas (Dana Darurat)"
                    ? `${dim.value.toFixed(1)} bulan`
                    : `${dim.value.toFixed(1)}%`}{" "}
                  | Target: {dim.target}
                </p>
                <p className="text-xs text-gray-500 mt-1">{dim.tip}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2">
              Rekomendasi Perbaikan
            </h3>
            <ul className="space-y-1 text-sm text-amber-700">
              {result.dimensions
                .filter((d) => d.status === "kurang")
                .map((d, i) => (
                  <li key={i}>
                    - <strong>{d.name}</strong>: Targetkan {d.target} untuk
                    meningkatkan skor Anda.
                  </li>
                ))}
              {result.dimensions.filter((d) => d.status === "kurang").length ===
                0 && (
                <li>
                  Kondisi keuangan Anda sudah cukup sehat. Terus pertahankan!
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
