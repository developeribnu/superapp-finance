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
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  DollarSign,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const portfolioData = [
  { month: "Jan", portfolio: 25000, benchmark: 24500 },
  { month: "Feb", portfolio: 27000, benchmark: 25800 },
  { month: "Mar", portfolio: 30000, benchmark: 28900 },
  { month: "Apr", portfolio: 28500, benchmark: 27500 },
  { month: "May", portfolio: 32000, benchmark: 30200 },
  { month: "Jun", portfolio: 35000, benchmark: 33100 },
];

const stocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.45,
    change: 5.2,
    pe: 28.5,
    sector: "Technology",
    shares: 50,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.91,
    change: 3.8,
    pe: 32.1,
    sector: "Technology",
    shares: 20,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.84,
    change: 8.5,
    pe: 68.9,
    sector: "Automotive",
    shares: 15,
  },
  {
    symbol: "JPM",
    name: "JP Morgan Chase",
    price: 161.23,
    change: 2.1,
    pe: 12.4,
    sector: "Finance",
    shares: 30,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 153.92,
    change: 1.2,
    pe: 26.8,
    sector: "Healthcare",
    shares: 25,
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 247.65,
    change: 4.3,
    pe: 42.5,
    sector: "Finance",
    shares: 18,
  },
];

const allocationData = [
  { name: "Tech Stocks", value: 45, allocation: 35 },
  { name: "Finance", value: 25, allocation: 20 },
  { name: "Healthcare", value: 15, allocation: 12 },
  { name: "Bonds", value: 10, allocation: 20 },
  { name: "Cash", value: 5, allocation: 13 },
];

const strategies = [
  {
    name: "Growth Strategy",
    description: "Aggressive growth focused on tech and emerging sectors",
    allocation: { stocks: 80, bonds: 15, cash: 5 },
    expectedReturn: "12-15%",
    risk: "High",
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Balanced Strategy",
    description: "Mix of growth and stability with dividend stocks",
    allocation: { stocks: 60, bonds: 30, cash: 10 },
    expectedReturn: "8-10%",
    risk: "Medium",
    color: "from-amber-500 to-yellow-500",
  },
  {
    name: "Conservative Strategy",
    description: "Focus on stability with bond and dividend stocks",
    allocation: { stocks: 40, bonds: 50, cash: 10 },
    expectedReturn: "5-6%",
    risk: "Low",
    color: "from-green-500 to-emerald-500",
  },
];

const riskReturnData = [
  { name: "Treasury Bonds", risk: 1, return: 4.5, size: 300 },
  { name: "Dividend Stocks", risk: 3, return: 6, size: 350 },
  { name: "Blue Chips", risk: 4, return: 8, size: 400 },
  { name: "Growth Stocks", risk: 6, return: 12, size: 350 },
  { name: "Tech Stocks", risk: 7, return: 15, size: 300 },
  { name: "Crypto", risk: 9, return: 25, size: 250 },
];

export default function Investment() {
  const [selectedTab, setSelectedTab] = useState<"portfolio" | "screener" | "strategies">(
    "portfolio"
  );

  const totalPortfolioValue = stocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0);
  const portfolioGain = (totalPortfolioValue - 25000).toFixed(2);
  const gainPercentage = ((portfolioGain / 25000) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Investment</h1>
          <p className="text-slate-400">
            Stock analysis, portfolio tracking, and investment strategies
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Portfolio Value",
              value: `$${(totalPortfolioValue / 1000).toFixed(0)}K`,
              change: `+${gainPercentage}%`,
              icon: DollarSign,
              positive: true,
            },
            {
              label: "Total Gain",
              value: `$${(portfolioGain / 1000).toFixed(1)}K`,
              change: "Since inception",
              icon: TrendingUp,
              positive: true,
            },
            {
              label: "Dividend Yield",
              value: "3.2%",
              change: "+0.5% YoY",
              icon: Activity,
              positive: true,
            },
            {
              label: "Win Rate",
              value: "72%",
              change: "vs benchmark",
              icon: Target,
              positive: true,
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
                <p
                  className={`text-xs mt-1 ${metric.positive ? "text-green-400" : "text-red-400"}`}
                >
                  {metric.change}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {["portfolio", "screener", "strategies"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "portfolio" | "screener" | "strategies")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "portfolio"
                ? "Portfolio Performance"
                : tab === "screener"
                  ? "Stock Screener"
                  : "Strategies"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === "portfolio" && (
          <div className="space-y-6">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Performance vs Benchmark
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioData}>
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
                    dataKey="portfolio"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ fill: "#fbbf24", r: 5 }}
                    name="Your Portfolio"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="S&P 500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Holdings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Current Holdings
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Symbol</th>
                    <th className="text-left py-3 text-slate-400">Company</th>
                    <th className="text-right py-3 text-slate-400">Price</th>
                    <th className="text-right py-3 text-slate-400">Change</th>
                    <th className="text-right py-3 text-slate-400">P/E</th>
                    <th className="text-right py-3 text-slate-400">Shares</th>
                    <th className="text-right py-3 text-slate-400">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 font-bold text-amber-400">
                        {stock.symbol}
                      </td>
                      <td className="py-3 text-white">{stock.name}</td>
                      <td className="text-right py-3 text-white">
                        ${stock.price.toFixed(2)}
                      </td>
                      <td className="text-right py-3">
                        <span
                          className={
                            stock.change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right py-3 text-slate-300">
                        {stock.pe.toFixed(1)}
                      </td>
                      <td className="text-right py-3 text-slate-300">
                        {stock.shares}
                      </td>
                      <td className="text-right py-3 font-semibold text-amber-400">
                        ${(stock.price * stock.shares).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        )}

        {selectedTab === "screener" && (
          <div className="space-y-6">
            {/* Risk vs Return Scatter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Risk vs Return Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    type="number"
                    dataKey="risk"
                    name="Risk"
                    stroke="#94a3b8"
                    label={{ value: "Risk (Volatility)", position: "insideBottomRight", offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="return"
                    name="Return"
                    stroke="#94a3b8"
                    label={{ value: "Expected Return %", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter
                    name="Assets"
                    data={riskReturnData}
                    fill="#fbbf24"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Screening Criteria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Stock Screener - Active Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "P/E Ratio", value: "< 30", status: "Active" },
                  { label: "Market Cap", value: "> $100B", status: "Active" },
                  { label: "Dividend Yield", value: "> 1%", status: "Active" },
                ].map((filter, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">{filter.label}</p>
                    <p className="text-lg font-semibold text-amber-400 mt-1">
                      {filter.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-slate-300 font-semibold">Results: 24 matches</h4>
                {stocks.slice(0, 4).map((stock, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:border-amber-500/30 border border-slate-700 transition-colors"
                  >
                    <div>
                      <p className="text-amber-400 font-semibold">{stock.symbol}</p>
                      <p className="text-xs text-slate-400">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        ${stock.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-400">P/E: {stock.pe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTab === "strategies" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strategy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors flex flex-col"
              >
                <div
                  className={`h-1 w-full rounded-full bg-gradient-to-r ${strategy.color} mb-4`}
                />

                <h3 className="text-lg font-semibold text-white mb-2">
                  {strategy.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4 flex-1">
                  {strategy.description}
                </p>

                <div className="space-y-3 mb-6 p-3 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400 font-semibold">
                    ALLOCATION
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Stocks</span>
                      <span className="text-amber-400 font-semibold">
                        {strategy.allocation.stocks}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Bonds</span>
                      <span className="text-blue-400 font-semibold">
                        {strategy.allocation.bonds}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Cash</span>
                      <span className="text-green-400 font-semibold">
                        {strategy.allocation.cash}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg p-3 border border-amber-500/20">
                    <p className="text-xs text-amber-300 mb-1">Expected Return</p>
                    <p className="text-lg font-bold text-amber-400">
                      {strategy.expectedReturn}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-3 border ${
                      strategy.risk === "High"
                        ? "bg-red-500/10 border-red-500/20"
                        : strategy.risk === "Medium"
                          ? "bg-yellow-500/10 border-yellow-500/20"
                          : "bg-green-500/10 border-green-500/20"
                    }`}
                  >
                    <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                    <p
                      className={`text-lg font-bold ${
                        strategy.risk === "High"
                          ? "text-red-400"
                          : strategy.risk === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {strategy.risk}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 rounded-lg transition-all text-sm">
                  Select Strategy
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
