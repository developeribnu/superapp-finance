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
  Wallet,
  TrendingUp,
  Calculator,
  PlusCircle,
  MinusCircle,
  Target,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";

const budgetData = [
  { month: "Jan", income: 5000, expenses: 3200, savings: 1800 },
  { month: "Feb", income: 5000, expenses: 3100, savings: 1900 },
  { month: "Mar", income: 5500, expenses: 3300, savings: 2200 },
  { month: "Apr", income: 5000, expenses: 3400, savings: 1600 },
  { month: "May", income: 5500, expenses: 3200, savings: 2300 },
  { month: "Jun", income: 5000, expenses: 3100, savings: 1900 },
];

const expenseCategories = [
  { category: "Housing", amount: 1200, percentage: 24, limit: 1500 },
  { category: "Food & Dining", amount: 600, percentage: 12, limit: 700 },
  { category: "Transportation", amount: 400, percentage: 8, limit: 500 },
  { category: "Utilities", amount: 250, percentage: 5, limit: 300 },
  { category: "Entertainment", amount: 300, percentage: 6, limit: 400 },
  { category: "Healthcare", amount: 200, percentage: 4, limit: 300 },
  { category: "Other", amount: 550, percentage: 11, limit: 600 },
];

const savingsGoals = [
  {
    name: "Emergency Fund",
    target: 15000,
    current: 8500,
    deadline: "Dec 2026",
    priority: "high",
  },
  {
    name: "Vacation",
    target: 5000,
    current: 2300,
    deadline: "Aug 2026",
    priority: "medium",
  },
  {
    name: "Car Down Payment",
    target: 10000,
    current: 4500,
    deadline: "Mar 2027",
    priority: "high",
  },
  {
    name: "Home Renovation",
    target: 20000,
    current: 6000,
    deadline: "Dec 2026",
    priority: "medium",
  },
];

interface LoanInput {
  principal: number;
  rate: number;
  months: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export default function PersonalFinance() {
  const [activeTab, setActiveTab] = useState<"budget" | "goals" | "loan">(
    "budget"
  );
  const [loanInput, setLoanInput] = useState<LoanInput>({
    principal: 100000,
    rate: 5,
    months: 360,
  });
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const monthlyRate = loanInput.rate / 100 / 12;
    const monthlyPayment =
      (loanInput.principal *
        (monthlyRate * Math.pow(1 + monthlyRate, loanInput.months))) /
      (Math.pow(1 + monthlyRate, loanInput.months) - 1);
    const totalPayment = monthlyPayment * loanInput.months;
    const totalInterest = totalPayment - loanInput.principal;

    setLoanResult({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  const savingsRate =
    ((budgetData.reduce((sum, d) => sum + d.savings, 0) /
      budgetData.reduce((sum, d) => sum + d.income, 0)) *
      100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">Personal Finance</h1>
          <p className="text-slate-400">
            Manage your budget, track savings goals, and simulate credit options
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Monthly Income",
              value: "$5,250",
              change: "+5.0%",
              icon: DollarSign,
            },
            {
              label: "Monthly Expenses",
              value: "$3,200",
              change: "-2.3%",
              icon: MinusCircle,
            },
            {
              label: "Savings Rate",
              value: `${savingsRate}%`,
              change: "+1.2%",
              icon: TrendingUp,
            },
            {
              label: "Total Saved",
              value: "$11,800",
              change: "+18%",
              icon: Wallet,
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
        <div className="flex gap-4 border-b border-slate-700">
          {["budget", "goals", "loan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "budget" | "goals" | "loan")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "budget"
                ? "Budget Tracker"
                : tab === "goals"
                  ? "Savings Goals"
                  : "Credit Simulator"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "budget" && (
          <div className="space-y-6">
            {/* Budget Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded" />
                Income vs Expenses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
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
                  <Bar dataKey="income" fill="#10b981" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                  <Bar dataKey="savings" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Expense Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Monthly Expenses by Category
              </h3>
              <div className="space-y-4">
                {expenseCategories.map((expense, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">
                        {expense.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400 font-semibold">
                          ${expense.amount}
                        </span>
                        <span className="text-slate-500 text-sm">
                          of ${expense.limit}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          expense.amount > expense.limit
                            ? "bg-red-500"
                            : "bg-gradient-to-r from-amber-400 to-amber-600"
                        }`}
                        style={{
                          width: `${Math.min((expense.amount / expense.limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-6">
            {/* Savings Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savingsGoals.map((goal, idx) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {goal.name}
                        </h4>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4" />
                          Target: {goal.deadline}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          goal.priority === "high"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {goal.priority === "high" ? "High" : "Medium"} Priority
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-400">Progress</p>
                          <p className="text-xl font-bold text-amber-400">
                            ${goal.current.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Target</p>
                          <p className="text-xl font-bold text-white">
                            ${goal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 text-center">
                        {progress.toFixed(1)}% completed
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add New Goal Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Savings Goal
            </motion.button>
          </div>
        )}

        {activeTab === "loan" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loan Calculator Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                Credit Simulator (Simulasi Kredit)
              </h3>

              <div className="space-y-6">
                {/* Principal Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Loan Amount (Pinjaman)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <input
                      type="number"
                      value={loanInput.principal}
                      onChange={(e) =>
                        setLoanInput({
                          ...loanInput,
                          principal: Number(e.target.value),
                        })
                      }
                      className="flex-1 bg-transparent text-white outline-none font-semibold"
                    />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={loanInput.principal}
                    onChange={(e) =>
                      setLoanInput({
                        ...loanInput,
                        principal: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Interest Rate Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Annual Interest Rate (%)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                    <Percent className="w-5 h-5 text-amber-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={loanInput.rate}
                      onChange={(e) =>
                        setLoanInput({
                          ...loanInput,
                          rate: Number(e.target.value),
                        })
                      }
                      className="flex-1 bg-transparent text-white outline-none font-semibold"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.1"
                    value={loanInput.rate}
                    onChange={(e) =>
                      setLoanInput({
                        ...loanInput,
                        rate: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Loan Term Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Loan Term (Months)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <input
                      type="number"
                      value={loanInput.months}
                      onChange={(e) =>
                        setLoanInput({
                          ...loanInput,
                          months: Number(e.target.value),
                        })
                      }
                      className="flex-1 bg-transparent text-white outline-none font-semibold"
                    />
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="360"
                    step="12"
                    value={loanInput.months}
                    onChange={(e) =>
                      setLoanInput({
                        ...loanInput,
                        months: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {(loanInput.months / 12).toFixed(1)} years
                  </p>
                </div>

                <button
                  onClick={calculateLoan}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Calculate Payment
                </button>
              </div>
            </motion.div>

            {/* Results */}
            {loanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900 border border-amber-500/30 rounded-lg p-6 space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  Loan Details (Detail Kredit)
                </h3>

                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm mb-1">Monthly Payment</p>
                    <p className="text-3xl font-bold text-amber-400">
                      ${loanResult.monthlyPayment.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Bulan Cicilan (Monthly Installment)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Total Interest</p>
                      <p className="text-xl font-bold text-red-400">
                        ${loanResult.totalInterest.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Total Payment</p>
                      <p className="text-xl font-bold text-green-400">
                        ${loanResult.totalPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                    <p className="text-slate-300 text-sm font-semibold">
                      Summary
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Principal</span>
                      <span className="text-white">
                        ${loanInput.principal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Interest Rate</span>
                      <span className="text-white">{loanInput.rate}% per year</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Term</span>
                      <span className="text-white">
                        {loanInput.months} months
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-2">
                      <span className="text-slate-400">Interest Cost</span>
                      <span className="text-amber-400 font-semibold">
                        ${loanResult.totalInterest.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
