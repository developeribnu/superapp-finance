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
import { Zap, TrendingUp, DollarSign, Users, Activity, AlertCircle } from "lucide-react";

const institutionalFlows = [
  { day: "Mon", buyVolume: 420, sellVolume: 380, netFlow: 40 },
  { day: "Tue", buyVolume: 450, sellVolume: 410, netFlow: 40 },
  { day: "Wed", buyVolume: 380, sellVolume: 420, netFlow: -40 },
  { day: "Thu", buyVolume: 510, sellVolume: 450, netFlow: 60 },
  { day: "Fri", buyVolume: 580, sellVolume: 500, netFlow: 80 },
];

const whaleActivity = [
  {
    address: "0x1234...5678",
    chain: "Ethereum",
    activity: "Sold 5,000 ETH",
    amount: "$18.5M",
    time: "2 hours ago",
    sentiment: "Bearish",
  },
  {
    address: "0x9abc...def0",
    chain: "Bitcoin",
    activity: "Bought 2.5 BTC",
    amount: "$108.9K",
    time: "4 hours ago",
    sentiment: "Bullish",
  },
  {
    address: "0x5xyz...1234",
    chain: "Ethereum",
    activity: "Transferred 3,000 ETH",
    amount: "$11.1M",
    time: "6 hours ago",
    sentiment: "Neutral",
  },
  {
    address: "0xabcd...efgh",
    chain: "Bitcoin",
    activity: "Bought 1.8 BTC",
    amount: "$78.4K",
    time: "8 hours ago",
    sentiment: "Bullish",
  },
];

const optionsFlow = [
  { strike: 42000, calls: 450, puts: 320, ratio: 1.41, sentiment: "Bullish" },
  { strike: 43000, calls: 380, puts: 280, ratio: 1.36, sentiment: "Bullish" },
  { strike: 44000, calls: 280, puts: 420, ratio: 0.67, sentiment: "Bearish" },
  { strike: 45000, calls: 160, puts: 380, ratio: 0.42, sentiment: "Bearish" },
];

const institutionalHoldings = [
  {
    fund: "BlackRock iShares",
    symbol: "AAPL",
    amount: "425.5M shares",
    value: "$77.3B",
    change: "+2.3% QoQ",
  },
  {
    fund: "Vanguard Index",
    symbol: "MSFT",
    amount: "310.2M shares",
    value: "$117.4B",
    change: "+1.8% QoQ",
  },
  {
    fund: "State Street",
    symbol: "GOOGL",
    amount: "205.8M shares",
    value: "$25.6B",
    change: "+3.1% QoQ",
  },
  {
    fund: "Berkshire Hathaway",
    symbol: "BRK.B",
    amount: "215.3M shares",
    value: "$82.9B",
    change: "-0.5% QoQ",
  },
];

const alerts = [
  {
    type: "Major Position Change",
    description: "Large institutional selling detected in tech sector",
    severity: "High",
    time: "10 mins ago",
  },
  {
    type: "Whale Alert",
    description: "Bitcoin whale moved 500 BTC to exchange (potentially selling)",
    severity: "High",
    time: "25 mins ago",
  },
  {
    type: "Options Activity",
    description: "Unusual call option activity on index futures",
    severity: "Medium",
    time: "1 hour ago",
  },
  {
    type: "Smart Money Signal",
    description: "Accumulation pattern detected in mid-cap stocks",
    severity: "Low",
    time: "2 hours ago",
  },
];

export default function SmartMoney() {
  const [selectedTab, setSelectedTab] = useState<"flows" | "whales" | "options">(
    "flows"
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
          <h1 className="text-4xl font-bold mb-2 text-white">Smart Money</h1>
          <p className="text-slate-400">
            Institutional flows tracking and whale alert monitoring
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Net Institutional Flow",
              value: "$8.5B",
              change: "+24h",
              icon: TrendingUp,
              positive: true,
            },
            {
              label: "Whale Movements",
              value: "14",
              change: "Last 24h",
              icon: Zap,
              positive: true,
            },
            {
              label: "Options Open Interest",
              value: "$92.3B",
              change: "+2.1%",
              icon: Activity,
              positive: true,
            },
            {
              label: "Smart Money Score",
              value: "7.8/10",
              change: "Bullish",
              icon: AlertCircle,
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

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Real-time Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  alert.severity === "High"
                    ? "bg-red-500/10 border-red-500/30"
                    : alert.severity === "Medium"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1 ${
                    alert.severity === "High"
                      ? "bg-red-400"
                      : alert.severity === "Medium"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">
                    {alert.type}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {alert.description}
                  </p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {["flows", "whales", "options"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "flows" | "whales" | "options")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "flows"
                ? "Institutional Flows"
                : tab === "whales"
                  ? "Whale Tracking"
                  : "Options Activity"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === "flows" && (
          <div className="space-y-6">
            {/* Flow Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Buy vs Sell Volume (5-Day)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={institutionalFlows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="buyVolume" fill="#10b981" name="Buy Volume" />
                  <Bar dataKey="sellVolume" fill="#ef4444" name="Sell Volume" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Institutional Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Top Institutional Holdings
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Fund</th>
                    <th className="text-left py-3 text-slate-400">Stock</th>
                    <th className="text-right py-3 text-slate-400">Shares</th>
                    <th className="text-right py-3 text-slate-400">Value</th>
                    <th className="text-right py-3 text-slate-400">QoQ</th>
                  </tr>
                </thead>
                <tbody>
                  {institutionalHoldings.map((holding, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 text-white font-semibold">
                        {holding.fund}
                      </td>
                      <td className="py-3 text-amber-400 font-semibold">
                        {holding.symbol}
                      </td>
                      <td className="text-right py-3 text-slate-300">
                        {holding.amount}
                      </td>
                      <td className="text-right py-3 text-white font-semibold">
                        {holding.value}
                      </td>
                      <td
                        className={`text-right py-3 font-semibold ${
                          holding.change.includes("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {holding.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        )}

        {selectedTab === "whales" && (
          <div className="space-y-6">
            {/* Whale Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Recent Whale Movements
              </h3>

              <div className="space-y-4">
                {whaleActivity.map((whale, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-amber-400 font-mono text-sm">
                          {whale.address}
                        </p>
                        <p className="text-white font-semibold mt-1">
                          {whale.activity}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          whale.sentiment === "Bullish"
                            ? "bg-green-500/20 text-green-300"
                            : whale.sentiment === "Bearish"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-slate-600/20 text-slate-300"
                        }`}
                      >
                        {whale.sentiment}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-400">
                          <span className="font-semibold text-white">
                            {whale.amount}
                          </span>{" "}
                          on {whale.chain}
                        </p>
                      </div>
                      <p className="text-slate-400 text-xs">{whale.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Whale Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  title: "Total Whale Volume",
                  value: "$342.5M",
                  subtitle: "24h whale movements",
                },
                {
                  title: "Bullish Whales",
                  value: "62%",
                  subtitle: "Net whale sentiment",
                },
                {
                  title: "Avg Whale Trade",
                  value: "$12.8M",
                  subtitle: "Average transaction",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-slate-400 text-xs mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {selectedTab === "options" && (
          <div className="space-y-6">
            {/* Options Flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Options Activity - Bitcoin Call/Put Ratio
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Strike</th>
                    <th className="text-right py-3 text-slate-400">Call Volume</th>
                    <th className="text-right py-3 text-slate-400">Put Volume</th>
                    <th className="text-right py-3 text-slate-400">C/P Ratio</th>
                    <th className="text-right py-3 text-slate-400">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsFlow.map((option, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 text-white font-semibold">
                        ${option.strike}K
                      </td>
                      <td className="text-right py-3 text-green-400">
                        {option.calls}
                      </td>
                      <td className="text-right py-3 text-red-400">
                        {option.puts}
                      </td>
                      <td className="text-right py-3 text-amber-400 font-semibold">
                        {option.ratio.toFixed(2)}
                      </td>
                      <td className="text-right py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            option.sentiment === "Bullish"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {option.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Options Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  title: "IV Percentile",
                  value: "65",
                  subtitle: "Volatility level",
                  icon: "📊",
                },
                {
                  title: "Put/Call Ratio",
                  value: "0.92",
                  subtitle: "Slightly bullish",
                  icon: "📈",
                },
                {
                  title: "Open Interest",
                  value: "$92.3B",
                  subtitle: "All expirations",
                  icon: "💰",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-slate-400 text-xs">{stat.title}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
