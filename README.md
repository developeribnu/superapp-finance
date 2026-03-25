# FinSuper - Comprehensive Financial Superapp

A complete Next.js 15 financial superapp with 7 major sections covering personal finance, investments, cryptocurrencies, investment banking, economics, institutional flows, and prediction markets.

## Project Structure

```
superapp-finance/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with sidebar
│   │   ├── page.tsx                   # Dashboard (300+ lines)
│   │   ├── globals.css                # Global styles & theme
│   │   ├── personal-finance/
│   │   │   └── page.tsx               # Budget, savings, credit simulator
│   │   ├── investment/
│   │   │   └── page.tsx               # Stock screener, portfolio tracker
│   │   ├── crypto/
│   │   │   └── page.tsx               # Crypto dashboard, DeFi protocols
│   │   ├── investment-banking/
│   │   │   └── page.tsx               # M&A, valuation, DCF calculator
│   │   ├── ekonomi/
│   │   │   └── page.tsx               # Economic indicators, Indonesia data
│   │   ├── smart-money/
│   │   │   └── page.tsx               # Institutional flows, whale tracking
│   │   └── polymarket/
│   │       └── page.tsx               # Prediction markets, probability
│   ├── components/
│   │   └── sidebar.tsx                # Navigation sidebar (7 sections)
│   └── data/
│       └── navigation.ts              # Navigation configuration
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

## Features

### 1. Dashboard
- **Portfolio Overview**: Multi-asset portfolio tracking with charts
- **Market Stats**: Key financial metrics and KPIs
- **Performance Charts**: Line, bar, and pie charts with Recharts
- **Quick Actions**: Rebalance, set goals, view opportunities

### 2. Personal Finance
- **Budget Calculator**: Income vs expenses tracking with visual bars
- **Expense Categories**: Categorized spending with limits
- **Savings Goals**: Track progress toward financial targets
- **Credit Simulator**: Indonesian kredit simulator (Simulasi Kredit) with:
  - Loan amount calculator
  - Interest rate adjustment
  - Monthly payment calculation
  - Total interest calculation

### 3. Investment
- **Portfolio Performance**: Real vs benchmark comparison
- **Stock Holdings**: Detailed table with P/E ratios
- **Stock Screener**: Advanced filtering with live results
- **Risk vs Return**: Scatter plot analysis
- **Investment Strategies**: 3 pre-built strategies (Growth, Balanced, Conservative)

### 4. Cryptocurrency
- **Crypto Dashboard**: BTC/ETH price tracking
- **Holdings Table**: Current crypto positions
- **DeFi Protocols**: Top 4 protocols with TVL and APY
- **Blockchain Data**: Network activity and metrics
- **Market Data**: Dominance, volume, and cap tracking

### 5. Investment Banking
- **Deals Pipeline**: M&A deals with progress tracking
- **DCF Valuation**: Interactive calculator with:
  - Revenue input
  - EBITDA margin
  - Tax rate
  - WACC calculation
  - Terminal growth rate
  - FCF projections
- **Valuation Metrics**: EV/EBITDA, EV/Revenue analysis
- **Comparables Analysis**: Company comparison table

### 6. Ekonomi (Economics)
- **GDP Trends**: Historical GDP growth tracking
- **Inflation Tracker**: Inflation vs target rates
- **Macro Indicators**: Global economic metrics
- **Indonesia Economy**: BI Rate, Rupiah exchange, forex reserves
- **Sector Performance**: Growth and GDP contribution analysis

### 7. Smart Money
- **Institutional Flows**: Buy vs sell volume tracking
- **Whale Tracking**: Large wallet movements and alerts
- **Options Activity**: Call/put ratio analysis
- **Real-time Alerts**: High/medium/low severity notifications
- **Top Holdings**: Institutional fund positions

### 8. Polymarket
- **Markets Browser**: Searchable prediction markets
- **Probability Display**: YES/NO probability bars
- **Probability Calculator**: Expected value computation
- **Market Trends**: Historical probability tracking
- **Top Predictors**: Leaderboard with accuracy metrics

## Technology Stack

- **Frontend Framework**: Next.js 15.1
- **React Version**: 19.0
- **Styling**: Tailwind CSS 4.0
- **Charts**: Recharts 2.10
- **Animations**: Framer Motion 11.0
- **Icons**: Lucide React 0.344
- **Language**: TypeScript 5.3

## Color Theme

- **Primary**: Amber/Gold (#fbbf24, #f59e0b, #d97706)
- **Background**: Slate-950, Slate-900
- **Accent**: Gold gradient on dark background
- **UI Elements**: Slate-800 cards with amber borders

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

## Features Implemented

### Dashboard
- Portfolio value tracking
- 4 stat cards with trending indicators
- 3 interactive charts (Line, Pie, Bar)
- Quick action buttons
- Gold/amber color accent throughout

### Personal Finance (200+ lines)
- Budget tracking with monthly data
- Expense categories with limits
- 4 major savings goals with progress bars
- Credit simulator with slider controls
- Loan calculation with amortization

### Investment (200+ lines)
- 6 stock holdings with P/E metrics
- Portfolio vs benchmark comparison
- Risk/return scatter plot
- Stock screener with active filters
- 3 investment strategy cards

### Crypto (200+ lines)
- 4 cryptocurrency holdings
- DeFi protocol information
- Network activity tracking
- Market dominance data
- Blockchain metrics

### Investment Banking (200+ lines)
- 4 active M&A deals with progress
- DCF valuation calculator (interactive sliders)
- Valuation metrics grid
- Comparables analysis table
- FCF projection chart

### Ekonomi (200+ lines)
- GDP growth chart
- Inflation rate tracking
- Macro indicators
- Indonesia economic data
- Sector performance analysis

### Smart Money (200+ lines)
- Institutional flow tracking
- Whale movement alerts
- Options call/put analysis
- Real-time notification system
- Top holdings leaderboard

### Polymarket (200+ lines)
- 6 active prediction markets
- Probability calculator
- Market trends analysis
- Top predictors leaderboard
- Category filtering

## Components

### Sidebar
- Mobile responsive with drawer
- 8 navigation items (Dashboard + 7 sections)
- Gold accent on active items
- Animated transitions
- Market status indicator

### Charts & Visualizations
- Recharts integration throughout
- Custom tooltips with dark theme
- Responsive containers
- Legend and axis labels
- Multiple chart types (Line, Bar, Pie, Scatter, Area)

### Interactive Elements
- Range sliders for calculators
- Filter buttons
- Progress bars
- Data tables with hover effects
- Tab navigation
- Modal-like cards

## Styling

All pages feature:
- Consistent dark theme (slate-950 background)
- Gold/amber accents (#fbbf24, #f59e0b)
- Smooth transitions and hover effects
- Responsive grid layouts
- Card-based UI with borders
- Gradient text (gold-gradient utility)
- Custom scrollbar styling

## Usage

Navigate through the sidebar to access:
1. **Dashboard** - Overview of all finances
2. **Personal Finance** - Budget and savings management
3. **Investment** - Stock portfolio management
4. **Crypto** - Cryptocurrency tracking
5. **Investment Banking** - M&A and valuation tools
6. **Ekonomi** - Economic analysis
7. **Smart Money** - Institutional tracking
8. **Polymarket** - Prediction markets

Each page has multiple tabs and interactive calculators for deep analysis.

## Future Enhancements

- Real data integration via APIs
- User authentication
- Portfolio persistence
- Real-time data streaming
- Advanced charting with TradingView
- Mobile app version
- Social features
- Backtesting engine

## License

MIT
