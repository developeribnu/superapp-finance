"use client";
import { useState } from "react";
import Link from "next/link";
import { materiEkonomi } from "@/data/ekonomi";

const kategoris = ["Semua", ...Array.from(new Set(materiEkonomi.map(m => m.kategori)))];

const kategoriColors: Record<string, string> = {
  "Ekonomi Mikro": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Ekonomi Makro": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Ekonomi Internasional": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Ekonomi Pembangunan": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Ekonomi Keuangan": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "Ekonomi Digital": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

export default function MateriPage() {
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = materiEkonomi.filter(m => {
    const matchKategori = activeKategori === "Semua" || m.kategori === activeKategori;
    const matchSearch = !search || m.judul.toLowerCase().includes(search.toLowerCase()) ||
      m.ringkasan.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchKategori && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Materi Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Pelajari berbagai topik ekonomi dari dasar hingga lanjut</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {kategoris.map(k => (
          <button
            key={k}
            onClick={() => setActiveKategori(k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeKategori === k
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            style={activeKategori !== k ? { color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" } : {}}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Materi Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(materi => (
          <Link key={materi.id} href={`/materi/${materi.id}`} className="card group hover:scale-[1.01] transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${kategoriColors[materi.kategori] || "bg-gray-100 text-gray-700"}`}>
                {materi.kategori}
              </span>
            </div>
            <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors" style={{ color: "var(--color-text)" }}>
              {materi.judul}
            </h3>
            <p className="text-sm mt-2 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
              {materi.ringkasan}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {materi.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              Baca Selengkapnya
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>Tidak ada materi yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
