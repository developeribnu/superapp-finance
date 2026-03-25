"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Flame,
  Lock,
  Activity,
  Plus,
} from "lucide-react";

const cryptoData = [
  { time: "00:00", btc: 42500, eth: 2250, total: 45000 },
  { time: "04:00", btc: 42800, eth: 2280, total: 45500 },
  { time: "08:00", btc: 43200, eth: 2320, total: 46000 },
  { time: "12:00", btc: 42900, eth: 2300, total: 45800 },
  { time: "16:00", btc: 43500, eth: 2350, total: 46500 },
  { time: "20:00", btc: 44100, eth: 2400, total: 47200 },
  { time: "24:00", btc: 43800, eth: 2370, total: 46900 },
];

const cryptoHoldings = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43800,
    change: 8.5,
    marketCap: "850B",
    volume: "28.5B",
    amount: 0.5,
    value: 21900,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2370,
    change: 6.2,
    marketCap: "285B",
    volume: "14.2B",
    amount: 5,
    value: 11850,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 145.32,
    change: 12.3,
    marketCap: "68B",
    volume: "3.2B",
    amount: 25,
    value: 3633,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.98,
    change: 4.5,
    marketCap: "35B",
    volume: "1.8B",
    amount: 1000,
    value: 980,
  },
];

const defiProtocols = [
  {
    name: "Uniswap",
    type: "DEX",
    tvl: "5.2B",
    apy: "12-45%",
    risk: "Medium",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Aave",
    type: "Lending",
    tvl: "10.8B",
    apy: "8-15%",
    risk: "Low",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Curve Finance",
    type: "DEX",
    tvl: "4.5B",
    apy: "3-20%",
    risk: "Low",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Lido",
    type: "Staking",
    tvl: "32.1B",
    apy: "3.5%",
    risk: "Low",
    color: "from-green-500 to-emerald-500",
  },
];

const marketData = [
  { name: "Bitcoin Dominance", value: 52, change: "+2.3%" },
  { name: "Ethereum Dominance", value: 18, change: "-0.5%" },
  { name: "Total Market Cap", value: "$2.1T", change: "+5.2%" },
  { name: "24h Volume", value: "$89.3B", change: "+12.1%" },
];

export default function Crypto() {
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "defi" | "blockchain">(
    "dashboard"
  );

  const totalCryptoValue = cryptoHoldings.reduce((sum, c) => sum + c.value, 0);
  const cryptoGain = (totalCryptoValue - 10000).toFixed(2);
  const gainPercentage = ((cryptoGain / 10000) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Cryptocurrency</h1>
          <p className="text-slate-400">
            Crypto tracker, DeFi protocols, and blockchain insights
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Portfolio Value",
              value: `$${(totalCryptoValue / 1000).toFixed(1)}K`,
              change: `+${gainPercentage}%`,
              icon: DollarSign,
            },
            {
              label: "Total Gain",
              value: `$${(cryptoGain / 1000).toFixed(1)}K`,
              change: "All time",
              icon: TrendingUp,
            },
            {
              label: "24h Volume",
              value: "$89.3B",
              change: "+12.1%",
              icon: Activity,
            },
            {
              label: "Staking Rewards",
              value: "$2,450",
              change: "APY 12.3%",
              icon: Zap,
            },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">{metric.label}</p>
                <metric.icon className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-green-400 mt-1">{metric.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {["dashboard", "defi", "blockchain"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "dashboard" | "defi" | "blockchain")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "dashboard"
                ? "Dashboard"
                : tab === "defi"
                  ? "DeFi Protocols"
                  : "Blockchain Data"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === "dashboard" && (
          <div className="space-y-6">
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Price Movement (24h)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cryptoData}>
                  <defs>
                    <linearGradient id="colorBTC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#fbbf24"
                    fillOpacity={1}
                    fill="url(#colorBTC)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Your Holdings
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 text-slate-400">Asset</th>
                    <th className="text-right py-3 text-slate-400">Price</th>
                    <th className="text-right py-3 text-slate-400">24h</th>
                    <th className="text-right py-3 text-slate-400">Amount</th>
                    <th className="text-right py-3 text-slate-400">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoHoldings.map((crypto, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3">
                        <div>
                          <p className="font-bold text-amber-400">
                            {crypto.symbol}
                          </p>
                          <p className="text-xs text-slate-400">{crypto.name}</p>
                        </div>
                      </td>
                      <td className="text-right py-3 text-white">
                        ${crypto.price.toLocaleString()}
                      </td>
                      <td className="text-right py-3">
                        <span className="text-green-400">
                          +{crypto.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right py-3 text-slate-300">
                        {crypto.amount}
                      </td>
                      <td className="text-right py-3 font-semibold text-amber-400">
                        ${crypto.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Market Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {marketData.map((data, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">{data.name}</p>
                  <p className="text-2xl font-bold text-white">{data.value}</p>
                  <p className="text-xs text-green-400 mt-1">{data.change}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {selectedTab === "defi" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Top DeFi Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defiProtocols.map((protocol, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                  >
                    <div className={`h-1 w-full rounded-full bg-gradient-to-r ${protocol.color} mb-4`} />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">
                          {protocol.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {protocol.type}
                        </p>
                      </div>
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">TVL</span>
                        <span className="text-white font-semibold">
                          ${protocol.tvl}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">APY</span>
                        <span className="text-green-400 font-semibold">
                          {protocol.apy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risk</span>
                        <span
                          className={`font-semibold ${
                            protocol.risk === "Low"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {protocol.risk}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-400 font-semibold py-2 rounded-lg transition-all text-sm border border-amber-500/30">
                      Deposit
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DeFi Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                DeFi Market Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total TVL", value: "$70.8B", change: "+2.1%" },
                  { label: "24h Volume", value: "$12.5B", change: "+8.3%" },
                  { label: "Avg APY", value: "8.5%", change: "-0.2%" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-amber-400">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTab === "blockchain" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Network Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cryptoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #d97706",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="btc" fill="#fbbf24" name="BTC Price" />
                  <Bar dataKey="eth" fill="#f59e0b" name="ETH Price" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Blockchain Concepts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                {
                  title: "Gas Fees",
                  value: "45 Gwei",
                  desc: "Current ETH network fee",
                  trend: "↓ 12%",
                },
                {
                  title: "Network Hash Rate",
                  value: "450 EH/s",
                  desc: "Bitcoin mining difficulty",
                  trend: "↑ 5%",
                },
                {
                  title: "Active Addresses",
                  value: "1.2M",
                  desc: "Daily active wallets",
                  trend: "↑ 3%",
                },
                {
                  title: "Transaction Value",
                  value: "$89.3B",
                  desc: "24h transaction volume",
                  trend: "↑ 12%",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors"
                >
                  <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.desc}</p>
                  <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
