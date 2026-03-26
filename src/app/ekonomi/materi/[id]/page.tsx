"use client";
import { use } from "react";
import Link from "next/link";
import { materiEkonomi } from "@/data/ekonomi";

export default function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const materi = materiEkonomi.find(m => m.id === id);

  if (!materi) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Materi tidak ditemukan</h1>
        <Link href="/materi" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke Materi</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/materi" className="hover:text-blue-600">Materi</Link>
        <span>/</span>
        <span style={{ color: "var(--color-text)" }}>{materi.judul}</span>
      </nav>

      {/* Header */}
      <div className="card">
        <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-3 inline-block">
          {materi.kategori}
        </span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>{materi.judul}</h1>
        <p className="text-lg mt-2" style={{ color: "var(--color-text-secondary)" }}>{materi.ringkasan}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {materi.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>Penjelasan Lengkap</h2>
        <div className="space-y-4">
          {materi.konten.split("\n\n").map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Key Points */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>Poin-Poin Penting</h2>
        <div className="space-y-3">
          {materi.poinPenting.map((poin, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{poin}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/materi" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: "var(--color-text-secondary)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Materi
        </Link>
      </div>
    </div>
  );
}
