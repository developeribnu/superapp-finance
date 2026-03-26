"use client";

import { useState } from "react";
import { referensi } from "@/data/ekonomi";

const jenisOptions = ["Semua", ...Array.from(new Set(referensi.map((item) => item.jenis)))];
const allLevelsValue = "Semua Level";
const levelOrder = ["Pemula", "Pemula-Menengah", "Menengah", "Menengah-Lanjut", "Lanjut", "Semua"];
const levelOptions = [allLevelsValue, ...levelOrder.filter((level) => referensi.some((item) => item.level === level))];

const collectionMeta: Record<string, { icon: string; description: string }> = {
  "Buku Teks": {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    description: "Rujukan utama untuk membangun fondasi konsep ekonomi secara sistematis.",
  },
  "Buku Populer": {
    icon: "M9.813 15.904L9 18.75l-2.846.813 2.846.813L9.813 24l.813-2.846L13.5 20.34l-2.846-.813L9.813 15.904Zm0 0L12 9.75l2.187 6.154M21 12l-2.25.75L18 15l-.75-2.25L15 12l2.25-.75L18 9l.75 2.25L21 12Z",
    description: "Buku ekonomi yang lebih naratif, relevan, dan mudah dicerna lintas level.",
  },
  Klasik: {
    icon: "M8.25 4.5h7.5a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0115.75 19.5h-7.5A2.25 2.25 0 016 17.25V6.75A2.25 2.25 0 018.25 4.5Z",
    description: "Karya-karya kunci yang membentuk sejarah dan arah pemikiran ekonomi modern.",
  },
  "Online Course": {
    icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342",
    description: "Pilihan belajar mandiri lewat video, kuliah terbuka, dan jalur kurikulum praktis.",
  },
  "Online Textbook": {
    icon: "M3.75 5.25h16.5M3.75 8.25h16.5m-16.5 3h16.5m-16.5 3h9",
    description: "Sumber gratis berbasis web yang interaktif dan cocok untuk belajar bertahap.",
  },
  "Slide Kuliah": {
    icon: "M7.5 3.75h9A2.25 2.25 0 0118.75 6v12A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75Zm2.25 4.5h4.5m-6 3h7.5m-7.5 3h7.5",
    description: "Materi presentasi, slide kuliah, dan ringkasan topik untuk belajar lebih cepat.",
  },
};

const coverThemes = [
  "from-slate-950 via-slate-800 to-slate-700",
  "from-blue-950 via-blue-700 to-sky-500",
  "from-emerald-950 via-emerald-700 to-teal-500",
  "from-amber-950 via-orange-700 to-amber-400",
  "from-rose-950 via-rose-700 to-pink-500",
  "from-violet-950 via-violet-700 to-indigo-400",
];

const levelBadgeClass: Record<string, string> = {
  Pemula: "badge badge-foundational",
  "Pemula-Menengah": "badge badge-practical",
  Menengah: "badge badge-professional",
  "Menengah-Lanjut": "badge badge-research",
  Lanjut: "badge badge-advanced",
  Semua: "badge badge-premium",
};

const levelDescription: Record<string, string> = {
  Pemula: "Mulai dari fondasi dan istilah paling dasar.",
  "Pemula-Menengah": "Cocok setelah memahami pengantar ekonomi.",
  Menengah: "Mulai masuk analisis dan kerangka berpikir formal.",
  "Menengah-Lanjut": "Lebih tajam, konseptual, dan padat referensi.",
  Lanjut: "Untuk pembaca yang nyaman dengan teori mendalam.",
  Semua: "Bisa dinikmati lintas level pembaca.",
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterLevel, setFilterLevel] = useState(allLevelsValue);

  const filtered = referensi.filter((item) => {
    const matchJenis = filterJenis === "Semua" || item.jenis === filterJenis;
    const matchLevel = filterLevel === allLevelsValue || item.level === filterLevel;
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      item.judul.toLowerCase().includes(query) ||
      item.penulis.toLowerCase().includes(query) ||
      item.deskripsi.toLowerCase().includes(query);

    return matchJenis && matchLevel && matchSearch;
  });

  const collections = jenisOptions
    .filter((jenis) => jenis !== "Semua")
    .map((jenis) => {
      const total = referensi.filter((item) => item.jenis === jenis).length;
      return {
        jenis,
        total,
        ...collectionMeta[jenis],
      };
    });

  const beginnerCount = referensi.filter((item) => item.level === "Pemula").length;
  const classicCount = referensi.filter((item) => item.jenis === "Klasik").length;
  const curatedLevels = new Set(referensi.map((item) => item.level)).size;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="hero-gradient relative overflow-hidden rounded-[2rem] border px-6 py-7 sm:px-8 lg:px-10 lg:py-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="library-dot-grid absolute inset-0 opacity-60" />
        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-blue-500/12 blur-3xl dark:bg-blue-400/10" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-emerald-500/12 blur-3xl dark:bg-emerald-400/10" />

        <div className="relative grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]" style={{ borderColor: "var(--color-border)", color: "var(--color-primary)", backgroundColor: "color-mix(in srgb, var(--color-bg-card) 88%, transparent)" }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
              Library
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.8rem]" style={{ color: "var(--color-text)" }}>
                Koleksi buku dan sumber belajar ekonomi dalam tampilan library yang lebih rapi.
              </h1>
              <p className="max-w-2xl text-sm leading-7 sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
                Satu halaman untuk menjelajah textbook, bacaan populer, karya klasik, dan sumber belajar online
                berdasarkan topik, tingkat kesulitan, dan kebutuhan belajar Anda.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Total Koleksi</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-text)" }}>{referensi.length}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>Kurasi buku, course, dan textbook</p>
              </div>
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Kategori</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-text)" }}>{collections.length}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>Dari textbook sampai online learning</p>
              </div>
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Jenjang</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-text)" }}>{curatedLevels}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>Mulai pemula sampai lanjutan</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border p-5 sm:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-bg-card) 90%, transparent)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-primary)" }}>Snapshot</p>
                <h2 className="mt-2 text-xl font-semibold" style={{ color: "var(--color-text)" }}>Koleksi yang paling berguna untuk mulai</h2>
              </div>
              <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10m0-10l4 4m-4-4l-4 4" />
                </svg>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Pemula</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Mulai dari buku pengantar dan course gratis</p>
                </div>
                <span className="badge badge-foundational">{beginnerCount} item</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Karya Klasik</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Untuk memperkuat konteks sejarah ekonomi</p>
                </div>
                <span className="badge badge-advanced">{classicCount} item</span>
              </div>
              <div className="rounded-2xl border px-4 py-4" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Hasil Aktif</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--color-text)" }}>{filtered.length}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Menampilkan koleksi yang sesuai dengan pencarian dan filter saat ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border p-5 sm:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Filter library</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Cari judul, penulis, atau persempit berdasarkan jenis dan level.
              </p>
            </div>
            <button
              onClick={() => {
                setSearch("");
                setFilterJenis("Semua");
                setFilterLevel(allLevelsValue);
              }}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Reset
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <div className="relative">
              <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Cari buku, penulis, atau topik ekonomi..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/15"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text)" }}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Jenis koleksi</p>
              <div className="flex flex-wrap gap-2">
                {jenisOptions.map((jenis) => {
                  const isActive = filterJenis === jenis;
                  return (
                    <button
                      key={jenis}
                      onClick={() => setFilterJenis(jenis)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : ""}`}
                      style={!isActive ? { backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" } : {}}
                    >
                      {jenis}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>Tingkat belajar</p>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map((level) => {
                  const isActive = filterLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${isActive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : ""}`}
                      style={!isActive ? { backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" } : {}}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {collections.map((collection) => (
            <button
              key={collection.jenis}
              onClick={() => setFilterJenis(collection.jenis)}
              className="card-hover rounded-[1.5rem] border p-5 text-left"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={collection.icon} />
                  </svg>
                </div>
                <span className="badge" style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}>
                  {collection.total} item
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold" style={{ color: "var(--color-text)" }}>{collection.jenis}</h3>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{collection.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-primary)" }}>Library Shelf</p>
            <h2 className="mt-1 text-2xl font-semibold" style={{ color: "var(--color-text)" }}>Koleksi yang bisa langsung dijelajahi</h2>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {filtered.length} hasil {search ? `untuk "${search}"` : "tersedia"}.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[1.75rem] border px-6 py-10 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--color-text)" }}>Tidak ada koleksi yang cocok</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Coba ganti kata kunci atau longgarkan filter jenis dan level.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item, index) => {
              const theme = coverThemes[index % coverThemes.length];
              const badgeClass = levelBadgeClass[item.level] || "badge";
              const description = levelDescription[item.level] || "Cocok untuk berbagai kebutuhan belajar.";

              return (
                <article
                  key={`${item.judul}-${item.penulis}`}
                  className="book-card overflow-hidden rounded-[1.75rem] border"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}
                >
                  <div className={`book-card-image relative h-60 overflow-hidden bg-gradient-to-br ${theme}`}>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent)",
                      }}
                    />
                    <div className="book-card-overlay absolute inset-0 bg-slate-950/15 dark:bg-black/35" />
                    <div className="absolute right-4 top-4 rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
                      Shelf {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-5 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85">
                          {item.jenis}
                        </span>
                        <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/55">Economics Library</p>
                        <h3 className="mt-3 line-clamp-3 text-2xl font-semibold leading-tight">{item.judul}</h3>
                        <p className="mt-3 text-sm text-white/75">{item.penulis}</p>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Level Insight</p>
                        <p className="mt-1 text-sm leading-6 text-white/88">{description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className={badgeClass}>{item.level}</span>
                      <button
                        onClick={() => setFilterJenis(item.jenis)}
                        className="badge transition-colors hover:opacity-90"
                        style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
                      >
                        {item.jenis}
                      </button>
                      {item.format ? (
                        <span
                          className="badge"
                          style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}
                        >
                          {item.format}
                          {item.halaman ? ` • ${item.halaman} hlm` : ""}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>{item.judul}</h3>
                      <p className="mt-1 text-sm font-medium" style={{ color: "var(--color-primary)" }}>{item.penulis}</p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
                      {item.deskripsi}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--color-text-muted)" }}>Direkomendasikan</p>
                        <p className="mt-1 text-sm font-medium" style={{ color: "var(--color-text)" }}>{item.level}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setFilterLevel(item.level)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Filter level
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                        {item.tautan ? (
                          <a
                            href={item.tautan}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            Buka PDF
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75l-7.5 7.5m0 0l-7.5-7.5m7.5 7.5V3" />
                            </svg>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
