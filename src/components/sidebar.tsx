"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  Bitcoin,
  Building2,
  BarChart3,
  Zap,
  Target,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  Wallet: <Wallet className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Bitcoin: <Bitcoin className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
};

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "Home",
    description: "Overview",
  },
  {
    id: "personal-finance",
    label: "Personal Finance",
    href: "/personal-finance",
    icon: "Wallet",
    description: "Budgeting & savings",
  },
  {
    id: "investment",
    label: "Investment",
    href: "/investment",
    icon: "TrendingUp",
    description: "Stocks & portfolio",
  },
  {
    id: "crypto",
    label: "Crypto",
    href: "/crypto",
    icon: "Bitcoin",
    description: "Digital assets",
  },
  {
    id: "investment-banking",
    label: "Investment Banking",
    href: "/investment-banking",
    icon: "Building2",
    description: "M&A & valuation",
  },
  {
    id: "ekonomi",
    label: "Ekonomi",
    href: "/ekonomi",
    icon: "BarChart3",
    description: "Economic data",
  },
  {
    id: "smart-money",
    label: "Smart Money",
    href: "/smart-money",
    icon: "Zap",
    description: "Whale tracking",
  },
  {
    id: "polymarket",
    label: "Polymarket",
    href: "/polymarket",
    icon: "Target",
    description: "Prediction markets",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-amber-600/10 border border-amber-600/30 hover:bg-amber-600/20 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-amber-500" />
        ) : (
          <Menu className="w-6 h-6 text-amber-500" />
        )}
      </button>

      <motion.aside
        initial={false}
        animate={{
          marginLeft: isOpen ? "0" : "-100%",
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-amber-600/20 flex flex-col z-40 md:relative md:marginLeft-0 md:animate-none"
      >
        <div className="p-6 border-b border-amber-600/20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-bold gold-gradient">FinSuper</h1>
            <p className="text-xs text-slate-400">
              Comprehensive Financial Dashboard
            </p>
          </motion.div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item, idx) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "bg-amber-600/20 border border-amber-500 text-amber-300"
                      : "text-slate-300 border border-slate-700/50 hover:border-amber-600/50 hover:bg-amber-600/10"
                  }`}
                >
                  <span
                    className={`mt-1 ${isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400"}`}
                  >
                    {item.icon === "Home" ? (
                      <Home className="w-5 h-5" />
                    ) : (
                      iconMap[item.icon]
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.label}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-600/20 bg-amber-600/5">
          <div className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/30">
            <p className="text-xs font-semibold text-amber-300 mb-1">
              Market Status
            </p>
            <p className="text-xs text-slate-400">Live • 24/7 Available</p>
          </div>
        </div>
      </motion.aside>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}
