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

interface Category {
  label: string;
  key: string;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    label: "Kebutuhan",
    key: "needs",
    color: "bg-[#1B4332]",
    description: "Biaya hidup wajib: sewa, makan, transportasi, tagihan",
  },
  {
    label: "Keinginan",
    key: "wants",
    color: "bg-emerald-500",
    description: "Hiburan, makan di luar, hobi, langganan",
  },
  {
    label: "Tabungan & Investasi",
    key: "savings",
    color: "bg-emerald-300",
    description: "Dana darurat, investasi, cicilan utang produktif",
  },
];

export function BudgetPlanner() {
  const [income, setIncome] = useState<number>(10_000_000);
  const [allocations, setAllocations] = useState<Record<string, number>>({
    needs: 50,
    wants: 30,
    savings: 20,
  });

  const handleSliderChange = (key: string, newValue: number) => {
    const otherKeys = Object.keys(allocations).filter((k) => k !== key);
    const oldValue = allocations[key];
    const diff = newValue - oldValue;

    const otherTotal = otherKeys.reduce((sum, k) => sum + allocations[k], 0);

    if (otherTotal === 0) return;

    const updated: Record<string, number> = { ...allocations, [key]: newValue };

    otherKeys.forEach((k) => {
      const proportion = allocations[k] / otherTotal;
      updated[k] = Math.max(0, Math.round(allocations[k] - diff * proportion));
    });

    // Ensure total is exactly 100
    const total = Object.values(updated).reduce((sum, v) => sum + v, 0);
    if (total !== 100) {
      const adjustKey = otherKeys[0];
      updated[adjustKey] = updated[adjustKey] + (100 - total);
    }

    setAllocations(updated);
  };

  const total = Object.values(allocations).reduce((sum, v) => sum + v, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-[#1B4332] mb-6">
        Perencana Anggaran 50/30/20
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pendapatan Bersih Bulanan (Rp)
            </label>
            <input
              type="text"
              value={income.toLocaleString("id-ID")}
              onChange={(e) => setIncome(parseNumber(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-colors"
            />
          </div>

          {categories.map((cat) => (
            <div key={cat.key}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {cat.label}
                </label>
                <span className="text-sm font-semibold text-[#1B4332]">
                  {allocations[cat.key]}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={allocations[cat.key]}
                onChange={(e) =>
                  handleSliderChange(cat.key, parseInt(e.target.value, 10))
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1B4332]"
              />
              <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
            </div>
          ))}

          {total !== 100 && (
            <p className="text-xs text-red-500">
              Total alokasi harus 100% (saat ini {total}%)
            </p>
          )}
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-[#1B4332] mb-4">
            Alokasi Anggaran
          </h4>

          {/* Visual bar */}
          <div className="flex h-4 rounded-full overflow-hidden mb-6">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className={`${cat.color} transition-all duration-300`}
                style={{ width: `${allocations[cat.key]}%` }}
              />
            ))}
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const amount = (income * allocations[cat.key]) / 100;
              return (
                <div
                  key={cat.key}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${cat.color}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {cat.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {allocations[cat.key]}% dari pendapatan
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-semibold text-[#1B4332]">
                    {formatRupiah(amount)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Pendapatan
              </span>
              <span className="text-lg font-bold text-[#1B4332]">
                {formatRupiah(income)}
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
