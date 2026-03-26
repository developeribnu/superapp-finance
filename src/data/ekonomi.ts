// ============================================================
// DATA LENGKAP EKONOMI - Sumber Belajar Ekonomi All-in-One
// ============================================================

// ---- MATERI EKONOMI ----
export interface Materi {
  id: string;
  kategori: string;
  judul: string;
  ringkasan: string;
  konten: string;
  poinPenting: string[];
  tags: string[];
}

export const materiEkonomi: Materi[] = [
  // === EKONOMI MIKRO ===
  {
    id: "mikro-penawaran-permintaan",
    kategori: "Ekonomi Mikro",
    judul: "Hukum Penawaran dan Permintaan",
    ringkasan: "Fondasi utama ekonomi mikro yang menjelaskan bagaimana harga dan kuantitas ditentukan di pasar.",
    konten: `Hukum permintaan menyatakan bahwa semakin tinggi harga suatu barang, semakin sedikit jumlah barang yang diminta (ceteris paribus). Sebaliknya, hukum penawaran menyatakan bahwa semakin tinggi harga, semakin banyak jumlah barang yang ditawarkan.

Titik keseimbangan (equilibrium) terjadi ketika jumlah yang diminta sama dengan jumlah yang ditawarkan. Pada titik ini, harga pasar terbentuk secara natural.

Faktor yang mempengaruhi permintaan: pendapatan konsumen, harga barang substitusi/komplementer, selera, ekspektasi harga masa depan, dan jumlah konsumen.

Faktor yang mempengaruhi penawaran: biaya produksi, teknologi, harga input, ekspektasi, jumlah produsen, dan kebijakan pemerintah.

Elastisitas harga permintaan mengukur seberapa responsif perubahan jumlah barang yang diminta terhadap perubahan harga. Jika Ed > 1 (elastis), Ed < 1 (inelastis), Ed = 1 (unitary).`,
    poinPenting: [
      "Harga naik → permintaan turun (ceteris paribus)",
      "Harga naik → penawaran naik (ceteris paribus)",
      "Equilibrium = titik temu kurva S dan D",
      "Elastisitas mengukur sensitivitas perubahan",
      "Surplus terjadi ketika harga di atas equilibrium",
      "Shortage terjadi ketika harga di bawah equilibrium"
    ],
    tags: ["mikro", "supply", "demand", "equilibrium", "elastisitas"]
  },
  {
    id: "mikro-struktur-pasar",
    kategori: "Ekonomi Mikro",
    judul: "Struktur Pasar",
    ringkasan: "Berbagai bentuk pasar dari persaingan sempurna hingga monopoli dan bagaimana mereka mempengaruhi harga serta output.",
    konten: `Struktur pasar menggambarkan karakteristik organisasi pasar yang mempengaruhi perilaku dan kinerja perusahaan.

1. PERSAINGAN SEMPURNA: Banyak penjual dan pembeli, produk homogen, bebas keluar masuk, informasi sempurna. Contoh: pasar beras di tingkat petani. P = MC = MR pada keseimbangan jangka panjang.

2. MONOPOLI: Satu penjual menguasai pasar, tidak ada substitusi dekat, barrier to entry tinggi. Contoh: PLN di Indonesia. Monopolis adalah price maker, MR < P, dan dapat menghasilkan deadweight loss.

3. OLIGOPOLI: Beberapa perusahaan besar mendominasi pasar, produk bisa homogen atau terdiferensiasi, barrier to entry ada. Contoh: industri telekomunikasi. Game theory sering digunakan untuk menganalisis perilaku strategis. Teori Nash Equilibrium menjelaskan mengapa perusahaan oligopoli cenderung tidak menurunkan harga.

4. PERSAINGAN MONOPOLISTIK: Banyak penjual, produk terdiferensiasi, bebas keluar masuk. Contoh: restoran, pakaian. Keuntungan normal dalam jangka panjang karena free entry.`,
    poinPenting: [
      "Persaingan sempurna: P = MC, efisiensi alokatif tercapai",
      "Monopoli: price maker, deadweight loss, perlu regulasi",
      "Oligopoli: interdependensi, game theory, Nash equilibrium",
      "Monopolistik: diferensiasi produk, iklan penting",
      "Semakin sedikit pemain → semakin besar market power",
      "Barrier to entry menentukan jumlah pemain di pasar"
    ],
    tags: ["mikro", "pasar", "monopoli", "oligopoli", "persaingan"]
  },
  {
    id: "mikro-teori-produksi",
    kategori: "Ekonomi Mikro",
    judul: "Teori Produksi dan Biaya",
    ringkasan: "Bagaimana perusahaan mengoptimalkan produksi dan memahami struktur biaya untuk memaksimalkan profit.",
    konten: `Teori produksi menjelaskan hubungan antara input (faktor produksi) dan output (barang/jasa).

FUNGSI PRODUKSI: Q = f(L, K) dimana L = tenaga kerja, K = kapital.
- Produk Marginal (MP): tambahan output dari satu unit input tambahan
- Produk Rata-rata (AP): total output dibagi total input
- Law of Diminishing Marginal Returns: setelah titik tertentu, MP akan menurun

BIAYA PRODUKSI:
- Fixed Cost (FC): biaya tetap (sewa gedung, gaji manajer)
- Variable Cost (VC): biaya berubah (bahan baku, upah buruh)
- Total Cost (TC) = FC + VC
- Average Total Cost (ATC) = TC/Q
- Marginal Cost (MC) = ΔTC/ΔQ

ECONOMIES OF SCALE: biaya rata-rata turun saat produksi naik karena efisiensi, spesialisasi, dan purchasing power. Diseconomies terjadi saat skala terlalu besar.

KEPUTUSAN OPTIMAL: Produksi optimal di mana MC = MR. Jika P > ATC → laba. Jika AVC < P < ATC → rugi tapi tetap produksi jangka pendek. Jika P < AVC → tutup.`,
    poinPenting: [
      "Law of Diminishing Marginal Returns berlaku setelah titik tertentu",
      "TC = FC + VC; perusahaan harus memahami struktur biaya",
      "MC = MR adalah kondisi profit maximization",
      "Economies of scale menurunkan ATC seiring kenaikan output",
      "Shutdown point: P < AVC",
      "Breakeven point: P = ATC"
    ],
    tags: ["mikro", "produksi", "biaya", "profit", "marginal"]
  },
  {
    id: "mikro-perilaku-konsumen",
    kategori: "Ekonomi Mikro",
    judul: "Teori Perilaku Konsumen",
    ringkasan: "Bagaimana konsumen membuat keputusan untuk memaksimalkan kepuasan (utilitas) dengan anggaran terbatas.",
    konten: `Teori perilaku konsumen menjelaskan bagaimana individu mengalokasikan pendapatan terbatas mereka di antara berbagai barang dan jasa.

TEORI UTILITAS KARDINAL (Alfred Marshall):
- Utilitas dapat diukur secara numerik (utils)
- Law of Diminishing Marginal Utility: kepuasan tambahan menurun
- Keseimbangan: MUx/Px = MUy/Py = ... = MUn/Pn

TEORI UTILITAS ORDINAL (Hicks & Allen):
- Utilitas hanya bisa diranking, bukan diukur
- Menggunakan kurva indiferen (indifference curve)
- Budget constraint: PxX + PyY = M
- Keseimbangan: MRS = Px/Py (titik singgung IC dengan budget line)

EFEK SUBSTITUSI & EFEK PENDAPATAN:
- Efek substitusi: perubahan konsumsi karena perubahan harga relatif
- Efek pendapatan: perubahan konsumsi karena perubahan daya beli riil
- Barang Giffen: efek pendapatan > efek substitusi (sangat jarang)

BEHAVIORAL ECONOMICS:
- Bounded rationality (Herbert Simon)
- Loss aversion: kerugian terasa 2x lebih berat dari keuntungan
- Anchoring, framing effect, status quo bias`,
    poinPenting: [
      "Konsumen memaksimalkan utilitas dengan anggaran terbatas",
      "Diminishing marginal utility: semakin banyak konsumsi, semakin sedikit tambahan kepuasan",
      "MRS = rasio harga pada titik optimal",
      "Efek substitusi dan pendapatan menjelaskan kurva permintaan",
      "Behavioral economics menunjukkan bahwa manusia tidak selalu rasional",
      "Loss aversion mempengaruhi keputusan ekonomi sehari-hari"
    ],
    tags: ["mikro", "konsumen", "utilitas", "indiferen", "behavioral"]
  },
  // === EKONOMI MAKRO ===
  {
    id: "makro-gdp-pertumbuhan",
    kategori: "Ekonomi Makro",
    judul: "GDP dan Pertumbuhan Ekonomi",
    ringkasan: "Pengukuran output nasional dan faktor-faktor yang mendorong pertumbuhan ekonomi suatu negara.",
    konten: `GDP (Gross Domestic Product) adalah nilai total barang dan jasa final yang diproduksi dalam suatu negara selama periode tertentu.

METODE PENGHITUNGAN GDP:
1. Pendekatan Pengeluaran: GDP = C + I + G + (X - M)
   - C = konsumsi rumah tangga (~57% GDP Indonesia)
   - I = investasi (pembentukan modal tetap bruto)
   - G = pengeluaran pemerintah
   - X-M = ekspor neto

2. Pendekatan Pendapatan: GDP = upah + sewa + bunga + laba

3. Pendekatan Produksi: GDP = Σ Nilai Tambah setiap sektor

GDP NOMINAL vs RIIL:
- GDP Nominal: dihitung dengan harga berlaku
- GDP Riil: dihitung dengan harga konstan (menghilangkan efek inflasi)
- GDP Deflator = (GDP Nominal / GDP Riil) × 100

PERTUMBUHAN EKONOMI ditentukan oleh:
- Akumulasi kapital (investasi fisik dan manusia)
- Pertumbuhan tenaga kerja dan produktivitas
- Kemajuan teknologi (TFP - Total Factor Productivity)
- Model Solow: Y = A × F(K, L), dimana pertumbuhan jangka panjang bergantung pada kemajuan teknologi
- Model pertumbuhan endogen (Romer, Lucas): pengetahuan dan inovasi sebagai engine of growth`,
    poinPenting: [
      "GDP = C + I + G + (X-M) adalah identitas fundamental",
      "GDP riil menghilangkan efek inflasi untuk perbandingan antar waktu",
      "GDP per kapita lebih baik mengukur kesejahteraan dibanding GDP total",
      "Model Solow: pertumbuhan jangka panjang dari teknologi",
      "Human capital dan inovasi mendorong pertumbuhan endogen",
      "GDP memiliki keterbatasan: tidak mengukur distribusi, lingkungan, kesejahteraan"
    ],
    tags: ["makro", "gdp", "pertumbuhan", "solow", "pendapatan-nasional"]
  },
  {
    id: "makro-inflasi-pengangguran",
    kategori: "Ekonomi Makro",
    judul: "Inflasi dan Pengangguran",
    ringkasan: "Dua masalah makroekonomi utama: kenaikan harga umum dan ketidakmampuan pasar tenaga kerja menyerap seluruh angkatan kerja.",
    konten: `INFLASI adalah kenaikan tingkat harga umum secara terus-menerus.

JENIS INFLASI:
- Demand-pull: kelebihan permintaan agregat
- Cost-push: kenaikan biaya produksi (BBM, upah)
- Built-in: ekspektasi inflasi yang self-fulfilling

PENGUKURAN: CPI (Consumer Price Index), GDP Deflator, PPI
- Inflasi = ((CPI_t - CPI_{t-1}) / CPI_{t-1}) × 100%

DAMPAK INFLASI:
- Menurunkan daya beli (terutama yang berpendapatan tetap)
- Ketidakpastian bisnis menurunkan investasi
- Redistribusi dari kreditur ke debitur
- Hiperinflasi menghancurkan ekonomi (Zimbabwe, Venezuela)

PENGANGGURAN:
- Friksional: transisi pekerjaan (natural, sehat)
- Struktural: mismatch skill dan kebutuhan pasar
- Siklikal: karena resesi/kontraksi ekonomi
- Natural rate of unemployment = friksional + struktural (~4-5%)

KURVA PHILLIPS:
- Trade-off jangka pendek antara inflasi dan pengangguran
- Jangka panjang: kurva Phillips vertikal pada natural rate
- Friedman & Phelps: expectations-augmented Phillips curve
- Stagflasi (1970s) menantang Phillips curve tradisional`,
    poinPenting: [
      "Inflasi moderat (2-3%) dianggap sehat untuk ekonomi",
      "Hiperinflasi menghancurkan kepercayaan pada mata uang",
      "Pengangguran natural selalu ada (friksional + struktural)",
      "Kurva Phillips: trade-off inflasi-pengangguran jangka pendek",
      "Ekspektasi inflasi mempengaruhi inflasi aktual",
      "Target inflasi Bank Indonesia: 2.5% ± 1%"
    ],
    tags: ["makro", "inflasi", "pengangguran", "phillips", "cpi"]
  },
  {
    id: "makro-kebijakan-fiskal",
    kategori: "Ekonomi Makro",
    judul: "Kebijakan Fiskal",
    ringkasan: "Penggunaan pengeluaran pemerintah dan perpajakan untuk mempengaruhi kondisi ekonomi makro.",
    konten: `Kebijakan fiskal adalah instrumen pemerintah melalui pengeluaran (G) dan pajak (T) untuk menstabilkan ekonomi.

JENIS KEBIJAKAN FISKAL:
- Ekspansif: meningkatkan G atau menurunkan T → meningkatkan AD → GDP naik
- Kontraktif: menurunkan G atau meningkatkan T → menurunkan AD → mengendalikan inflasi

MULTIPLIER EFFECT:
- Fiscal multiplier = 1 / (1 - MPC) dimana MPC = Marginal Propensity to Consume
- Jika MPC = 0.8, multiplier = 5 → setiap Rp1 spending pemerintah meningkatkan GDP Rp5
- Tax multiplier = -MPC / (1 - MPC), lebih kecil dari spending multiplier
- Balanced budget multiplier = 1

AUTOMATIC STABILIZERS:
- Progressive income tax: otomatis menaikkan pajak saat boom
- Unemployment insurance: otomatis meningkatkan spending saat resesi
- Mengurangi volatilitas siklus bisnis tanpa keputusan kebijakan aktif

TANTANGAN:
- Time lag: recognition, decision, implementation, impact lag
- Crowding out: pinjaman pemerintah menaikkan suku bunga → investasi swasta turun
- Ricardian equivalence: konsumen menabung karena ekspektasi pajak masa depan
- Defisit dan utang publik: debt-to-GDP ratio Indonesia ~40%

APBN INDONESIA:
- Penerimaan: pajak (PPh, PPN, cukai) + PNBP
- Belanja: kementerian, transfer daerah, subsidi, bunga utang
- Pembiayaan: SBN, pinjaman`,
    poinPenting: [
      "Fiskal ekspansif saat resesi, kontraktif saat overheating",
      "Multiplier effect memperbesar dampak belanja pemerintah",
      "Automatic stabilizer bekerja tanpa keputusan kebijakan",
      "Crowding out membatasi efektivitas kebijakan fiskal",
      "Time lag membuat timing kebijakan sulit",
      "Kesinambungan fiskal: debt-to-GDP harus terjaga"
    ],
    tags: ["makro", "fiskal", "pajak", "apbn", "multiplier"]
  },
  {
    id: "makro-kebijakan-moneter",
    kategori: "Ekonomi Makro",
    judul: "Kebijakan Moneter",
    ringkasan: "Peran bank sentral dalam mengendalikan jumlah uang beredar dan suku bunga untuk stabilitas ekonomi.",
    konten: `Kebijakan moneter dijalankan oleh bank sentral (Bank Indonesia) untuk mencapai stabilitas harga dan mendukung pertumbuhan ekonomi.

INSTRUMEN KEBIJAKAN MONETER:
1. Suku bunga acuan (BI-7 Day Reverse Repo Rate)
2. Operasi pasar terbuka (jual-beli SBN)
3. Giro Wajib Minimum (reserve requirement)
4. Discount rate (fasilitas pinjaman ke bank)

MEKANISME TRANSMISI:
Suku bunga BI turun → suku bunga bank turun → kredit naik → investasi & konsumsi naik → AD naik → GDP naik (dengan lag 4-8 kuartal)

Jalur transmisi: suku bunga, kredit, harga aset, nilai tukar, ekspektasi

TEORI MONETER:
- Quantity Theory of Money: MV = PY (Fisher)
- Jika V konstan, kenaikan M proporsional dengan kenaikan PY
- Keynesian: liquidity preference → permintaan uang untuk transaksi, berjaga-jaga, spekulasi
- Monetarism (Friedman): inflasi selalu dan di mana saja merupakan fenomena moneter

INFLATION TARGETING FRAMEWORK (ITF):
- Bank Indonesia menerapkan ITF sejak 2005
- Target inflasi diumumkan ke publik
- Suku bunga sebagai instrumen utama
- Transparansi dan akuntabilitas
- Forward-looking approach

QUANTITATIVE EASING (QE):
- Pembelian aset besar-besaran saat suku bunga mendekati 0%
- Dilakukan The Fed, ECB, BOJ setelah krisis 2008 dan COVID-19
- Meningkatkan likuiditas dan menurunkan yield obligasi`,
    poinPenting: [
      "BI-7DRR adalah suku bunga acuan utama Indonesia",
      "Transmisi moneter memerlukan waktu 4-8 kuartal",
      "MV = PY: hubungan uang beredar, kecepatan, harga, dan output",
      "ITF menargetkan inflasi dengan transparansi",
      "Zero lower bound membatasi efektivitas kebijakan moneter konvensional",
      "QE adalah instrumen non-konvensional saat suku bunga sudah sangat rendah"
    ],
    tags: ["makro", "moneter", "bank-sentral", "suku-bunga", "inflasi"]
  },
  // === EKONOMI INTERNASIONAL ===
  {
    id: "internasional-perdagangan",
    kategori: "Ekonomi Internasional",
    judul: "Teori Perdagangan Internasional",
    ringkasan: "Mengapa negara-negara berdagang dan bagaimana perdagangan meningkatkan kesejahteraan global.",
    konten: `Perdagangan internasional memungkinkan negara untuk mengonsumsi di luar batas kemampuan produksinya.

TEORI KEUNGGULAN ABSOLUT (Adam Smith):
- Negara mengekspor barang yang diproduksi lebih efisien
- Perdagangan menguntungkan jika masing-masing punya keunggulan absolut

TEORI KEUNGGULAN KOMPARATIF (David Ricardo):
- Bahkan jika satu negara lebih efisien di semua barang, perdagangan tetap menguntungkan
- Negara fokus pada barang dengan opportunity cost terendah
- Contoh: Indonesia punya comparative advantage di CPO dan karet

HECKSCHER-OHLIN MODEL:
- Negara mengekspor barang yang menggunakan faktor produksi melimpah secara intensif
- Indonesia (labor abundant) → ekspor garmen, alas kaki
- Jepang (capital abundant) → ekspor mobil, elektronik

NEW TRADE THEORY (Krugman):
- Economies of scale dan first-mover advantage
- Intra-industry trade: negara maju saling berdagang barang serupa
- Network effects dan learning by doing

KEBIJAKAN PERDAGANGAN:
- Free trade vs proteksionisme
- Tarif, kuota, subsidi ekspor, dumping
- WTO sebagai arbitrase perdagangan global
- FTA: AFTA, RCEP, CPTPP
- Terms of Trade = (indeks harga ekspor / indeks harga impor) × 100`,
    poinPenting: [
      "Comparative advantage: dasar perdagangan internasional",
      "Heckscher-Ohlin: faktor endowment menentukan pola perdagangan",
      "New trade theory: economies of scale dan first-mover matter",
      "Proteksionisme mengurangi total kesejahteraan dunia",
      "Indonesia aktif di ASEAN, RCEP, dan negosiasi FTA lainnya",
      "Terms of trade mempengaruhi neraca perdagangan"
    ],
    tags: ["internasional", "perdagangan", "komparatif", "tarif", "wto"]
  },
  {
    id: "internasional-keuangan",
    kategori: "Ekonomi Internasional",
    judul: "Sistem Keuangan Internasional",
    ringkasan: "Neraca pembayaran, nilai tukar, dan sistem keuangan global yang menghubungkan ekonomi dunia.",
    konten: `Sistem keuangan internasional mengatur aliran uang dan modal antar negara.

NERACA PEMBAYARAN (Balance of Payments):
- Current Account: perdagangan barang, jasa, pendapatan primer & sekunder
- Capital Account: transfer modal
- Financial Account: investasi langsung (FDI), portfolio, dan lainnya
- BOP selalu seimbang secara akuntansi (double-entry)

NILAI TUKAR:
- Sistem mengambang (floating): ditentukan pasar (USD, EUR)
- Sistem tetap (fixed): dipatok ke mata uang lain
- Managed float: BI melakukan intervensi untuk stabilitas (Indonesia)

TEORI NILAI TUKAR:
- Purchasing Power Parity (PPP): harga barang identik harus sama di semua negara
- Interest Rate Parity: perbedaan suku bunga = ekspektasi depresiasi
- Mundell-Fleming (IS-LM-BP): kebijakan ekonomi dalam ekonomi terbuka

KRISIS KEUANGAN INTERNASIONAL:
- Asian Financial Crisis 1997-98: capital flight, depresiasi rupiah dari 2,500 ke 16,000/USD
- Global Financial Crisis 2008: subprime mortgage, Lehman Brothers
- COVID-19 Economic Crisis 2020: supply & demand shock simultan

INSTITUSI INTERNASIONAL:
- IMF: stabilitas keuangan, pinjaman darurat
- World Bank: pembangunan ekonomi, pengentasan kemiskinan
- BIS: bank sentral dari bank sentral`,
    poinPenting: [
      "BOP: current account + capital/financial account = 0",
      "Indonesia menggunakan sistem managed floating exchange rate",
      "PPP menjelaskan nilai tukar jangka panjang",
      "Interest rate parity menghubungkan suku bunga dan nilai tukar",
      "Krisis 1997-98: pelajaran tentang bahaya hot money dan fixed exchange rate",
      "IMF sebagai lender of last resort internasional"
    ],
    tags: ["internasional", "nilai-tukar", "bop", "imf", "krisis"]
  },
  // === EKONOMI PEMBANGUNAN ===
  {
    id: "pembangunan-teori",
    kategori: "Ekonomi Pembangunan",
    judul: "Teori Pembangunan Ekonomi",
    ringkasan: "Bagaimana negara berkembang bertransformasi dari ekonomi agraris menjadi ekonomi modern.",
    konten: `Ekonomi pembangunan mempelajari transformasi struktural negara berkembang.

TEORI MODERNISASI (Rostow):
Lima tahapan pertumbuhan:
1. Masyarakat tradisional
2. Prakondisi tinggal landas
3. Tinggal landas (take-off)
4. Menuju kedewasaan
5. Konsumsi massa tinggi
Indonesia berada di tahap 3-4.

STRUCTURAL CHANGE (Lewis):
- Ekonomi dual: sektor tradisional (surplus labor) + sektor modern
- Industrialisasi menyerap tenaga kerja dari pertanian
- Lewis turning point: upah mulai naik saat surplus labor habis

DEPENDENCY THEORY:
- Negara berkembang (periphery) dieksploitasi oleh negara maju (core)
- Terms of trade memburuk untuk komoditas primer
- Import substitution industrialization (ISI) sebagai respons

INSTITUTIONAL ECONOMICS (Acemoglu, North):
- Institusi inklusif → prosperity
- Institusi ekstraktif → kemiskinan
- "Why Nations Fail": geography bukan takdir, institusi menentukan

SUSTAINABLE DEVELOPMENT:
- MDGs → SDGs (17 goals untuk 2030)
- Triple bottom line: people, planet, profit
- Green economy dan circular economy
- Indonesia: economic transformation agenda 2045 (Indonesia Emas)`,
    poinPenting: [
      "Rostow: pembangunan melalui 5 tahapan",
      "Lewis: surplus labor pertanian → industrialisasi",
      "Institusi yang baik kunci pembangunan ekonomi",
      "SDGs: agenda pembangunan berkelanjutan global",
      "Indonesia menuju 2045: target negara maju",
      "Human Development Index (HDI) mengukur pembangunan lebih holistik"
    ],
    tags: ["pembangunan", "rostow", "lewis", "sdgs", "institusi"]
  },
  // === EKONOMI KEUANGAN ===
  {
    id: "keuangan-pasar-modal",
    kategori: "Ekonomi Keuangan",
    judul: "Pasar Modal dan Investasi",
    ringkasan: "Bagaimana pasar modal bekerja, instrumen investasi, dan teori portofolio modern.",
    konten: `Pasar modal adalah tempat bertemunya pihak yang membutuhkan dana (emiten) dan yang memiliki dana (investor).

INSTRUMEN PASAR MODAL:
- Saham: kepemilikan perusahaan, dividen, capital gain
- Obligasi: surat utang, kupon tetap/variabel, jatuh tempo
- Reksa Dana: pooling dana investor, dikelola manajer investasi
- Derivatif: futures, options, swaps (untuk hedging/spekulasi)

VALUASI SAHAM:
- Fundamental: P/E ratio, PBV, DCF (Discounted Cash Flow)
- DCF: V = Σ CF_t / (1+r)^t
- Dividend Discount Model: P = D1 / (r - g)

TEORI PORTOFOLIO (Markowitz):
- Diversifikasi mengurangi risiko non-sistematis
- Efficient frontier: portofolio optimal risk-return
- Risk = systematic (beta) + unsystematic (diversifiable)

CAPM (Capital Asset Pricing Model):
E(Ri) = Rf + βi × (E(Rm) - Rf)
- Rf = risk-free rate (SBI)
- β = sensitivitas return aset terhadap pasar
- Market risk premium = E(Rm) - Rf

EFFICIENT MARKET HYPOTHESIS (Fama):
- Weak form: harga reflect historical info
- Semi-strong: harga reflect all public info
- Strong: harga reflect all info (termasuk insider)

BEI (Bursa Efek Indonesia):
- IHSG sebagai indeks komposit
- LQ45, IDX30 sebagai indeks blue chip
- OJK sebagai regulator`,
    poinPenting: [
      "Diversifikasi: jangan taruh telur dalam satu keranjang",
      "CAPM: expected return = risk-free + beta × market premium",
      "Efficient Market Hypothesis: pasar sudah merefleksikan informasi",
      "Fundamental analysis: valuasi berdasarkan kinerja perusahaan",
      "Risk & return tradeoff: return tinggi = risiko tinggi",
      "BEI tumbuh signifikan dengan investor ritel muda"
    ],
    tags: ["keuangan", "saham", "obligasi", "capm", "portofolio"]
  },
  // === EKONOMI DIGITAL ===
  {
    id: "digital-ekonomi",
    kategori: "Ekonomi Digital",
    judul: "Ekonomi Digital dan Fintech",
    ringkasan: "Transformasi ekonomi melalui teknologi digital, dari e-commerce hingga cryptocurrency.",
    konten: `Ekonomi digital mengubah fundamental cara ekonomi bekerja.

E-COMMERCE & PLATFORM ECONOMY:
- Marketplace: Tokopedia, Shopee, Bukalapak
- Network effects: nilai platform naik seiring jumlah pengguna
- Winner-takes-all dynamics
- GMV (Gross Merchandise Value) e-commerce Indonesia: $80+ billion

FINTECH (Financial Technology):
- Payment: GoPay, OVO, Dana, ShopeePay
- P2P Lending: Akulaku, Kredivo, Modalku
- Insurtech, Wealthtech, Regtech
- Financial inclusion: menjangkau unbanked population

CRYPTOCURRENCY & BLOCKCHAIN:
- Bitcoin: decentralized digital currency
- Blockchain: distributed ledger technology
- DeFi (Decentralized Finance): lending, DEX, yield farming
- CBDC (Central Bank Digital Currency): Rupiah Digital oleh BI

GIG ECONOMY:
- Platform-based work: Gojek, Grab drivers
- Freelancing global: Upwork, Fiverr
- Tantangan: regulasi, perlindungan pekerja, benefit

DATA ECONOMY:
- Data sebagai "new oil"
- AI dan machine learning dalam prediksi ekonomi
- Privacy vs innovation trade-off
- Regulasi: UU PDP (Perlindungan Data Pribadi)`,
    poinPenting: [
      "Network effects menciptakan monopoli natural di platform digital",
      "Fintech meningkatkan financial inclusion",
      "Cryptocurrency: inovasi atau spekulasi?",
      "Gig economy mengubah konsep ketenagakerjaan tradisional",
      "Data economy: regulasi harus seimbang antara inovasi dan privasi",
      "Indonesia: salah satu pasar digital terbesar di Asia Tenggara"
    ],
    tags: ["digital", "fintech", "blockchain", "ecommerce", "platform"]
  }
];

// ---- CASE STUDIES ----
export interface CaseStudy {
  id: string;
  judul: string;
  kategori: string;
  tahun: string;
  negara: string;
  ringkasan: string;
  latar: string;
  kronologi: string;
  dampak: string;
  pelajaran: string[];
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-krisis-asia-1997",
    judul: "Krisis Finansial Asia 1997-1998",
    kategori: "Krisis Keuangan",
    tahun: "1997-1998",
    negara: "Asia Tenggara, Korea Selatan",
    ringkasan: "Krisis mata uang yang bermula dari Thailand dan menyebar ke seluruh Asia, menghancurkan ekonomi Indonesia dan mengakhiri era Orde Baru.",
    latar: `Sebelum krisis, negara-negara Asia Tenggara mengalami pertumbuhan ekonomi tinggi ("Asian Miracle"). Indonesia tumbuh 7-8% per tahun selama 3 dekade. Namun, terdapat kerentanan struktural: nilai tukar tetap/semi-tetap, utang luar negeri swasta besar (tanpa hedging), sektor perbankan lemah (NPL tinggi, connected lending), dan crony capitalism.`,
    kronologi: `Juli 1997: Thailand melepas peg Baht → Baht jatuh 20%. Contagion menyebar ke Indonesia, Malaysia, Korea Selatan.

Agustus 1997: Rupiah mulai terdepresiasi. BI melepas band intervensi.

Oktober 1997: Indonesia meminta bantuan IMF. Letter of Intent ditandatangani dengan syarat reformasi ketat.

Januari 1998: Rupiah jatuh ke 16,000/USD (dari 2,500). Bank run massal. 16 bank ditutup. Kepanikan publik.

Mei 1998: Kerusuhan sosial. Soeharto mengundurkan diri setelah 32 tahun berkuasa.

1999-2003: Proses pemulihan bertahap. BPPN menangani restrukturisasi perbankan. Biaya rekapitalisasi ~Rp650 triliun (50% GDP).`,
    dampak: `- GDP Indonesia kontraksi -13.1% di 1998
- Kemiskinan naik dari 11% ke 24%
- Inflasi mencapai 77%
- Sektor riil hancur, banyak perusahaan bangkrut
- Reformasi politik: demokrasi, desentralisasi
- Restrukturisasi sektor perbankan total`,
    pelajaran: [
      "Fixed exchange rate rentan terhadap speculative attack",
      "Utang luar negeri tanpa hedging adalah risiko besar",
      "Moral hazard dari connected lending dan crony capitalism",
      "Pentingnya cadangan devisa dan stabilitas sektor perbankan",
      "IMF conditionality bisa memperburuk krisis (pro-cyclical)",
      "Krisis ekonomi dapat memicu perubahan politik fundamental"
    ],
    tags: ["krisis", "asia", "indonesia", "imf", "mata-uang"]
  },
  {
    id: "cs-krisis-global-2008",
    judul: "Global Financial Crisis 2008",
    kategori: "Krisis Keuangan",
    tahun: "2007-2009",
    negara: "Global (bermula dari AS)",
    ringkasan: "Krisis keuangan global terparah sejak Great Depression, dipicu oleh bubble pasar properti AS dan inovasi keuangan yang tidak terkendali.",
    latar: `Awal 2000-an, suku bunga rendah dan deregulasi mendorong pemberian mortgage kepada peminjam berisiko tinggi (subprime). Bank mengemas mortgage ini menjadi Mortgage-Backed Securities (MBS) dan Collateralized Debt Obligations (CDO). Rating agency memberikan AAA rating pada instrumen berisiko. Credit Default Swaps (CDS) menciptakan jaringan risiko yang saling terhubung.`,
    kronologi: `2006: Harga rumah AS mulai turun setelah bertahun-tahun naik. Default mortgage subprime meningkat.

2007: Bear Stearns hedge fund kolaps. BNP Paribas membekukan redemption fund. Likuiditas mengering.

September 2008: Lehman Brothers bangkrut (utang $600 miliar). AIG di-bailout ($185 miliar). Merrill Lynch dijual ke Bank of America. Credit markets freeze.

Oktober 2008: TARP (Troubled Asset Relief Program) $700 miliar disetujui Congress. Bank sentral global berkoordinasi potong suku bunga.

2009: Resesi global. AS kehilangan 8.7 juta pekerjaan. GDP dunia kontraksi.

2009-2015: Recovery bertahap. QE1, QE2, QE3. Dodd-Frank Act reformasi regulasi keuangan.`,
    dampak: `- GDP global kontraksi 2009
- Pengangguran AS mencapai 10%
- Wealth destruction: $11 triliun dari US households
- Sovereign debt crisis di Eropa (PIIGS)
- Kebijakan moneter non-konvensional (QE)
- Reformasi regulasi keuangan global (Basel III)`,
    pelajaran: [
      "Too big to fail menciptakan moral hazard",
      "Inovasi keuangan tanpa regulasi berbahaya",
      "Interconnectedness sistem keuangan amplifikasi risiko",
      "Rating agency memiliki conflict of interest",
      "Regulasi harus mengikuti perkembangan industri",
      "Pentingnya macroprudential regulation"
    ],
    tags: ["krisis", "global", "subprime", "lehman", "bailout"]
  },
  {
    id: "cs-hiperinflasi-zimbabwe",
    judul: "Hiperinflasi Zimbabwe",
    kategori: "Kebijakan Moneter",
    tahun: "2007-2009",
    negara: "Zimbabwe",
    ringkasan: "Salah satu kasus hiperinflasi terparah dalam sejarah, di mana inflasi mencapai 79.6 miliar persen per bulan.",
    latar: `Zimbabwe pasca-kemerdekaan mengalami masalah struktural: land reform yang menghancurkan sektor pertanian (2000), keterlibatan dalam perang Congo yang mahal, sanksi internasional, dan korupsi. Pemerintah membiayai defisit fiskal dengan mencetak uang secara masif.`,
    kronologi: `2000: Land reform paksa. Produksi pertanian jatuh 50%.
2003: Inflasi mulai meningkat tajam (~600%)
2006: "Operation Sunrise" - redenominasi mata uang (potong 3 nol)
2007: Inflasi 66,000%. Kontrol harga gagal total.
2008: Inflasi mencapai 79.6 miliar persen per bulan (November). Uang kertas $100 triliun dicetak. Harga berlipat ganda setiap 24 jam.
2009: Zimbabwe dollar ditinggalkan. Dolarisasi (menggunakan USD dan ZAR).`,
    dampak: `- Kehancuran total sistem moneter
- GDP kontraksi kumulatif >50%
- Kemiskinan mencapai 80%+
- Brain drain masif
- Hancurnya kepercayaan terhadap institusi
- Transition ke multi-currency system`,
    pelajaran: [
      "Mencetak uang berlebihan selalu berakhir dengan inflasi",
      "Independensi bank sentral sangat krusial",
      "Kebijakan populis yang merusak produksi punya konsekuensi fatal",
      "Hiperinflasi menghancurkan tabungan dan kontrak sosial",
      "Kontrol harga bukan solusi, justru memperparah shortage",
      "Kepercayaan pada mata uang adalah fondasi sistem ekonomi"
    ],
    tags: ["hiperinflasi", "moneter", "zimbabwe", "mata-uang"]
  },
  {
    id: "cs-keajaiban-korea",
    judul: "Keajaiban Ekonomi Korea Selatan",
    kategori: "Pembangunan Ekonomi",
    tahun: "1960-2000",
    negara: "Korea Selatan",
    ringkasan: "Transformasi dari salah satu negara termiskin menjadi ekonomi maju dalam 40 tahun - 'Miracle on the Han River'.",
    latar: `Pasca Perang Korea (1953), Korea Selatan adalah salah satu negara termiskin dengan GDP per kapita ~$67 (lebih rendah dari banyak negara Afrika). Negara hancur oleh perang, sumber daya alam minim, populasi besar di lahan sempit.`,
    kronologi: `1960s: Park Chung-hee memulai industrialisasi berorientasi ekspor. Five-Year Plans. Chaebol (Samsung, Hyundai, LG) didukung pemerintah. Fokus pada industri ringan (tekstil, wig).

1970s: Heavy and Chemical Industrialization (HCI). Baja, petrokimia, kapal, elektronik. Investasi masif di pendidikan.

1980s: Demokratisasi. Liberalisasi ekonomi bertahap. Olympic 1988 Seoul. Semikonduktor dan otomotif menjadi unggulan.

1990s: Masuk OECD (1996). Krisis 1997 memaksa reformasi struktural. Chaebol reform, corporate governance improvement.

2000s-sekarang: Innovation economy. K-pop, Samsung, Hyundai sebagai global brand. GDP per kapita >$35,000.`,
    dampak: `- GDP per kapita: $67 (1953) → $35,000+ (sekarang)
- HDI: dari low ke very high
- Dari penerima bantuan menjadi donor (DAC OECD)
- Soft power global (Hallyu)
- Benchmark pembangunan untuk developing countries`,
    pelajaran: [
      "Export-oriented industrialization lebih efektif dari ISI",
      "Investasi di pendidikan dan human capital adalah kunci",
      "Peran aktif pemerintah (developmental state) bisa efektif",
      "Chaebol: efisien tapi rentan crony capitalism",
      "Krisis bisa menjadi momentum untuk reformasi",
      "Inovasi dan R&D menentukan daya saing jangka panjang"
    ],
    tags: ["pembangunan", "korea", "industrialisasi", "chaebol", "ekspor"]
  },
  {
    id: "cs-covid-ekonomi",
    judul: "Dampak Ekonomi Pandemi COVID-19",
    kategori: "Krisis Global",
    tahun: "2020-2023",
    negara: "Global",
    ringkasan: "Pandemi yang menyebabkan resesi global sinkron dan memaksa respons kebijakan fiskal-moneter terbesar dalam sejarah.",
    latar: `COVID-19 muncul di Wuhan, China akhir 2019 dan menyebar ke seluruh dunia. Lockdown dan pembatasan mobilitas menghentikan aktivitas ekonomi secara tiba-tiba. Ini merupakan simultaneous supply and demand shock yang belum pernah terjadi.`,
    kronologi: `Q1 2020: Virus menyebar global. Pasar saham crash (IHSG -38%, S&P500 -34%). Lockdown mulai diterapkan.

Q2 2020: Resesi global. GDP Indonesia -5.3% (YoY). Stimulus fiskal masif diluncurkan di seluruh dunia.

2020-2021: Program vaksinasi. PPKM di Indonesia. PEN (Pemulihan Ekonomi Nasional) ~Rp700 triliun. The Fed turunkan suku bunga ke 0% dan QE unlimited.

2022: Recovery. Supply chain disruption → inflasi global melonjak. The Fed naikkan suku bunga agresif. Indonesia pulih lebih cepat berkat komoditas.

2023: Normalisasi. Inflasi mulai mereda. Scarring effects masih terasa.`,
    dampak: `- GDP global kontraksi 3.1% (2020)
- 255 juta full-time equivalent jobs hilang global
- Utang pemerintah global naik ~$20 triliun
- Akselerasi digitalisasi 3-5 tahun
- K-shaped recovery: yang kaya makin kaya
- Inflasi global tertinggi dalam 40 tahun (2022)`,
    pelajaran: [
      "Black swan events memerlukan kesiapan fiskal (fiscal space)",
      "Koordinasi kebijakan fiskal-moneter penting dalam krisis",
      "Digitalisasi bukan opsional tapi keharusan",
      "Supply chain resilience lebih penting dari efisiensi murni",
      "Ketimpangan memburuk saat krisis",
      "Stimulus berlebihan bisa menciptakan masalah baru (inflasi)"
    ],
    tags: ["covid", "pandemi", "stimulus", "resesi", "digital"]
  },
  {
    id: "cs-ekonomi-china",
    judul: "Kebangkitan Ekonomi China",
    kategori: "Pembangunan Ekonomi",
    tahun: "1978-sekarang",
    negara: "China",
    ringkasan: "Transformasi ekonomi terbesar dalam sejarah: 800 juta orang terangkat dari kemiskinan dalam 40 tahun.",
    latar: `Setelah kematian Mao Zedong (1976) dan kegagalan Revolusi Kebudayaan, China berada di ambang kehancuran ekonomi. GDP per kapita hanya ~$200. Deng Xiaoping memulai reformasi ekonomi yang mengubah dunia.`,
    kronologi: `1978: "Reform and Opening Up". Household Responsibility System di pertanian. Produktivitas pertanian melonjak.

1980s: Special Economic Zones (Shenzhen). FDI mulai masuk. Township and Village Enterprises (TVEs).

1990s: "Socialist Market Economy". Reformasi BUMN. Shanghai Pudong development. Privatisasi bertahap.

2001: Masuk WTO. Menjadi "factory of the world". Ekspor meledak. FDI masif.

2010s: GDP terbesar kedua dunia. Belt and Road Initiative. Tech giants: Alibaba, Tencent, Huawei. Urbanisasi 60%+.

2020s: Middle income trap challenges. Evergrande crisis. Zero-COVID impact. US-China trade war. Technology self-reliance.`,
    dampak: `- GDP per kapita: $200 (1978) → $12,000+ (sekarang)
- 800 juta orang keluar dari kemiskinan
- Dari ekonomi agraris menjadi economic superpower
- Mengubah geopolitik dan ekonomi global
- Tantangan: aging population, debt, environment`,
    pelajaran: [
      "Gradual reform (gradualism) bisa lebih efektif dari shock therapy",
      "SEZ sebagai laboratorium kebijakan ekonomi",
      "Integrasi ke ekonomi global (WTO) akselerator pertumbuhan",
      "State capitalism: model alternatif pembangunan?",
      "Middle income trap: tantangan transisi ke high income",
      "Sustainability: pertumbuhan harus memperhatikan lingkungan"
    ],
    tags: ["china", "pembangunan", "reformasi", "industrialisasi", "wto"]
  }
];

// ---- GLOSARIUM ----
export interface GlosariumItem {
  istilah: string;
  definisi: string;
  kategori: string;
  contoh?: string;
}

export const glosarium: GlosariumItem[] = [
  { istilah: "GDP (Gross Domestic Product)", definisi: "Nilai total barang dan jasa final yang diproduksi dalam suatu negara selama periode tertentu.", kategori: "Makroekonomi", contoh: "GDP Indonesia 2023: ~Rp20,892 triliun" },
  { istilah: "Inflasi", definisi: "Kenaikan tingkat harga umum secara terus-menerus dalam suatu perekonomian.", kategori: "Makroekonomi", contoh: "Inflasi Indonesia 2023: ~2.6%" },
  { istilah: "Deflasi", definisi: "Penurunan tingkat harga umum secara terus-menerus. Bisa berbahaya karena menunda konsumsi.", kategori: "Makroekonomi", contoh: "Jepang mengalami deflasi berkepanjangan 1990s-2010s" },
  { istilah: "Suku Bunga", definisi: "Harga dari uang; biaya meminjam uang atau return dari menyimpan uang.", kategori: "Moneter", contoh: "BI-7DRR = 6.00% (contoh)" },
  { istilah: "Fiskal", definisi: "Berkaitan dengan pendapatan dan pengeluaran pemerintah (pajak dan belanja negara).", kategori: "Kebijakan Ekonomi" },
  { istilah: "Moneter", definisi: "Berkaitan dengan uang, perbankan, dan kebijakan bank sentral.", kategori: "Kebijakan Ekonomi" },
  { istilah: "Elastisitas", definisi: "Ukuran sensitivitas perubahan kuantitas terhadap perubahan harga atau faktor lainnya.", kategori: "Mikroekonomi", contoh: "Elastisitas harga permintaan bensin ≈ 0.3 (inelastis)" },
  { istilah: "Opportunity Cost", definisi: "Nilai dari alternatif terbaik yang dikorbankan ketika membuat pilihan.", kategori: "Dasar Ekonomi", contoh: "Kuliah 4 tahun: opportunity cost = gaji yang bisa diperoleh bekerja" },
  { istilah: "Comparative Advantage", definisi: "Kemampuan memproduksi barang dengan opportunity cost lebih rendah dibanding pihak lain.", kategori: "Perdagangan", contoh: "Indonesia memiliki comparative advantage di CPO dan nikel" },
  { istilah: "Externality", definisi: "Dampak aktivitas ekonomi terhadap pihak ketiga yang tidak terlibat dalam transaksi.", kategori: "Mikroekonomi", contoh: "Polusi pabrik (negative externality), vaksinasi (positive externality)" },
  { istilah: "Moral Hazard", definisi: "Kecenderungan mengambil risiko lebih besar karena tidak menanggung konsekuensi penuh.", kategori: "Keuangan", contoh: "Bank yang 'too big to fail' mengambil risiko berlebihan karena yakin di-bailout" },
  { istilah: "Adverse Selection", definisi: "Situasi dimana informasi asimetris menyebabkan pihak berisiko tinggi lebih mungkin bertransaksi.", kategori: "Keuangan", contoh: "Orang yang sakit lebih mungkin membeli asuransi kesehatan" },
  { istilah: "Multiplier Effect", definisi: "Efek pengganda di mana perubahan pengeluaran menghasilkan perubahan GDP yang lebih besar.", kategori: "Makroekonomi", contoh: "Spending multiplier = 1/(1-MPC). Jika MPC=0.8, multiplier=5" },
  { istilah: "Quantitative Easing (QE)", definisi: "Pembelian aset skala besar oleh bank sentral untuk meningkatkan likuiditas saat suku bunga sudah sangat rendah.", kategori: "Moneter", contoh: "The Fed melakukan QE unlimited saat COVID-19 (2020)" },
  { istilah: "Current Account", definisi: "Komponen neraca pembayaran yang mencatat perdagangan barang, jasa, dan transfer.", kategori: "Internasional" },
  { istilah: "Capital Flight", definisi: "Aliran modal keluar secara besar-besaran dari suatu negara akibat ketidakpastian.", kategori: "Internasional", contoh: "Indonesia 1997: capital flight masif memperparah krisis" },
  { istilah: "NPV (Net Present Value)", definisi: "Selisih antara present value arus kas masuk dan keluar. Proyek layak jika NPV > 0.", kategori: "Keuangan", contoh: "NPV = Σ CF_t/(1+r)^t - I₀" },
  { istilah: "ROI (Return on Investment)", definisi: "Rasio keuntungan terhadap biaya investasi, dinyatakan dalam persentase.", kategori: "Keuangan", contoh: "ROI = (Gain - Cost) / Cost × 100%" },
  { istilah: "Break Even Point", definisi: "Titik dimana total pendapatan sama dengan total biaya (laba = 0).", kategori: "Keuangan", contoh: "BEP unit = Fixed Cost / (Harga - Variable Cost per unit)" },
  { istilah: "Supply Chain", definisi: "Jaringan organisasi, aktivitas, dan sumber daya yang terlibat dalam produksi dan distribusi barang.", kategori: "Bisnis" },
  { istilah: "Recession", definisi: "Penurunan GDP riil selama dua kuartal berturut-turut atau lebih.", kategori: "Makroekonomi" },
  { istilah: "Stagflasi", definisi: "Kondisi ekonomi di mana terjadi inflasi tinggi bersamaan dengan pertumbuhan rendah dan pengangguran tinggi.", kategori: "Makroekonomi", contoh: "Krisis minyak 1970s menyebabkan stagflasi global" },
  { istilah: "Subsidi", definisi: "Bantuan finansial pemerintah untuk menurunkan harga atau mendukung produsen/konsumen tertentu.", kategori: "Kebijakan Ekonomi", contoh: "Subsidi BBM dan pupuk di Indonesia" },
  { istilah: "Tarif", definisi: "Pajak yang dikenakan pada barang impor untuk melindungi industri dalam negeri.", kategori: "Perdagangan" },
  { istilah: "Devaluasi", definisi: "Penurunan nilai mata uang secara resmi oleh pemerintah terhadap mata uang asing.", kategori: "Internasional" },
  { istilah: "Hedge / Hedging", definisi: "Strategi untuk mengurangi risiko kerugian dari fluktuasi harga, nilai tukar, atau suku bunga.", kategori: "Keuangan" },
  { istilah: "Likuiditas", definisi: "Kemudahan suatu aset dikonversi menjadi uang tunai tanpa kehilangan nilai signifikan.", kategori: "Keuangan" },
  { istilah: "Solvabilitas", definisi: "Kemampuan perusahaan/individu memenuhi kewajiban keuangan jangka panjang.", kategori: "Keuangan" },
  { istilah: "CAPM", definisi: "Capital Asset Pricing Model: model yang menghubungkan expected return dengan systematic risk (beta).", kategori: "Keuangan", contoh: "E(R) = Rf + β(Rm - Rf)" },
  { istilah: "Gini Coefficient", definisi: "Ukuran ketimpangan distribusi pendapatan (0 = sempurna merata, 1 = sempurna timpang).", kategori: "Pembangunan", contoh: "Gini Indonesia: ~0.38" }
];

// ---- QUIZ DATA ----
export interface QuizQuestion {
  id: string;
  kategori: string;
  pertanyaan: string;
  opsi: string[];
  jawabanBenar: number;
  penjelasan: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    kategori: "Ekonomi Mikro",
    pertanyaan: "Apa yang terjadi pada harga keseimbangan jika penawaran meningkat sementara permintaan tetap?",
    opsi: ["Harga naik", "Harga turun", "Harga tetap", "Tidak bisa ditentukan"],
    jawabanBenar: 1,
    penjelasan: "Ketika penawaran meningkat (kurva S bergeser ke kanan) dengan permintaan tetap, akan terjadi surplus pada harga lama sehingga harga turun hingga tercapai keseimbangan baru."
  },
  {
    id: "q2",
    kategori: "Ekonomi Makro",
    pertanyaan: "Komponen GDP menurut pendekatan pengeluaran adalah...",
    opsi: ["C + I + G + (X-M)", "C + S + T + (X-M)", "W + R + I + P", "GDP Nominal / CPI × 100"],
    jawabanBenar: 0,
    penjelasan: "GDP = Consumption + Investment + Government Spending + Net Exports (X-M). Ini adalah identitas fundamental makroekonomi."
  },
  {
    id: "q3",
    kategori: "Ekonomi Makro",
    pertanyaan: "Jika MPC (Marginal Propensity to Consume) = 0.75, berapa fiscal spending multiplier?",
    opsi: ["3", "4", "5", "0.75"],
    jawabanBenar: 1,
    penjelasan: "Fiscal multiplier = 1/(1-MPC) = 1/(1-0.75) = 1/0.25 = 4. Artinya setiap Rp1 belanja pemerintah meningkatkan GDP Rp4."
  },
  {
    id: "q4",
    kategori: "Ekonomi Mikro",
    pertanyaan: "Pada struktur pasar mana perusahaan adalah price taker?",
    opsi: ["Monopoli", "Oligopoli", "Persaingan sempurna", "Persaingan monopolistik"],
    jawabanBenar: 2,
    penjelasan: "Dalam persaingan sempurna, perusahaan sangat kecil relatif terhadap pasar sehingga tidak bisa mempengaruhi harga. Mereka menerima harga pasar (price taker)."
  },
  {
    id: "q5",
    kategori: "Kebijakan Moneter",
    pertanyaan: "Apa nama instrumen suku bunga acuan Bank Indonesia saat ini?",
    opsi: ["SBI Rate", "BI Rate", "BI-7 Day Reverse Repo Rate", "JIBOR"],
    jawabanBenar: 2,
    penjelasan: "Sejak 2016, BI menggunakan BI-7 Day Reverse Repo Rate (BI-7DRR) sebagai suku bunga acuan, menggantikan BI Rate karena lebih cepat mempengaruhi suku bunga pasar."
  },
  {
    id: "q6",
    kategori: "Perdagangan Internasional",
    pertanyaan: "Menurut teori keunggulan komparatif Ricardo, negara sebaiknya mengekspor barang yang...",
    opsi: ["Diproduksi paling murah", "Memiliki opportunity cost paling rendah", "Permintaan domestik paling tinggi", "Menggunakan teknologi tercanggih"],
    jawabanBenar: 1,
    penjelasan: "Ricardo menunjukkan bahwa negara mendapat keuntungan dari perdagangan dengan mengekspor barang yang diproduksi dengan opportunity cost relatif paling rendah, bahkan jika tidak memiliki keunggulan absolut."
  },
  {
    id: "q7",
    kategori: "Ekonomi Keuangan",
    pertanyaan: "Dalam CAPM, beta (β) mengukur...",
    opsi: ["Total risiko aset", "Risiko non-sistematis", "Sensitivitas return aset terhadap return pasar", "Expected return"],
    jawabanBenar: 2,
    penjelasan: "Beta mengukur systematic risk, yaitu seberapa sensitif return suatu aset terhadap perubahan return pasar. β > 1 berarti lebih volatile dari pasar, β < 1 berarti kurang volatile."
  },
  {
    id: "q8",
    kategori: "Ekonomi Makro",
    pertanyaan: "Stagflasi adalah kondisi di mana...",
    opsi: ["Inflasi rendah dan pertumbuhan tinggi", "Inflasi tinggi bersamaan dengan pertumbuhan rendah/negatif", "Deflasi dengan pengangguran rendah", "Inflasi dan pertumbuhan sama-sama tinggi"],
    jawabanBenar: 1,
    penjelasan: "Stagflasi (stagnation + inflation) terjadi ketika ekonomi mengalami inflasi tinggi bersamaan dengan pertumbuhan rendah dan pengangguran tinggi. Ini menantang Kurva Phillips tradisional."
  },
  {
    id: "q9",
    kategori: "Ekonomi Mikro",
    pertanyaan: "Jika elastisitas harga permintaan suatu barang = 0.3, barang tersebut...",
    opsi: ["Elastis", "Inelastis", "Unitary elastic", "Perfectly elastic"],
    jawabanBenar: 1,
    penjelasan: "Elastisitas < 1 berarti inelastis: perubahan harga 1% hanya menyebabkan perubahan jumlah diminta 0.3%. Barang kebutuhan pokok biasanya inelastis."
  },
  {
    id: "q10",
    kategori: "Ekonomi Pembangunan",
    pertanyaan: "Gini Coefficient yang mendekati 0 menunjukkan...",
    opsi: ["Ketimpangan sempurna", "Distribusi pendapatan merata", "GDP per kapita tinggi", "Tingkat kemiskinan rendah"],
    jawabanBenar: 1,
    penjelasan: "Gini Coefficient berkisar 0-1. Nilai 0 berarti distribusi pendapatan sempurna merata (setiap orang punya pendapatan sama). Nilai 1 berarti satu orang memiliki semua pendapatan."
  },
  {
    id: "q11",
    kategori: "Ekonomi Mikro",
    pertanyaan: "Apa yang dimaksud dengan deadweight loss?",
    opsi: ["Kerugian perusahaan monopoli", "Hilangnya surplus ekonomi akibat ketidakefisienan pasar", "Biaya tetap produksi", "Kerugian pemerintah dari subsidi"],
    jawabanBenar: 1,
    penjelasan: "Deadweight loss adalah hilangnya total surplus (consumer surplus + producer surplus) akibat pasar tidak berada pada keseimbangan efisien, misalnya karena monopoli, pajak, atau price control."
  },
  {
    id: "q12",
    kategori: "Ekonomi Keuangan",
    pertanyaan: "NPV (Net Present Value) positif menunjukkan bahwa...",
    opsi: ["Proyek merugi", "Proyek sebaiknya ditolak", "Proyek menghasilkan return di atas discount rate", "Proyek memiliki payback period pendek"],
    jawabanBenar: 2,
    penjelasan: "NPV > 0 berarti present value arus kas masuk lebih besar dari present value arus kas keluar. Proyek ini menghasilkan return di atas required rate of return dan layak diterima."
  }
];

// ---- RUMUS & FORMULA ----
export interface Formula {
  id: string;
  nama: string;
  kategori: string;
  rumus: string;
  keterangan: string;
  contoh: string;
}

export const formulas: Formula[] = [
  { id: "f1", nama: "GDP (Pengeluaran)", kategori: "Makroekonomi", rumus: "GDP = C + I + G + (X - M)", keterangan: "C=Konsumsi, I=Investasi, G=Belanja Pemerintah, X=Ekspor, M=Impor", contoh: "Jika C=500, I=200, G=150, X=100, M=80 → GDP = 870" },
  { id: "f2", nama: "Multiplier Fiskal", kategori: "Makroekonomi", rumus: "k = 1 / (1 - MPC)", keterangan: "MPC = Marginal Propensity to Consume (0 < MPC < 1)", contoh: "MPC=0.8 → k=1/(1-0.8)=5" },
  { id: "f3", nama: "Elastisitas Harga Permintaan", kategori: "Mikroekonomi", rumus: "Ed = (%ΔQd) / (%ΔP)", keterangan: "Mengukur sensitivitas permintaan terhadap harga", contoh: "Harga naik 10%, Qd turun 20% → Ed = -2 (elastis)" },
  { id: "f4", nama: "Break Even Point (unit)", kategori: "Keuangan", rumus: "BEP = FC / (P - VC)", keterangan: "FC=Fixed Cost, P=Harga jual, VC=Variable Cost per unit", contoh: "FC=10juta, P=50rb, VC=30rb → BEP=10jt/(50rb-30rb)=500 unit" },
  { id: "f5", nama: "ROI", kategori: "Keuangan", rumus: "ROI = (Gain - Cost) / Cost × 100%", keterangan: "Mengukur persentase return dari investasi", contoh: "Investasi 100jt, hasil 130jt → ROI=30%" },
  { id: "f6", nama: "NPV", kategori: "Keuangan", rumus: "NPV = Σ [CF_t / (1+r)^t] - I₀", keterangan: "CF=Cash Flow, r=discount rate, I₀=investasi awal", contoh: "I₀=100jt, CF=40jt/thn, r=10%, 4thn → NPV=26.8jt" },
  { id: "f7", nama: "CAPM", kategori: "Keuangan", rumus: "E(Ri) = Rf + βi × [E(Rm) - Rf]", keterangan: "Rf=risk-free, β=beta, Rm=market return", contoh: "Rf=5%, β=1.2, Rm=12% → E(R)=5%+1.2(12%-5%)=13.4%" },
  { id: "f8", nama: "Quantity Theory of Money", kategori: "Moneter", rumus: "MV = PY", keterangan: "M=Money supply, V=Velocity, P=Price level, Y=Real output", contoh: "Jika M naik 10% dan V,Y tetap → P naik 10%" },
  { id: "f9", nama: "Terms of Trade", kategori: "Internasional", rumus: "ToT = (Px / Pm) × 100", keterangan: "Px=indeks harga ekspor, Pm=indeks harga impor", contoh: "Px=110, Pm=105 → ToT=104.8 (membaik)" },
  { id: "f10", nama: "Inflation Rate", kategori: "Makroekonomi", rumus: "π = [(CPI_t - CPI_{t-1}) / CPI_{t-1}] × 100%", keterangan: "CPI = Consumer Price Index", contoh: "CPI 2023=115, CPI 2022=110 → π=4.5%" },
  { id: "f11", nama: "Real Interest Rate", kategori: "Moneter", rumus: "r = i - π (Fisher Equation)", keterangan: "i=nominal interest rate, π=inflation rate", contoh: "Bunga deposito 6%, inflasi 3% → real return=3%" },
  { id: "f12", nama: "Dividend Discount Model", kategori: "Keuangan", rumus: "P = D₁ / (r - g)", keterangan: "D₁=dividen tahun depan, r=required return, g=growth rate", contoh: "D₁=500, r=12%, g=5% → P=500/(0.12-0.05)=Rp7,143" }
];

// ---- REFERENSI BELAJAR ----
export interface Referensi {
  judul: string;
  penulis: string;
  jenis: string;
  deskripsi: string;
  level: string;
  tautan?: string;
  format?: string;
  halaman?: number;
}

export const referensi: Referensi[] = [
  { judul: "Principles of Economics", penulis: "N. Gregory Mankiw", jenis: "Buku Teks", deskripsi: "Buku pengantar ekonomi paling populer di dunia. Mencakup mikro dan makro dengan penjelasan intuitif.", level: "Pemula" },
  { judul: "Economics", penulis: "Paul Samuelson & William Nordhaus", jenis: "Buku Teks", deskripsi: "Klasik sepanjang masa. Edisi pertama 1948, terus diperbarui. Komprehensif dan mendalam.", level: "Pemula-Menengah" },
  { judul: "Microeconomics", penulis: "Hal Varian", jenis: "Buku Teks", deskripsi: "Intermediate microeconomics terbaik. Pendekatan matematis yang accessible.", level: "Menengah" },
  { judul: "Macroeconomics", penulis: "Olivier Blanchard", jenis: "Buku Teks", deskripsi: "Makroekonomi intermediate standar. Mantan Chief Economist IMF.", level: "Menengah" },
  { judul: "International Economics", penulis: "Paul Krugman & Maurice Obstfeld", jenis: "Buku Teks", deskripsi: "Standar untuk ekonomi internasional: perdagangan dan keuangan.", level: "Menengah" },
  { judul: "Why Nations Fail", penulis: "Daron Acemoglu & James Robinson", jenis: "Buku Populer", deskripsi: "Mengapa ada negara kaya dan miskin? Jawabannya: institusi. Pemenang Nobel 2024.", level: "Semua" },
  { judul: "Thinking, Fast and Slow", penulis: "Daniel Kahneman", jenis: "Buku Populer", deskripsi: "Behavioral economics klasik. Bagaimana manusia membuat keputusan yang tidak selalu rasional.", level: "Semua" },
  { judul: "Capital in the Twenty-First Century", penulis: "Thomas Piketty", jenis: "Buku Populer", deskripsi: "Analisis mendalam ketimpangan ekonomi global dengan data historis ratusan tahun.", level: "Menengah-Lanjut" },
  { judul: "The Wealth of Nations", penulis: "Adam Smith", jenis: "Klasik", deskripsi: "Fondasi ilmu ekonomi modern (1776). Invisible hand, division of labor, free market.", level: "Semua" },
  { judul: "The General Theory", penulis: "John Maynard Keynes", jenis: "Klasik", deskripsi: "Revolusi Keynesian (1936). Peran pemerintah dalam stabilisasi ekonomi.", level: "Lanjut" },
  { judul: "Khan Academy Economics", penulis: "Khan Academy", jenis: "Online Course", deskripsi: "Video gratis micro & macroeconomics. Sangat baik untuk pemula.", level: "Pemula" },
  { judul: "MIT OpenCourseWare - Economics", penulis: "MIT", jenis: "Online Course", deskripsi: "Kuliah MIT gratis: Principles of Economics, Intermediate Micro/Macro.", level: "Menengah-Lanjut" },
  { judul: "Coursera: Economics Specializations", penulis: "Various Universities", jenis: "Online Course", deskripsi: "Kursus dari universitas top dunia: Yale, Stanford, University of Michigan.", level: "Semua" },
  { judul: "CORE Econ (The Economy)", penulis: "CORE Team", jenis: "Online Textbook", deskripsi: "Buku teks ekonomi gratis dan interaktif. Pendekatan modern dan relevan.", level: "Pemula-Menengah" },
  {
    judul: "Correlation and Linear Regression",
    penulis: "Stephanie Campbell",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 43 halaman tentang korelasi, koefisien regresi, signifikansi slope, koefisien determinasi, hingga confidence dan prediction interval.",
    level: "Menengah",
    tautan: "/ebooks/3c52e5fb780108e6d4b5b5a57dcc3b66.pdf",
    format: "PDF",
    halaman: 43,
  },
  {
    judul: "Describing Data: Frequency Tables, Frequency Distributions, and Graphic Presentation",
    penulis: "McGraw-Hill Education",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 22 halaman tentang frequency table, relative frequency, bar chart, pie chart, histogram, dan frequency polygon untuk deskriptif statistik dasar.",
    level: "Pemula",
    tautan: "/ebooks/5cdb473e3f3c76a3605fb1f07564d53e.pdf",
    format: "PDF",
    halaman: 22,
  },
  {
    judul: "Estimation and Confidence Intervals",
    penulis: "Stephanie Campbell",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 27 halaman tentang point estimate, confidence interval untuk mean dan proportion, sample size, serta penyesuaian untuk finite population.",
    level: "Menengah",
    tautan: "/ebooks/9ac124301d628555d53fb03fa97e0a5a.pdf",
    format: "PDF",
    halaman: 27,
  },
  {
    judul: "Sampling, Sampling Methods, and the Central Limit Theorem",
    penulis: "McGraw-Hill Education",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 27 halaman tentang alasan melakukan sampling, probability sampling methods, simple random sampling, stratified dan cluster sampling, hingga central limit theorem.",
    level: "Pemula-Menengah",
    tautan: "/ebooks/d44591165d73997678b336d8ec013ba0.pdf",
    format: "PDF",
    halaman: 27,
  },
  {
    judul: "The Fundamentals of Managerial Economics",
    penulis: "McGraw-Hill Education",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 33 halaman tentang dasar managerial economics: goals, constraints, incentives, market rivalry, profit, five forces, present value, dan marginal analysis.",
    level: "Pemula",
    tautan: "/ebooks/16bb43c9512df41fc322ead369785c42.pdf",
    format: "PDF",
    halaman: 33,
  },
  {
    judul: "Analysis of Variance",
    penulis: "Stephanie Campbell",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 36 halaman tentang F distribution, uji kesamaan varians, ANOVA satu arah, confidence interval antarrata-rata, hingga two-way ANOVA dengan interaction.",
    level: "Menengah",
    tautan: "/ebooks/25ac04173d41a72fe4587485a1aab924.pdf",
    format: "PDF",
    halaman: 36,
  },
  {
    judul: "One-Sample Tests of Hypothesis",
    penulis: "Stephanie Campbell",
    jenis: "Slide Kuliah",
    deskripsi: "Materi PDF 31 halaman tentang proses hypothesis testing, one-tailed dan two-tailed test, uji mean populasi, p-value, t-statistic, dan Type II error.",
    level: "Menengah",
    tautan: "/ebooks/41cfa5d8f0b4bb712417bd69f779184c.pdf",
    format: "PDF",
    halaman: 31,
  },
  {
    judul: "Capitalism without Capital: The Rise of the Intangible Economy",
    penulis: "Jonathan Haskel & Stian Westlake",
    jenis: "Buku Populer",
    deskripsi: "Buku 290 halaman tentang bagaimana intangible assets seperti software, branding, desain, dan data mengubah cara kapitalisme modern bekerja.",
    level: "Menengah-Lanjut",
    tautan: "/ebooks/capitalism-without-capital-the-rise-of-the-intangible-economy.pdf",
    format: "PDF",
    halaman: 290,
  }
];
