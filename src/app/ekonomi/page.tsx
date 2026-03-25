"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Percent,
  Activity,
  Globe,
} from "lucide-react";

const gdpData = [
  { year: "2019", gdp: 1120, growth: 4.2 },
  { year: "2020", gdp: 1059, growth: -5.5 },
  { year: "2021", gdp: 1186, growth: 12.0 },
  { year: "2022", gdp: 1319, growth: 11.2 },
  { year: "2023", gdp: 1417, growth: 7.4 },
  { year: "2024", gdp: 1520, growth: 7.3 },
];

const inflationData = [
  { month: "Jan 24", inflation: 2.6, target: 3 },
  { month: "Feb 24", inflation: 2.4, target: 3 },
  { month: "Mar 24", inflation: 2.3, target: 3 },
  { month: "Apr 24", inflation: 2.5, target: 3 },
  { month: "May 24", inflation: 2.2, target: 3 },
  { month: "Jun 24", inflation: 2.8, target: 3 },
];

const indicators = [
  {
    category: "Macro Indicators",
    items: [
      { name: "GDP Growth", value: "7.3%", change: "+0.1 q/q", trend: "up" },
      { name: "Inflation Rate", value: "2.8%", change: "-0.5 y/y", trend: "down" },
      { name: "Unemployment", value: "4.2%", change: "+0.3 y/y", trend: "up" },
      { name: "Interest Rate", value: "6.0%", change: "Unchanged", trend: "neutral" },
    ],
  },
  {
    category: "Indonesia Economic Data",
    items: [
      {
        name: "BI Rate (Ganda Kurs)",
        value: "6.0%",
        change: "Latest: Dec 2024",
        trend: "neutral",
      },
      {
        name: "Rupiah Exchange",
        value: "15,750",
        change: "+2.3% vs USD",
        trend: "up",
      },
      {
        name: "Forex Reserves",
        value: "$145.2B",
        change: "+8.5% YoY",
        trend: "up",
      },
      {
        name: "Trade Balance",
        value: "$2.8B",
        change: "+12% vs last month",
        trend: "up",
      },
    ],
  },
];

const sectorPerformance = [
  {
    sector: "Technology",
    growth: 9.2,
    contribution: 8.5,
    trend: "up",
  },
  {
    sector: "Finance",
    growth: 6.8,
    contribution: 7.2,
    trend: "up",
  },
  {
    sector: "Manufacturing",
    growth: 5.2,
    contribution: 15.3,
    trend: "up",
  },
  {
    sector: "Agriculture",
    growth: 3.1,
    contribution: 12.8,
    trend: "down",
  },
  {
    sector: "Energy",
    growth: 4.5,
    contribution: 11.2,
    trend: "up",
  },
];

const consumptionData = [
  { quarter: "Q1 2024", consumption: 65.2, investment: 28.5 },
  { quarter: "Q2 2024", consumption: 66.1, investment: 27.8 },
  { quarter: "Q3 2024", consumption: 67.3, investment: 28.2 },
  { quarter: "Q4 2024", consumption: 68.5, investment: 29.3 },
];

export default function Ekonomi() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "indonesia" | "sectors">(
    "overview"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Ekonomi</h1>
          <p className="text-slate-400">
            Macro/micro economics, Indonesian economic data, and market analysis
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "GDP Growth",
              value: "7.3%",
              change: "YoY growth",
              icon: TrendingUp,
            },
            {
              label: "Inflation Rate",
              value: "2.8%",
              change: "Current rate",
              icon: Percent,
            },
            {
              label: "Interest Rate",
              value: "6.0%",
              change: "BI Rate (Ganda)",
              icon: DollarSign,
            },
            {
              label: "Rupiah Rate",
              value: "15,750",
              change: "vs USD",
              icon: Globe,
            },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">{metric.label}</p>
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-slate-400 mt-1">{metric.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {["overview", "indonesia", "sectors"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "overview" | "indonesia" | "sectors")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "overview"
                ? "Global Overview"
                : tab === "indonesia"
                  ? "Indonesia Economy"
                  : "Sector Analysis"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* GDP Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                GDP Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gdpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="gdp" fill="#fbbf24" name="GDP (Billions USD)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Inflation Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Inflation Rate vs Target
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inflationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inflation"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    name="Actual Inflation"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target Range"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Macro Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Macroeconomic Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indicators[0].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/50 transition-colors"
                  >
                    <p className="text-slate-400 text-sm mb-2">{item.name}</p>
                    <p className="text-3xl font-bold text-amber-400">
                      {item.value}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        item.trend === "up"
                          ? "text-green-400"
                          : item.trend === "down"
                            ? "text-red-400"
                            : "text-slate-400"
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTab === "indonesia" && (
          <div className="space-y-6">
            {/* Indonesia Economic Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Indonesian Economic Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indicators[1].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/50 transition-colors"
                  >
                    <p className="text-slate-400 text-sm mb-2">{item.name}</p>
                    <p className="text-3xl font-bold text-amber-400">
                      {item.value}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        item.trend === "up"
                          ? "text-green-400"
                          : item.trend === "down"
                            ? "text-red-400"
                            : "text-slate-400"
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Consumption vs Investment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Consumption vs Investment
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="quarter" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="consumption" fill="#fbbf24" name="Consumption %" />
                  <Bar dataKey="investment" fill="#f59e0b" name="Investment %" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Key Facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  title: "Main Industries",
                  items: [
                    "Manufacturing (16%)",
                    "Wholesale/Retail (13%)",
                    "Agriculture (12%)",
                  ],
                },
                {
                  title: "Growth Drivers",
                  items: ["Consumer Spending", "FDI Inflows", "Infrastructure"],
                },
                {
                  title: "Challenges",
                  items: [
                    "Currency Volatility",
                    "Trade Deficit",
                    "Commodity Prices",
                  ],
                },
              ].map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-amber-400 font-semibold mb-3">
                    {fact.title}
                  </p>
                  <ul className="space-y-2">
                    {fact.items.map((item, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {selectedTab === "sectors" && (
          <div className="space-y-6">
            {/* Sector Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Sector Performance & Contribution
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Sector</th>
                    <th className="text-right py-3 text-slate-400">Growth %</th>
                    <th className="text-right py-3 text-slate-400">
                      GDP Contribution %
                    </th>
                    <th className="text-right py-3 text-slate-400">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorPerformance.map((sector, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 font-semibold text-white">
                        {sector.sector}
                      </td>
                      <td className="text-right py-3 text-amber-400 font-semibold">
                        {sector.growth}%
                      </td>
                      <td className="text-right py-3 text-white">
                        {sector.contribution}%
                      </td>
                      <td className="text-right py-3">
                        <span
                          className={`text-sm font-semibold ${
                            sector.trend === "up"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {sector.trend === "up" ? "↑ Up" : "↓ Down"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Sector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectorPerformance.map((sector, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-white">{sector.sector}</p>
                    <span
                      className={`text-lg font-bold ${
                        sector.trend === "up"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {sector.trend === "up" ? "↑" : "↓"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Growth</span>
                      <span className="text-amber-400 font-semibold">
                        {sector.growth}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                        style={{ width: `${(sector.growth / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-slate-400 text-sm">
                        GDP Contribution
                      </span>
                      <span className="text-green-400 font-semibold">
                        {sector.contribution}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
