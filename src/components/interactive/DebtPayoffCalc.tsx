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

interface Debt {
  id: string;
  name: string;
  balance: string;
  interestRate: number;
  minimumPayment: string;
}

interface PayoffResult {
  totalInterest: number;
  totalMonths: number;
  payoffOrder: string[];
}

function simulatePayoff(
  debts: Debt[],
  sortedIndices: number[]
): PayoffResult {
  const remaining = debts.map((d) => parseNumber(d.balance));
  const rates = debts.map((d) => d.interestRate / 100 / 12);
  const minPayments = debts.map((d) => parseNumber(d.minimumPayment));
  const totalBudget = minPayments.reduce((a, b) => a + b, 0);

  let totalInterest = 0;
  let months = 0;
  const maxMonths = 600;
  const payoffOrder: string[] = [];
  const paidOff = new Array<boolean>(debts.length).fill(false);

  while (
    remaining.some((b, i) => !paidOff[i] && b > 0.01) &&
    months < maxMonths
  ) {
    months++;

    // Step 1: Accrue interest on all active debts
    for (let i = 0; i < remaining.length; i++) {
      if (paidOff[i]) continue;
      const interest = remaining[i] * rates[i];
      totalInterest += interest;
      remaining[i] += interest;
    }

    // Step 2: Pay minimum on all active debts, track leftover budget
    let budgetLeft = totalBudget;
    for (let i = 0; i < remaining.length; i++) {
      if (paidOff[i]) continue;
      const payment = Math.min(minPayments[i], remaining[i]);
      remaining[i] -= payment;
      budgetLeft -= payment;
      if (remaining[i] <= 0.01) {
        remaining[i] = 0;
        paidOff[i] = true;
        payoffOrder.push(debts[i].name || `Hutang ${i + 1}`);
      }
    }

    // Step 3: Apply extra budget to highest-priority active debt
    for (const idx of sortedIndices) {
      if (paidOff[idx] || budgetLeft <= 0) continue;
      const extra = Math.min(budgetLeft, remaining[idx]);
      remaining[idx] -= extra;
      budgetLeft -= extra;
      if (remaining[idx] <= 0.01) {
        remaining[idx] = 0;
        paidOff[idx] = true;
        if (!payoffOrder.includes(debts[idx].name || `Hutang ${idx + 1}`)) {
          payoffOrder.push(debts[idx].name || `Hutang ${idx + 1}`);
        }
      }
    }
  }

  return { totalInterest, totalMonths: months, payoffOrder };
}

export function DebtPayoffCalc() {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: "1",
      name: "Kartu Kredit",
      balance: "15000000",
      interestRate: 24,
      minimumPayment: "1500000",
    },
  ]);
  const [avalancheResult, setAvalancheResult] = useState<PayoffResult | null>(
    null
  );
  const [snowballResult, setSnowballResult] = useState<PayoffResult | null>(
    null
  );

  const addDebt = () => {
    setDebts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        balance: "0",
        interestRate: 0,
        minimumPayment: "0",
      },
    ]);
  };

  const removeDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDebt = (
    id: string,
    field: keyof Debt,
    value: string | number
  ) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const calculate = useCallback(() => {
    if (debts.length === 0) return;

    // Avalanche: highest interest rate first
    const avalancheOrder = debts
      .map((_, i) => i)
      .sort((a, b) => debts[b].interestRate - debts[a].interestRate);

    // Snowball: smallest balance first
    const snowballOrder = debts
      .map((_, i) => i)
      .sort(
        (a, b) =>
          parseNumber(debts[a].balance) - parseNumber(debts[b].balance)
      );

    setAvalancheResult(simulatePayoff(debts, avalancheOrder));
    setSnowballResult(simulatePayoff(debts, snowballOrder));
  }, [debts]);

  const formatMonths = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} bulan`;
    if (remainingMonths === 0) return `${years} tahun`;
    return `${years} tahun ${remainingMonths} bulan`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Kalkulator Pelunasan Hutang
      </h2>

      <div className="space-y-4 mb-6">
        {debts.map((debt, index) => (
          <div
            key={debt.id}
            className="border border-gray-200 rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Hutang {index + 1}
              </h3>
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-red-500 text-sm hover:text-red-700 cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Hutang
                </label>
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) =>
                    updateDebt(debt.id, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
                  placeholder="cth: Kartu Kredit"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Saldo (Rp)
                </label>
                <input
                  type="text"
                  value={new Intl.NumberFormat("id-ID").format(
                    parseNumber(debt.balance)
                  )}
                  onChange={(e) =>
                    updateDebt(debt.id, "balance", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bunga (%/tahun)
                </label>
                <input
                  type="number"
                  value={debt.interestRate}
                  onChange={(e) =>
                    updateDebt(
                      debt.id,
                      "interestRate",
                      Number(e.target.value)
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
                  step={0.1}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Pembayaran Minimum (Rp)
                </label>
                <input
                  type="text"
                  value={new Intl.NumberFormat("id-ID").format(
                    parseNumber(debt.minimumPayment)
                  )}
                  onChange={(e) =>
                    updateDebt(debt.id, "minimumPayment", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={addDebt}
          className="flex-1 border-2 border-dashed border-gray-300 text-gray-500 font-medium py-2 rounded-lg hover:border-[#1B4332] hover:text-[#1B4332] transition-colors cursor-pointer"
        >
          + Tambah Hutang
        </button>
        <button
          onClick={calculate}
          className="flex-1 bg-[#1B4332] text-white font-semibold py-2 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
        >
          Bandingkan Strategi
        </button>
      </div>

      {avalancheResult && snowballResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-blue-800 text-lg">
              Metode Avalanche
            </h3>
            <p className="text-xs text-blue-600">
              Prioritas: bunga tertinggi duluan
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">
                  Total Bunga Dibayar
                </span>
                <span className="font-semibold text-gray-900">
                  {formatRupiah(avalancheResult.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Waktu Pelunasan</span>
                <span className="font-semibold text-gray-900">
                  {formatMonths(avalancheResult.totalMonths)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">
                  Urutan Pelunasan:
                </span>
                <ol className="list-decimal list-inside text-sm text-gray-700 mt-1">
                  {avalancheResult.payoffOrder.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-green-800 text-lg">
              Metode Snowball
            </h3>
            <p className="text-xs text-green-600">
              Prioritas: saldo terkecil duluan
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">
                  Total Bunga Dibayar
                </span>
                <span className="font-semibold text-gray-900">
                  {formatRupiah(snowballResult.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Waktu Pelunasan</span>
                <span className="font-semibold text-gray-900">
                  {formatMonths(snowballResult.totalMonths)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">
                  Urutan Pelunasan:
                </span>
                <ol className="list-decimal list-inside text-sm text-gray-700 mt-1">
                  {snowballResult.payoffOrder.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {avalancheResult.totalInterest < snowballResult.totalInterest && (
            <div className="md:col-span-2 bg-[#1B4332]/5 rounded-xl p-3 text-center">
              <p className="text-sm text-[#1B4332] font-medium">
                Metode Avalanche menghemat{" "}
                <span className="font-bold">
                  {formatRupiah(
                    snowballResult.totalInterest -
                      avalancheResult.totalInterest
                  )}
                </span>{" "}
                bunga dibanding Snowball.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
