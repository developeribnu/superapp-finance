export const navItems = [
    { slug: "finance", label: "Finance", subroutes: ["kalkulator", "quiz"] },
    { slug: "crypto", label: "Crypto" },
    { slug: "investment-banking", label: "Investment Banking", subroutes: ["dashboard", "banking", "analyses", "templates", "learn"] },
    { slug: "ekonomi", label: "Ekonomi", subroutes: ["materi", "case-study", "catatan", "glosarium", "kalkulator", "quiz", "library", "grafik", "rumus", "referensi"] },
    { slug: "smart-money", label: "Smart Money" },
    { slug: "Polymarket", label: "Polymarket" }
];

export const superappInfo = {
  name: "Superapp Finance",
  description: "All-in-one finance, investment, crypto & economics hub",
};

export const financeRoutes = [
  { name: "Calculators", path: "/finance/kalkulator", items: ["PPh21", "Retirement", "Compound Interest", "Savings", "Budgeting", "Emergency Fund", "Debt Payoff", "Goal Planner", "DCA Simulator"] },
  { name: "Quizzes", path: "/finance/quiz", items: ["Risk Profile"] }
];

export const investmentBankingRoutes = [
  { name: "Dashboard", path: "/investment-banking/dashboard" },
  { name: "Banking", path: "/investment-banking/banking" },
  { name: "Analyses", path: "/investment-banking/analyses" },
  { name: "Templates", path: "/investment-banking/templates" },
  { name: "Learning", path: "/investment-banking/learn" }
];

export const ekonomiRoutes = [
  { name: "Materials", path: "/ekonomi/materi" },
  { name: "Case Studies", path: "/ekonomi/case-study" },
  { name: "Notes", path: "/ekonomi/catatan" },
  { name: "Glossary", path: "/ekonomi/glosarium" },
  { name: "Calculators", path: "/ekonomi/kalkulator" },
  { name: "Quizzes", path: "/ekonomi/quiz" },
  { name: "Library", path: "/ekonomi/library" },
  { name: "Charts", path: "/ekonomi/grafik" },
  { name: "Formulas", path: "/ekonomi/rumus" },
  { name: "References", path: "/ekonomi/referensi" }
];
