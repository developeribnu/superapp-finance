"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { FootballFieldChart } from "@/components/charts/football-field-chart";
import { formatSharePrice } from "@/lib/calculations/formatting";
import type { FootballFieldBar } from "@/types/calculations";

function computeStats(values: (number | null)[]) {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return null;
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
    (p25Idx % 1) * (nums[Math.ceil(p25Idx)] - nums[Math.floor(p25Idx)]);
  const p75 =
    nums[Math.floor(p75Idx)] +
    (p75Idx % 1) * (nums[Math.ceil(p75Idx)] - nums[Math.floor(p75Idx)]);
  return { mean, median, p25, p75, min: nums[0], max: nums[nums.length - 1] };
}

export default function FootballFieldPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const footballData = useMemo((): FootballFieldBar[] => {
    if (!analysis || !analysis.calculatedMultiples?.length) return [];
    const target = analysis.targetCompany;
    const netDebt = (target.totalDebt ?? 0) - (target.cashAndEquivalents ?? 0);
    const shares = target.dilutedShares ?? 0;
    if (shares === 0) return [];

    const mappings = [
      {
        key: "evRevenueNTM",
        label: "EV/Revenue NTM",
        financial: target.revenueNTM,
        isEvBased: true,
      },
      {
        key: "evRevenueLTM",
        label: "EV/Revenue LTM",
        financial: target.revenueLTM,
        isEvBased: true,
      },
      {
        key: "evEbitdaNTM",
        label: "EV/EBITDA NTM",
        financial: target.ebitdaNTM,
        isEvBased: true,
      },
      {
        key: "evEbitdaLTM",
        label: "EV/EBITDA LTM",
        financial: target.ebitdaLTM,
        isEvBased: true,
      },
      {
        key: "peRatioNTM",
        label: "P/E NTM",
        financial: target.netIncomeNTM,
        isEvBased: false,
      },
    ];

    const bars: FootballFieldBar[] = [];
    for (const m of mappings) {
      const vals = analysis.calculatedMultiples.map(
        (cm: any) => cm[m.key] as number | null
      );
      const stats = computeStats(vals);
      if (!stats || !m.financial) continue;

      const toPrice = (mult: number) =>
        m.isEvBased
          ? (m.financial! * mult - netDebt) / shares
          : (m.financial! * mult) / shares;

      bars.push({
        methodology: m.key,
        label: m.label,
        min: toPrice(stats.min),
        percentile25: toPrice(stats.p25),
        median: toPrice(stats.median),
        mean: toPrice(stats.mean),
        percentile75: toPrice(stats.p75),
        max: toPrice(stats.max),
      });
    }

    // 52-week range bar
    if (target.fiftyTwoWeekLow && target.fiftyTwoWeekHigh) {
      const mid = (target.fiftyTwoWeekLow + target.fiftyTwoWeekHigh) / 2;
      bars.push({
        methodology: "52week",
        label: "52-Week Range",
        min: target.fiftyTwoWeekLow,
        percentile25: target.fiftyTwoWeekLow + (mid - target.fiftyTwoWeekLow) * 0.25,
        median: mid,
        mean: mid,
        percentile75: mid + (target.fiftyTwoWeekHigh - mid) * 0.75,
        max: target.fiftyTwoWeekHigh,
      });
    }

    return bars;
  }, [analysis]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Analysis not found.
      </div>
    );
  }

  const target = analysis.targetCompany;
  const currentPrice = target.sharePrice;

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Football Field — ${target.name}`}
        breadcrumbs={[
          { label: "Analyses", href: "/analyses" },
          { label: analysis.name, href: `/analyses/${id}` },
          { label: "Football Field" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/analyses/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Analysis
            </Link>
          </Button>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4">
        <FootballFieldChart
          data={footballData}
          currentPrice={currentPrice}
          targetName={target.name}
        />
      </div>

      {footballData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm space-y-2">
          <h3 className="font-medium">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Current Price: </span>
              <span className="font-mono font-medium">
                {formatSharePrice(currentPrice)}
              </span>
            </div>
            {analysis.impliedShareLow != null && (
              <div>
                <span className="text-muted-foreground">
                  Implied Range (Primary):{" "}
                </span>
                <span className="font-mono font-medium">
                  {formatSharePrice(analysis.impliedShareLow)} &ndash;{" "}
                  {formatSharePrice(analysis.impliedShareHigh)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
