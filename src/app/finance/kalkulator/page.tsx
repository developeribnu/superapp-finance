import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkulator Keuangan Gratis - Finansial Nexus",
  description:
    "Koleksi 9 kalkulator keuangan interaktif untuk membantu perencanaan keuanganmu. Hitung compound interest, budgeting, pajak, investasi, dan lainnya.",
  keywords: [
    "kalkulator keuangan",
    "kalkulator investasi",
    "kalkulator pajak",
    "kalkulator pensiun",
    "compound interest calculator",
    "budget calculator",
  ],
};

const calculators = [
  {
    slug: "compound-interest",
    title: "Compound Interest",
    description: "Hitung kekuatan bunga berbunga dan lihat bagaimana investasimu bisa bertumbuh seiring waktu.",
    icon: "📈",
  },
  {
    slug: "budgeting",
    title: "Budgeting 50/30/20",
    description: "Alokasikan pendapatan bulananmu dengan metode 50/30/20 untuk kebutuhan, keinginan, dan tabungan/investasi.",
    icon: "💰",
  },
  {
    slug: "dana-darurat",
    title: "Dana Darurat",
    description: "Hitung target dana darurat ideal berdasarkan pengeluaran bulanan dan kebutuhan finansialmu.",
    icon: "🛡️",
  },
  {
    slug: "deposito",
    title: "Deposito",
    description: "Simulasi return deposito setelah pajak dan temukan produk terbaik untuk investasimu.",
    icon: "🏦",
  },
  {
    slug: "goal-planner",
    title: "Goal Planner",
    description: "Rencanakan target keuangan seperti rumah, mobil, atau pendidikan dengan strategi investasi yang tepat.",
    icon: "🎯",
  },
  {
    slug: "retirement",
    title: "Dana Pensiun",
    description: "Proyeksikan kebutuhan biaya hidup di masa pensiun dan buat rencana akumulasi dana.",
    icon: "🌴",
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff",
    description: "Hitung strategi pelunasan utang dengan berbagai metode seperti snowball atau avalanche.",
    icon: "💳",
  },
  {
    slug: "dca-simulator",
    title: "DCA Simulator",
    description: "Simulasi investasi berkala (DCA) untuk melihat dampak rupiah-cost averaging terhadap return investasimu.",
    icon: "📊",
  },
  {
    slug: "pph21",
    title: "PPh 21",
    description: "Hitung pajak penghasilan (PPh 21) berdasarkan gaji, status PTKP, dan potongan BPJS.",
    icon: "📋",
  },
];

export default function KalkulatorIndexPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Kalkulator Keuangan Gratis
          </h1>
          <p className="text-lg text-green-100 max-w-2xl">
            Koleksi 9 tools interaktif untuk membantu perencanaan keuangan, investasi, dan pensiunmu.
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/kalkulator/${calc.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-[#2D6A4F] transition-all duration-300"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A373] opacity-5 rounded-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{calc.icon}</span>
                  <ArrowRight className="w-5 h-5 text-[#2D6A4F] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-lg font-semibold text-[#1B4332] mb-2 group-hover:text-[#2D6A4F] transition-colors">
                  {calc.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {calc.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#2D6A4F] group-hover:gap-3 transition-all">
                  Buka Kalkulator
                  <Calculator className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-[#F5F5F0] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-8 text-center">
            Tips Menggunakan Kalkulator
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1B4332] mb-2">✓ Gunakan Data Akurat</h3>
              <p className="text-sm text-gray-600">
                Masukkan data keuangan yang akurat untuk mendapatkan proyeksi dan hasil kalkulasi yang mendekati realis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1B4332] mb-2">✓ Update Secara Berkala</h3>
              <p className="text-sm text-gray-600">
                Review dan update angka-angka kamu secara berkala untuk memastikan rencana keuangan selalu relevan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1B4332] mb-2">✓ Coba Skenario Berbeda</h3>
              <p className="text-sm text-gray-600">
                Eksplorasi berbagai skenario untuk memahami dampak keputusan finansial terhadap tujuan kamu.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#1B4332] mb-2">✓ Konsultasikan dengan Expert</h3>
              <p className="text-sm text-gray-600">
                Gunakan hasil kalkulator sebagai landasan diskusi dengan financial advisor atau perencana keuangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Disclaimer:</strong> Semua kalkulator di Finansial Nexus bersifat edukatif dan informatif saja. Hasil kalkulasi tidak menggantikan saran profesional dari financial advisor, akuntan, atau perencana keuangan berlisensi. Selalu lakukan riset mendalam dan konsultasikan dengan ahli sebelum membuat keputusan investasi atau keuangan.
          </p>
        </div>
      </section>
    </div>
  );
}
