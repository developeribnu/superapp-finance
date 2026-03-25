"use client";

import { motion } from "framer-motion";
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
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

const portfolioData = [
  { month: "Jan", value: 45000, investments: 25000, crypto: 8000, savings: 12000 },
  { month: "Feb", value: 48500, investments: 27000, crypto: 9500, savings: 12000 },
  { month: "Mar", value: 52100, investments: 30000, crypto: 11000, savings: 11100 },
  { month: "Apr", value: 49800, investments: 28500, crypto: 10000, savings: 11300 },
  { month: "May", value: 55300, investments: 32000, crypto: 12500, savings: 10800 },
  { month: "Jun", value: 58900, investments: 35000, crypto: 14000, savings: 9900 },
];

const assetAllocation = [
  { name: "Stocks", value: 35, color: "#fbbf24" },
  { name: "Real Estate", value: 25, color: "#f59e0b" },
  { name: "Crypto", value: 20, color: "#d97706" },
  { name: "Bonds", value: 15, color: "#b45309" },
  { name: "Cash", value: 5, color: "#92400e" },
];

const marketStats = [
  {
    label: "Portfolio Value",
    value: "$58,900",
    change: "+18.2%",
    trend: "up",
    icon: Wallet,
  },
  {
    label: "Total Returns",
    value: "$13,900",
    change: "+31.0%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Monthly Growth",
    value: "+$3,600",
    change: "+6.5%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Risk Score",
    value: "7.2/10",
    change: "-0.3%",
    trend: "down",
    icon: AlertIcon,
  },
];

function AlertIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4v2m0 0v-2m0 2v2m7.071-7.071l-1.414 1.414M7.071 7.071L5.657 5.657M16.657 16.657l1.414 1.414M8.485 8.485L7.071 7.071"
      />
    </svg>
  );
}

const StatsCard = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card-dark card-hover"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/30">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
    </div>
    <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
      {trend === "up" ? (
        <ArrowUpRight className="w-4 h-4 text-green-400" />
      ) : (
        <ArrowDownLeft className="w-4 h-4 text-red-400" />
      )}
      <span
        className={`text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}
      >
        {change}
      </span>
      <span className="text-slate-500 text-sm ml-auto">vs last month</span>
    </div>
  </motion.div>
);

const ChartSection = ({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card-dark card-hover"
  >
    <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
      <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
      {title}
    </h3>
    {children}
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
            Welcome Back!
          </h1>
          <p className="text-slate-400">
            Here's your complete financial overview and market insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketStats.map((stat, idx) => (
            <StatsCard key={stat.label} {...stat} delay={idx * 0.1} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Value Chart */}
          <div className="lg:col-span-2">
            <ChartSection title="Portfolio Growth" delay={0.4}>
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
                    labelStyle={{ color: "#fbbf24" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ fill: "#fbbf24", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
          </div>

          {/* Asset Allocation Pie Chart */}
          <ChartSection title="Asset Allocation" delay={0.5}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#fbbf24"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #d97706",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        {/* Asset Breakdown */}
        <ChartSection title="Asset Breakdown by Month" delay={0.6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #d97706",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fbbf24" }}
              />
              <Legend />
              <Bar dataKey="investments" stackId="a" fill="#fbbf24" />
              <Bar dataKey="crypto" stackId="a" fill="#f59e0b" />
              <Bar dataKey="savings" stackId="a" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Rebalance Portfolio",
              desc: "Adjust your asset allocation",
              icon: "⚖️",
            },
            { title: "Set Budget Goals", desc: "Create monthly targets", icon: "🎯" },
            { title: "View Opportunities", desc: "See investment ideas", icon: "💡" },
          ].map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
              className="card-dark card-hover flex items-center gap-4 p-6"
            >
              <span className="text-3xl">{action.icon}</span>
              <div className="text-left flex-1">
                <p className="font-semibold text-white">{action.title}</p>
                <p className="text-sm text-slate-400">{action.desc}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
