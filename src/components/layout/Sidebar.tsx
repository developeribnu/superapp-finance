"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RiskLevel } from "@/lib/types";

interface SidebarArticle {
  title: string;
  slug: string;
  riskLevel?: RiskLevel;
}

interface SidebarProps {
  currentDomain: string;
  articles: SidebarArticle[];
}

const riskColorMap: Record<RiskLevel, string> = {
  rendah: "bg-green-500",
  sedang: "bg-blue-500",
  tinggi: "bg-amber-500",
  "sangat-tinggi": "bg-red-500",
};

const riskLabelMap: Record<RiskLevel, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  "sangat-tinggi": "Sangat Tinggi",
};

export function Sidebar({ currentDomain, articles }: SidebarProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-20 rounded-xl border border-[#1B4332]/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-[#1B4332] uppercase tracking-wide mb-3">
          Artikel
        </h3>

        {articles.length === 0 && (
          <p className="text-sm text-[#1B4332]/50">Belum ada artikel.</p>
        )}

        <ul className="space-y-1">
          {articles.map((article) => {
            const href = `/${currentDomain}/${article.slug}`;
            const isActive = pathname === href;

            return (
              <li key={article.slug}>
                <Link
                  href={href}
                  className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-[#1B4332]/10 text-[#1B4332] font-medium"
                      : "text-[#1B4332]/70 hover:bg-[#1B4332]/5 hover:text-[#1B4332]"
                  }`}
                >
                  {article.riskLevel && (
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${riskColorMap[article.riskLevel]}`}
                      title={`Risiko: ${riskLabelMap[article.riskLevel]}`}
                    />
                  )}
                  <span>{article.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Risk Legend */}
        {articles.some((a) => a.riskLevel) && (
          <div className="mt-4 pt-3 border-t border-[#1B4332]/10">
            <p className="text-xs font-medium text-[#1B4332]/50 mb-2">
              Tingkat Risiko
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {(Object.entries(riskColorMap) as [RiskLevel, string][]).map(
                ([level, color]) => (
                  <span key={level} className="flex items-center gap-1 text-xs text-[#1B4332]/60">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    {riskLabelMap[level]}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
