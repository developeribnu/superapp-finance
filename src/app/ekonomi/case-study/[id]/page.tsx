"use client";
import { use } from "react";
import Link from "next/link";
import { caseStudies } from "@/data/ekonomi";

export default function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const cs = caseStudies.find(c => c.id === id);

  if (!cs) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Case study tidak ditemukan</h1>
        <Link href="/case-study" className="mt-4 inline-block text-blue-600 hover:underline">Kembali</Link>
      </div>
    );
  }

  const sections = [
    { title: "Latar Belakang", content: cs.latar, icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" },
    { title: "Kronologi", content: cs.kronologi, icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Dampak", content: cs.dampak, icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/case-study" className="hover:text-blue-600">Case Study</Link>
        <span>/</span>
        <span style={{ color: "var(--color-text)" }}>{cs.judul}</span>
      </nav>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="badge" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>{cs.tahun}</span>
          <span className="badge" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}>{cs.kategori}</span>
          <span className="badge" style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}>{cs.negara}</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>{cs.judul}</h1>
        <p className="text-lg mt-3" style={{ color: "var(--color-text-secondary)" }}>{cs.ringkasan}</p>
      </div>

      {sections.map((section, i) => (
        <div key={i} className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{section.title}</h2>
          </div>
          <div className="space-y-3">
            {section.content.split("\n\n").map((p, j) => (
              <p key={j} className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{p}</p>
            ))}
          </div>
        </div>
      ))}

      {/* Pelajaran */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Pelajaran yang Dapat Diambil</h2>
        </div>
        <div className="space-y-3">
          {cs.pelajaran.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--color-success-light)" }}>
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/case-study" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5" style={{ color: "var(--color-text-secondary)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Case Study
        </Link>
      </div>
    </div>
  );
}
