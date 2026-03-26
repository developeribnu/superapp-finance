"use client";
import { useState } from "react";

// Simple SVG-based chart components (no external deps needed)
function BarChart({ data, title, color }: { data: { label: string; value: number }[]; title: string; color: string }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="card">
      <h3 className="font-bold mb-4" style={{ color: "var(--color-text)" }}>{title}</h3>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs w-24 text-right flex-shrink-0" style={{ color: "var(--color-text-secondary)" }}>{d.label}</span>
            <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
              <div className={`h-full rounded-full ${color} transition-all duration-1000 flex items-center justify-end pr-2`} style={{ width: `${(d.value / max) * 100}%` }}>
                <span className="text-xs text-white font-medium">{d.value.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="card">
      <h3 className="font-bold mb-4" style={{ color: "var(--color-text)" }}>{title}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg viewBox="0 0 100 100" className="w-48 h-48 flex-shrink-0">
          {data.map((d, i) => {
            const percentage = d.value / total;
            const startAngle = cumulative * 360;
            cumulative += percentage;
            const endAngle = cumulative * 360;

            const startRad = ((startAngle - 90) * Math.PI) / 180;
            const endRad = ((endAngle - 90) * Math.PI) / 180;
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            const largeArc = percentage > 0.5 ? 1 : 0;

            return (
              <path key={i} d={`M50,50 L${x1},${y1} A40,40 0 ${largeArc},1 ${x2},${y2} Z`} fill={d.color} stroke="white" strokeWidth="0.5" />
            );
          })}
        </svg>
        <div className="space-y-2 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{d.label}</span>
              <span className="text-xs font-bold ml-auto" style={{ color: "var(--color-text)" }}>{((d.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LineChart({ data, title, ylabel }: { data: { label: string; value: number }[]; title: string; ylabel: string }) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const padding = 40;
  const width = 500;
  const height = 200;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((d.value - min) / range) * (height - padding * 2),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="card">
      <h3 className="font-bold mb-4" style={{ color: "var(--color-text)" }}>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ color: "var(--color-text-muted)" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = height - padding - frac * (height - padding * 2);
          const val = min + frac * range;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <text x={padding - 5} y={y + 4} textAnchor="end" fill="currentColor" fontSize="8">{val.toFixed(1)}</text>
            </g>
          );
        })}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={points[i].x} y={height - 10} textAnchor="middle" fill="currentColor" fontSize="7">{d.label}</text>
        ))}
        {/* Line */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Area */}
        <path d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`} fill="#3b82f6" opacity="0.1" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
        ))}
        {/* Y label */}
        <text x="10" y={height / 2} textAnchor="middle" fill="currentColor" fontSize="8" transform={`rotate(-90, 10, ${height / 2})`}>{ylabel}</text>
      </svg>
    </div>
  );
}

export default function GrafikPage() {
  const [activeTab, setActiveTab] = useState("gdp");

  const tabs = [
    { id: "gdp", label: "GDP Indonesia" },
    { id: "inflasi", label: "Inflasi" },
    { id: "struktur", label: "Struktur GDP" },
    { id: "perdagangan", label: "Neraca Perdagangan" },
    { id: "apbn", label: "APBN" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Grafik & Visualisasi Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Visualisasi data ekonomi untuk pemahaman yang lebih baik</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-md" : ""}`}
            style={activeTab !== t.id ? { color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "gdp" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <LineChart
            title="Pertumbuhan GDP Indonesia (%)"
            ylabel="Growth (%)"
            data={[
              { label: "2017", value: 5.07 }, { label: "2018", value: 5.17 }, { label: "2019", value: 5.02 },
              { label: "2020", value: -2.07 }, { label: "2021", value: 3.70 }, { label: "2022", value: 5.31 },
              { label: "2023", value: 5.05 }, { label: "2024", value: 5.10 },
            ]}
          />
          <BarChart
            title="GDP Negara ASEAN (Miliar USD, 2023)"
            color="bg-blue-500"
            data={[
              { label: "Indonesia", value: 1371 }, { label: "Thailand", value: 515 },
              { label: "Singapura", value: 497 }, { label: "Filipina", value: 435 },
              { label: "Vietnam", value: 430 }, { label: "Malaysia", value: 408 },
            ]}
          />
          <BarChart
            title="GDP per Kapita ASEAN (USD, 2023)"
            color="bg-purple-500"
            data={[
              { label: "Singapura", value: 84734 }, { label: "Brunei", value: 37580 },
              { label: "Malaysia", value: 13034 }, { label: "Thailand", value: 7298 },
              { label: "Indonesia", value: 4942 }, { label: "Vietnam", value: 4346 },
            ]}
          />
          <LineChart
            title="GDP Indonesia (Triliun Rp)"
            ylabel="Triliun Rp"
            data={[
              { label: "2018", value: 14838 }, { label: "2019", value: 15833 }, { label: "2020", value: 15443 },
              { label: "2021", value: 16977 }, { label: "2022", value: 19588 }, { label: "2023", value: 20892 },
            ]}
          />
        </div>
      )}

      {activeTab === "inflasi" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <LineChart
            title="Inflasi Indonesia (%)"
            ylabel="Inflasi (%)"
            data={[
              { label: "2017", value: 3.61 }, { label: "2018", value: 3.13 }, { label: "2019", value: 2.72 },
              { label: "2020", value: 1.68 }, { label: "2021", value: 1.87 }, { label: "2022", value: 5.51 },
              { label: "2023", value: 2.61 }, { label: "2024", value: 1.55 },
            ]}
          />
          <BarChart
            title="Inflasi Negara-Negara 2023 (%)"
            color="bg-amber-500"
            data={[
              { label: "Argentina", value: 211 }, { label: "Turki", value: 65 },
              { label: "India", value: 5.7 }, { label: "AS", value: 3.4 },
              { label: "Indonesia", value: 2.6 }, { label: "Jepang", value: 3.3 },
            ]}
          />
          <LineChart
            title="BI-7 Day Reverse Repo Rate (%)"
            ylabel="Rate (%)"
            data={[
              { label: "2019", value: 5.0 }, { label: "2020", value: 3.75 }, { label: "2021", value: 3.50 },
              { label: "2022", value: 5.50 }, { label: "2023", value: 6.00 }, { label: "2024", value: 6.00 },
            ]}
          />
          <BarChart
            title="Komponen CPI Indonesia (Bobot %)"
            color="bg-rose-500"
            data={[
              { label: "Makanan", value: 25.4 }, { label: "Perumahan", value: 26.3 },
              { label: "Transportasi", value: 14.8 }, { label: "Pendidikan", value: 6.0 },
              { label: "Kesehatan", value: 4.9 }, { label: "Lainnya", value: 22.6 },
            ]}
          />
        </div>
      )}

      {activeTab === "struktur" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <PieChart
            title="Struktur GDP Indonesia (Pengeluaran)"
            data={[
              { label: "Konsumsi RT (C)", value: 54.5, color: "#3b82f6" },
              { label: "Investasi (I)", value: 30.7, color: "#8b5cf6" },
              { label: "Belanja Pemerintah (G)", value: 8.2, color: "#10b981" },
              { label: "Ekspor (X)", value: 21.6, color: "#f59e0b" },
              { label: "Impor (M)", value: -15.0, color: "#ef4444" },
            ]}
          />
          <PieChart
            title="Struktur GDP Indonesia (Sektor)"
            data={[
              { label: "Industri Pengolahan", value: 18.7, color: "#3b82f6" },
              { label: "Perdagangan", value: 13.1, color: "#8b5cf6" },
              { label: "Pertanian", value: 12.4, color: "#10b981" },
              { label: "Pertambangan", value: 9.8, color: "#f59e0b" },
              { label: "Konstruksi", value: 9.7, color: "#ef4444" },
              { label: "Jasa Keuangan", value: 4.2, color: "#06b6d4" },
              { label: "Lainnya", value: 32.1, color: "#94a3b8" },
            ]}
          />
          <BarChart
            title="Kontribusi Sektor terhadap GDP (%)"
            color="bg-emerald-500"
            data={[
              { label: "Manufaktur", value: 18.7 }, { label: "Perdagangan", value: 13.1 },
              { label: "Pertanian", value: 12.4 }, { label: "Tambang", value: 9.8 },
              { label: "Konstruksi", value: 9.7 }, { label: "Transportasi", value: 5.5 },
            ]}
          />
          <PieChart
            title="Tenaga Kerja per Sektor"
            data={[
              { label: "Pertanian", value: 29, color: "#10b981" },
              { label: "Perdagangan", value: 22, color: "#8b5cf6" },
              { label: "Industri", value: 14, color: "#3b82f6" },
              { label: "Jasa", value: 17, color: "#f59e0b" },
              { label: "Lainnya", value: 18, color: "#94a3b8" },
            ]}
          />
        </div>
      )}

      {activeTab === "perdagangan" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <BarChart
            title="Ekspor Utama Indonesia (Miliar USD)"
            color="bg-emerald-500"
            data={[
              { label: "CPO", value: 26.8 }, { label: "Batu Bara", value: 34.1 },
              { label: "Besi/Baja", value: 18.2 }, { label: "Elektronik", value: 10.1 },
              { label: "Karet", value: 5.8 }, { label: "Garmen", value: 7.3 },
            ]}
          />
          <LineChart
            title="Neraca Perdagangan Indonesia (Miliar USD)"
            ylabel="Miliar USD"
            data={[
              { label: "2018", value: -0.2 }, { label: "2019", value: -3.2 }, { label: "2020", value: 21.7 },
              { label: "2021", value: 35.3 }, { label: "2022", value: 54.5 }, { label: "2023", value: 36.9 },
            ]}
          />
          <BarChart
            title="Mitra Dagang Utama (Ekspor, Miliar USD)"
            color="bg-blue-500"
            data={[
              { label: "China", value: 60.2 }, { label: "AS", value: 25.8 },
              { label: "Jepang", value: 22.1 }, { label: "India", value: 21.3 },
              { label: "Malaysia", value: 12.4 }, { label: "Korea", value: 11.8 },
            ]}
          />
          <LineChart
            title="Cadangan Devisa Indonesia (Miliar USD)"
            ylabel="Miliar USD"
            data={[
              { label: "2018", value: 120.7 }, { label: "2019", value: 129.2 }, { label: "2020", value: 135.9 },
              { label: "2021", value: 144.9 }, { label: "2022", value: 137.2 }, { label: "2023", value: 146.4 },
            ]}
          />
        </div>
      )}

      {activeTab === "apbn" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <PieChart
            title="Struktur Penerimaan APBN"
            data={[
              { label: "PPh", value: 35.2, color: "#3b82f6" },
              { label: "PPN", value: 30.1, color: "#8b5cf6" },
              { label: "Cukai", value: 9.8, color: "#10b981" },
              { label: "PNBP SDA", value: 10.5, color: "#f59e0b" },
              { label: "Bea Masuk/Keluar", value: 3.2, color: "#ef4444" },
              { label: "PNBP Lainnya", value: 11.2, color: "#94a3b8" },
            ]}
          />
          <PieChart
            title="Struktur Belanja APBN"
            data={[
              { label: "Kementerian/Lembaga", value: 30, color: "#3b82f6" },
              { label: "Transfer Daerah", value: 28, color: "#8b5cf6" },
              { label: "Subsidi", value: 12, color: "#10b981" },
              { label: "Bunga Utang", value: 15, color: "#f59e0b" },
              { label: "Bansos", value: 5, color: "#ef4444" },
              { label: "Lainnya", value: 10, color: "#94a3b8" },
            ]}
          />
          <LineChart
            title="Defisit APBN (% GDP)"
            ylabel="% GDP"
            data={[
              { label: "2018", value: -1.76 }, { label: "2019", value: -2.20 }, { label: "2020", value: -6.14 },
              { label: "2021", value: -4.65 }, { label: "2022", value: -2.38 }, { label: "2023", value: -1.65 },
            ]}
          />
          <LineChart
            title="Rasio Utang Pemerintah (% GDP)"
            ylabel="% GDP"
            data={[
              { label: "2018", value: 29.8 }, { label: "2019", value: 30.2 }, { label: "2020", value: 39.4 },
              { label: "2021", value: 40.7 }, { label: "2022", value: 39.5 }, { label: "2023", value: 39.0 },
            ]}
          />
        </div>
      )}
    </div>
  );
}
