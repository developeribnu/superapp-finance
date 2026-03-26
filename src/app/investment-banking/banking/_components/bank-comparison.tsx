"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { 
  banks, 
  type Bank,
  getTopBanksByDepositoRate,
  getDigitalBankingRankings 
} from "@/lib/data/banking-data";
import { 
  TrendingUp, 
  Smartphone, 
  Building2, 
  Wallet,
  Star,
  Check,
  X,
  ArrowRightLeft,
  Info
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Bank Card Component
function BankCard({ bank, onSelect, isSelected }: { 
  bank: Bank; 
  onSelect: (bank: Bank) => void;
  isSelected: boolean;
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onClick={() => onSelect(bank)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: bank.color, color: bank.textColor }}
          >
            {bank.code}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{bank.name}</CardTitle>
            <CardDescription className="text-xs">{bank.type}</CardDescription>
          </div>
          {isSelected && <Check className="h-5 w-5 text-primary" />}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Deposito 12bln</span>
            <span className="font-medium text-green-600">{bank.rates.deposito12Month}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Admin/bulan</span>
            <span className="font-medium">Rp {bank.fees.monthlyAdmin.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">App Rating</span>
            <span className="font-medium flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {bank.digitalApp.rating}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Bank Detail Dialog
function BankDetailDialog({ bank, open, onOpenChange }: {
  bank: Bank | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!bank) return null;

  const radarData = [
    { subject: "Digital", A: bank.digitalApp.rating * 20, fullMark: 100 },
    { subject: "Bunga", A: (bank.rates.deposito12Month / 5) * 100, fullMark: 100 },
    { subject: "Jaringan", A: Math.min((bank.network.atms / 20000) * 100, 100), fullMark: 100 },
    { subject: "Hemat", A: (1 - bank.fees.monthlyAdmin / 25000) * 100, fullMark: 100 },
    { subject: "Produk", A: bank.products.length * 25, fullMark: 100 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: bank.color, color: bank.textColor }}
            >
              {bank.code}
            </div>
            <div>
              <DialogTitle>{bank.fullName}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{bank.type}</Badge>
                <span className="text-xs">Est. {bank.established}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{bank.description}</p>

            {/* Radar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name={bank.name}
                    dataKey="A"
                    stroke={bank.color}
                    fill={bank.color}
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Kelebihan
                </h4>
                <ul className="space-y-1">
                  {bank.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-green-500">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  Kekurangan
                </h4>
                <ul className="space-y-1">
                  {bank.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-red-500">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator />

            {/* Rates & Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Suku Bunga Deposito</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3 Bulan</span>
                    <span className="font-medium">{bank.rates.deposito3Month}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">6 Bulan</span>
                    <span className="font-medium">{bank.rates.deposito6Month}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">12 Bulan</span>
                    <span className="font-medium text-green-600">{bank.rates.deposito12Month}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Biaya</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Admin/bulan</span>
                    <span className="font-medium">Rp {bank.fees.monthlyAdmin.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transfer beda bank</span>
                    <span className="font-medium">Rp {bank.fees.transferDifferentBank.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital App */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Aplikasi: {bank.digitalApp.name}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{bank.digitalApp.rating}/5</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {bank.digitalApp.features.map((f) => (
                  <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-medium mb-2">Produk Unggulan</h4>
              <div className="space-y-2">
                {bank.products.slice(0, 3).map((product) => (
                  <div key={product.name} className="p-2 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Side by Side Comparison
function SideBySideComparison({ bank1, bank2 }: { bank1: Bank; bank2: Bank }) {
  const comparisonData = [
    { label: "Suku Bunga Deposito (12bln)", bank1: bank1.rates.deposito12Month, bank2: bank2.rates.deposito12Month, unit: "%", higherBetter: true },
    { label: "Bunga Tabungan", bank1: bank1.rates.savingsInterest, bank2: bank2.rates.savingsInterest, unit: "%", higherBetter: true },
    { label: "Biaya Admin/Bulan", bank1: bank1.fees.monthlyAdmin, bank2: bank2.fees.monthlyAdmin, unit: "Rp", higherBetter: false },
    { label: "Rating Aplikasi", bank1: bank1.digitalApp.rating, bank2: bank2.digitalApp.rating, unit: "", higherBetter: true },
    { label: "Jumlah ATM", bank1: bank1.network.atms, bank2: bank2.network.atms, unit: "", higherBetter: true },
    { label: "Jumlah Cabang", bank1: bank1.network.branches, bank2: bank2.network.branches, unit: "", higherBetter: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center font-bold"
            style={{ backgroundColor: bank1.color, color: bank1.textColor }}
          >
            {bank1.code}
          </div>
          <div className="font-medium text-sm">{bank1.name}</div>
        </div>
        <div className="text-center">
          <ArrowRightLeft className="h-6 w-6 mx-auto text-muted-foreground" />
          <div className="text-xs text-muted-foreground mt-1">VS</div>
        </div>
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center font-bold"
            style={{ backgroundColor: bank2.color, color: bank2.textColor }}
          >
            {bank2.code}
          </div>
          <div className="font-medium text-sm">{bank2.name}</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Fitur</TableHead>
            <TableHead className="text-center">{bank1.code}</TableHead>
            <TableHead className="text-center">{bank2.code}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonData.map((item) => {
            const b1Better = item.higherBetter ? item.bank1 > item.bank2 : item.bank1 < item.bank2;
            const b2Better = item.higherBetter ? item.bank2 > item.bank1 : item.bank2 < item.bank1;
            
            return (
              <TableRow key={item.label}>
                <TableCell className="text-sm">{item.label}</TableCell>
                <TableCell className={cn(
                  "text-center font-medium",
                  b1Better && "text-green-600 bg-green-500/10",
                  b2Better && "text-muted-foreground"
                )}>
                  {item.unit === "Rp" ? formatCurrency(item.bank1) : item.bank1 + item.unit}
                </TableCell>
                <TableCell className={cn(
                  "text-center font-medium",
                  b2Better && "text-green-600 bg-green-500/10",
                  b1Better && "text-muted-foreground"
                )}>
                  {item.unit === "Rp" ? formatCurrency(item.bank2) : item.bank2 + item.unit}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Main Comparison Component
export function BankComparison() {
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([]);
  const [detailBank, setDetailBank] = useState<Bank | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleBank = (bank: Bank) => {
    setSelectedBanks(prev => {
      if (prev.find(b => b.id === bank.id)) {
        return prev.filter(b => b.id !== bank.id);
      }
      if (prev.length >= 2) {
        return [prev[1], bank];
      }
      return [...prev, bank];
    });
  };

  const topDepositoBanks = useMemo(() => getTopBanksByDepositoRate().slice(0, 5), []);
  const digitalRankings = useMemo(() => getDigitalBankingRankings().slice(0, 5), []);

  const depositorChartData = banks.map(b => ({
    name: b.code,
    rate3: b.rates.deposito3Month,
    rate6: b.rates.deposito6Month,
    rate12: b.rates.deposito12Month,
    color: b.color
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua Bank</TabsTrigger>
          <TabsTrigger value="compare">Bandingkan</TabsTrigger>
          <TabsTrigger value="deposito">Bunga Deposito</TabsTrigger>
          <TabsTrigger value="digital">Digital Banking</TabsTrigger>
        </TabsList>

        {/* All Banks Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {banks.map((bank) => (
              <Dialog key={bank.id}>
                <DialogTrigger asChild>
                  <div>
                    <BankCard
                      bank={bank}
                      onSelect={(b) => {
                        setDetailBank(b);
                        setDetailOpen(true);
                      }}
                      isSelected={false}
                    />
                  </div>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pilih 2 Bank untuk Dibandingkan</CardTitle>
              <CardDescription>Klik pada bank untuk memilih/melepaskan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => toggleBank(bank)}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all",
                      selectedBanks.find(b => b.id === bank.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    style={selectedBanks.find(b => b.id === bank.id) ? {
                      borderColor: bank.color
                    } : {}}
                  >
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold mb-1"
                      style={{ backgroundColor: bank.color, color: bank.textColor }}
                    >
                      {bank.code}
                    </div>
                    <div className="text-xs font-medium truncate">{bank.name}</div>
                  </button>
                ))}
              </div>

              {selectedBanks.length === 2 && (
                <SideBySideComparison bank1={selectedBanks[0]} bank2={selectedBanks[1]} />
              )}

              {selectedBanks.length < 2 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Pilih 2 bank dari daftar di atas untuk membandingkan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deposito Rates Tab */}
        <TabsContent value="deposito" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Perbandingan Suku Bunga Deposito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depositorChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" domain={[0, 5]} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" width={60} />
                    <RechartsTooltip 
                      formatter={(value: number | undefined) => `${value || 0}%`}
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    />
                    <Legend />
                    <Bar dataKey="rate3" name="3 Bulan" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="rate6" name="6 Bulan" fill="#34d399" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="rate12" name="12 Bulan" fill="#f472b6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Top 5 Bank - Deposito 12 Bulan</h4>
                <div className="space-y-2">
                  {topDepositoBanks.map((bank, index) => (
                    <div key={bank.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold w-6">#{index + 1}</span>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Banking Tab */}
        <TabsContent value="digital" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-500" />
                Peringkat Digital Banking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {digitalRankings.map(({ bank, score }, index) => (
                  <div key={bank.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <span className="text-lg font-bold w-8">#{index + 1}</span>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                      style={{ backgroundColor: bank.color, color: bank.textColor }}
                    >
                      {bank.code}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{bank.name}</div>
                      <div className="text-sm text-muted-foreground">{bank.digitalApp.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bank.digitalApp.features.slice(0, 3).map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{bank.digitalApp.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Score: {score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BankDetailDialog 
        bank={detailBank} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </div>
  );
}
