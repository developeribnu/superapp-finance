import Link from "next/link";
import { domains } from "@/lib/domains";

const popularDomains = domains.filter((d) =>
  ["literasi", "investasi", "budgeting", "perbankan", "pajak", "crypto"].includes(d.id)
);

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#D4A373]">
              Finansial Nexus
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Platform edukasi keuangan terlengkap Indonesia. Belajar, pahami,
              dan kelola keuanganmu dengan lebih baik.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#D4A373] uppercase tracking-wide">
              Topik Populer
            </h4>
            <ul className="space-y-1.5">
              {popularDomains.map((domain) => (
                <li key={domain.id}>
                  <Link
                    href={`/${domain.slug}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {domain.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links & Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#D4A373] uppercase tracking-wide">
              Navigasi
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/kalkulator"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Kalkulator Keuangan
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Pencarian
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Books Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
          <p className="text-xs text-white/50 leading-relaxed">
            Konten bersifat edukatif, bukan saran keuangan profesional.
          </p>
          <p className="text-xs text-white/40">
            &copy; 2024-2026 Finansial Nexus. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
