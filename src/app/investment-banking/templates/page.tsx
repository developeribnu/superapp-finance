import Link from "next/link";
import {
  Laptop,
  ShoppingCart,
  Landmark,
  Heart,
  Zap,
  Home,
  Phone,
  Wrench,
  File,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

// ---------------------------------------------------------------------------
// Sector category -> icon mapping
// ---------------------------------------------------------------------------

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Technology: <Laptop className="h-5 w-5" />,
  Consumer: <ShoppingCart className="h-5 w-5" />,
  Financials: <Landmark className="h-5 w-5" />,
  Healthcare: <Heart className="h-5 w-5" />,
  Energy: <Zap className="h-5 w-5" />,
  "Real Estate": <Home className="h-5 w-5" />,
  Telecom: <Phone className="h-5 w-5" />,
  Industrials: <Wrench className="h-5 w-5" />,
};

function getSectorIcon(category: string): React.ReactNode {
  return SECTOR_ICONS[category] ?? <File className="h-5 w-5" />;
}

// ---------------------------------------------------------------------------
// Helper: format a multiple key for display (e.g. EV_EBITDA -> EV/EBITDA)
// ---------------------------------------------------------------------------

function formatMultiple(key: string): string {
  return key.replace(/_/g, "/");
}

// ---------------------------------------------------------------------------
// Helper: format typical range object { low, mid, high } -> "6x - 10x - 16x"
// ---------------------------------------------------------------------------

function formatRange(range: { low: number; mid: number; high: number }): string {
  return `${range.low}x \u2013 ${range.mid}x \u2013 ${range.high}x`;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function TemplatesPage() {
  const templates = await prisma.sectorTemplate.findMany({
    include: { sector: true },
    orderBy: { sector: { category: "asc" } },
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sector Templates"
        subtitle="Pre-configured valuation templates by industry sector"
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={<File className="h-10 w-10" />}
          title="No templates available"
          description="Seed the database to load sector templates with recommended multiples and typical ranges."
          actionLabel="Go to Dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => {
            const multiples = JSON.parse(
              template.recommendedMultiples
            ) as string[];

            // Parse typical range fields
            const typicalEvEbitda = template.typicalEvEbitda
              ? (JSON.parse(template.typicalEvEbitda) as {
                  low: number;
                  mid: number;
                  high: number;
                })
              : null;
            const typicalEvRevenue = template.typicalEvRevenue
              ? (JSON.parse(template.typicalEvRevenue) as {
                  low: number;
                  mid: number;
                  high: number;
                })
              : null;
            const typicalPe = template.typicalPe
              ? (JSON.parse(template.typicalPe) as {
                  low: number;
                  mid: number;
                  high: number;
                })
              : null;

            // Parse selection criteria
            const criteria = template.selectionCriteria
              ? (JSON.parse(template.selectionCriteria) as string[])
              : null;

            const category = template.sector.category;
            const icon = getSectorIcon(category);

            return (
              <Card
                key={template.id}
                className="flex flex-col border-border bg-card hover:border-primary/30 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-muted-foreground">{icon}</span>
                      <div>
                        <CardTitle className="text-sm font-medium leading-tight">
                          {template.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {template.sector.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 pt-0">
                  {/* Description */}
                  {template.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  )}

                  {/* Primary & Secondary Multiples from Sector */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-foreground">
                      Key Multiples
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        variant="default"
                        className="text-xs"
                      >
                        {formatMultiple(template.sector.primaryMultiple)}
                      </Badge>
                      {template.sector.secondaryMultiple && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {formatMultiple(template.sector.secondaryMultiple)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Recommended Multiples */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-foreground">
                      Recommended Multiples
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {multiples.map((m) => (
                        <Badge
                          key={m}
                          variant="outline"
                          className="text-xs font-mono"
                        >
                          {formatMultiple(m)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Typical Ranges */}
                  {(typicalEvEbitda || typicalEvRevenue || typicalPe) && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-foreground">
                        Typical Ranges
                      </div>
                      <div className="rounded-md border border-border bg-muted/50 p-2 space-y-1">
                        {typicalEvEbitda && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              EV/EBITDA
                            </span>
                            <span className="font-mono text-foreground">
                              {formatRange(typicalEvEbitda)}
                            </span>
                          </div>
                        )}
                        {typicalEvRevenue && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              EV/Revenue
                            </span>
                            <span className="font-mono text-foreground">
                              {formatRange(typicalEvRevenue)}
                            </span>
                          </div>
                        )}
                        {typicalPe && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">P/E</span>
                            <span className="font-mono text-foreground">
                              {formatRange(typicalPe)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {template.notes && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {template.notes}
                    </p>
                  )}
                </CardContent>

                {/* Use Template CTA */}
                <div className="px-6 pb-4 pt-1">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/analyses/new">
                      Use Template
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
