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

type TaxStatus = "TK" | "K";

const PTKP_VALUES: Record<string, number> = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0": 58_500_000,
  "K/1": 63_000_000,
  "K/2": 67_500_000,
  "K/3": 72_000_000,
};

const TAX_BRACKETS: Array<{ limit: number; rate: number }> = [
  { limit: 60_000_000, rate: 0.05 },
  { limit: 250_000_000, rate: 0.15 },
  { limit: 500_000_000, rate: 0.25 },
  { limit: 5_000_000_000, rate: 0.3 },
  { limit: Infinity, rate: 0.35 },
];

function calculateProgressiveTax(pkp: number): number {
  if (pkp <= 0) return 0;

  let tax = 0;
  let remaining = pkp;
  let prevLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    const taxableInBracket = Math.min(remaining, bracket.limit - prevLimit);
    if (taxableInBracket <= 0) break;
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    prevLimit = bracket.limit;
  }

  return tax;
}

interface PPh21Result {
  annualGross: number;
  biayaJabatan: number;
  bpjsJHTAnnual: number;
  bpjsJPAnnual: number;
  ptkp: number;
  pkp: number;
  annualTax: number;
  monthlyTax: number;
  netMonthlySalary: number;
  effectiveTaxRate: number;
  taxBreakdown: Array<{ bracket: string; amount: number; tax: number }>;
}

export function PPh21Calc() {
  const [grossSalary, setGrossSalary] = useState<string>("15000000");
  const [status, setStatus] = useState<TaxStatus>("TK");
  const [dependents, setDependents] = useState<number>(0);
  const [result, setResult] = useState<PPh21Result | null>(null);

  const calculate = useCallback(() => {
    const monthly = parseNumber(grossSalary);
    const annualGross = monthly * 12;

    // Biaya jabatan: 5% of gross, max 6jt/tahun (500rb/bulan)
    const biayaJabatan = Math.min(annualGross * 0.05, 6_000_000);

    // BPJS deductions (employee portion)
    const bpjsJHTAnnual = monthly * 0.02 * 12; // 2% JHT
    const bpjsJPAnnual = monthly * 0.01 * 12; // 1% JP

    // PTKP
    const ptkpKey = `${status}/${dependents}`;
    const ptkp = PTKP_VALUES[ptkpKey] ?? 54_000_000;

    // PKP (Penghasilan Kena Pajak)
    const pkp = Math.max(
      0,
      annualGross - biayaJabatan - bpjsJHTAnnual - bpjsJPAnnual - ptkp
    );

    // Calculate progressive tax with breakdown
    const taxBreakdown: PPh21Result["taxBreakdown"] = [];
    let remaining = pkp;
    let prevLimit = 0;

    const bracketLabels = [
      "0 - 60 juta",
      "60 - 250 juta",
      "250 - 500 juta",
      "500 juta - 5 miliar",
      "> 5 miliar",
    ];

    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const bracket = TAX_BRACKETS[i];
      const taxableInBracket = Math.min(remaining, bracket.limit - prevLimit);
      if (taxableInBracket <= 0) break;
      taxBreakdown.push({
        bracket: `${bracketLabels[i]} (${bracket.rate * 100}%)`,
        amount: taxableInBracket,
        tax: taxableInBracket * bracket.rate,
      });
      remaining -= taxableInBracket;
      prevLimit = bracket.limit;
    }

    const annualTax = calculateProgressiveTax(pkp);
    const monthlyTax = Math.round(annualTax / 12);
    const netMonthlySalary =
      monthly - monthlyTax - monthly * 0.02 - monthly * 0.01;
    const effectiveTaxRate = monthly > 0 ? (monthlyTax / monthly) * 100 : 0;

    setResult({
      annualGross,
      biayaJabatan,
      bpjsJHTAnnual,
      bpjsJPAnnual,
      ptkp,
      pkp,
      annualTax,
      monthlyTax,
      netMonthlySalary,
      effectiveTaxRate,
      taxBreakdown,
    });
  }, [grossSalary, status, dependents]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Kalkulator PPh 21
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gaji Kotor Bulanan (Rp)
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("id-ID").format(
              parseNumber(grossSalary)
            )}
            onChange={(e) => setGrossSalary(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaxStatus)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50 bg-white"
          >
            <option value="TK">TK (Tidak Kawin)</option>
            <option value="K">K (Kawin)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah Tanggungan
          </label>
          <select
            value={dependents}
            onChange={(e) => setDependents(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/50 bg-white"
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-1">
        <p className="text-sm text-gray-600">
          Potongan BPJS Ketenagakerjaan (karyawan):
        </p>
        <div className="flex gap-6 text-sm text-gray-700">
          <span>JHT: 2%</span>
          <span>JP: 1%</span>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
      >
        Hitung PPh 21
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Calculation Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-gray-700 mb-2">
              Rincian Perhitungan
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Penghasilan Bruto Tahunan</span>
              <span className="text-gray-900">
                {formatRupiah(result.annualGross)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Biaya Jabatan (5%, maks 6 jt)
              </span>
              <span className="text-red-600">
                - {formatRupiah(result.biayaJabatan)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BPJS JHT (2%)</span>
              <span className="text-red-600">
                - {formatRupiah(result.bpjsJHTAnnual)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BPJS JP (1%)</span>
              <span className="text-red-600">
                - {formatRupiah(result.bpjsJPAnnual)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                PTKP ({status}/{dependents})
              </span>
              <span className="text-red-600">
                - {formatRupiah(result.ptkp)}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">
                PKP (Penghasilan Kena Pajak)
              </span>
              <span className="text-gray-900">{formatRupiah(result.pkp)}</span>
            </div>
          </div>

          {/* Tax Bracket Breakdown */}
          {result.taxBreakdown.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-gray-700 mb-2">
                Perhitungan Pajak Progresif
              </h3>
              {result.taxBreakdown.map((row, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">{row.bracket}</span>
                  <span className="text-gray-900">{formatRupiah(row.tax)}</span>
                </div>
              ))}
              <hr className="border-gray-300" />
              <div className="flex justify-between font-semibold">
                <span className="text-gray-700">PPh 21 Tahunan</span>
                <span className="text-gray-900">
                  {formatRupiah(result.annualTax)}
                </span>
              </div>
            </div>
          )}

          {/* Result Summary */}
          <div className="bg-[#1B4332]/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">
                PPh 21 per Bulan
              </span>
              <span className="font-bold text-red-600 text-lg">
                {formatRupiah(result.monthlyTax)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">
                Gaji Bersih per Bulan
              </span>
              <span className="font-bold text-[#1B4332] text-lg">
                {formatRupiah(result.netMonthlySalary)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">
                Tarif Pajak Efektif
              </span>
              <span className="font-semibold text-gray-900">
                {result.effectiveTaxRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
