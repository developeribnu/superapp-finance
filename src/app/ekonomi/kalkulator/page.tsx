"use client";
import { useState } from "react";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n);
}

// ROI Calculator
function ROICalc() {
  const [gain, setGain] = useState("");
  const [cost, setCost] = useState("");
  const roi = gain && cost && +cost !== 0 ? ((+gain - +cost) / +cost) * 100 : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Total Keuntungan (Rp)</label>
        <input type="number" value={gain} onChange={e => setGain(e.target.value)} placeholder="130000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Total Biaya Investasi (Rp)</label>
        <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="100000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      {roi !== null && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>ROI = ({formatNumber(+gain)} - {formatNumber(+cost)}) / {formatNumber(+cost)} x 100%</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "var(--color-primary)" }}>{formatNumber(roi)}%</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {roi > 0 ? "Investasi menguntungkan" : roi < 0 ? "Investasi merugi" : "Impas (break even)"}
          </p>
        </div>
      )}
    </div>
  );
}

// NPV Calculator
function NPVCalc() {
  const [investment, setInvestment] = useState("");
  const [rate, setRate] = useState("");
  const [cashflows, setCashflows] = useState("40000000,40000000,40000000,40000000");

  const calculate = () => {
    if (!investment || !rate || !cashflows) return null;
    const cfs = cashflows.split(",").map(c => +c.trim());
    const r = +rate / 100;
    let npv = -+investment;
    cfs.forEach((cf, i) => { npv += cf / Math.pow(1 + r, i + 1); });
    return npv;
  };

  const npv = calculate();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Investasi Awal (Rp)</label>
        <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="100000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Discount Rate (%)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="10"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Cash Flow per Tahun (pisahkan dengan koma)</label>
        <input type="text" value={cashflows} onChange={e => setCashflows(e.target.value)} placeholder="40000000,40000000,40000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      {npv !== null && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: npv >= 0 ? "var(--color-success-light)" : "var(--color-danger-light)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Net Present Value</p>
          <p className="text-2xl font-bold mt-1" style={{ color: npv >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
            Rp {formatNumber(npv)}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {npv >= 0 ? "Proyek layak diterima (NPV > 0)" : "Proyek sebaiknya ditolak (NPV < 0)"}
          </p>
        </div>
      )}
    </div>
  );
}

// Break Even Calculator
function BEPCalc() {
  const [fixedCost, setFixedCost] = useState("");
  const [price, setPrice] = useState("");
  const [variableCost, setVariableCost] = useState("");

  const bepUnit = fixedCost && price && variableCost && (+price - +variableCost) > 0
    ? +fixedCost / (+price - +variableCost) : null;
  const bepRp = bepUnit !== null ? bepUnit * +price : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Fixed Cost / Biaya Tetap (Rp)</label>
        <input type="number" value={fixedCost} onChange={e => setFixedCost(e.target.value)} placeholder="10000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Harga Jual per Unit (Rp)</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="50000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Variable Cost per Unit (Rp)</label>
        <input type="number" value={variableCost} onChange={e => setVariableCost(e.target.value)} placeholder="30000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      {bepUnit !== null && bepRp !== null && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>BEP = FC / (P - VC) = {formatNumber(+fixedCost)} / ({formatNumber(+price)} - {formatNumber(+variableCost)})</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>BEP (Unit)</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>{formatNumber(Math.ceil(bepUnit))} unit</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>BEP (Rupiah)</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Rp {formatNumber(bepRp)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inflation Calculator
function InflationCalc() {
  const [amount, setAmount] = useState("");
  const [inflRate, setInflRate] = useState("");
  const [years, setYears] = useState("");

  const futureValue = amount && inflRate && years
    ? +amount * Math.pow(1 + +inflRate / 100, +years) : null;
  const purchasingPower = amount && inflRate && years
    ? +amount / Math.pow(1 + +inflRate / 100, +years) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Jumlah Uang Saat Ini (Rp)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Tingkat Inflasi per Tahun (%)</label>
        <input type="number" value={inflRate} onChange={e => setInflRate(e.target.value)} placeholder="3"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Jangka Waktu (Tahun)</label>
        <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="10"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      {futureValue !== null && purchasingPower !== null && (
        <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: "var(--color-warning-light)" }}>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Harga barang Rp {formatNumber(+amount)} akan menjadi:</p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-warning)" }}>Rp {formatNumber(futureValue)}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>dalam {years} tahun dengan inflasi {inflRate}%/tahun</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Daya beli Rp {formatNumber(+amount)} akan setara:</p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-danger)" }}>Rp {formatNumber(purchasingPower)}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>dalam nilai riil {years} tahun ke depan</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Multiplier Calculator
function MultiplierCalc() {
  const [mpc, setMpc] = useState("");
  const [spending, setSpending] = useState("");

  const multiplier = mpc && +mpc > 0 && +mpc < 1 ? 1 / (1 - +mpc) : null;
  const gdpChange = multiplier !== null && spending ? multiplier * +spending : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>MPC (0 {"<"} MPC {"<"} 1)</label>
        <input type="number" step="0.01" value={mpc} onChange={e => setMpc(e.target.value)} placeholder="0.8"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Perubahan Spending Pemerintah (Rp)</label>
        <input type="number" value={spending} onChange={e => setSpending(e.target.value)} placeholder="1000000000000"
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
      </div>
      {multiplier !== null && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-accent-light)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Multiplier = 1 / (1 - {mpc}) = <strong>{formatNumber(multiplier)}</strong></p>
          {gdpChange !== null && (
            <div className="mt-2">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Perubahan GDP:</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>Rp {formatNumber(gdpChange)}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Setiap Rp 1 belanja pemerintah menghasilkan Rp {formatNumber(multiplier)} GDP</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const calculators = [
  { id: "roi", name: "ROI (Return on Investment)", desc: "Hitung persentase keuntungan dari investasi", component: ROICalc, color: "from-blue-500 to-blue-600" },
  { id: "npv", name: "NPV (Net Present Value)", desc: "Evaluasi kelayakan proyek berdasarkan nilai sekarang", component: NPVCalc, color: "from-purple-500 to-purple-600" },
  { id: "bep", name: "Break Even Point", desc: "Hitung titik impas penjualan", component: BEPCalc, color: "from-emerald-500 to-emerald-600" },
  { id: "inflasi", name: "Dampak Inflasi", desc: "Hitung dampak inflasi terhadap daya beli", component: InflationCalc, color: "from-amber-500 to-amber-600" },
  { id: "multiplier", name: "Fiscal Multiplier", desc: "Hitung efek pengganda belanja pemerintah", component: MultiplierCalc, color: "from-rose-500 to-rose-600" },
];

export default function KalkulatorPage() {
  const [activeCalc, setActiveCalc] = useState("roi");
  const ActiveComponent = calculators.find(c => c.id === activeCalc)!.component;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Kalkulator Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Tools interaktif untuk perhitungan ekonomi dan keuangan</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calculator Selection */}
        <div className="space-y-2">
          {calculators.map(calc => (
            <button key={calc.id} onClick={() => setActiveCalc(calc.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeCalc === calc.id ? "ring-2 ring-blue-500 shadow-md" : ""}`}
              style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              <h3 className="font-semibold text-sm" style={{ color: activeCalc === calc.id ? "var(--color-primary)" : "var(--color-text)" }}>{calc.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{calc.desc}</p>
            </button>
          ))}
        </div>

        {/* Calculator Display */}
        <div className="lg:col-span-3 card">
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{calculators.find(c => c.id === activeCalc)!.name}</h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{calculators.find(c => c.id === activeCalc)!.desc}</p>
          </div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
