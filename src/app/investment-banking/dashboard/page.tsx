"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calculator,
  CheckCircle,
  Users,
  Plus,
  Database,
  BookOpen,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/calculations/formatting";

interface DashboardData {
  totalCompanies: number;
  totalAnalyses: number;
  completedAnalyses: number;
  avgComps: number;
  recentAnalyses: any[];
  sectorBreakdown: { name: string; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [companiesRes, analysesRes] = await Promise.all([
        fetch("/api/companies?limit=200"),
        fetch("/api/analyses?limit=200"),
      ]);
      const companies = await companiesRes.json();
      const analyses = await analysesRes.json();

      const companyList = companies.success ? companies.data : [];
      const analysisList = analyses.success ? analyses.data : [];

      // Sector breakdown
      const sectorMap = new Map<string, number>();
      for (const c of companyList) {
        const sectorName = c.sector?.name || "Unknown";
        sectorMap.set(sectorName, (sectorMap.get(sectorName) || 0) + 1);
      }
      const sectorBreakdown = Array.from(sectorMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Avg comps
      const completedAnalyses = analysisList.filter(
        (a: any) => a.status === "completed"
      );
      const totalComps = analysisList.reduce(
        (sum: number, a: any) => sum + (a._count?.comparables || a.comparables?.length || 0),
        0
      );
      const avgComps =
        analysisList.length > 0
          ? (totalComps / analysisList.length)
          : 0;

      setData({
        totalCompanies: companies.total || companyList.length,
        totalAnalyses: analyses.total || analysisList.length,
        completedAnalyses: completedAnalyses.length,
        avgComps: Math.round(avgComps * 10) / 10,
        recentAnalyses: analysisList
          .sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5),
        sectorBreakdown,
      });
    } catch (error) {
      // Error handled gracefully by keeping previous data or showing empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        toast.success("Demo data seeded successfully!");
        await fetchData();
      } else {
        toast.error(result.error || "Failed to seed data");
      }
    } catch {
      toast.error("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  };

  const statusColor: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    in_progress: "bg-accent-amber/20 text-accent-amber",
    completed: "bg-accent-green/20 text-accent-green",
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  const isEmpty = data && data.totalCompanies === 0 && data.totalAnalyses === 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Companies"
          value={data?.totalCompanies ?? 0}
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          title="Total Analyses"
          value={data?.totalAnalyses ?? 0}
          icon={<Calculator className="h-4 w-4" />}
        />
        <StatCard
          title="Completed"
          value={data?.completedAnalyses ?? 0}
          subtitle="analyses"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Comps per Set"
          value={data?.avgComps?.toFixed(1) ?? "0.0"}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Analyses */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-3">
          <h2 className="text-sm font-medium text-foreground mb-3">
            Recent Analyses
          </h2>
          {data && data.recentAnalyses.length > 0 ? (
            <div className="space-y-2">
              {data.recentAnalyses.map((analysis: any) => (
                <Link
                  key={analysis.id}
                  href={`/analyses/${analysis.id}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {analysis.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {analysis.targetCompany?.name || "—"} (
                      {analysis.targetCompany?.ticker || "—"})
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColor[analysis.status] || ""}`}
                    >
                      {analysis.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(analysis.updatedAt)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No analyses yet. Create your first analysis to get started.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <h2 className="text-sm font-medium text-foreground mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                variant="default"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/analyses/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/companies/new")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Add Company
              </Button>
              {isEmpty && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleSeed}
                  disabled={seeding}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {seeding ? "Seeding..." : "Seed Demo Data"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/learn")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                IB Methodology
              </Button>
            </div>
          </div>

          {/* Sector Breakdown */}
          {data && data.sectorBreakdown.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-3">
              <h2 className="text-sm font-medium text-foreground mb-3">
                Sector Breakdown
              </h2>
              <div className="space-y-1">
                {data.sectorBreakdown.slice(0, 6).map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-24 truncate">
                      {s.name}
                    </span>
                    <div className="flex-1 bg-muted rounded-sm h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-sm transition-all"
                        style={{
                          width: `${(s.count / Math.max(...data.sectorBreakdown.map((x) => x.count))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums w-6 text-right">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Companies by Sector Chart */}
      {data && data.sectorBreakdown.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3">
          <h2 className="text-sm font-medium text-foreground mb-3">
            Companies by Sector
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data.sectorBreakdown}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 10, fill: "var(--foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs">
                      <p className="font-medium">{item.name}</p>
                      <p className="font-mono">{item.count} companies</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
