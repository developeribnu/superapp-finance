import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { METHODOLOGY_INFO } from "@/lib/data/methodology-info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/shared/page-header";

// ---------------------------------------------------------------------------
// Section order matching the spec
// ---------------------------------------------------------------------------

const SECTION_ORDER: (keyof typeof METHODOLOGY_INFO)[] = [
  "comparableAnalysis",
  "enterpriseValue",
  "evEbitda",
  "evRevenue",
  "peRatio",
  "priceToBook",
  "footballField",
  "outlierDetection",
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function LearnPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="IB Methodology Reference"
        subtitle="Learn the fundamentals of Investment Banking valuation"
      />

      <div className="rounded-lg border border-border bg-card">
        <Accordion type="multiple" className="w-full">
          {SECTION_ORDER.map((key) => {
            const info = METHODOLOGY_INFO[key];
            if (!info) return null;

            const hasFormula = "formula" in info && info.formula;

            return (
              <AccordionItem key={key} value={key} className="px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    {info.title}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>

                  {/* Formula */}
                  {hasFormula && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-foreground">
                        Formula
                      </div>
                      <pre className="rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                        {info.formula}
                      </pre>
                    </div>
                  )}

                  {/* Key Points */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-foreground">
                      Key Points
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {info.keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex gap-2 leading-relaxed"
                        >
                          <span className="text-primary mt-0.5 shrink-0">
                            &bull;
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-1">
                    <Link
                      href="/analyses/new"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Try it: Go to Analyses &rarr; New
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
