"use client";
import { useState } from "react";
import Link from "next/link";
import { caseStudies } from "@/data/ekonomi";

export default function CaseStudyPage() {
  const [search, setSearch] = useState("");

  const filtered = caseStudies.filter(cs =>
    !search ||
    cs.judul.toLowerCase().includes(search.toLowerCase()) ||
    cs.negara.toLowerCase().includes(search.toLowerCase()) ||
    cs.tags.some(t => t.includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Case Study Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Pelajari peristiwa ekonomi dunia nyata dan ambil pelajaran berharga</p>
      </div>

      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text" placeholder="Cari case study..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map(cs => (
          <Link key={cs.id} href={`/case-study/${cs.id}`} className="card group hover:scale-[1.01] transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>{cs.tahun}</span>
              <span className="badge" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}>{cs.kategori}</span>
              <span className="badge" style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}>{cs.negara}</span>
            </div>
            <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors" style={{ color: "var(--color-text)" }}>{cs.judul}</h3>
            <p className="text-sm mt-2 line-clamp-3" style={{ color: "var(--color-text-secondary)" }}>{cs.ringkasan}</p>
            <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              Baca Selengkapnya
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
