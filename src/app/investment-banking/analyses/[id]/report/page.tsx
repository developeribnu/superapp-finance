"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
  formatCurrency,
  formatMultiple,
  formatSharePrice,
  formatPercent,
} from "@/lib/calculations/formatting";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeStats(values: (number | null)[]) {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return null;
  nums.sort((a, b) => a - b);
  const mean = nums.reduce((s, v) => s + v, 0) / nums.length;
  const median =
    nums.length % 2 === 0
      ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
      : nums[Math.floor(nums.length / 2)];
  return { mean, median, min: nums[0], max: nums[nums.length - 1], count: nums.length };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const json = await res.json();
      if (json.success) setAnalysis(json.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  const target = analysis?.targetCompany;
  const comps = analysis?.comparables ?? [];
  const multiples = analysis?.calculatedMultiples ?? [];
  const currentPrice = target?.sharePrice;

  const multipleStats = useMemo(() => {
    if (!multiples.length) return {};
    const keys = [
      { key: "evRevenueNTM", label: "EV/Revenue NTM" },
      { key: "evRevenueLTM", label: "EV/Revenue LTM" },
      { key: "evEbitdaNTM", label: "EV/EBITDA NTM" },
      { key: "evEbitdaLTM", label: "EV/EBITDA LTM" },
      { key: "peRatioNTM", label: "P/E NTM" },
      { key: "peRatioLTM", label: "P/E LTM" },
      { key: "priceToBook", label: "P/Book" },
    ];
    const result: Record<string, { label: string; mean: number; median: number; min: number; max: number; count: number }> = {};
    for (const k of keys) {
      const vals = multiples.map((m: any) => m[k.key] as number | null);
      const s = computeStats(vals);
      if (s) result[k.key] = { label: k.label, ...s };
    }
    return result;
  }, [multiples]);

  // Football field bars
  const footballBars = useMemo(() => {
    if (!target || !multiples.length) return [];
    const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
    const shares = target.dilutedShares ?? 0;
    if (shares === 0) return [];

    const mappings = [
      { key: "evRevenueNTM", label: "EV/Revenue NTM", financial: target.revenueNTM, isEvBased: true },
      { key: "evEbitdaNTM", label: "EV/EBITDA NTM", financial: target.ebitdaNTM, isEvBased: true },
      { key: "evEbitdaLTM", label: "EV/EBITDA LTM", financial: target.ebitdaLTM, isEvBased: true },
      { key: "peRatioNTM", label: "P/E NTM", financial: target.netIncomeNTM, isEvBased: false },
    ];

    const bars: { label: string; min: number; median: number; max: number }[] = [];
    for (const m of mappings) {
      const vals = multiples.map((cm: any) => cm[m.key] as number | null);
      const stats = computeStats(vals);
      if (!stats || !m.financial) continue;
      const toPrice = (mult: number) =>
        m.isEvBased ? (m.financial! * mult - netDebt) / shares : (m.financial! * mult) / shares;
      bars.push({ label: m.label, min: toPrice(stats.min), median: toPrice(stats.median), max: toPrice(stats.max) });
    }

    if (target.fiftyTwoWeekLow && target.fiftyTwoWeekHigh) {
      bars.push({
        label: "52-Week Range",
        min: target.fiftyTwoWeekLow,
        median: (target.fiftyTwoWeekLow + target.fiftyTwoWeekHigh) / 2,
        max: target.fiftyTwoWeekHigh,
      });
    }

    return bars;
  }, [target, multiples]);

  // Football field domain
  const ffDomain = useMemo(() => {
    if (footballBars.length === 0) return { min: 0, max: 100 };
    const allVals = footballBars.flatMap((b) => [b.min, b.max]);
    if (currentPrice != null) allVals.push(currentPrice);
    return { min: Math.max(0, Math.min(...allVals) * 0.85), max: Math.max(...allVals) * 1.15 };
  }, [footballBars, currentPrice]);

  // -------------------------------------------------------------------------
  // Export handlers
  // -------------------------------------------------------------------------

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${analysis?.name || "report"}-valuation-report.pdf`);
    } catch (err) {
      // Error handled gracefully - PDF export failure is logged but user continues
    } finally {
      setExporting(false);
    }
  }, [analysis]);

  // -------------------------------------------------------------------------
  // Loading / empty states
  // -------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  if (!analysis || !target) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Analysis not found.
      </div>
    );
  }

  const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Navigation bar - hidden in print */}
      <div className="print:hidden">
        <PageHeader
          title={`Valuation Report — ${target.name}`}
          breadcrumbs={[
            { label: "Analyses", href: "/analyses" },
            { label: analysis.name, href: `/analyses/${id}` },
            { label: "Report" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button size="sm" onClick={handleExportPdf} disabled={exporting}>
                <Download className="h-4 w-4 mr-1" />
                {exporting ? "Exporting…" : "Export PDF"}
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/analyses/${id}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
            </div>
          }
        />
      </div>

      {/* ============================================================== */}
      {/* Printable Report Content                                       */}
      {/* ============================================================== */}
      <div
        ref={reportRef}
        className="bg-white text-gray-900 rounded-lg border border-border print:border-0 print:rounded-none"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Comparable Company Analysis
              </h1>
              <h2 className="text-lg font-semibold text-blue-700 mt-1">
                {target.name}
                {target.ticker && (
                  <span className="text-gray-500 font-normal ml-2">
                    ({target.ticker})
                  </span>
                )}
              </h2>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{reportDate}</p>
              <p className="mt-1">CONFIDENTIAL</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Executive Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Current Share Price" value={formatSharePrice(currentPrice)} />
            <SummaryCard label="Market Capitalization" value={formatCurrency(target.marketCap)} />
            <SummaryCard label="Enterprise Value" value={formatCurrency(target.enterpriseValue)} />
            <SummaryCard label="Net Debt" value={formatCurrency(netDebt)} />
          </div>

          {analysis.impliedShareLow != null && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">
                    Implied Valuation Range (Primary Multiple)
                  </p>
                  <p className="text-xl font-bold text-blue-900 mt-1 font-mono tabular-nums">
                    {formatSharePrice(analysis.impliedShareLow)} &ndash;{" "}
                    {formatSharePrice(analysis.impliedShareMid)} &ndash;{" "}
                    {formatSharePrice(analysis.impliedShareHigh)}
                  </p>
                </div>
                {currentPrice != null && analysis.impliedShareMid != null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">vs. Current Price</p>
                    <p
                      className={`text-lg font-bold font-mono ${
                        analysis.impliedShareMid >= currentPrice
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysis.impliedShareMid >= currentPrice ? "+" : ""}
                      {(((analysis.impliedShareMid - currentPrice) / currentPrice) * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comparable Set */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Comparable Companies ({comps.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">Company</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Market Cap</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">EV</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Revenue NTM</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">EBITDA NTM</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">EBITDA Margin</th>
                  <th className="text-right py-2 pl-2 font-semibold text-gray-700">Rev Growth</th>
                </tr>
              </thead>
              <tbody>
                {comps.map((comp: any) => {
                  const c = comp.company;
                  return (
                    <tr key={c.id} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3">
                        <span className="font-medium">{c.name}</span>
                        {c.ticker && <span className="text-gray-400 ml-1">({c.ticker})</span>}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatCurrency(c.marketCap)}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatCurrency(c.enterpriseValue)}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatCurrency(c.revenueNTM)}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatCurrency(c.ebitdaNTM)}</td>
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums">{formatPercent(c.ebitdaMarginLTM)}</td>
                      <td className="py-1.5 pl-2 text-right font-mono tabular-nums">{formatPercent(c.revenueGrowthNTM)}</td>
                    </tr>
                  );
                })}
                {/* Target row highlighted */}
                <tr className="border-t-2 border-blue-300 bg-blue-50">
                  <td className="py-1.5 pr-3 font-bold text-blue-800">
                    {target.name}
                    {target.ticker && <span className="text-blue-400 ml-1">({target.ticker})</span>}
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatCurrency(target.marketCap)}</td>
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatCurrency(target.enterpriseValue)}</td>
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatCurrency(target.revenueNTM)}</td>
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatCurrency(target.ebitdaNTM)}</td>
                  <td className="py-1.5 px-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatPercent(target.ebitdaMarginLTM)}</td>
                  <td className="py-1.5 pl-2 text-right font-mono tabular-nums font-bold text-blue-800">{formatPercent(target.revenueGrowthNTM)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Valuation Multiples */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Valuation Multiples Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">Company</th>
                  {Object.values(multipleStats).map((s: any) => (
                    <th key={s.label} className="text-right py-2 px-2 font-semibold text-gray-700">{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {multiples.map((m: any) => (
                  <tr key={m.companyId || m.companyName} className="border-b border-gray-100">
                    <td className="py-1.5 pr-3 font-medium">
                      {m.companyName}
                      {m.isOutlier && <span className="text-amber-500 ml-1">*</span>}
                    </td>
                    {Object.keys(multipleStats).map((key) => (
                      <td key={key} className="py-1.5 px-2 text-right font-mono tabular-nums">{formatMultiple(m[key])}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-1.5 pr-3 font-semibold text-gray-700">Mean</td>
                  {Object.values(multipleStats).map((s: any) => (
                    <td key={`mean-${s.label}`} className="py-1.5 px-2 text-right font-mono tabular-nums font-semibold">{formatMultiple(s.mean)}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-1.5 pr-3 font-semibold text-gray-700">Median</td>
                  {Object.values(multipleStats).map((s: any) => (
                    <td key={`med-${s.label}`} className="py-1.5 px-2 text-right font-mono tabular-nums font-semibold">{formatMultiple(s.median)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Football Field (CSS-based for print) */}
        {footballBars.length > 0 && (
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Football Field — Implied Share Price Ranges
            </h3>
            <div className="space-y-3">
              {footballBars.map((bar) => {
                const range = ffDomain.max - ffDomain.min;
                const leftPct = ((bar.min - ffDomain.min) / range) * 100;
                const widthPct = ((bar.max - bar.min) / range) * 100;
                const medianPct = ((bar.median - ffDomain.min) / range) * 100;

                return (
                  <div key={bar.label} className="flex items-center gap-3">
                    <div className="w-32 text-xs font-medium text-gray-700 text-right shrink-0">
                      {bar.label}
                    </div>
                    <div className="flex-1 relative h-6 bg-gray-100 rounded">
                      <div
                        className="absolute h-full bg-blue-200 rounded"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
                        style={{ left: `${medianPct}%` }}
                      />
                      {currentPrice != null && (
                        <div
                          className="absolute top-0 h-full w-px bg-amber-500"
                          style={{ left: `${((currentPrice - ffDomain.min) / range) * 100}%` }}
                        />
                      )}
                    </div>
                    <div className="w-40 flex gap-2 text-xs font-mono tabular-nums text-gray-600 shrink-0">
                      <span>{formatSharePrice(bar.min)}</span>
                      <span className="text-gray-300">|</span>
                      <span className="font-semibold text-blue-700">{formatSharePrice(bar.median)}</span>
                      <span className="text-gray-300">|</span>
                      <span>{formatSharePrice(bar.max)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 bg-blue-200 rounded" />
                <span>Min–Max Range</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>Median</span>
              </div>
              {currentPrice != null && (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-px bg-amber-500" />
                  <span>Current Price ({formatSharePrice(currentPrice)})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Implied Valuation */}
        {analysis.impliedShareLow != null && (
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Implied Valuation Bridge
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <ValuationColumn
                label="Low (25th Pctl)"
                sharePrice={analysis.impliedShareLow}
                ev={analysis.impliedEvLow}
                currentPrice={currentPrice}
              />
              <ValuationColumn
                label="Mid (Median)"
                sharePrice={analysis.impliedShareMid}
                ev={analysis.impliedEvMid}
                currentPrice={currentPrice}
                highlight
              />
              <ValuationColumn
                label="High (75th Pctl)"
                sharePrice={analysis.impliedShareHigh}
                ev={analysis.impliedEvHigh}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="px-8 py-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Disclaimer
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            This report has been prepared using a comparable company analysis methodology
            and is intended for informational purposes only. The implied valuations
            presented herein are based on publicly available financial data and comparable
            company trading multiples as of the report date. This analysis does not
            constitute investment advice, a recommendation, or an offer to buy or sell any
            securities. Past performance is not indicative of future results. The
            methodologies, assumptions, and estimates contained in this report are subject
            to significant uncertainty and may change materially. Recipients should conduct
            their own independent analysis and consult with qualified financial advisors
            before making any investment decisions.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Generated by IB Valuation Toolkit on {reportDate}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-bold font-mono tabular-nums text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function ValuationColumn({
  label,
  sharePrice,
  ev,
  currentPrice,
  highlight = false,
}: {
  label: string;
  sharePrice: number | null;
  ev: number | null;
  currentPrice: number | null;
  highlight?: boolean;
}) {
  const upDown =
    sharePrice != null && currentPrice != null
      ? ((sharePrice - currentPrice) / currentPrice) * 100
      : null;

  return (
    <div className={`p-4 rounded-lg border ${highlight ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-xl font-bold font-mono tabular-nums text-gray-900">{formatSharePrice(sharePrice)}</p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Implied EV</span>
          <span className="font-mono tabular-nums text-gray-700">{formatCurrency(ev)}</span>
        </div>
        {upDown != null && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">vs. Current</span>
            <span className={`font-mono tabular-nums font-semibold ${upDown >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {upDown >= 0 ? "+" : ""}{upDown.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
