"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  RefreshCw,
  Download,
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { FootballFieldChart } from "@/components/charts/football-field-chart";
import { SensitivityHeatmap } from "@/components/charts/sensitivity-heatmap";
import {
  formatCurrency,
  formatMultiple,
  formatPercent,
  formatSharePrice,
} from "@/lib/calculations/formatting";
import { generateSensitivityTable } from "@/lib/calculations/sensitivity";
import type { FootballFieldBar } from "@/types/calculations";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Company {
  id: string;
  name: string;
  ticker: string | null;
  sharePrice: number | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  dilutedShares: number | null;
  totalDebt: number | null;
  cashAndEquivalents: number | null;
  revenueLTM: number | null;
  revenueNTM: number | null;
  ebitdaLTM: number | null;
  ebitdaNTM: number | null;
  ebitLTM: number | null;
  ebitNTM: number | null;
  netIncomeLTM: number | null;
  netIncomeNTM: number | null;
  epsLTM: number | null;
  epsNTM: number | null;
  revenueGrowthNTM: number | null;
  ebitdaMarginLTM: number | null;
  ebitdaMarginNTM: number | null;
  sector?: { id: string; name: string; category: string } | null;
}

interface AnalysisData {
  id: string;
  name: string;
  description: string | null;
  status: string;
  primaryMultiple: string;
  timePeriod: string;
  valuationDate: string | null;
  impliedShareLow: number | null;
  impliedShareMid: number | null;
  impliedShareHigh: number | null;
  impliedEvLow: number | null;
  impliedEvMid: number | null;
  impliedEvHigh: number | null;
  targetCompany: Company;
  comparables: Array<{
    id: string;
    isIncluded: boolean;
    company: Company;
  }>;
  calculatedMultiples: Array<{
    companyId: string;
    companyName: string;
    evRevenueLTM: number | null;
    evRevenueNTM: number | null;
    evEbitdaLTM: number | null;
    evEbitdaNTM: number | null;
    evEbitLTM: number | null;
    evEbitNTM: number | null;
    peRatioLTM: number | null;
    peRatioNTM: number | null;
    priceToBook: number | null;
    priceToTBV: number | null;
    pegRatio: number | null;
    evToArr: number | null;
    isOutlier: boolean;
    outlierReason: string | null;
  }>;
}

// Multiples we display in the matrix
const MULTIPLE_COLS = [
  { key: "evRevenueLTM", label: "EV/Rev LTM" },
  { key: "evRevenueNTM", label: "EV/Rev NTM" },
  { key: "evEbitdaLTM", label: "EV/EBITDA LTM" },
  { key: "evEbitdaNTM", label: "EV/EBITDA NTM" },
  { key: "peRatioLTM", label: "P/E LTM" },
  { key: "peRatioNTM", label: "P/E NTM" },
] as const;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  in_progress: {
    label: "In Progress",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeStats(values: (number | null)[]): {
  mean: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  min: number | null;
  max: number | null;
} {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0)
    return { mean: null, median: null, p25: null, p75: null, min: null, max: null };

  nums.sort((a, b) => a - b);
  const mean = nums.reduce((s, v) => s + v, 0) / nums.length;

  const median =
    nums.length % 2 === 0
      ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
      : nums[Math.floor(nums.length / 2)];

  const p25Idx = (nums.length - 1) * 0.25;
  const p75Idx = (nums.length - 1) * 0.75;
  const p25 =
    nums[Math.floor(p25Idx)] +
    (p25Idx % 1) *
      (nums[Math.ceil(p25Idx)] - nums[Math.floor(p25Idx)]);
  const p75 =
    nums[Math.floor(p75Idx)] +
    (p75Idx % 1) *
      (nums[Math.ceil(p75Idx)] - nums[Math.floor(p75Idx)]);

  return { mean, median, p25, p75, min: nums[0], max: nums[nums.length - 1] };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalysisWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const json = await res.json();
      if (json.success) setAnalysis(json.data);
    } catch {
      toast.error("Failed to load analysis");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const runCalculation = async () => {
    setCalculating(true);
    try {
      const res = await fetch(`/api/analyses/${id}/calculate`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Valuation calculated successfully");
        await fetchAnalysis();
      } else {
        toast.error(json.error || "Calculation failed");
      }
    } catch {
      toast.error("Calculation failed");
    } finally {
      setCalculating(false);
    }
  };

  // Computed stats for each multiple column
  const multipleStats = useMemo(() => {
    if (!analysis || analysis.calculatedMultiples.length === 0) return null;
    const stats: Record<string, ReturnType<typeof computeStats>> = {};
    for (const col of MULTIPLE_COLS) {
      const values = analysis.calculatedMultiples.map(
        (m) => m[col.key as keyof typeof m] as number | null
      );
      stats[col.key] = computeStats(values);
    }
    return stats;
  }, [analysis]);

  // Football field data
  const footballData = useMemo((): FootballFieldBar[] => {
    if (!analysis || !multipleStats) return [];
    const target = analysis.targetCompany;
    const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
    const shares = target.dilutedShares ?? 0;
    if (shares === 0) return [];

    const bars: FootballFieldBar[] = [];
    const mappings: {
      key: string;
      label: string;
      financial: number | null;
      isEvBased: boolean;
    }[] = [
      { key: "evRevenueNTM", label: "EV/Revenue NTM", financial: target.revenueNTM, isEvBased: true },
      { key: "evEbitdaNTM", label: "EV/EBITDA NTM", financial: target.ebitdaNTM, isEvBased: true },
      { key: "peRatioNTM", label: "P/E NTM", financial: target.netIncomeNTM, isEvBased: false },
    ];

    for (const m of mappings) {
      const stats = multipleStats[m.key];
      if (!stats || !stats.median || !m.financial) continue;

      const toPrice = (mult: number) => {
        if (m.isEvBased) {
          return (m.financial! * mult - netDebt) / shares;
        }
        return (m.financial! * mult) / shares;
      };

      bars.push({
        methodology: m.key,
        label: m.label,
        min: toPrice(stats.min!),
        percentile25: toPrice(stats.p25!),
        median: toPrice(stats.median),
        mean: toPrice(stats.mean!),
        percentile75: toPrice(stats.p75!),
        max: toPrice(stats.max!),
      });
    }
    return bars;
  }, [analysis, multipleStats]);

  // Sensitivity data
  const sensitivityData = useMemo(() => {
    if (!analysis) return null;
    const target = analysis.targetCompany;
    const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
    const shares = target.dilutedShares ?? 0;
    const baseFinancial = target.ebitdaNTM;
    if (!baseFinancial || shares === 0) return null;

    const baseMultiple = multipleStats?.evEbitdaNTM?.median;
    if (!baseMultiple) return null;

    const finLow = baseFinancial * 0.7;
    const finHigh = baseFinancial * 1.3;
    const multLow = baseMultiple * 0.6;
    const multHigh = baseMultiple * 1.4;

    return generateSensitivityTable({
      baseFinancial,
      baseMultiple,
      netDebt,
      dilutedShares: shares,
      isEvBased: true,
      rowVariable: "financial",
      rowMin: finLow,
      rowMax: finHigh,
      rowSteps: 5,
      colVariable: "multiple",
      colMin: multLow,
      colMax: multHigh,
      colSteps: 5,
    });
  }, [analysis, multipleStats]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Analysis not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/analyses">Back to Analyses</Link>
        </Button>
      </div>
    );
  }

  const target = analysis.targetCompany;
  const currentPrice = target.sharePrice;
  const statusCfg = STATUS_CONFIG[analysis.status] || STATUS_CONFIG.draft;

  // Over/undervalued calculation
  const impliedMid = analysis.impliedShareMid;
  const overUnder =
    currentPrice && impliedMid
      ? ((currentPrice - impliedMid) / impliedMid) * 100
      : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        title={analysis.name}
        breadcrumbs={[
          { label: "Analyses", href: "/analyses" },
          { label: analysis.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={runCalculation}
              disabled={calculating}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${calculating ? "animate-spin" : ""}`}
              />
              {calculating ? "Calculating..." : "Recalculate"}
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/analyses/${id}/report`}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Link>
            </Button>
          </div>
        }
      />

      {/* Meta info */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
        <span>
          Target: <span className="text-foreground font-medium">{target.name}</span>
          {target.ticker && (
            <span className="text-muted-foreground"> ({target.ticker})</span>
          )}
        </span>
        <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
        <span>
          {analysis.primaryMultiple.replace(/_/g, "/")} &middot;{" "}
          {analysis.timePeriod}
        </span>
        <span>{analysis.comparables.length} comps</span>
      </div>

      {/* KPI Cards */}
      {analysis.impliedShareMid != null && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Current Price"
            value={formatSharePrice(currentPrice)}
          />
          <StatCard
            title="Implied Low (25th)"
            value={formatSharePrice(analysis.impliedShareLow)}
          />
          <StatCard
            title="Implied Mid (Median)"
            value={formatSharePrice(analysis.impliedShareMid)}
          />
          <StatCard
            title="Implied High (75th)"
            value={formatSharePrice(analysis.impliedShareHigh)}
            subtitle={
              overUnder != null
                ? overUnder > 0
                  ? `Overvalued by ${overUnder.toFixed(0)}%`
                  : `Undervalued by ${Math.abs(overUnder).toFixed(0)}%`
                : undefined
            }
            trend={overUnder != null ? (overUnder > 5 ? "down" : overUnder < -5 ? "up" : "neutral") : undefined}
          />
        </div>
      )}

      {/* 5-Tab Workspace */}
      <Tabs defaultValue="comp-table" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="comp-table">Comp Table</TabsTrigger>
          <TabsTrigger value="multiples">Multiples</TabsTrigger>
          <TabsTrigger value="implied">Implied Value</TabsTrigger>
          <TabsTrigger value="football">Football Field</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
        </TabsList>

        {/* TAB 1: Comp Table */}
        <TabsContent value="comp-table" className="mt-3">
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs uppercase tracking-wider">
                      Company
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      Mkt Cap
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      EV
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      Rev NTM
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      EBITDA NTM
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      Rev Grth
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider">
                      EBITDA Mgn
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysis.comparables
                    .filter((c) => c.isIncluded)
                    .map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium text-sm">
                          {comp.company.name}
                          {comp.company.ticker && (
                            <span className="text-muted-foreground text-xs ml-1">
                              {comp.company.ticker}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(comp.company.marketCap)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(comp.company.enterpriseValue)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(comp.company.revenueNTM)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatCurrency(comp.company.ebitdaNTM)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          <span
                            className={
                              (comp.company.revenueGrowthNTM ?? 0) >= 0
                                ? "text-accent-green"
                                : "text-accent-red"
                            }
                          >
                            {formatPercent(comp.company.revenueGrowthNTM)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatPercent(comp.company.ebitdaMarginNTM)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Separator + Target Row */}
                  <TableRow className="border-t-2 border-primary/30 bg-muted/30">
                    <TableCell className="font-bold text-sm text-primary">
                      {target.name}
                      {target.ticker && (
                        <span className="text-primary/70 text-xs ml-1">
                          {target.ticker}
                        </span>
                      )}
                      <Badge variant="outline" className="ml-2 text-xs">
                        TARGET
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      {formatCurrency(target.marketCap)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      {formatCurrency(target.enterpriseValue)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      {formatCurrency(target.revenueNTM)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      {formatCurrency(target.ebitdaNTM)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      <span
                        className={
                          (target.revenueGrowthNTM ?? 0) >= 0
                            ? "text-accent-green"
                            : "text-accent-red"
                        }
                      >
                        {formatPercent(target.revenueGrowthNTM)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums font-bold">
                      {formatPercent(target.ebitdaMarginNTM)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Multiples */}
        <TabsContent value="multiples" className="mt-3">
          <div className="rounded-lg border border-border bg-card">
            {analysis.calculatedMultiples.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No multiples calculated yet. Click &quot;Recalculate&quot; to
                compute valuation multiples.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Company
                      </TableHead>
                      {MULTIPLE_COLS.map((col) => (
                        <TableHead
                          key={col.key}
                          className="text-right text-xs uppercase tracking-wider"
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.calculatedMultiples.map((mult, i) => (
                      <TableRow
                        key={i}
                        className={mult.isOutlier ? "opacity-60" : ""}
                      >
                        <TableCell className="font-medium text-sm">
                          {mult.companyName}
                          {mult.isOutlier && (
                            <Star className="inline h-3 w-3 ml-1 text-accent-amber" />
                          )}
                        </TableCell>
                        {MULTIPLE_COLS.map((col) => {
                          const val = mult[
                            col.key as keyof typeof mult
                          ] as number | null;
                          return (
                            <TableCell
                              key={col.key}
                              className="text-right font-mono text-xs tabular-nums"
                            >
                              {formatMultiple(val)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}

                    {/* Stats Rows */}
                    {multipleStats && (
                      <>
                        <TableRow className="border-t-2 border-border bg-muted/30 font-medium">
                          <TableCell className="text-sm">Mean</TableCell>
                          {MULTIPLE_COLS.map((col) => (
                            <TableCell
                              key={col.key}
                              className="text-right font-mono text-xs tabular-nums"
                            >
                              {formatMultiple(multipleStats[col.key]?.mean ?? null)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow className="bg-muted/30 font-medium">
                          <TableCell className="text-sm">Median</TableCell>
                          {MULTIPLE_COLS.map((col) => (
                            <TableCell
                              key={col.key}
                              className="text-right font-mono text-xs tabular-nums"
                            >
                              {formatMultiple(
                                multipleStats[col.key]?.median ?? null
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="text-sm text-muted-foreground">
                            25th %ile
                          </TableCell>
                          {MULTIPLE_COLS.map((col) => (
                            <TableCell
                              key={col.key}
                              className="text-right font-mono text-xs tabular-nums text-muted-foreground"
                            >
                              {formatMultiple(multipleStats[col.key]?.p25 ?? null)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="text-sm text-muted-foreground">
                            75th %ile
                          </TableCell>
                          {MULTIPLE_COLS.map((col) => (
                            <TableCell
                              key={col.key}
                              className="text-right font-mono text-xs tabular-nums text-muted-foreground"
                            >
                              {formatMultiple(multipleStats[col.key]?.p75 ?? null)}
                            </TableCell>
                          ))}
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          {analysis.calculatedMultiples.some((m) => m.isOutlier) && (
            <p className="text-xs text-muted-foreground mt-2">
              <Star className="inline h-3 w-3 mr-1 text-accent-amber" /> =
              Outlier flagged (IQR method)
            </p>
          )}
        </TabsContent>

        {/* TAB 3: Implied Value */}
        <TabsContent value="implied" className="mt-3">
          <ImpliedValuationTab analysis={analysis} multipleStats={multipleStats} />
        </TabsContent>

        {/* TAB 4: Football Field */}
        <TabsContent value="football" className="mt-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium mb-3">
              Football Field &mdash; {target.name}
            </h3>
            <FootballFieldChart
              data={footballData}
              currentPrice={currentPrice}
              targetName={target.name}
            />
            {footballData.length > 0 && currentPrice != null && (
              <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm">
                <p>
                  <span className="font-medium">Assessment: </span>
                  {overUnder != null && overUnder > 10 && (
                    <span className="text-accent-red font-medium">
                      POTENTIALLY OVERVALUED ({overUnder.toFixed(0)}% above
                      median implied)
                    </span>
                  )}
                  {overUnder != null && overUnder < -10 && (
                    <span className="text-accent-green font-medium">
                      POTENTIALLY UNDERVALUED ({Math.abs(overUnder).toFixed(0)}%
                      below median implied)
                    </span>
                  )}
                  {overUnder != null &&
                    overUnder >= -10 &&
                    overUnder <= 10 && (
                      <span className="text-muted-foreground font-medium">
                        NEAR FAIR VALUE (within 10% of median implied)
                      </span>
                    )}
                  {overUnder == null && (
                    <span className="text-muted-foreground">
                      Run calculations to see assessment
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 5: Sensitivity */}
        <TabsContent value="sensitivity" className="mt-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium mb-1">
              Sensitivity Analysis &mdash; {target.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              NTM EBITDA ($M) vs EV/EBITDA Multiple &rarr; Implied Share Price
            </p>
            {sensitivityData ? (
              <SensitivityHeatmap
                rowLabels={sensitivityData.rowValues.map(
                  (v) => `$${v.toFixed(0)}M`
                )}
                colLabels={sensitivityData.colValues.map(
                  (v) => `${v.toFixed(1)}x`
                )}
                values={sensitivityData.matrix}
                currentPrice={currentPrice}
                rowHeader="EBITDA ($M)"
                colHeader="EV/EBITDA"
                baseRowIndex={sensitivityData.baseRowIndex}
                baseColIndex={sensitivityData.baseColIndex}
              />
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Sensitivity data not available. Run calculations first and ensure
                the target has NTM EBITDA and diluted shares data.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Implied Valuation Sub-component
// ---------------------------------------------------------------------------

function ImpliedValuationTab({
  analysis,
  multipleStats,
}: {
  analysis: AnalysisData;
  multipleStats: Record<string, ReturnType<typeof computeStats>> | null;
}) {
  const target = analysis.targetCompany;
  const currentPrice = target.sharePrice;
  const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
  const shares = target.dilutedShares ?? 0;

  // Default to primary multiple
  const defaultMultipleKey =
    analysis.primaryMultiple === "EV_EBITDA"
      ? analysis.timePeriod === "LTM"
        ? "evEbitdaLTM"
        : "evEbitdaNTM"
      : analysis.primaryMultiple === "EV_REVENUE"
        ? analysis.timePeriod === "LTM"
          ? "evRevenueLTM"
          : "evRevenueNTM"
        : analysis.timePeriod === "LTM"
          ? "peRatioLTM"
          : "peRatioNTM";

  const [selectedMultiple, setSelectedMultiple] = useState(defaultMultipleKey);
  const [selectedStat, setSelectedStat] = useState<"median" | "mean" | "p25" | "p75">("median");

  const stats = multipleStats?.[selectedMultiple];

  const multipleLabelMap: Record<string, string> = {};
  for (const col of MULTIPLE_COLS) {
    multipleLabelMap[col.key] = col.label;
  }

  // Get target financial for selected multiple
  const financialMap: Record<string, { value: number | null; label: string; isEvBased: boolean }> = {
    evRevenueLTM: { value: target.revenueLTM, label: "Revenue LTM", isEvBased: true },
    evRevenueNTM: { value: target.revenueNTM, label: "Revenue NTM", isEvBased: true },
    evEbitdaLTM: { value: target.ebitdaLTM, label: "EBITDA LTM", isEvBased: true },
    evEbitdaNTM: { value: target.ebitdaNTM, label: "EBITDA NTM", isEvBased: true },
    evEbitLTM: { value: target.ebitLTM, label: "EBIT LTM", isEvBased: true },
    evEbitNTM: { value: target.ebitNTM, label: "EBIT NTM", isEvBased: true },
    peRatioLTM: { value: target.netIncomeLTM, label: "Net Income LTM", isEvBased: false },
    peRatioNTM: { value: target.netIncomeNTM, label: "Net Income NTM", isEvBased: false },
  };

  const fin = financialMap[selectedMultiple];
  const multipleValue = stats
    ? stats[selectedStat as keyof typeof stats]
    : null;

  let impliedEV: number | null = null;
  let impliedEquity: number | null = null;
  let impliedPrice: number | null = null;

  if (fin?.value && multipleValue && shares > 0) {
    if (fin.isEvBased) {
      impliedEV = fin.value * multipleValue;
      impliedEquity = impliedEV - netDebt;
      impliedPrice = impliedEquity / shares;
    } else {
      impliedEquity = fin.value * multipleValue;
      impliedPrice = impliedEquity / shares;
    }
  }

  const priceComparison =
    currentPrice && impliedPrice
      ? ((currentPrice - impliedPrice) / impliedPrice) * 100
      : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Multiple</label>
          <Select value={selectedMultiple} onValueChange={setSelectedMultiple}>
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MULTIPLE_COLS.map((col) => (
                <SelectItem key={col.key} value={col.key} className="text-xs">
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Statistic</label>
          <Select
            value={selectedStat}
            onValueChange={(v) => setSelectedStat(v as typeof selectedStat)}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="median" className="text-xs">
                Median
              </SelectItem>
              <SelectItem value="mean" className="text-xs">
                Mean
              </SelectItem>
              <SelectItem value="p25" className="text-xs">
                25th Percentile
              </SelectItem>
              <SelectItem value="p75" className="text-xs">
                75th Percentile
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Valuation Bridge */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">
          Valuation Bridge ({multipleLabelMap[selectedMultiple]} &mdash;{" "}
          {selectedStat === "p25"
            ? "25th %ile"
            : selectedStat === "p75"
              ? "75th %ile"
              : selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)}
          : {formatMultiple(multipleValue)})
        </h3>

        {fin?.value && multipleValue ? (
          <div className="space-y-2 font-mono text-sm max-w-md">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Target {fin.label}:
              </span>
              <span>{formatCurrency(fin.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                x {selectedStat === "p25" ? "25th" : selectedStat === "p75" ? "75th" : selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)} Multiple:
              </span>
              <span>{formatMultiple(multipleValue)}</span>
            </div>

            {fin.isEvBased && (
              <>
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Implied Enterprise Value:</span>
                  <span>{formatCurrency(impliedEV)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    - Net Debt:
                  </span>
                  <span>({formatCurrency(Math.abs(netDebt))})</span>
                </div>
              </>
            )}

            <div className="border-t border-border pt-2 flex justify-between font-medium">
              <span>Implied Equity Value:</span>
              <span>{formatCurrency(impliedEquity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                / Diluted Shares:
              </span>
              <span>{target.dilutedShares?.toFixed(0)}M</span>
            </div>

            <div className="border-t-2 border-primary pt-2 flex justify-between font-bold text-base">
              <span>Implied Share Price:</span>
              <span className="text-primary">
                {formatSharePrice(impliedPrice)}
              </span>
            </div>

            {currentPrice != null && impliedPrice != null && (
              <div className="mt-3 p-2 rounded-md bg-muted/50 text-xs">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span>{formatSharePrice(currentPrice)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Difference:</span>
                  <span
                    className={
                      priceComparison! > 0
                        ? "text-accent-red"
                        : "text-accent-green"
                    }
                  >
                    {priceComparison! > 0
                      ? `Overvalued by ${priceComparison!.toFixed(1)}%`
                      : `Undervalued by ${Math.abs(priceComparison!).toFixed(1)}%`}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {!stats
              ? "Run calculations first to see the implied valuation."
              : "Target financial data not available for this multiple."}
          </p>
        )}
      </div>

      {/* Range Summary */}
      {stats && fin?.value && shares > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Implied Price Range</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                { label: "25th %ile", stat: "p25" },
                { label: "Median", stat: "median" },
                { label: "Mean", stat: "mean" },
                { label: "75th %ile", stat: "p75" },
              ] as const
            ).map(({ label, stat }) => {
              const mult = stats[stat];
              if (!mult || !fin.value) return null;
              const price = fin.isEvBased
                ? (fin.value * mult - netDebt) / shares
                : (fin.value * mult) / shares;
              return (
                <div
                  key={stat}
                  className="rounded-md border border-border p-2 text-center"
                >
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-mono font-bold tabular-nums mt-0.5">
                    {formatSharePrice(price)}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {formatMultiple(mult)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
