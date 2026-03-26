"use client";

import { useState } from "react";
import Link from "next/link";
import { domains } from "@/lib/domains";
import {
  Menu,
  X,
  Search,
  Calculator,
  BookOpenText,
  ChevronDown,
  Compass,
  Wallet,
  Building2,
  TrendingUp,
  Gem,
  Bitcoin,
  Shield,
  CreditCard,
  Store,
  Smartphone,
  Receipt,
  Globe,
  Target,
  Palmtree,
  ArrowLeftRight,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Compass,
  Wallet,
  Building2,
  TrendingUp,
  Gem,
  Bitcoin,
  Shield,
  CreditCard,
  Store,
  Smartphone,
  Receipt,
  Globe,
  Target,
  Palmtree,
  ArrowLeftRight,
  Lock,
};

export function Navbar(): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [megaOpen, setMegaOpen] = useState<boolean>(false);

  const columns = [
    domains.slice(0, 4),
    domains.slice(4, 8),
    domains.slice(8, 12),
    domains.slice(12, 16),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF5] border-b border-[#1B4332]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-[#1B4332]">
              Finansial Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Domains Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-[#1B4332]/80 hover:text-[#1B4332] transition-colors"
                onClick={() => setMegaOpen((prev) => !prev)}
              >
                Topik
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {megaOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white rounded-xl shadow-lg border border-[#1B4332]/10 p-6">
                  <div className="grid grid-cols-4 gap-4">
                    {columns.map((column, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-2">
                        {column.map((domain) => {
                          const Icon = iconMap[domain.icon];
                          return (
                            <Link
                              key={domain.id}
                              href={`/${domain.slug}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-[#1B4332]/80 hover:bg-[#1B4332]/5 hover:text-[#1B4332] transition-colors"
                              onClick={() => setMegaOpen(false)}
                            >
                              {Icon && <Icon className="w-4 h-4 shrink-0" />}
                              <span className="truncate">{domain.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/kalkulator"
              className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332]/80 hover:text-[#1B4332] transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Kalkulator
            </Link>

            <Link
              href="/books"
              className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332]/80 hover:text-[#1B4332] transition-colors"
            >
              <BookOpenText className="w-4 h-4" />
              Books Hub
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332]/80 hover:text-[#1B4332] transition-colors"
            >
              <Search className="w-4 h-4" />
              Cari
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-[#1B4332] hover:bg-[#1B4332]/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1B4332]/10 bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/kalkulator"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#1B4332]/80 hover:bg-[#1B4332]/5 hover:text-[#1B4332] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Calculator className="w-4 h-4" />
              Kalkulator
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#1B4332]/80 hover:bg-[#1B4332]/5 hover:text-[#1B4332] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Search className="w-4 h-4" />
              Cari
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#1B4332]/80 hover:bg-[#1B4332]/5 hover:text-[#1B4332] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <BookOpenText className="w-4 h-4" />
              Books Hub
            </Link>

            <div className="pt-2 border-t border-[#1B4332]/10">
              <p className="px-3 py-1 text-xs font-semibold text-[#D4A373] uppercase tracking-wide">
                Topik
              </p>
              {domains.map((domain) => {
                const Icon = iconMap[domain.icon];
                return (
                  <Link
                    key={domain.id}
                    href={`/${domain.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#1B4332]/80 hover:bg-[#1B4332]/5 hover:text-[#1B4332] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    <span>{domain.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
