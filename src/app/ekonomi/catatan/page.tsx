"use client";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface Catatan {
  id: string;
  judul: string;
  konten: string;
  kategori: string;
  createdAt: string;
  updatedAt: string;
}

const kategoriOptions = ["Umum", "Ekonomi Mikro", "Ekonomi Makro", "Keuangan", "Perdagangan", "Pembangunan", "Digital"];

export default function CatatanPage() {
  const [catatan, setCatatan] = useLocalStorage<Catatan[]>("ekonomi-catatan", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState("Umum");
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const saveCatatan = () => {
    if (!judul.trim() || !konten.trim()) return;
    const now = new Date().toISOString();
    if (editId) {
      setCatatan(prev => prev.map(c => c.id === editId ? { ...c, judul, konten, kategori, updatedAt: now } : c));
    } else {
      const newCatatan: Catatan = {
        id: Date.now().toString(),
        judul, konten, kategori,
        createdAt: now, updatedAt: now,
      };
      setCatatan(prev => [newCatatan, ...prev]);
    }
    resetForm();
  };

  const deleteCatatan = (id: string) => {
    setCatatan(prev => prev.filter(c => c.id !== id));
  };

  const editCatatan = (c: Catatan) => {
    setEditId(c.id);
    setJudul(c.judul);
    setKonten(c.konten);
    setKategori(c.kategori);
    setIsEditing(true);
  };

  const resetForm = () => {
    setEditId(null);
    setJudul("");
    setKonten("");
    setKategori("Umum");
    setIsEditing(false);
  };

  const filtered = catatan.filter(c => {
    const matchKategori = filterKategori === "Semua" || c.kategori === filterKategori;
    const matchSearch = !search || c.judul.toLowerCase().includes(search.toLowerCase()) || c.konten.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Catatan Saya</h1>
          <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Simpan catatan pribadi terkait materi ekonomi ({catatan.length} catatan)</p>
        </div>
        <button onClick={() => { resetForm(); setIsEditing(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Catatan Baru
        </button>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4" style={{ backgroundColor: "var(--color-bg-card)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{editId ? "Edit Catatan" : "Catatan Baru"}</h2>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Judul</label>
              <input type="text" value={judul} onChange={e => setJudul(e.target.value)} placeholder="Judul catatan..."
                className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Kategori</label>
              <select value={kategori} onChange={e => setKategori(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Konten</label>
              <textarea value={konten} onChange={e => setKonten(e.target.value)} placeholder="Tulis catatan Anda di sini..."
                rows={10}
                className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5" style={{ color: "var(--color-text-secondary)" }}>Batal</button>
              <button onClick={saveCatatan} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Cari catatan..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Semua", ...kategoriOptions].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterKategori === k ? "bg-blue-600 text-white" : ""}`}
              style={filterKategori !== k ? { color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" } : {}}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="card group">
              <div className="flex items-center justify-between mb-2">
                <span className="badge text-xs" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>{c.kategori}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editCatatan(c)} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                    <svg className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button onClick={() => deleteCatatan(c.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{c.judul}</h3>
              <p className="text-xs mt-2 line-clamp-4" style={{ color: "var(--color-text-secondary)" }}>{c.konten}</p>
              <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
                {new Date(c.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <svg className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <p className="text-lg font-medium" style={{ color: "var(--color-text)" }}>Belum ada catatan</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Klik "Catatan Baru" untuk mulai mencatat</p>
        </div>
      )}
    </div>
  );
}
