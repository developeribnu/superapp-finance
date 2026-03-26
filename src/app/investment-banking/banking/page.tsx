"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Landmark, 
  PiggyBank, 
  CreditCard, 
  Home, 
  Wallet,
  TrendingUp,
  Shield,
  Users,
  ArrowRightLeft,
  Briefcase,
  Info,
  Calculator,
  BookOpen,
  HelpCircle,
  Landmark as BankIcon,
  Sparkles,
  Wrench,
  Crown
} from "lucide-react";
import { BankingCalculators } from "./_components/calculators";
import { BankComparison } from "./_components/bank-comparison";
import { BankingKnowledge } from "./_components/banking-knowledge";
import { BankingTools } from "./_components/banking-tools";
import { AdvancedBanking } from "./_components/advanced-banking";
import { banks } from "@/lib/data/banking-data";
import { getTopBanksByDepositoRate } from "@/lib/data/banking-data";

const bankTypes = [
  {
    icon: Building2,
    title: "Bank Umum",
    description: "Bank yang melayani masyarakat umum dengan produk seperti tabungan, deposito, dan kredit.",
    examples: "BCA, BRI, Mandiri, BNI",
    features: ["Tabungan", "Deposito", "Kredit", "Kartu Kredit"]
  },
  {
    icon: Landmark,
    title: "Bank Sentral",
    description: "Bank yang mengatur dan mengawasi sistem keuangan suatu negara. Di Indonesia adalah Bank Indonesia (BI).",
    examples: "Bank Indonesia (BI)",
    features: ["Mengatur suku bunga", "Menerbitkan uang", "Mengawasi bank", "Menjaga stabilitas"]
  },
  {
    icon: TrendingUp,
    title: "Bank Investasi",
    description: "Bank yang fokus pada layanan korporasi besar seperti IPO, M&A, dan underwriting.",
    examples: "Mandiri Sekuritas, BCA Sekuritas",
    features: ["Underwriting", "M&A Advisory", "IPO", "Valuasi"]
  },
  {
    icon: Users,
    title: "Bank Perkreditan Rakyat (BPR)",
    description: "Bank yang melayani usaha kecil dan menengah di daerah tertentu.",
    examples: "BPR Daerah",
    features: ["Kredit UMKM", "Tabungan", "Deposito", "Pelayanan lokal"]
  },
  {
    icon: Briefcase,
    title: "Bank Syariah",
    description: "Bank yang beroperasi berdasarkan prinsip syariah Islam, tanpa riba.",
    examples: "Bank Syariah Indonesia (BSI)",
    features: ["Mudharabah", "Musyarakah", "Murabahah", "Ijarah"]
  },
  {
    icon: Sparkles,
    title: "Neobank / Digital Bank",
    description: "Bank tanpa cabang fisik yang beroperasi 100% digital melalui aplikasi.",
    examples: "Jenius, Blu, Line Bank, Bank Jago",
    features: ["No admin fee", "Bunga tinggi", "UI modern", "Integrasi API"]
  }
];

const bankProducts = [
  {
    icon: PiggyBank,
    title: "Tabungan",
    description: "Rekening untuk menyimpan uang dengan bunga rendah dan likuiditas tinggi. Cocok untuk dana darurat.",
    benefits: ["Likuiditas tinggi", "Bunga 0.5-2%", "Kartu ATM/Debit", "Mobile banking"],
    suitableFor: "Dana darurat, pengeluaran harian",
    minBalance: "Rp 0 - 500.000",
    adminFee: "Rp 0 - 20.000/bulan"
  },
  {
    icon: Wallet,
    title: "Deposito",
    description: "Penempatan dana dengan jangka waktu tertentu dan bunga lebih tinggi dari tabungan.",
    benefits: ["Bunga 3-6%", "Aman (LPS)", "Jangka waktu fleksibel", "Dijamin pemerintah"],
    suitableFor: "Investasi jangka pendek, dana tidak digunakan",
    minBalance: "Rp 8.000.000",
    adminFee: "Gratis"
  },
  {
    icon: Home,
    title: "KPR (Kredit Pemilikan Rumah)",
    description: "Pinjaman jangka panjang untuk membeli atau membangun rumah.",
    benefits: ["Tenor sampai 25 tahun", "Angsuran tetap/fluktuatif", "Fasilitas takeover", "Subsidi pemerintah"],
    suitableFor: "Pembelian rumah pertama, investasi properti",
    minBalance: "-",
    adminFee: "Provisi 1-3%"
  },
  {
    icon: CreditCard,
    title: "Kartu Kredit",
    description: "Alat pembayaran non-tunai dengan sistem bayar nanti dan fitur cicilan.",
    benefits: ["Cashback/poin", "Cicilan 0%", "Promo merchant", "Pay later"],
    suitableFor: "Cashflow management, reward hunter",
    minBalance: "-",
    adminFee: "Rp 100.000 - 500.000/tahun"
  },
  {
    icon: ArrowRightLeft,
    title: "Kredit Modal Kerja",
    description: "Pinjaman untuk kebutuhan operasional bisnis seperti pembelian stok.",
    benefits: ["Limit besar", "Revolving", "Tenor fleksibel", "Bunga kompetitif"],
    suitableFor: "Pemilik usaha, UMKM",
    minBalance: "-",
    adminFee: "Sesuai kesepakatan"
  },
  {
    icon: Shield,
    title: "Asuransi & Investasi",
    description: "Produk protection dan wealth management yang ditawarkan bank.",
    benefits: ["Unit link", "DPLK", "Bancassurance", "Reksadana"],
    suitableFor: "Perencanaan keuangan jangka panjang",
    minBalance: "Rp 100.000 - 10.000.000",
    adminFee: "Bervariasi"
  }
];

const quickStats = [
  { label: "Total Bank", value: "100+", description: "Bank di Indonesia" },
  { label: "ATM Terpasang", value: "100.000+", description: "Seluruh Indonesia" },
  { label: "Jaminan LPS", value: "Rp 2 M", description: "Per nasabah per bank" },
  { label: "QRIS", value: "15jt+", description: "Merchant tersedia" }
];

export default function BankingPage() {
  const topDepositoBanks = getTopBanksByDepositoRate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banking Center"
        subtitle="Pusat informasi lengkap tentang perbankan di Indonesia - perbandingan bank, kalkulator finansial, dan panduan lengkap."
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="types" className="text-xs">Jenis Bank</TabsTrigger>
          <TabsTrigger value="products" className="text-xs">Produk</TabsTrigger>
          <TabsTrigger value="calculators" className="text-xs">Kalkulator</TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs">Perbandingan</TabsTrigger>
          <TabsTrigger value="knowledge" className="text-xs">FAQ & Glosarium</TabsTrigger>
          <TabsTrigger value="tools" className="text-xs">Tools Lanjutan</TabsTrigger>
          <TabsTrigger value="premium" className="text-xs">Fitur Premium</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  Apa Itu Bank?
                </CardTitle>
                <CardDescription>
                  Lembaga keuangan yang menghimpun dana dari masyarakat dan menyalurkannya dalam bentuk kredit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Bank adalah lembaga keuangan yang berfungsi sebagai perantara keuangan (financial intermediary) 
                  antara pihak yang memiliki kelebihan dana (surplus unit) dengan pihak yang membutuhkan dana 
                  (deficit unit). Di Indonesia, kegiatan bank diawasi oleh Otoritas Jasa Keuangan (OJK) dan 
                  Bank Indonesia (BI).
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Fungsi Penghimpun Dana</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Menghimpun dana dari masyarakat dalam bentuk tabungan, deposito, dan giro
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Fungsi Penyalur Dana</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Menyalurkan dana dalam bentuk kredit untuk kebutuhan konsumsi atau investasi
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Fungsi Jasa</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Memberikan jasa pembayaran, transfer, inkaso, dan layanan perbankan lainnya
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Tahukah Kamu?</h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                        Simpanan di bank Indonesia yang tercatat di LPS (Lembaga Penjamin Simpanan) 
                        dijamin pemerintah hingga Rp 2 miliar per nasabah per bank dengan suku bunga maksimal 
                        tertentu. Jadi meskipun bank bangkrut, uangmu tetap aman sampai batas tersebut!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Bunga Deposito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDepositoBanks.slice(0, 5).map((bank, index) => (
                    <div key={bank.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold w-5">{index + 1}</span>
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: bank.color, color: bank.textColor }}
                        >
                          {bank.code}
                        </div>
                        <span className="text-sm">{bank.name}</span>
                      </div>
                      <span className="font-bold text-green-600">{bank.rates.deposito12Month}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Jenis-Jenis Bank di Indonesia
              </CardTitle>
              <CardDescription>
                Memahami perbedaan berbagai jenis bank untuk memilih yang sesuai kebutuhan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankTypes.map((type) => (
                  <Card key={type.title} className="group hover:border-primary/50 transition-all">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-sm">{type.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-2">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Contoh:</span>
                          <p className="text-xs">{type.examples}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Fitur Utama:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {type.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Produk Perbankan
              </CardTitle>
              <CardDescription>
                Berbagai produk yang ditawarkan bank untuk memenuhi kebutuhan finansial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankProducts.map((product) => (
                  <Card key={product.title} className="group hover:border-primary/50 transition-all flex flex-col">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <product.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-sm">{product.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Keuntungan:</span>
                          <ul className="mt-1 space-y-1">
                            {product.benefits.map((benefit) => (
                              <li key={benefit} className="text-xs flex items-center gap-1">
                                <span className="text-green-500">✓</span> {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t">
                          <span className="text-xs font-medium text-muted-foreground">Cocok untuk:</span>
                          <p className="text-xs mt-1 text-primary">{product.suitableFor}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Min. Saldo:</span>
                          <p className="font-medium">{product.minBalance}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Biaya Admin:</span>
                          <p className="font-medium">{product.adminFee}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculators Tab */}
        <TabsContent value="calculators" className="space-y-4">
          <BankingCalculators />
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <BankComparison />
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <BankingKnowledge />
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <BankingTools />
        </TabsContent>

        {/* Premium Features Tab */}
        <TabsContent value="premium" className="space-y-4">
          <AdvancedBanking />
        </TabsContent>
      </Tabs>
    </div>
  );
}
