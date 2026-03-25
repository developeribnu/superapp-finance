"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Calculator,
  Zap,
  Target,
  Plus,
} from "lucide-react";

const dealsPipeline = [
  {
    company: "TechCorp Inc.",
    type: "Acquisition",
    value: 2500,
    status: "Due Diligence",
    progress: 75,
  },
  {
    company: "FinServe Ltd.",
    type: "Merger",
    value: 3800,
    status: "Negotiation",
    progress: 55,
  },
  {
    company: "RetailGlobal",
    type: "Spin-off",
    value: 1200,
    status: "Approved",
    progress: 90,
  },
  {
    company: "EnergyPlus Co.",
    type: "Joint Venture",
    value: 850,
    status: "Initial Contact",
    progress: 20,
  },
];

const dcfAnalysis = [
  { year: "2024", fcf: 150, pv: 147 },
  { year: "2025", fcf: 180, pv: 172 },
  { year: "2026", fcf: 215, pv: 195 },
  { year: "2027", fcf: 258, pv: 224 },
  { year: "2028", fcf: 310, pv: 258 },
];

const valuationMetrics = [
  { metric: "Enterprise Value", value: "$4.5B", vs: "+8.2% vs peer avg" },
  { metric: "EV/EBITDA", value: "12.5x", vs: "-0.3x vs industry" },
  { metric: "EV/Revenue", value: "8.2x", vs: "+1.5x vs comparable" },
  { metric: "Price/Book", value: "4.8x", vs: "+0.5x vs sector" },
];

const comparables = [
  {
    company: "Market Leader A",
    ev: 5200,
    revenue: 680,
    ebitda: 420,
    multiple: 12.4,
  },
  {
    company: "Competitor B",
    ev: 3800,
    revenue: 520,
    ebitda: 310,
    multiple: 12.3,
  },
  {
    company: "Similar Peer C",
    ev: 4100,
    revenue: 530,
    ebitda: 335,
    multiple: 12.2,
  },
  {
    company: "Target Company",
    ev: 4500,
    revenue: 580,
    ebitda: 360,
    multiple: 12.5,
  },
];

interface DCFInput {
  revenue: number;
  ebitdaMargin: number;
  taxRate: number;
  wacc: number;
  terminalGrowth: number;
}

interface DCFResult {
  enterpriseValue: number;
  equity: number;
  perShare: number;
}

export default function InvestmentBanking() {
  const [activeTab, setActiveTab] = useState<"overview" | "dcf" | "comparables">(
    "overview"
  );
  const [dcfInput, setDcfInput] = useState<DCFInput>({
    revenue: 580,
    ebitdaMargin: 62,
    taxRate: 25,
    wacc: 8.5,
    terminalGrowth: 2.5,
  });
  const [dcfResult, setDcfResult] = useState<DCFResult | null>(null);

  const calculateDCF = () => {
    const fcf = dcfInput.revenue * (dcfInput.ebitdaMargin / 100) * (1 - dcfInput.taxRate / 100);
    const pvFactor = 1 / Math.pow(1 + dcfInput.wacc / 100, 5);
    const terminalValue = fcf * (1 + dcfInput.terminalGrowth / 100) / (dcfInput.wacc / 100 - dcfInput.terminalGrowth / 100);
    const pvTerminalValue = terminalValue * pvFactor;
    const sum = dcfAnalysis.reduce((acc, val) => acc + val.pv, 0);
    const enterpriseValue = sum + pvTerminalValue;

    setDcfResult({
      enterpriseValue: Math.round(enterpriseValue),
      equity: Math.round(enterpriseValue * 0.95),
      perShare: Math.round((enterpriseValue * 0.95) / 100),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Investment Banking</h1>
          <p className="text-slate-400">
            M&A deals, company valuation, DCF models, and deal analytics
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Deals in Pipeline",
              value: "4",
              change: "$8.35B total",
              icon: Building2,
            },
            {
              label: "Average Multiple",
              value: "12.5x",
              change: "EV/EBITDA",
              icon: TrendingUp,
            },
            {
              label: "Expected Synergies",
              value: "$420M",
              change: "Cost + Revenue",
              icon: Zap,
            },
            {
              label: "Team Size",
              value: "48",
              change: "Professionals",
              icon: Target,
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
          {["overview", "dcf", "comparables"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "overview" | "dcf" | "comparables")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "overview"
                ? "Deals Pipeline"
                : tab === "dcf"
                  ? "DCF Valuation"
                  : "Comparables Analysis"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Deals Pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Active Deals in Pipeline
              </h3>

              <div className="space-y-4">
                {dealsPipeline.map((deal, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">
                          {deal.company}
                        </h4>
                        <p className="text-sm text-slate-400">{deal.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-400">
                          ${deal.value}M
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Transaction Value
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">
                          Status: <span className="text-amber-300">{deal.status}</span>
                        </span>
                        <span className="text-sm font-semibold text-amber-400">
                          {deal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                          style={{ width: `${deal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Valuation Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {valuationMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-slate-400 text-sm mb-2">{metric.metric}</p>
                  <p className="text-3xl font-bold text-amber-400 mb-2">
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-400">{metric.vs}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {activeTab === "dcf" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DCF Calculator Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                DCF Valuation Model
              </h3>

              <div className="space-y-6">
                {/* Revenue */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Base Year Revenue ($M)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <input
                      type="number"
                      value={dcfInput.revenue}
                      onChange={(e) =>
                        setDcfInput({
                          ...dcfInput,
                          revenue: Number(e.target.value),
                        })
                      }
                      className="flex-1 bg-transparent text-white outline-none font-semibold"
                    />
                  </div>
                </div>

                {/* EBITDA Margin */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    EBITDA Margin (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dcfInput.ebitdaMargin}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        ebitdaMargin: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={dcfInput.ebitdaMargin}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        ebitdaMargin: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dcfInput.taxRate}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        taxRate: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.1"
                    value={dcfInput.taxRate}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        taxRate: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* WACC */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    WACC (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dcfInput.wacc}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        wacc: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={dcfInput.wacc}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        wacc: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Terminal Growth */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Terminal Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dcfInput.terminalGrowth}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        terminalGrowth: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={dcfInput.terminalGrowth}
                    onChange={(e) =>
                      setDcfInput({
                        ...dcfInput,
                        terminalGrowth: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                <button
                  onClick={calculateDCF}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Calculate Valuation
                </button>
              </div>
            </motion.div>

            {/* Results */}
            <div className="space-y-6">
              {dcfResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-6 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white">
                    Valuation Results
                  </h3>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm mb-1">Enterprise Value</p>
                    <p className="text-4xl font-bold text-amber-400">
                      ${dcfResult.enterpriseValue}M
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Equity Value</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${dcfResult.equity}M
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Per Share</p>
                      <p className="text-2xl font-bold text-amber-400">
                        ${dcfResult.perShare}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FCF Projection Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  FCF Projection
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dcfAnalysis}>
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
                    <Bar dataKey="fcf" fill="#fbbf24" name="Free Cash Flow" />
                    <Bar dataKey="pv" fill="#f59e0b" name="Present Value" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "comparables" && (
          <div className="space-y-6">
            {/* Comparables Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Comparable Companies Analysis
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Company</th>
                    <th className="text-right py-3 text-slate-400">EV ($M)</th>
                    <th className="text-right py-3 text-slate-400">
                      Revenue ($M)
                    </th>
                    <th className="text-right py-3 text-slate-400">
                      EBITDA ($M)
                    </th>
                    <th className="text-right py-3 text-slate-400">
                      EV/EBITDA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparables.map((comp, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors ${
                        comp.company === "Target Company"
                          ? "bg-amber-500/10 border-amber-500/30"
                          : ""
                      }`}
                    >
                      <td className="py-3">
                        <p className="font-semibold text-white">
                          {comp.company}
                        </p>
                      </td>
                      <td className="text-right py-3 text-white">
                        ${comp.ev.toLocaleString()}
                      </td>
                      <td className="text-right py-3 text-white">
                        ${comp.revenue.toLocaleString()}
                      </td>
                      <td className="text-right py-3 text-white">
                        ${comp.ebitda.toLocaleString()}
                      </td>
                      <td
                        className={`text-right py-3 font-semibold ${
                          comp.company === "Target Company"
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {comp.multiple.toFixed(1)}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {[
                {
                  label: "Mean EV/EBITDA",
                  value: "12.4x",
                  range: "12.2x - 12.5x",
                },
                { label: "Median EV/EBITDA", value: "12.3x", range: "Industry std" },
                {
                  label: "Target Multiple",
                  value: "12.5x",
                  range: "Premium pricing",
                },
                {
                  label: "Implied Value",
                  value: "$4.5B",
                  range: "Based on comps",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.range}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
