"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { SensitivityHeatmap } from "@/components/charts/sensitivity-heatmap";
import { generateSensitivityTable } from "@/lib/calculations/sensitivity";

function computeMedian(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return null;
  nums.sort((a, b) => a - b);
  return nums.length % 2 === 0
    ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
    : nums[Math.floor(nums.length / 2)];
}

export default function SensitivityPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [finMin, setFinMin] = useState<number>(0);
  const [finMax, setFinMax] = useState<number>(0);
  const [multMin, setMultMin] = useState<number>(0);
  const [multMax, setMultMax] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const json = await res.json();
      if (json.success) {
        setAnalysis(json.data);
        const t = json.data.targetCompany;
        const baseFinancial = t.ebitdaNTM || 1000;
        const multiples = (json.data.calculatedMultiples || []).map(
          (m: any) => m.evEbitdaNTM as number | null
        );
        const medianMult = computeMedian(multiples) || 20;

        setFinMin(Math.round(baseFinancial * 0.7));
        setFinMax(Math.round(baseFinancial * 1.3));
        setMultMin(Math.round(medianMult * 0.6 * 10) / 10);
        setMultMax(Math.round(medianMult * 1.4 * 10) / 10);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sensitivityData = useMemo(() => {
    if (!analysis) return null;
    const t = analysis.targetCompany;
    const netDebt = (t.totalDebt ?? 0) - (t.cashAndEquivalents ?? 0);
    const shares = t.dilutedShares ?? 0;
    if (shares === 0 || finMin >= finMax || multMin >= multMax) return null;

    const baseFinancial = t.ebitdaNTM || (finMin + finMax) / 2;
    const multiples = (analysis.calculatedMultiples || []).map(
      (m: any) => m.evEbitdaNTM as number | null
    );
    const baseMultiple = computeMedian(multiples) || (multMin + multMax) / 2;

    return generateSensitivityTable({
      baseFinancial,
      baseMultiple,
      netDebt,
      dilutedShares: shares,
      isEvBased: true,
      rowVariable: "financial",
      rowMin: finMin,
      rowMax: finMax,
      rowSteps: 5,
      colVariable: "multiple",
      colMin: multMin,
      colMax: multMax,
      colSteps: 5,
    });
  }, [analysis, finMin, finMax, multMin, multMax]);

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
        title={`Sensitivity Analysis — ${target.name}`}
        breadcrumbs={[
          { label: "Analyses", href: "/analyses" },
          { label: analysis.name, href: `/analyses/${id}` },
          { label: "Sensitivity" },
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

      {/* Configuration */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">EBITDA Min ($M)</Label>
            <Input
              type="number"
              value={finMin}
              onChange={(e) => setFinMin(Number(e.target.value))}
              className="h-8 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">EBITDA Max ($M)</Label>
            <Input
              type="number"
              value={finMax}
              onChange={(e) => setFinMax(Number(e.target.value))}
              className="h-8 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Multiple Min (x)</Label>
            <Input
              type="number"
              step="0.1"
              value={multMin}
              onChange={(e) => setMultMin(Number(e.target.value))}
              className="h-8 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Multiple Max (x)</Label>
            <Input
              type="number"
              step="0.1"
              value={multMax}
              onChange={(e) => setMultMax(Number(e.target.value))}
              className="h-8 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium mb-1">Implied Share Price ($)</h3>
        <p className="text-xs text-muted-foreground mb-4">
          NTM EBITDA ($M) vs EV/EBITDA Multiple
        </p>
        {sensitivityData ? (
          <SensitivityHeatmap
            rowLabels={sensitivityData.rowValues.map((v) => `$${v.toFixed(0)}M`)}
            colLabels={sensitivityData.colValues.map((v) => `${v.toFixed(1)}x`)}
            values={sensitivityData.matrix}
            currentPrice={currentPrice}
            rowHeader="EBITDA ($M)"
            colHeader="EV/EBITDA"
            baseRowIndex={sensitivityData.baseRowIndex}
            baseColIndex={sensitivityData.baseColIndex}
          />
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Enter valid ranges to generate the sensitivity table. Ensure the
            target has NTM EBITDA and diluted shares data.
          </div>
        )}
      </div>
    </div>
  );
}
