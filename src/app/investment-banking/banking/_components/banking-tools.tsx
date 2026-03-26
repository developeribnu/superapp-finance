"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  SwitchCamera,
  Target,
  Gift,
  TrendingDown,
  Calculator,
  ArrowRight,
  Check,
  X,
  Wallet,
  Calendar,
  MapPin,
  Percent,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Banknote
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { banks } from "@/lib/data/banking-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ============== SWITCH BANK CALCULATOR ==============
function SwitchBankCalculator() {
  const [currentBank, setCurrentBank] = useState(banks[0]);
  const [targetBank, setTargetBank] = useState(banks[5]); // BSI
  const [depositoAmount, setDepositoAmount] = useState(100000000);
  const [years, setYears] = useState(3);
  const [switchCost, setSwitchCost] = useState(50000); // Biaya pindah (admin, biaya kartu, dll)

  const analysis = useMemo(() => {
    const currentMonthlyRate = currentBank.rates.deposito12Month / 100 / 12;
    const targetMonthlyRate = targetBank.rates.deposito12Month / 100 / 12;
    const months = years * 12;

    // Current bank calculation
    const currentInterest = depositoAmount * currentMonthlyRate * months;
    const currentTax = currentInterest * 0.2;
    const currentNet = currentInterest - currentTax;
    const currentAdminTotal = currentBank.fees.monthlyAdmin * months;
    const currentTotal = currentNet - currentAdminTotal;

    // Target bank calculation
    const targetInterest = depositoAmount * targetMonthlyRate * months;
    const targetTax = targetInterest * 0.2;
    const targetNet = targetInterest - targetTax;
    const targetAdminTotal = targetBank.fees.monthlyAdmin * months;
    const targetTotal = targetNet - targetAdminTotal - switchCost;

    const difference = targetTotal - currentTotal;
    const percentIncrease = (difference / Math.abs(currentTotal)) * 100;
    const breakEvenMonths = difference > 0 ? Math.ceil(switchCost / ((targetTotal - currentTotal) / months)) : 0;

    return {
      currentTotal,
      targetTotal,
      difference,
      percentIncrease,
      breakEvenMonths,
      currentNet,
      targetNet,
      yearlyData: Array.from({ length: years }, (_, i) => {
        const year = i + 1;
        const m = year * 12;
        const cTotal = (depositoAmount * currentMonthlyRate * m * 0.8) - (currentBank.fees.monthlyAdmin * m);
        const tTotal = (depositoAmount * targetMonthlyRate * m * 0.8) - (targetBank.fees.monthlyAdmin * m) - switchCost;
        return {
          year: `Th ${year}`,
          current: Math.round(cTotal),
          target: Math.round(tTotal),
          difference: Math.round(tTotal - cTotal)
        };
      })
    };
  }, [currentBank, targetBank, depositoAmount, years, switchCost]);

  const isWorthIt = analysis.difference > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <SwitchCamera className="h-5 w-5 text-primary" />
          Kalkulator Pindah Bank
        </CardTitle>
        <CardDescription>
          Hitung apakah pindah bank menguntungkan dengan mempertimbangkan bunga dan biaya
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Bank */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium">Bank Saat Ini</Label>
            <Select value={currentBank.id} onValueChange={(id) => setCurrentBank(banks.find(b => b.id === id)!)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <span className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: bank.color }}
                      />
                      {bank.name} ({bank.rates.deposito12Month}%)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Bunga Deposito:</span>
                <span className="font-medium">{currentBank.rates.deposito12Month}%/tahun</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Admin:</span>
                <span className="font-medium">Rp {currentBank.fees.monthlyAdmin.toLocaleString()}/bulan</span>
              </div>
            </div>
          </div>

          {/* Target Bank */}
          <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Label className="text-sm font-medium">Bank Tujuan</Label>
            <Select value={targetBank.id} onValueChange={(id) => setTargetBank(banks.find(b => b.id === id)!)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <span className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: bank.color }}
                      />
                      {bank.name} ({bank.rates.deposito12Month}%)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Bunga Deposito:</span>
                <span className="font-medium text-green-600">{targetBank.rates.deposito12Month}%/tahun</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Admin:</span>
                <span className="font-medium">Rp {targetBank.fees.monthlyAdmin.toLocaleString()}/bulan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Jumlah Deposito</Label>
            <Input
              type="number"
              value={depositoAmount}
              onChange={(e) => setDepositoAmount(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Durasi: {years} tahun</Label>
            <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={10} step={1} />
          </div>
          <div className="space-y-2">
            <Label>Biaya Pindah Bank</Label>
            <Input
              type="number"
              value={switchCost}
              onChange={(e) => setSwitchCost(Number(e.target.value))}
              className="font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className={cn(
          "p-4 rounded-lg border",
          isWorthIt 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-red-500/10 border-red-500/30"
        )}>
          <div className="flex items-center gap-2 mb-3">
            {isWorthIt ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
            <span className={cn(
              "font-bold",
              isWorthIt ? "text-green-600" : "text-red-600"
            )}>
              {isWorthIt ? "Pindah Bank Menguntungkan!" : "Pindah Bank Tidak Menguntungkan"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Total di Bank Saat Ini</div>
              <div className="text-lg font-bold">{formatCurrency(analysis.currentTotal)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Total di Bank Tujuan</div>
              <div className="text-lg font-bold text-primary">{formatCurrency(analysis.targetTotal)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Selisih ({analysis.percentIncrease.toFixed(1)}%)</div>
              <div className={cn(
                "text-lg font-bold",
                isWorthIt ? "text-green-600" : "text-red-600"
              )}>
                {isWorthIt ? "+" : ""}{formatCurrency(analysis.difference)}
              </div>
            </div>
          </div>

          {isWorthIt && analysis.breakEvenMonths > 0 && (
            <div className="mt-3 text-xs text-center text-muted-foreground">
              Break-even dalam <span className="font-medium text-primary">{analysis.breakEvenMonths} bulan</span>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analysis.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" tick={{fontSize: 12}} />
              <YAxis tickFormatter={(v) => `Rp ${(v/1000000).toFixed(0)}jt`} tick={{fontSize: 10}} />
              <RechartsTooltip 
                formatter={(value: number | undefined) => formatCurrency(value || 0)}
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="current" 
                name={currentBank.name} 
                stroke={currentBank.color} 
                fill={currentBank.color}
                fillOpacity={0.1}
              />
              <Area 
                type="monotone" 
                dataKey="target" 
                name={targetBank.name} 
                stroke={targetBank.color} 
                fill={targetBank.color}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== SAVINGS GOAL TRACKER ==============
function SavingsGoalTracker() {
  const [goalName, setGoalName] = useState("Dana Darurat");
  const [targetAmount, setTargetAmount] = useState(50000000);
  const [currentAmount, setCurrentAmount] = useState(15000000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000000);
  const [interestRate, setInterestRate] = useState(3.5);

  const projection = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    let current = currentAmount;
    const months = [];
    let monthCount = 0;
    const maxMonths = 120; // 10 years max

    while (current < targetAmount && monthCount < maxMonths) {
      current = (current + monthlyContribution) * (1 + monthlyRate);
      monthCount++;
      
      if (monthCount % 6 === 0 || current >= targetAmount) {
        months.push({
          month: monthCount,
          label: monthCount % 12 === 0 ? `Th ${monthCount/12}` : `${monthCount}bln`,
          amount: Math.round(current),
          target: targetAmount
        });
      }
    }

    const progress = (currentAmount / targetAmount) * 100;
    const remaining = targetAmount - currentAmount;
    const estimatedMonths = monthCount;
    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + estimatedMonths);

    return {
      progress,
      remaining,
      estimatedMonths,
      estimatedDate: estimatedDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
      months,
      isAchievable: monthCount < maxMonths
    };
  }, [targetAmount, currentAmount, monthlyContribution, interestRate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Target Tabungan
        </CardTitle>
        <CardDescription>
          Pantau progress dan proyeksi pencapaian target keuanganmu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nama Target</Label>
              <Input value={goalName} onChange={(e) => setGoalName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Target Jumlah</Label>
              <Input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Saat Ini</Label>
              <Input 
                type="number" 
                value={currentAmount} 
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Tabungan per Bulan</Label>
              <Input 
                type="number" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Suku Bunga: {interestRate}%/tahun</Label>
              <Slider 
                value={[interestRate]} 
                onValueChange={(v) => setInterestRate(v[0])}
                min={1}
                max={10}
                step={0.5}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Estimasi Tercapai</div>
              <div className="text-lg font-bold text-primary">
                {projection.isAchievable ? projection.estimatedDate : ">10 tahun"}
              </div>
              <div className="text-xs text-muted-foreground">
                {projection.isAchievable ? `${projection.estimatedMonths} bulan lagi` : "Perlu lebih banyak tabungan"}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{projection.progress.toFixed(1)}%</span>
          </div>
          <Progress value={projection.progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(currentAmount)}</span>
            <span>{formatCurrency(targetAmount)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Tersisa</div>
              <div className="text-sm font-bold">{formatCurrency(projection.remaining)}</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Per Bulan</div>
              <div className="text-sm font-bold">{formatCurrency(monthlyContribution)}</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Bunga</div>
              <div className="text-sm font-bold">{interestRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection.months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="label" tick={{fontSize: 10}} interval={1} />
              <YAxis tickFormatter={(v) => `Rp ${(v/1000000).toFixed(0)}jt`} tick={{fontSize: 10}} />
              <RechartsTooltip 
                formatter={(value: number | undefined) => formatCurrency(value || 0)}
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              />
              <ReferenceLine y={targetAmount} stroke="#10b981" strokeDasharray="5 5" label="Target" />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Proyeksi Tabungan"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== PROMO TRACKER ==============
function PromoTracker() {
  const promos = [
    {
      id: 1,
      bank: "BCA",
      bankColor: "#0066AE",
      title: "Cashback 30% Gopay",
      description: "Isi ulang Gopay via myBCA dapat cashback 30% maksimal Rp 15.000",
      category: "Cashback",
      minTransaction: 50000,
      maxReward: 15000,
      period: "1-31 Maret 2026",
      remainingDays: 18,
      terms: ["Berlaku untuk pengguna myBCA", "Maksimal 1x per hari", "Kuota terbatas"],
      link: "#"
    },
    {
      id: 2,
      bank: "Mandiri",
      bankColor: "#F5A623",
      title: "Diskon 50% GrabFood",
      description: "Pesan GrabFood pakai Livin' dapat diskon 50% maksimal Rp 25.000",
      category: "Diskon",
      minTransaction: 40000,
      maxReward: 25000,
      period: "Sampai 30 April 2026",
      remainingDays: 45,
      terms: ["Kode promo: MANDIRIFOOD", "Min. transaksi Rp 40.000", "Berlaku hari Senin-Jumat"],
      link: "#"
    },
    {
      id: 3,
      bank: "CIMB",
      bankColor: "#C41E3A",
      title: "Cashback Rp 100.000 Tokopedia",
      description: "Transaksi di Tokopedia pakai OCTO Cards dapat cashback s/d Rp 100.000",
      category: "Cashback",
      minTransaction: 500000,
      maxReward: 100000,
      period: "Sampai 15 Maret 2026",
      remainingDays: 2,
      terms: ["Khusus pengguna OCTO Cards", "Cashback masuk dalam 14 hari kerja", "Kuota terbatas"],
      link: "#"
    },
    {
      id: 4,
      bank: "BRI",
      bankColor: "#00579C",
      title: "Voucher Shopee Rp 20.000",
      description: "Isi ulang ShopeePay pakai BRIMo dapat voucher Rp 20.000",
      category: "Voucher",
      minTransaction: 100000,
      maxReward: 20000,
      period: "Maret 2026",
      remainingDays: 18,
      terms: ["Min. isi ulang Rp 100.000", "Voucher otomatis masuk", "Berlaku untuk semua pengguna BRIMo"],
      link: "#"
    },
    {
      id: 5,
      bank: "BSI",
      bankColor: "#2E7D32",
      title: "Cashback 10% Umroh",
      description: "Pembelian paket umroh via BSI Mobile dapat cashback 10%",
      category: "Cashback",
      minTransaction: 25000000,
      maxReward: 2500000,
      period: "Ramadhan 2026",
      remainingDays: 60,
      terms: ["Berlaku untuk travel partner tertentu", "Cashback dicicil 3 bulan", "Daftar via BSI Mobile"],
      link: "#"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "Cashback", "Diskon", "Voucher"];

  const filteredPromos = selectedCategory === "all" 
    ? promos 
    : promos.filter(p => p.category === selectedCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          Promo & Cashback Bank
        </CardTitle>
        <CardDescription>
          Kumpulan promo menarik dari berbagai bank
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "Semua" : cat}
            </button>
          ))}
        </div>

        {/* Promo List */}
        <div className="space-y-3">
          {filteredPromos.map(promo => (
            <Card key={promo.id} className="group hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: promo.bankColor, color: "#fff" }}
                  >
                    {promo.bank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{promo.title}</h4>
                      <Badge variant="secondary" className="text-xs">{promo.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{promo.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {promo.period}
                      </span>
                      <span className={cn(
                        "flex items-center gap-1",
                        promo.remainingDays <= 3 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        <Clock className="h-3 w-3" />
                        {promo.remainingDays} hari lagi
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Min. transaksi: <span className="font-medium">{formatCurrency(promo.minTransaction)}</span>
                      </span>
                      <span className="text-green-600 font-medium">
                        Reward s/d {formatCurrency(promo.maxReward)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-center text-muted-foreground">
          *Promo dapat berubah sewaktu-waktu. Pastikan cek ketentuan di aplikasi bank masing-masing.
        </div>
      </CardContent>
    </Card>
  );
}

// ============== INTEREST RATE HISTORY ==============
function InterestRateHistory() {
  // Historical BI Rate and average deposito rates
  const historyData = [
    { year: "2020 Q1", biRate: 4.5, avgDeposito: 5.5, inflation: 2.96 },
    { year: "2020 Q2", biRate: 4.25, avgDeposito: 5.0, inflation: 2.28 },
    { year: "2020 Q3", biRate: 4.0, avgDeposito: 4.5, inflation: 1.42 },
    { year: "2020 Q4", biRate: 3.75, avgDeposito: 4.0, inflation: 1.68 },
    { year: "2021 Q1", biRate: 3.5, avgDeposito: 3.75, inflation: 1.37 },
    { year: "2021 Q2", biRate: 3.5, avgDeposito: 3.5, inflation: 1.33 },
    { year: "2021 Q3", biRate: 3.5, avgDeposito: 3.25, inflation: 1.84 },
    { year: "2021 Q4", biRate: 3.5, avgDeposito: 3.0, inflation: 1.87 },
    { year: "2022 Q1", biRate: 3.5, avgDeposito: 2.75, inflation: 2.64 },
    { year: "2022 Q2", biRate: 3.5, avgDeposito: 2.5, inflation: 4.35 },
    { year: "2022 Q3", biRate: 4.25, avgDeposito: 3.0, inflation: 5.95 },
    { year: "2022 Q4", biRate: 5.5, avgDeposito: 4.0, inflation: 5.51 },
    { year: "2023 Q1", biRate: 5.75, avgDeposito: 4.5, inflation: 5.11 },
    { year: "2023 Q2", biRate: 5.75, avgDeposito: 4.75, inflation: 4.03 },
    { year: "2023 Q3", biRate: 5.75, avgDeposito: 5.0, inflation: 2.28 },
    { year: "2023 Q4", biRate: 6.0, avgDeposito: 5.25, inflation: 2.61 },
    { year: "2024 Q1", biRate: 6.25, avgDeposito: 5.5, inflation: 2.84 },
    { year: "2024 Q2", biRate: 6.25, avgDeposito: 5.25, inflation: 2.80 },
    { year: "2024 Q3", biRate: 6.0, avgDeposito: 5.0, inflation: 1.84 },
    { year: "2024 Q4", biRate: 5.75, avgDeposito: 4.5, inflation: 1.57 },
    { year: "2025 Q1", biRate: 5.5, avgDeposito: 4.0, inflation: 1.20 },
    { year: "2025 Q2", biRate: 5.25, avgDeposito: 3.75, inflation: 1.15 },
    { year: "2025 Q3", biRate: 5.0, avgDeposito: 3.5, inflation: 1.08 },
    { year: "2025 Q4", biRate: 4.75, avgDeposito: 3.25, inflation: 1.02 },
    { year: "2026 Q1", biRate: 4.5, avgDeposito: 3.0, inflation: 0.98 },
  ];

  const [showInflation, setShowInflation] = useState(true);
  const [showRealReturn, setShowRealReturn] = useState(true);

  const dataWithRealReturn = historyData.map(d => ({
    ...d,
    realReturn: d.avgDeposito - d.inflation
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingDown className="h-5 w-5 text-primary" />
          Historis Suku Bunga
        </CardTitle>
        <CardDescription>
          Perkembangan BI Rate, bunga deposito, dan inflasi (2020-2026)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggles */}
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={showInflation} 
              onChange={(e) => setShowInflation(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Tampilkan Inflasi</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={showRealReturn} 
              onChange={(e) => setShowRealReturn(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Tampilkan Real Return</span>
          </label>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataWithRealReturn}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" tick={{fontSize: 10}} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{fontSize: 10}} domain={[0, 8]} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip 
                formatter={(value: number | undefined) => `${(value || 0).toFixed(2)}%`}
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="biRate" 
                name="BI Rate" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="avgDeposito" 
                name="Rata-rata Deposito" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
              {showInflation && (
                <Line 
                  type="monotone" 
                  dataKey="inflation" 
                  name="Inflasi" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
              {showRealReturn && (
                <Line 
                  type="monotone" 
                  dataKey="realReturn" 
                  name="Real Return (Deposito - Inflasi)" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">BI Rate Saat Ini</div>
              <div className="text-xl font-bold text-blue-500">4.50%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Avg Deposito</div>
              <div className="text-xl font-bold text-green-500">3.50%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Inflasi</div>
              <div className="text-xl font-bold text-red-500">0.98%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Real Return</div>
              <div className="text-xl font-bold text-amber-500">2.52%</div>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
          <AlertCircle className="h-4 w-4 inline mr-1" />
          Real Return = Bunga Deposito - Inflasi. Jika positif, uangmu bertumbuh secara nyata.
        </div>
      </CardContent>
    </Card>
  );
}

// ============== ATM FEE CALCULATOR ==============
function AtmFeeCalculator() {
  const [withdrawalAmount, setWithdrawalAmount] = useState(2000000);
  const [frequency, setFrequency] = useState(4); // per bulan
  const [homeBank, setHomeBank] = useState(banks[0]);
  const [withdrawalBank, setWithdrawalBank] = useState(banks[2]); // Mandiri

  const analysis = useMemo(() => {
    const isSameBank = homeBank.id === withdrawalBank.id;
    const feePerTransaction = isSameBank 
      ? homeBank.fees.atmWithdrawalSameBank 
      : homeBank.fees.atmWithdrawalDifferentBank;
    
    const monthlyFee = feePerTransaction * frequency;
    const yearlyFee = monthlyFee * 12;
    const convenienceCost = (yearlyFee / withdrawalAmount) * 100;

    return {
      isSameBank,
      feePerTransaction,
      monthlyFee,
      yearlyFee,
      convenienceCost,
      recommendation: yearlyFee > 300000 
        ? "Pertimbangkan untuk lebih sering tarik tunai di ATM bank sendiri"
        : "Biaya masih dalam batas wajar"
    };
  }, [withdrawalAmount, frequency, homeBank, withdrawalBank]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Banknote className="h-5 w-5 text-primary" />
          Kalkulator Biaya ATM
        </CardTitle>
        <CardDescription>
          Hitung biaya tarik tunai lintas bank dan temukan cara hemat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Bank Kartu ATM</Label>
            <Select value={homeBank.id} onValueChange={(id) => setHomeBank(banks.find(b => b.id === id)!)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Tarik di ATM Bank</Label>
            <Select value={withdrawalBank.id} onValueChange={(id) => setWithdrawalBank(banks.find(b => b.id === id)!)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {banks.map(bank => (
                  <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nominal Tarik (Rp)</Label>
            <Input 
              type="number" 
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Frekuensi: {frequency}x per bulan</Label>
            <Slider value={[frequency]} onValueChange={(v) => setFrequency(v[0])} min={1} max={20} step={1} />
          </div>
        </div>

        {/* Result */}
        <div className={cn(
          "p-4 rounded-lg border",
          analysis.isSameBank 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-amber-500/10 border-amber-500/30"
        )}>
          <div className="flex items-center gap-2 mb-3">
            {analysis.isSameBank ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <span className={cn(
              "font-bold",
              analysis.isSameBank ? "text-green-600" : "text-amber-600"
            )}>
              {analysis.isSameBank ? "Gratis!" : "Ada Biaya"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Biaya/Transaksi</div>
              <div className="text-lg font-bold">{formatCurrency(analysis.feePerTransaction)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Biaya/Bulan</div>
              <div className="text-lg font-bold">{formatCurrency(analysis.monthlyFee)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Biaya/Tahun</div>
              <div className={cn(
                "text-lg font-bold",
                analysis.yearlyFee > 300000 ? "text-red-500" : "text-muted-foreground"
              )}>
                {formatCurrency(analysis.yearlyFee)}
              </div>
            </div>
          </div>

          {!analysis.isSameBank && (
            <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
              <span className="font-medium">Rekomendasi:</span> {analysis.recommendation}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium mb-1">💡 Tips Hemat</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Tarik tunai di ATM bank sendiri (gratis)</li>
              <li>• Gunakan QRIS untuk pembayaran</li>
              <li>• Ambil uang dalam jumlah besar</li>
            </ul>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium mb-1">⚠️ Hindari</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Tarik tunai di ATM prima/bersama (mahal)</li>
              <li>• Cek saldo di ATM beda bank (Rp 4.000)</li>
              <li>• Tarik tunai sering dengan nominal kecil</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== MAIN EXPORT ==============
export function BankingTools() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="switch" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="switch" className="text-xs">
            <SwitchCamera className="h-4 w-4 mr-1 hidden sm:inline" />
            Pindah Bank
          </TabsTrigger>
          <TabsTrigger value="goal" className="text-xs">
            <Target className="h-4 w-4 mr-1 hidden sm:inline" />
            Target
          </TabsTrigger>
          <TabsTrigger value="promo" className="text-xs">
            <Gift className="h-4 w-4 mr-1 hidden sm:inline" />
            Promo
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <TrendingDown className="h-4 w-4 mr-1 hidden sm:inline" />
            Historis
          </TabsTrigger>
          <TabsTrigger value="atm" className="text-xs">
            <Banknote className="h-4 w-4 mr-1 hidden sm:inline" />
            Biaya ATM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="switch" className="mt-4">
          <SwitchBankCalculator />
        </TabsContent>

        <TabsContent value="goal" className="mt-4">
          <SavingsGoalTracker />
        </TabsContent>

        <TabsContent value="promo" className="mt-4">
          <PromoTracker />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <InterestRateHistory />
        </TabsContent>

        <TabsContent value="atm" className="mt-4">
          <AtmFeeCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
