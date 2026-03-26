"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { 
  Calculator, 
  Wallet, 
  Home, 
  TrendingUp,
  Info,
  ArrowRight,
  Percent,
  Calendar,
  DollarSign
} from "lucide-react";
import { banks } from "@/lib/data/banking-data";
import { cn, formatCurrency } from "@/lib/utils";

// Deposito Calculator
export function DepositoCalculator() {
  const [principal, setPrincipal] = useState(10000000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(3.5);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const totalInterest = principal * monthlyRate * months;
    const tax = totalInterest * 0.2; // PPh final 20%
    const netInterest = totalInterest - tax;
    const maturity = principal + netInterest;
    
    return {
      totalInterest,
      tax,
      netInterest,
      maturity,
      monthlyIncome: netInterest / months
    };
  }, [principal, months, rate]);

  const pieData = [
    { name: "Pokok", value: principal, color: "#3b82f6" },
    { name: "Bunga Bersih", value: results.netInterest, color: "#10b981" },
    { name: "Pajak", value: results.tax, color: "#ef4444" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Kalkulator Deposito
        </CardTitle>
        <CardDescription>
          Hitung perkiraan bunga deposito setelah pajak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Jumlah Deposito (Rp)
              </Label>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={1000000}
                step={1000000}
                className="font-mono"
              />
              <div className="flex gap-2">
                {[10, 50, 100, 500].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPrincipal(num * 1000000)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Rp {num}M
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Jangka Waktu: {months} bulan
              </Label>
              <Slider
                value={[months]}
                onValueChange={(v) => setMonths(v[0])}
                min={1}
                max={24}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 bln</span>
                <span>12 bln</span>
                <span>24 bln</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Suku Bunga per Tahun: {rate}%
              </Label>
              <Slider
                value={[rate]}
                onValueChange={(v) => setRate(v[0])}
                min={1}
                max={10}
                step={0.25}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Quick Rate Buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Pilih bank untuk rate referensi:</Label>
              <div className="flex flex-wrap gap-1">
                {banks.slice(0, 6).map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setRate(bank.rates.deposito12Month)}
                    className="text-xs px-2 py-1 rounded border border-border hover:bg-accent transition-colors"
                    style={{ borderLeftColor: bank.color, borderLeftWidth: 3 }}
                  >
                    {bank.code}: {bank.rates.deposito12Month}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Total Saat Jatuh Tempo</div>
                  <div className="text-lg font-bold text-primary">{formatCurrency(results.maturity)}</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Bunga Bersih</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.netInterest)}</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Pendapatan/Bulan</div>
                  <div className="text-lg font-bold">{formatCurrency(results.monthlyIncome)}</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Pajak (20%)</div>
                  <div className="text-lg font-bold text-red-500">-{formatCurrency(results.tax)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number | undefined) => formatCurrency(value || 0)}
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-xs">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 dark:text-blue-300">
            Perhitungan ini bersifat estimasi. Bunga deposito dikenakan PPh final 20%. 
            Rate aktual dapat berbeda, silakan konfirmasi ke bank bersangkutan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// KPR Calculator
export function KprCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(500000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [years, setYears] = useState(15);
  const [fixedRate, setFixedRate] = useState(8);
  const [floatingRate, setFloatingRate] = useState(10);
  const [fixedYears, setFixedYears] = useState(3);

  const results = useMemo(() => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const months = years * 12;
    
    // Fixed period calculation
    const fixedMonthlyRate = fixedRate / 100 / 12;
    const fixedMonths = fixedYears * 12;
    const fixedMonthlyPayment = loanAmount * 
      (fixedMonthlyRate * Math.pow(1 + fixedMonthlyRate, months)) / 
      (Math.pow(1 + fixedMonthlyRate, months) - 1);
    
    // Remaining balance after fixed period
    const remainingAfterFixed = loanAmount * 
      (Math.pow(1 + fixedMonthlyRate, months) - Math.pow(1 + fixedMonthlyRate, fixedMonths)) / 
      (Math.pow(1 + fixedMonthlyRate, months) - 1);
    
    // Floating period calculation
    const remainingMonths = months - fixedMonths;
    const floatingMonthlyRate = floatingRate / 100 / 12;
    const floatingMonthlyPayment = remainingAfterFixed * 
      (floatingMonthlyRate * Math.pow(1 + floatingMonthlyRate, remainingMonths)) / 
      (Math.pow(1 + floatingMonthlyRate, remainingMonths) - 1);
    
    const totalPayment = (fixedMonthlyPayment * fixedMonths) + (floatingMonthlyPayment * remainingMonths);
    const totalInterest = totalPayment - loanAmount;
    
    return {
      downPayment,
      loanAmount,
      fixedMonthlyPayment,
      floatingMonthlyPayment,
      totalPayment,
      totalInterest,
      remainingAfterFixed
    };
  }, [propertyPrice, downPaymentPercent, years, fixedRate, floatingRate, fixedYears]);

  // Monthly payment schedule data for chart
  const chartData = useMemo(() => {
    const data = [];
    const fixedPayment = Math.round(results.fixedMonthlyPayment);
    const floatPayment = Math.round(results.floatingMonthlyPayment);
    
    for (let year = 1; year <= years; year++) {
      data.push({
        year: `Th ${year}`,
        payment: year <= fixedYears ? fixedPayment : floatPayment,
        type: year <= fixedYears ? "Fixed Rate" : "Floating Rate"
      });
    }
    return data;
  }, [results, years, fixedYears]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Home className="h-5 w-5 text-primary" />
          Kalkulator KPR
        </CardTitle>
        <CardDescription>
          Simulasi angsuran KPR dengan periode fixed dan floating
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Harga Properti (Rp)</Label>
              <Input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                min={100000000}
                step={50000000}
                className="font-mono"
              />
              <div className="flex gap-2">
                {[500, 750, 1000, 1500, 2000].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPropertyPrice(num * 1000000)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Rp {num >= 1000 ? `${num/1000}M` : `${num}jt`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>DP (Uang Muka): {downPaymentPercent}% ({formatCurrency(results.downPayment)})</Label>
              <Slider
                value={[downPaymentPercent]}
                onValueChange={(v) => setDownPaymentPercent(v[0])}
                min={10}
                max={50}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>30%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tenor: {years} tahun</Label>
                <Slider
                  value={[years]}
                  onValueChange={(v) => setYears(v[0])}
                  min={5}
                  max={25}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Fixed Period: {fixedYears} tahun</Label>
                <Slider
                  value={[fixedYears]}
                  onValueChange={(v) => setFixedYears(Math.min(v[0], years - 1))}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bunga Fixed: {fixedRate}%</Label>
                <Slider
                  value={[fixedRate]}
                  onValueChange={(v) => setFixedRate(v[0])}
                  min={5}
                  max={15}
                  step={0.25}
                />
              </div>
              <div className="space-y-2">
                <Label>Bunga Floating: {floatingRate}%</Label>
                <Slider
                  value={[floatingRate]}
                  onValueChange={(v) => setFloatingRate(v[0])}
                  min={8}
                  max={18}
                  step={0.25}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Angsuran Fixed</div>
                  <div className="text-lg font-bold text-primary">{formatCurrency(results.fixedMonthlyPayment)}/bln</div>
                  <div className="text-xs text-muted-foreground">({fixedYears} tahun pertama)</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Angsuran Floating*</div>
                  <div className="text-lg font-bold text-amber-600">{formatCurrency(results.floatingMonthlyPayment)}/bln</div>
                  <div className="text-xs text-muted-foreground">(sisa tenor)</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga Properti</span>
                <span className="font-medium">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uang Muka ({downPaymentPercent}%)</span>
                <span className="font-medium text-green-600">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jumlah Pinjaman</span>
                <span className="font-medium text-blue-600">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pembayaran</span>
                  <span className="font-bold">{formatCurrency(results.totalPayment)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Total Bunga</span>
                  <span className="font-medium text-red-500">{formatCurrency(results.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" tick={{fontSize: 10}} />
                  <YAxis hide />
                  <RechartsTooltip 
                    formatter={(value: number | undefined) => formatCurrency(value || 0)}
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  />
                  <Bar dataKey="payment" fill="#3b82f6">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.type === "Fixed Rate" ? "#3b82f6" : "#f59e0b"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Fixed Rate
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500 rounded-sm" /> Floating Rate
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-xs">
          <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 dark:text-amber-300">
            *Angsuran floating merupakan estimasi berdasarkan suku bunga saat ini. 
            Suku bunga floating dapat berubah sesuai kondisi pasar dan kebijakan Bank Indonesia. 
            Perhitungan ini menggunakan metode anuitas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Investment Calculator
export function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(8);

  const results = useMemo(() => {
    const monthlyRate = returnRate / 100 / 12;
    const months = years * 12;
    
    // Future value of lump sum
    const fvLumpSum = initialAmount * Math.pow(1 + monthlyRate, months);
    
    // Future value of contributions
    const fvContributions = monthlyContribution * 
      (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    
    const totalValue = fvLumpSum + fvContributions;
    const totalContributions = initialAmount + (monthlyContribution * months);
    const totalReturn = totalValue - totalContributions;
    
    return {
      totalValue,
      totalContributions,
      totalReturn,
      fvLumpSum,
      fvContributions
    };
  }, [initialAmount, monthlyContribution, years, returnRate]);

  // Generate yearly breakdown
  const yearlyData = useMemo(() => {
    const data = [];
    const monthlyRate = returnRate / 100 / 12;
    
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const fvLumpSum = initialAmount * Math.pow(1 + monthlyRate, months);
      const fvContributions = monthlyContribution * 
        (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      const totalValue = fvLumpSum + fvContributions;
      const totalContributions = initialAmount + (monthlyContribution * months);
      
      data.push({
        year: `Th ${year}`,
        value: Math.round(totalValue),
        contribution: Math.round(totalContributions),
        return: Math.round(totalValue - totalContributions)
      });
    }
    return data;
  }, [initialAmount, monthlyContribution, years, returnRate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Kalkulator Investasi
        </CardTitle>
        <CardDescription>
          Proyeksi pertumbuhan investasi dengan bunga majemuk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dana Awal (Rp)</Label>
              <Input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                min={0}
                step={1000000}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Investasi Bulanan (Rp)</Label>
              <Input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min={0}
                step={100000}
                className="font-mono"
              />
              <div className="flex gap-2">
                {[500000, 1000000, 2000000, 5000000].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMonthlyContribution(num)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Rp {num >= 1000000 ? `${num/1000000}jt` : `${num/1000}rb`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durasi: {years} tahun</Label>
                <Slider
                  value={[years]}
                  onValueChange={(v) => setYears(v[0])}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Return: {returnRate}%/tahun</Label>
                <Slider
                  value={[returnRate]}
                  onValueChange={(v) => setReturnRate(v[0])}
                  min={3}
                  max={20}
                  step={0.5}
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Benchmark Return:</div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setReturnRate(4)}>Deposito: 4%</Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setReturnRate(6)}>Obligasi: 6%</Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setReturnRate(10)}>Reksadana Saham: 10%</Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setReturnRate(12)}>Saham IDX: 12%</Badge>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Nilai Investasi</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.totalValue)}</div>
                <div className="text-xs text-muted-foreground mt-1">setelah {years} tahun</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Total Modal</div>
                  <div className="text-base font-medium">{formatCurrency(results.totalContributions)}</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Keuntungan</div>
                  <div className="text-base font-medium text-green-600">+{formatCurrency(results.totalReturn)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              Return: {((results.totalReturn / results.totalContributions) * 100).toFixed(1)}% total
            </div>

            {/* Chart */}
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" tick={{fontSize: 10}} interval={Math.floor(years / 5)} />
                  <YAxis hide />
                  <RechartsTooltip 
                    formatter={(value: number | undefined) => formatCurrency(value || 0)}
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  />
                  <Bar dataKey="contribution" stackId="a" fill="#3b82f6" name="Modal" />
                  <Bar dataKey="return" stackId="a" fill="#10b981" name="Keuntungan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Modal
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-sm" /> Keuntungan
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-xs">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 dark:text-blue-300">
            Perhitungan menggunakan bunga majemuk bulanan. Return investasi aktual dapat bervariasi 
            dan tidak menjamin hasil di masa depan. Historis tidak menjamin performa masa depan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Calculators Container
export function BankingCalculators() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="deposito" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposito" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Deposito</span>
          </TabsTrigger>
          <TabsTrigger value="kpr" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">KPR</span>
          </TabsTrigger>
          <TabsTrigger value="investasi" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Investasi</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposito" className="mt-4">
          <DepositoCalculator />
        </TabsContent>
        
        <TabsContent value="kpr" className="mt-4">
          <KprCalculator />
        </TabsContent>
        
        <TabsContent value="investasi" className="mt-4">
          <InvestmentCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
