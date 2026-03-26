"use client";
import { useState } from "react";
import { formulas } from "@/data/ekonomi";

const kategoris = ["Semua", ...Array.from(new Set(formulas.map(f => f.kategori)))];

export default function RumusPage() {
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = formulas.filter(f => {
    const matchKategori = activeKategori === "Semua" || f.kategori === activeKategori;
    const matchSearch = !search || f.nama.toLowerCase().includes(search.toLowerCase()) || f.rumus.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Rumus & Formula Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Kumpulan rumus penting dalam ilmu ekonomi dan keuangan</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Cari rumus..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {kategoris.map(k => (
          <button key={k} onClick={() => setActiveKategori(k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeKategori === k ? "bg-blue-600 text-white shadow-md" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            style={activeKategori !== k ? { color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" } : {}}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg" style={{ color: "var(--color-text)" }}>{f.nama}</h3>
              <span className="badge" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>{f.kategori}</span>
            </div>
            <div className="px-4 py-3 rounded-lg font-mono text-center text-lg font-semibold" style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-primary)" }}>
              {f.rumus}
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <strong>Keterangan:</strong> {f.keterangan}
            </p>
            <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-success-light)" }}>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                <strong>Contoh:</strong> {f.contoh}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
