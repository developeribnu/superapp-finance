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
  CreditCard,
  ShieldAlert,
  HeartPulse,
  PieChart as PieChartIcon,
  Lightbulb,
  Star,
  Zap,
  Plane,
  ShoppingBag,
  Fuel,
  Utensils,
  Check,
  X,
  TrendingUp,
  AlertCircle,
  Wallet,
  PiggyBank,
  Landmark,
  ArrowRight,
  Sparkles,
  Target
} from "lucide-react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { banks } from "@/lib/data/banking-data";
import { formatCurrency, cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ============== CREDIT CARD COMPARISON ==============
const creditCards = [
  {
    id: "bca-visa-platinum",
    bank: "BCA",
    bankColor: "#0066AE",
    name: "BCA Visa Platinum",
    type: "Lifestyle",
    annualFee: 600000,
    cashbackRate: 0,
    rewardPoints: "1 poin / Rp 2.000",
    benefits: [
      "Lounge access 2x/tahun",
      "Promo restoran 20%",
      "Asuransi travel",
      "Concierge service"
    ],
    bestFor: ["Travel", "Dining", "Lifestyle"],
    minIncome: 5000000,
    rating: 4.5,
    image: "💳"
  },
  {
    id: "mandiri-signature",
    bank: "Mandiri",
    bankColor: "#F5A623",
    name: "Mandiri Signature",
    type: "Premium",
    annualFee: 1200000,
    cashbackRate: 0,
    rewardPoints: "1 poin / Rp 1.000",
    benefits: [
      "Unlimited lounge access",
      "Buy 1 Get 1 F&B",
      "Asuransi travel USD 1 juta",
      "Golf privileges"
    ],
    bestFor: ["Premium Travel", "Golf", "Dining"],
    minIncome: 20000000,
    rating: 4.8,
    image: "💎"
  },
  {
    id: "cimb-world",
    bank: "CIMB",
    bankColor: "#C41E3A",
    name: "CIMB World",
    type: "Cashback",
    annualFee: 0,
    cashbackRate: 1.5,
    rewardPoints: "-",
    benefits: [
      "Cashback 1.5% semua transaksi",
      "Cashback 5% kategori pilihan",
      "No annual fee lifetime",
      "Promo e-commerce"
    ],
    bestFor: ["Cashback", "Online Shopping", "Everyday"],
    minIncome: 3600000,
    rating: 4.6,
    image: "💰"
  },
  {
    id: "bri-garuda",
    bank: "BRI",
    bankColor: "#00579C",
    name: "BRI Garuda Indonesia",
    type: "Travel",
    annualFee: 300000,
    cashbackRate: 0,
    rewardPoints: "1 GarudaMiles / Rp 3.000",
    benefits: [
      "Miles Garuda Indonesia",
      "Gratis tiket domestik",
      "Lounge access 4x/tahun",
      "Asuransi travel"
    ],
    bestFor: ["Garuda Flights", "Travel", "Miles Collector"],
    minIncome: 5000000,
    rating: 4.3,
    image: "✈️"
  },
  {
    id: "danamon-world",
    bank: "Danamon",
    bankColor: "#EC1C24",
    name: "Danamon World",
    type: "Lifestyle",
    annualFee: 450000,
    cashbackRate: 0,
    rewardPoints: "1 poin / Rp 2.500",
    benefits: [
      "Buy 1 Get 1 Cinema",
      "Promo F&B 15%",
      "Asuransi jiwa",
      "Mobile protection"
    ],
    bestFor: ["Entertainment", "Movies", "Lifestyle"],
    minIncome: 3000000,
    rating: 4.2,
    image: "🎬"
  },
  {
    id: "bni-platinum",
    bank: "BNI",
    bankColor: "#E85D04",
    name: "BNI Platinum",
    type: "General",
    annualFee: 350000,
    cashbackRate: 0,
    rewardPoints: "1 poin / Rp 2.000",
    benefits: [
      "Point reward fleksibel",
      "Cicilan 0% tenor panjang",
      "Asuransi kecelakaan",
      "Priority banking"
    ],
    bestFor: ["PNS", "General", "Installments"],
    minIncome: 3000000,
    rating: 4.0,
    image: "🏛️"
  }
];

function CreditCardComparison() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [monthlySpend, setMonthlySpend] = useState(3000000);

  const filteredCards = filterType === "all" 
    ? creditCards 
    : creditCards.filter(c => c.bestFor.some(b => b.toLowerCase().includes(filterType.toLowerCase())));

  const calculateReward = (card: typeof creditCards[0]) => {
    if (card.cashbackRate > 0) {
      return monthlySpend * (card.cashbackRate / 100);
    }
    return 0; // Points calculation would be more complex
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Perbandingan Kartu Kredit
        </CardTitle>
        <CardDescription>
          Temukan kartu kredit terbaik untuk gaya hidup dan kebutuhanmu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "Travel", "Cashback", "Lifestyle", "Premium"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {type === "all" ? "Semua" : type}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Pengeluaran Bulanan (Simulasi Reward)</Label>
            <Slider 
              value={[monthlySpend]} 
              onValueChange={(v) => setMonthlySpend(v[0])}
              min={1000000}
              max={10000000}
              step={500000}
            />
            <div className="text-xs text-muted-foreground">{formatCurrency(monthlySpend)}/bulan</div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <Card 
              key={card.id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedCard === card.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: card.bankColor }}
                  >
                    {card.image}
                  </div>
                  <Badge variant="secondary" className="text-xs">{card.type}</Badge>
                </div>
                
                <h4 className="font-medium text-sm mb-1">{card.name}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs">{card.rating}</span>
                </div>

                <div className="space-y-1 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Fee:</span>
                    <span className={card.annualFee === 0 ? "text-green-600 font-medium" : ""}>
                      {card.annualFee === 0 ? "FREE" : formatCurrency(card.annualFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min. Income:</span>
                    <span>{formatCurrency(card.minIncome)}/bulan</span>
                  </div>
                  {card.cashbackRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cashback:</span>
                      <span className="text-green-600 font-medium">{card.cashbackRate}%</span>
                    </div>
                  )}
                </div>

                {card.cashbackRate > 0 && (
                  <div className="p-2 bg-green-500/10 rounded text-center">
                    <span className="text-xs text-muted-foreground">Est. Reward/bulan: </span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(calculateReward(card))}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  {card.bestFor.map(bf => (
                    <Badge key={bf} variant="outline" className="text-xs">{bf}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCard && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Detail Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const card = creditCards.find(c => c.id === selectedCard);
                if (!card) return null;
                return (
                  <div className="space-y-3">
                    <ul className="space-y-1">
                      {card.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

// ============== EMERGENCY FUND CALCULATOR ==============
function EmergencyFundCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(5000000);
  const [currentFund, setCurrentFund] = useState(10000000);
  const [safetyLevel, setSafetyLevel] = useState(6); // months

  const calculation = useMemo(() => {
    const target = monthlyExpense * safetyLevel;
    const gap = target - currentFund;
    const percentComplete = Math.min((currentFund / target) * 100, 100);
    const monthlySavingNeeded = gap > 0 ? gap / 12 : 0;

    let status: "danger" | "warning" | "good" | "excellent";
    let message: string;

    if (percentComplete < 30) {
      status = "danger";
      message = "🚨 DANA DARURAT KRITIS! Segera mulai tabungan darurat.";
    } else if (percentComplete < 60) {
      status = "warning";
      message = "⚠️ Dana darurat belum cukup. Percepat pengisian.";
    } else if (percentComplete < 100) {
      status = "good";
      message = "✅ Dana darurat bagus. Lanjutkan hingga target tercapai.";
    } else {
      status = "excellent";
      message = "🌟 Luar biasa! Dana darurat sudah aman.";
    }

    return { target, gap, percentComplete, monthlySavingNeeded, status, message };
  }, [monthlyExpense, currentFund, safetyLevel]);

  const statusColors = {
    danger: "bg-red-500",
    warning: "bg-amber-500",
    good: "bg-blue-500",
    excellent: "bg-green-500"
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Kalkulator Dana Darurat
        </CardTitle>
        <CardDescription>
          Hitung kebutuhan dana darurat berdasarkan pengeluaran bulananmu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Pengeluaran Bulanan</Label>
            <Input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Dana Darurat Saat Ini</Label>
            <Input
              type="number"
              value={currentFund}
              onChange={(e) => setCurrentFund(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Target: {safetyLevel} bulan pengeluaran</Label>
            <Slider
              value={[safetyLevel]}
              onValueChange={(v) => setSafetyLevel(v[0])}
              min={3}
              max={12}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 bln (single)</span>
              <span>6 bln (married)</span>
              <span>12 bln (family)</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress Dana Darurat</span>
            <span className="font-medium">{calculation.percentComplete.toFixed(1)}%</span>
          </div>
          <Progress 
            value={calculation.percentComplete} 
            className="h-4"
          />
        </div>

        {/* Status Alert */}
        <div className={cn(
          "p-4 rounded-lg border",
          calculation.status === "danger" && "bg-red-500/10 border-red-500/30",
          calculation.status === "warning" && "bg-amber-500/10 border-amber-500/30",
          calculation.status === "good" && "bg-blue-500/10 border-blue-500/30",
          calculation.status === "excellent" && "bg-green-500/10 border-green-500/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className={cn(
              "h-5 w-5",
              calculation.status === "danger" && "text-red-500",
              calculation.status === "warning" && "text-amber-500",
              calculation.status === "good" && "text-blue-500",
              calculation.status === "excellent" && "text-green-500"
            )} />
            <span className="font-bold">{calculation.message}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Target Dana Darurat</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(calculation.target)}</div>
              <div className="text-xs text-muted-foreground">({safetyLevel} bulan)</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Kekurangan</div>
              <div className={cn(
                "text-xl font-bold",
                calculation.gap > 0 ? "text-red-500" : "text-green-500"
              )}>
                {calculation.gap > 0 ? formatCurrency(calculation.gap) : "✅ Tercapai!"}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Tabungan/bulan (12 bln)</div>
              <div className="text-xl font-bold text-blue-500">
                {calculation.monthlySavingNeeded > 0 
                  ? formatCurrency(calculation.monthlySavingNeeded)
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium mb-1">🧍 Single</div>
            <p className="text-muted-foreground">3-4 bulan pengeluaran cukup karena overhead lebih rendah.</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium mb-1">💑 Married</div>
            <p className="text-muted-foreground">6 bulan pengeluaran untuk stabilitas pasangan.</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium mb-1">👨‍👩‍👧‍👦 Family</div>
            <p className="text-muted-foreground">9-12 bulan untuk keamanan keluarga dengan anak.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== FINANCIAL HEALTH SCORE ==============
function FinancialHealthScore() {
  const [scores, setScores] = useState({
    savings: 5,
    debt: 5,
    emergency: 5,
    investment: 5,
    insurance: 5
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = 25;
  const percentage = (totalScore / maxScore) * 100;

  const getGrade = () => {
    if (percentage >= 90) return { grade: "A", color: "text-green-500", message: "Keuanganmu sangat sehat! 🌟" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-500", message: "Keuanganmu baik, sedikit improvement lagi! ✅" };
    if (percentage >= 50) return { grade: "C", color: "text-amber-500", message: "Cukup, tapi perlu perhatian di beberapa area ⚠️" };
    return { grade: "D", color: "text-red-500", message: "Butuh perbaikan signifikan 🚨" };
  };

  const grade = getGrade();

  const categories = [
    { key: "savings", label: "Tabungan Rutin", icon: PiggyBank, desc: "Menabung minimal 20% penghasilan" },
    { key: "debt", label: "Rasio Utang", icon: CreditCard, desc: "Cicilan < 30% penghasilan" },
    { key: "emergency", label: "Dana Darurat", icon: ShieldAlert, desc: "Memiliki 3-12 bulan pengeluaran" },
    { key: "investment", label: "Investasi", icon: TrendingUp, desc: "Sudah mulai investasi" },
    { key: "insurance", label: "Proteksi", icon: HeartPulse, desc: "Asuransi kesehatan & jiwa" }
  ];

  const radarData = categories.map(cat => ({
    subject: cat.label,
    A: scores[cat.key as keyof typeof scores] * 20,
    fullMark: 100
  }));

  const recommendations = useMemo(() => {
    const recs = [];
    if (scores.savings < 7) recs.push("💰 Tingkatkan tabunganmu. Target: 20% dari penghasilan");
    if (scores.debt < 7) recs.push("💳 Kurangi utang konsumtif. Prioritaskan cicilan dengan bunga tinggi");
    if (scores.emergency < 7) recs.push("🛡️ Prioritaskan dana darurat 3-6 bulan pengeluaran");
    if (scores.investment < 7) recs.push("📈 Mulai investasi meski kecil. Manfaatkan compound interest");
    if (scores.insurance < 7) recs.push("🩺 Pertimbangkan asuransi kesehatan dan jiwa untuk proteksi");
    if (recs.length === 0) recs.push("🌟 Luar biasa! Pertahankan kesehatan keuanganmu!");
    return recs;
  }, [scores]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartPulse className="h-5 w-5 text-primary" />
          Financial Health Score
        </CardTitle>
        <CardDescription>
          Asesmen kesehatan keuanganmu dalam 5 kategori penting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={cn("text-5xl font-bold", grade.color)}>{grade.grade}</span>
                <span className="text-sm text-muted-foreground">{totalScore}/{maxScore}</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                  className={grade.color}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-center mt-4 text-sm">{grade.message}</p>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="font-medium">{scores[cat.key as keyof typeof scores]}/5</span>
                  </div>
                  <Slider
                    value={[scores[cat.key as keyof typeof scores]]}
                    onValueChange={(v) => setScores(prev => ({ ...prev, [cat.key]: v[0] }))}
                    min={1}
                    max={5}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Rekomendasi Perbaikan
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                {rec}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== MULTI-BANK PORTFOLIO TRACKER ==============
function MultiBankPortfolio() {
  const [portfolios, setPortfolios] = useState([
    { bank: banks[0], savings: 20000000, deposito: 50000000 },
    { bank: banks[1], savings: 10000000, deposito: 0 },
    { bank: banks[5], savings: 0, deposito: 30000000 },
  ]);

  const [newBankId, setNewBankId] = useState("");
  const [newSavings, setNewSavings] = useState(0);
  const [newDeposito, setNewDeposito] = useState(0);

  const totals = useMemo(() => {
    const totalSavings = portfolios.reduce((sum, p) => sum + p.savings, 0);
    const totalDeposito = portfolios.reduce((sum, p) => sum + p.deposito, 0);
    const total = totalSavings + totalDeposito;
    
    const estimatedMonthlyIncome = portfolios.reduce((sum, p) => {
      const monthlyRate = p.bank.rates.deposito12Month / 100 / 12;
      return sum + (p.deposito * monthlyRate * 0.8); // After tax
    }, 0);

    return { totalSavings, totalDeposito, total, estimatedMonthlyIncome };
  }, [portfolios]);

  const addPortfolio = () => {
    if (!newBankId) return;
    const bank = banks.find(b => b.id === newBankId);
    if (!bank) return;
    setPortfolios([...portfolios, { bank, savings: newSavings, deposito: newDeposito }]);
    setNewBankId("");
    setNewSavings(0);
    setNewDeposito(0);
  };

  const removePortfolio = (index: number) => {
    setPortfolios(portfolios.filter((_, i) => i !== index));
  };

  const chartData = portfolios.map(p => ({
    name: p.bank.code,
    value: p.savings + p.deposito,
    color: p.bank.color
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Multi-Bank Portfolio Tracker
        </CardTitle>
        <CardDescription>
          Pantau asetmu yang tersebar di berbagai bank
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Total Aset</div>
              <div className="text-lg font-bold text-blue-500">{formatCurrency(totals.total)}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Tabungan</div>
              <div className="text-lg font-bold text-green-500">{formatCurrency(totals.totalSavings)}</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Deposito</div>
              <div className="text-lg font-bold text-amber-500">{formatCurrency(totals.totalDeposito)}</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-3 text-center">
              <div className="text-xs text-muted-foreground">Est. Pendapatan/Bulan</div>
              <div className="text-lg font-bold text-purple-500">{formatCurrency(totals.estimatedMonthlyIncome)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio List */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Portofolio per Bank</h4>
            {portfolios.map((p, index) => (
              <Card key={index} className="group">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: p.bank.color }}
                      >
                        {p.bank.code}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{p.bank.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Tab: {formatCurrency(p.savings)} | Dep: {formatCurrency(p.deposito)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(p.savings + p.deposito)}</div>
                      <button 
                        onClick={() => removePortfolio(index)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New */}
            <Card className="border-dashed">
              <CardContent className="p-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Select value={newBankId} onValueChange={setNewBankId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Pilih Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.filter(b => !portfolios.some(p => p.bank.id === b.id)).map(bank => (
                        <SelectItem key={bank.id} value={bank.id} className="text-xs">
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    type="number" 
                    placeholder="Tabungan"
                    className="text-xs"
                    value={newSavings || ""}
                    onChange={(e) => setNewSavings(Number(e.target.value))}
                  />
                  <Input 
                    type="number" 
                    placeholder="Deposito"
                    className="text-xs"
                    value={newDeposito || ""}
                    onChange={(e) => setNewDeposito(Number(e.target.value))}
                  />
                </div>
                <Button 
                  onClick={addPortfolio} 
                  disabled={!newBankId}
                  className="w-full"
                  size="sm"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Tambah Bank
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number | undefined) => formatCurrency(value || 0)}
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LPS Safety Check */}
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-medium">Status Keamanan LPS</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Semua asetmu dijamin LPS karena di bawah Rp 2 miliar per bank. 
            Total aset: {formatCurrency(totals.total)} tersebar di {portfolios.length} bank.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== SMART SAVING RECOMMENDATIONS ==============
function SmartSavingRecommendations() {
  const [monthlyIncome, setMonthlyIncome] = useState(10000000);
  const [monthlyExpense, setMonthlyExpense] = useState(6000000);
  const [goal, setGoal] = useState("emergency"); // emergency, investment, purchase

  const analysis = useMemo(() => {
    const available = monthlyIncome - monthlyExpense;
    const savingsRate = (available / monthlyIncome) * 100;

    let recommendation: {
      title: string;
      allocation: { name: string; amount: number; percent: number; color: string }[];
      advice: string[];
    };

    if (goal === "emergency") {
      recommendation = {
        title: "Strategi: Prioritas Dana Darurat",
        allocation: [
          { name: "Tabungan Instan", amount: available * 0.2, percent: 20, color: "#3b82f6" },
          { name: "Deposito 3-6 bln", amount: available * 0.5, percent: 50, color: "#10b981" },
          { name: "Deposito 12 bln", amount: available * 0.3, percent: 30, color: "#f59e0b" }
        ],
        advice: [
          "Simpan 20% di tabungan untuk akses instan",
          "50% di deposito tenor pendek (likuiditas)",
          "30% di deposito 12 bulan (bunga lebih tinggi)",
          "Target: 6 bulan pengeluaran di dana darurat"
        ]
      };
    } else if (goal === "investment") {
      recommendation = {
        title: "Strategi: Pertumbuhan Kekayaan",
        allocation: [
          { name: "Deposito (Safe)", amount: available * 0.3, percent: 30, color: "#3b82f6" },
          { name: "Reksadana (Mod)", amount: available * 0.4, percent: 40, color: "#10b981" },
          { name: "Saham (Risk)", amount: available * 0.3, percent: 30, color: "#f59e0b" }
        ],
        advice: [
          "30% di deposito sebagai safe haven",
          "40% di reksadana campuran/saham (moderate risk)",
          "30% di saam individual (high risk, high return)",
          "Review portofolio setiap 6 bulan"
        ]
      };
    } else {
      recommendation = {
        title: "Strategi: Target Pembelian",
        allocation: [
          { name: "Tabungan Goal", amount: available * 0.6, percent: 60, color: "#3b82f6" },
          { name: "Deposito", amount: available * 0.3, percent: 30, color: "#10b981" },
          { name: "Celengan", amount: available * 0.1, percent: 10, color: "#f59e0b" }
        ],
        advice: [
          "60% masuk ke tabungan khusus goal (auto debit)",
          "30% di deposito untuk bunga tambahan",
          "10% untuk celengan fleksibel",
          "Gunakan fitur 'Dream Saver' di aplikasi bank"
        ]
      };
    }

    return { available, savingsRate, recommendation };
  }, [monthlyIncome, monthlyExpense, goal]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Rekomendasi Tabungan Pintar
        </CardTitle>
        <CardDescription>
          Strategi alokasi dana berdasarkan tujuan keuanganmu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Penghasilan/Bulan</Label>
            <Input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Pengeluaran/Bulan</Label>
            <Input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Tujuan</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">🛡️ Dana Darurat</SelectItem>
                <SelectItem value="investment">📈 Investasi</SelectItem>
                <SelectItem value="purchase">🎯 Target Pembelian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Dana Tersedia/Bulan</div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(analysis.available)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Savings Rate</div>
            <div className={cn(
              "text-xl font-bold",
              analysis.savingsRate >= 20 ? "text-green-500" : "text-amber-500"
            )}>
              {analysis.savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {analysis.savingsRate < 20 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-sm">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Savings rate dibawah 20%. Coba kurangi pengeluaran non-esensial.
          </div>
        )}

        {/* Recommendation */}
        <div>
          <h4 className="font-medium mb-3">{analysis.recommendation.title}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysis.recommendation.allocation}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="amount"
                    label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {analysis.recommendation.allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Details */}
            <div className="space-y-2">
              {analysis.recommendation.allocation.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">💡 Saran:</h5>
            <ul className="space-y-1">
              {analysis.recommendation.advice.map((advice, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {advice}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== MAIN EXPORT ==============
export function AdvancedBanking() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="creditcard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="creditcard" className="text-xs">
            <CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />
            Kartu Kredit
          </TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs">
            <ShieldAlert className="h-4 w-4 mr-1 hidden sm:inline" />
            Dana Darurat
          </TabsTrigger>
          <TabsTrigger value="health" className="text-xs">
            <HeartPulse className="h-4 w-4 mr-1 hidden sm:inline" />
            Health Score
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs">
            <PieChartIcon className="h-4 w-4 mr-1 hidden sm:inline" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="smart" className="text-xs">
            <Sparkles className="h-4 w-4 mr-1 hidden sm:inline" />
            Smart Saving
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creditcard" className="mt-4">
          <CreditCardComparison />
        </TabsContent>

        <TabsContent value="emergency" className="mt-4">
          <EmergencyFundCalculator />
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <FinancialHealthScore />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          <MultiBankPortfolio />
        </TabsContent>

        <TabsContent value="smart" className="mt-4">
          <SmartSavingRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
