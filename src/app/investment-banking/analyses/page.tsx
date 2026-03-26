"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, BarChart3, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { formatSharePrice } from "@/lib/calculations/formatting";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TargetCompany {
  id: string;
  name: string;
  ticker: string | null;
  sharePrice: number | null;
}

interface Analysis {
  id: string;
  name: string;
  description: string | null;
  status: "draft" | "in_progress" | "completed";
  primaryMultiple: string;
  timePeriod: string;
  impliedShareLow: number | null;
  impliedShareMid: number | null;
  impliedShareHigh: number | null;
  targetCompany: TargetCompany;
  _count: { comparables: number };
  updatedAt: string;
}

type SortKey =
  | "name"
  | "targetCompany"
  | "status"
  | "comparables"
  | "impliedShareMid"
  | "updatedAt";

type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  Analysis["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

/**
 * Formats a date string as relative time (e.g. "2h ago", "3d ago").
 */
function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Formats the implied share price range as "low - mid - high".
 */
function formatImpliedRange(analysis: Analysis): string {
  if (
    analysis.impliedShareLow == null &&
    analysis.impliedShareMid == null &&
    analysis.impliedShareHigh == null
  ) {
    return "\u2014";
  }

  return `${formatSharePrice(analysis.impliedShareLow)} \u2013 ${formatSharePrice(analysis.impliedShareMid)} \u2013 ${formatSharePrice(analysis.impliedShareHigh)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AnalysesPage() {
  const router = useRouter();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // ---------------------------------------------------------------------------
  // Fetch analyses on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const res = await fetch("/api/analyses");
        const json = await res.json();
        if (json.success) {
          setAnalyses(json.data);
        }
      } catch (err) {
        // Error handled gracefully by keeping empty state
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, []);

  // ---------------------------------------------------------------------------
  // Sorted data
  // ---------------------------------------------------------------------------
  const sortedAnalyses = useMemo(() => {
    const result = [...analyses];

    result.sort((a, b) => {
      let aVal: string | number | null;
      let bVal: string | number | null;

      switch (sortKey) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "targetCompany":
          aVal = a.targetCompany.name.toLowerCase();
          bVal = b.targetCompany.name.toLowerCase();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "comparables":
          aVal = a._count.comparables;
          bVal = b._count.comparables;
          break;
        case "impliedShareMid":
          aVal = a.impliedShareMid;
          bVal = b.impliedShareMid;
          break;
        case "updatedAt":
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
          break;
        default:
          return 0;
      }

      // Nulls always sort last regardless of direction
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const diff = (aVal as number) - (bVal as number);
      return sortOrder === "asc" ? diff : -diff;
    });

    return result;
  }, [analyses, sortKey, sortOrder]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder(key === "updatedAt" ? "desc" : "asc");
    }
  }

  function handleRowClick(id: string) {
    router.push(`/analyses/${id}`);
  }

  // ---------------------------------------------------------------------------
  // Sortable header helper
  // ---------------------------------------------------------------------------
  function SortableHeader({
    label,
    sortKeyValue,
    className,
  }: {
    label: string;
    sortKeyValue: SortKey;
    className?: string;
  }) {
    const isActive = sortKey === sortKeyValue;
    const SortIcon = isActive
      ? sortOrder === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;

    return (
      <TableHead className={className}>
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort(sortKeyValue)}
        >
          {label}
          <SortIcon
            className={`h-3 w-3 ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}
          />
        </button>
      </TableHead>
    );
  }

  // ---------------------------------------------------------------------------
  // Header actions (shared across all states)
  // ---------------------------------------------------------------------------
  const headerActions = (
    <Button asChild size="sm">
      <Link href="/analyses/new">
        <Plus className="h-4 w-4 mr-1" />
        New Analysis
      </Link>
    </Button>
  );

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Analyses"
          subtitle="Comparable company valuation analyses"
          actions={headerActions}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Target Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"># Comps</TableHead>
                <TableHead className="text-right">Implied Range</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-44 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  if (analyses.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Analyses"
          subtitle="Comparable company valuation analyses"
          actions={headerActions}
        />
        <EmptyState
          icon={<BarChart3 className="h-10 w-10" />}
          title="No analyses yet"
          description="Create your first comparable company analysis to get started with valuation."
          actionLabel="+ New Analysis"
          actionHref="/analyses/new"
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Analyses"
        subtitle="Comparable company valuation analyses"
        actions={headerActions}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader label="Name" sortKeyValue="name" />
              <SortableHeader
                label="Target Company"
                sortKeyValue="targetCompany"
              />
              <SortableHeader label="Status" sortKeyValue="status" />
              <SortableHeader
                label="# Comps"
                sortKeyValue="comparables"
                className="text-right"
              />
              <SortableHeader
                label="Implied Range"
                sortKeyValue="impliedShareMid"
                className="text-right"
              />
              <SortableHeader
                label="Last Updated"
                sortKeyValue="updatedAt"
                className="text-right"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAnalyses.map((analysis) => {
              const statusConfig = STATUS_CONFIG[analysis.status];

              return (
                <TableRow
                  key={analysis.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(analysis.id)}
                >
                  {/* Name */}
                  <TableCell>
                    <div className="font-medium">{analysis.name}</div>
                    {analysis.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {analysis.description}
                      </p>
                    )}
                  </TableCell>

                  {/* Target Company */}
                  <TableCell>
                    <div>{analysis.targetCompany.name}</div>
                    {analysis.targetCompany.ticker && (
                      <span className="text-xs text-muted-foreground">
                        {analysis.targetCompany.ticker}
                        {analysis.targetCompany.sharePrice != null && (
                          <span className="font-mono tabular-nums">
                            {" "}
                            @ {formatSharePrice(analysis.targetCompany.sharePrice)}
                          </span>
                        )}
                      </span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>

                  {/* # Comps */}
                  <TableCell className="text-right font-mono tabular-nums">
                    {analysis._count.comparables}
                  </TableCell>

                  {/* Implied Range */}
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatImpliedRange(analysis)}
                  </TableCell>

                  {/* Last Updated */}
                  <TableCell className="text-right text-muted-foreground">
                    {formatRelativeTime(analysis.updatedAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
