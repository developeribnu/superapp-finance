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

interface DCAResult {
  totalInvested: number;
  dcaFinalValue: number;
  dcaProfit: number;
  lumpSumFinalValue: number;
  lumpSumProfit: number;
  monthlyBreakdown: Array<{
    month: number;
    invested: number;
    dcaValue: number;
  }>;
}

export function DCASimulator() {
  const [monthlyAmount, setMonthlyAmount] = useState<string>("1000000");
  const [annualReturn, setAnnualReturn] = useState<number>(10);
  const [duration, setDuration] = useState<number>(10);
  const [result, setResult] = useState<DCAResult | null>(null);

  const calculate = useCallback(() => {
    const monthly = parseNumber(monthlyAmount);
    if (monthly <= 0 || duration <= 0) return;

    const monthlyReturn = annualReturn / 100 / 12;
    const totalMonths = duration * 12;
    const totalInvested = monthly * totalMonths;

    // DCA: invest monthly amount each month
    const monthlyBreakdown: DCAResult["monthlyBreakdown"] = [];
    let dcaValue = 0;

    for (let m = 1; m <= totalMonths; m++) {
      dcaValue = (dcaValue + monthly) * (1 + monthlyReturn);

      // Record yearly snapshots + first and last months
      if (m % 12 === 0 || m === 1 || m === totalMonths) {
        monthlyBreakdown.push({
          month: m,
          invested: monthly * m,
          dcaValue: dcaValue,
        });
      }
    }

    // Lump sum: invest entire amount at the beginning
    const lumpSumFinalValue =
      totalInvested * Math.pow(1 + monthlyReturn, totalMonths);

    setResult({
      totalInvested,
      dcaFinalValue: dcaValue,
      dcaProfit: dcaValue - totalInvested,
      lumpSumFinalValue,
      lumpSumProfit: lumpSumFinalValue - totalInvested,
      monthlyBreakdown,
    });
  }, [monthlyAmount, annualReturn, duration]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Simulator Dollar Cost Averaging (DCA)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investasi Bulanan (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(monthlyAmount)
            )}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ekspektasi Return Tahunan (%)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            step={0.1}
            min={0}
            max={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durasi (tahun)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
            min={1}
            max={50}
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
      >
        Simulasi DCA
      </button>

      {result && (
        <div className="mt-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Diinvestasikan</p>
              <p className="text-lg font-bold text-gray-900">
                {formatRupiah(result.totalInvested)}
              </p>
            </div>
            <div className="bg-[#1B4332]/5 rounded-xl p-4 text-center">
              <p className="text-sm text-[#1B4332] mb-1">Nilai Akhir DCA</p>
              <p className="text-lg font-bold text-[#1B4332]">
                {formatRupiah(result.dcaFinalValue)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Keuntungan: {formatRupiah(result.dcaProfit)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600 mb-1">
                Nilai Akhir Lump Sum
              </p>
              <p className="text-lg font-bold text-blue-800">
                {formatRupiah(result.lumpSumFinalValue)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Keuntungan: {formatRupiah(result.lumpSumProfit)}
              </p>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Akumulasi Investasi DCA
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">
                      Periode
                    </th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">
                      Total Disetor
                    </th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">
                      Nilai Portofolio
                    </th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">
                      Keuntungan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyBreakdown.map((row) => (
                    <tr
                      key={row.month}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3 text-gray-700">
                        {row.month < 12
                          ? `Bulan ${row.month}`
                          : `Tahun ${Math.floor(row.month / 12)}${row.month % 12 !== 0 ? ` Bulan ${row.month % 12}` : ""}`}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-700">
                        {formatRupiah(row.invested)}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-[#1B4332]">
                        {formatRupiah(row.dcaValue)}
                      </td>
                      <td className="py-2 px-3 text-right text-green-600">
                        {formatRupiah(row.dcaValue - row.invested)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-sm text-amber-800">
              Simulasi berdasarkan asumsi return konstan, bukan prediksi.
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
