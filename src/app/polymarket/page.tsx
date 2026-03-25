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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Target, TrendingUp, DollarSign, Activity, Calendar, Zap } from "lucide-react";

const markets = [
  {
    id: 1,
    title: "Will Bitcoin exceed $50K by end of 2024?",
    category: "Crypto",
    yes: 72,
    no: 28,
    volume: "$12.5M",
    deadline: "Dec 31, 2024",
    liquidity: "$450K",
    status: "Active",
  },
  {
    id: 2,
    title: "Will Fed maintain rates above 5%?",
    category: "Economics",
    yes: 58,
    no: 42,
    volume: "$8.3M",
    deadline: "Mar 31, 2025",
    liquidity: "$320K",
    status: "Active",
  },
  {
    id: 3,
    title: "Will S&P 500 reach 5500 by Q2 2025?",
    category: "Stocks",
    yes: 65,
    no: 35,
    volume: "$15.8M",
    deadline: "Jun 30, 2025",
    liquidity: "$580K",
    status: "Active",
  },
  {
    id: 4,
    title: "Will Ethereum 2.0 staking reach 50M ETH?",
    category: "Crypto",
    yes: 82,
    no: 18,
    volume: "$6.2M",
    deadline: "Apr 15, 2025",
    liquidity: "$220K",
    status: "Active",
  },
  {
    id: 5,
    title: "Will US inflation drop below 2% by Q4 2025?",
    category: "Economics",
    yes: 45,
    no: 55,
    volume: "$9.7M",
    deadline: "Dec 31, 2025",
    liquidity: "$390K",
    status: "Active",
  },
  {
    id: 6,
    title: "Will Apple stock split again by 2026?",
    category: "Stocks",
    yes: 38,
    no: 62,
    volume: "$4.1M",
    deadline: "Dec 31, 2025",
    liquidity: "$150K",
    status: "Active",
  },
];

const historicalData = [
  { month: "Jan", bitcoin: 72, fed: 55, sp500: 62 },
  { month: "Feb", bitcoin: 68, fed: 58, sp500: 64 },
  { month: "Mar", bitcoin: 75, fed: 59, sp500: 66 },
  { month: "Apr", bitcoin: 70, fed: 57, sp500: 63 },
  { month: "May", bitcoin: 74, fed: 60, sp500: 68 },
  { month: "Jun", bitcoin: 72, fed: 58, sp500: 65 },
];

const categoryDistribution = [
  { name: "Crypto", value: 35, color: "#fbbf24" },
  { name: "Stocks", value: 30, color: "#f59e0b" },
  { name: "Economics", value: 25, color: "#d97706" },
  { name: "Politics", value: 10, color: "#b45309" },
];

const topPredictors = [
  {
    username: "CryptoAnalyst",
    accuracy: 72,
    trades: 145,
    profit: "$42,500",
    followers: 2850,
  },
  {
    username: "MacroGuru",
    accuracy: 68,
    trades: 98,
    profit: "$28,300",
    followers: 1920,
  },
  {
    username: "EquityExpert",
    accuracy: 71,
    trades: 156,
    profit: "$51,200",
    followers: 3120,
  },
  {
    username: "TrendMaster",
    accuracy: 65,
    trades: 102,
    profit: "$19,850",
    followers: 1540,
  },
];

interface CalculatorInput {
  probability: number;
  investment: number;
  payoutYes: number;
  payoutNo: number;
}

interface CalculatorResult {
  expectedValue: number;
  potentialGain: number;
  potentialLoss: number;
  profitIfCorrect: number;
}

export default function Polymarket() {
  const [selectedTab, setSelectedTab] = useState<"markets" | "calculator" | "leaderboard">(
    "markets"
  );
  const [calculator, setCalculator] = useState<CalculatorInput>({
    probability: 65,
    investment: 1000,
    payoutYes: 100,
    payoutNo: 100,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const calculateProbability = () => {
    const expectedValue = (calculator.probability / 100) * (calculator.payoutYes - calculator.investment) - ((100 - calculator.probability) / 100) * calculator.investment;
    const potentialGain = calculator.payoutYes - calculator.investment;
    const potentialLoss = calculator.investment;
    const profitIfCorrect = (calculator.probability / 100) * expectedValue;

    setResult({
      expectedValue,
      potentialGain,
      potentialLoss,
      profitIfCorrect,
    });
  };

  const filteredMarkets = selectedCategory === "All" ? markets : markets.filter((m) => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Polymarket</h1>
          <p className="text-slate-400">
            Prediction markets, probability analysis, and trend forecasting
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Market Volume",
              value: "$156.8M",
              change: "+28% this month",
              icon: DollarSign,
            },
            {
              label: "Active Markets",
              value: "2,847",
              change: "+124 new",
              icon: Target,
            },
            {
              label: "Total Liquidity",
              value: "$3.2B",
              change: "+12% YoY",
              icon: Activity,
            },
            {
              label: "Unique Traders",
              value: "84,520",
              change: "+15% month",
              icon: TrendingUp,
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
                <p className="text-xs text-green-400 mt-1">{metric.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {["markets", "calculator", "leaderboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "markets" | "calculator" | "leaderboard")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "markets"
                ? "Markets Browser"
                : tab === "calculator"
                  ? "Probability Calculator"
                  : "Top Predictors"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === "markets" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["All", "Crypto", "Stocks", "Economics", "Politics"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Markets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMarkets.map((market, idx) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white flex-1">
                        {market.title}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/20 text-amber-300">
                        {market.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Resolves {market.deadline}
                    </p>
                  </div>

                  {/* Probability Bars */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300 font-semibold">
                          YES
                        </span>
                        <span className="text-sm font-bold text-green-400">
                          {market.yes}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          style={{ width: `${market.yes}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300 font-semibold">
                          NO
                        </span>
                        <span className="text-sm font-bold text-red-400">
                          {market.no}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                          style={{ width: `${market.no}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-4 p-3 bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-slate-400">Volume</p>
                      <p className="font-semibold text-white">{market.volume}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Liquidity</p>
                      <p className="font-semibold text-white">
                        {market.liquidity}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Status</p>
                      <p className="font-semibold text-amber-400">
                        {market.status}
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 rounded-lg transition-all text-sm">
                    Trade Market
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Market Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Market Probability Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
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
                    dataKey="bitcoin"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    name="Bitcoin >50K"
                  />
                  <Line
                    type="monotone"
                    dataKey="fed"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Fed Rates >5%"
                  />
                  <Line
                    type="monotone"
                    dataKey="sp500"
                    stroke="#d97706"
                    strokeWidth={2}
                    name="S&P >5500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {selectedTab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Probability Calculator
              </h3>

              <div className="space-y-6">
                {/* Probability */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Event Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={calculator.probability}
                    onChange={(e) =>
                      setCalculator({
                        ...calculator,
                        probability: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={calculator.probability}
                    onChange={(e) =>
                      setCalculator({
                        ...calculator,
                        probability: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Investment */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={calculator.investment}
                    onChange={(e) =>
                      setCalculator({
                        ...calculator,
                        investment: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Payouts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Payout if YES ($)
                    </label>
                    <input
                      type="number"
                      value={calculator.payoutYes}
                      onChange={(e) =>
                        setCalculator({
                          ...calculator,
                          payoutYes: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Payout if NO ($)
                    </label>
                    <input
                      type="number"
                      value={calculator.payoutNo}
                      onChange={(e) =>
                        setCalculator({
                          ...calculator,
                          payoutNo: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateProbability}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Calculate
                </button>
              </div>
            </motion.div>

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">
                  Analysis Results
                </h3>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-300 text-sm mb-1">Expected Value</p>
                  <p className="text-4xl font-bold text-amber-400">
                    ${result.expectedValue.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-1">If Correct</p>
                    <p className="text-2xl font-bold text-green-400">
                      +${result.potentialGain.toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-1">If Wrong</p>
                    <p className="text-2xl font-bold text-red-400">
                      -${result.potentialLoss.toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                  <p className="text-slate-300 text-sm font-semibold">
                    Summary
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Win Probability</span>
                    <span className="text-white font-semibold">
                      {calculator.probability}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk/Reward Ratio</span>
                    <span className="text-white font-semibold">
                      1:{(result.potentialGain / result.potentialLoss).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {selectedTab === "leaderboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-x-auto"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">
              Top Predictors by Accuracy
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-slate-400">Rank</th>
                  <th className="text-left py-3 text-slate-400">Username</th>
                  <th className="text-right py-3 text-slate-400">Accuracy</th>
                  <th className="text-right py-3 text-slate-400">Trades</th>
                  <th className="text-right py-3 text-slate-400">Profit</th>
                  <th className="text-right py-3 text-slate-400">Followers</th>
                </tr>
              </thead>
              <tbody>
                {topPredictors.map((predictor, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 text-white font-semibold">
                      {predictor.username}
                    </td>
                    <td className="text-right py-3 text-amber-400 font-bold">
                      {predictor.accuracy}%
                    </td>
                    <td className="text-right py-3 text-slate-300">
                      {predictor.trades}
                    </td>
                    <td className="text-right py-3 text-green-400 font-semibold">
                      {predictor.profit}
                    </td>
                    <td className="text-right py-3 text-slate-300">
                      {predictor.followers.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
