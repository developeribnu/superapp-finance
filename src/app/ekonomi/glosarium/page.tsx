"use client";
import { useState } from "react";
import { glosarium } from "@/data/ekonomi";

const kategoris = ["Semua", ...Array.from(new Set(glosarium.map(g => g.kategori)))];

export default function GlosariumPage() {
  const [search, setSearch] = useState("");
  const [activeKategori, setActiveKategori] = useState("Semua");

  const filtered = glosarium.filter(g => {
    const matchKategori = activeKategori === "Semua" || g.kategori === activeKategori;
    const matchSearch = !search || g.istilah.toLowerCase().includes(search.toLowerCase()) || g.definisi.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  // Group by first letter
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, g) => {
    const letter = g.istilah[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(g);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Glosarium Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Kamus istilah-istilah penting dalam ilmu ekonomi ({glosarium.length} istilah)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Cari istilah..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {kategoris.map(k => (
          <button key={k} onClick={() => setActiveKategori(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeKategori === k ? "bg-blue-600 text-white" : ""}`}
            style={activeKategori !== k ? { color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" } : {}}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {Object.keys(grouped).sort().map(letter => (
          <div key={letter}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {letter}
              </span>
              <span className="text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>({grouped[letter].length} istilah)</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {grouped[letter].map((g, i) => (
                <div key={i} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{g.istilah}</h3>
                    <span className="badge text-xs" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>{g.kategori}</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{g.definisi}</p>
                  {g.contoh && (
                    <p className="text-xs mt-2 italic p-2 rounded" style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}>
                      Contoh: {g.contoh}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: "var(--color-text-muted)" }}>Istilah tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}
