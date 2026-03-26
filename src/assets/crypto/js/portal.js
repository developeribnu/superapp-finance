const PORTAL_NAV = {
  home: {
    label: "Home",
    href: "/",
    secondary: [
      {
        id: "overview",
        label: "Overview",
        href: "/#home",
        tertiary: [
          { label: "Command Hub", href: "/portal/#overview" },
          { label: "Execution Map", href: "/portal/#execution-map" },
          { label: "Fast Access", href: "/#tools" }
        ]
      },
      {
        id: "updates",
        label: "Updates",
        href: "/#knowledge",
        tertiary: [
          { label: "Latest Changes", href: "/portal/#updates" },
          { label: "Live Status", href: "/#research" }
        ]
      }
    ]
  },
  market: {
    label: "Market",
    href: "/",
    secondary: [
      {
        id: "dashboards",
        label: "Dashboards",
        href: "/#analytics",
        tertiary: [
          { label: "BTC Signal Stack", href: "/portal/market.html#dashboards" },
          { label: "Cycle Context", href: "/#analytics" }
        ]
      },
      {
        id: "flows",
        label: "Flows",
        href: "/#analytics",
        tertiary: [
          { label: "On-chain Flows", href: "/portal/market.html#flows" },
          { label: "Risk Tape", href: "/#analytics" }
        ]
      }
    ]
  },
  tools: {
    label: "Tools",
    href: "/",
    secondary: [
      {
        id: "trading-tools",
        label: "Trading Tools",
        href: "/#tools",
        tertiary: [
          { label: "Execution Utilities", href: "/portal/tools.html#trading-tools" },
          { label: "Risk Utilities", href: "/#tools" }
        ]
      },
      {
        id: "playground",
        label: "Playground",
        href: "/#knowledge",
        tertiary: [
          { label: "Learning Tools", href: "/#knowledge" },
          { label: "Legacy Playground", href: "/legacy.html#playground" }
        ]
      }
    ]
  },
  knowledge: {
    label: "Knowledge",
    href: "/",
    secondary: [
      {
        id: "deck",
        label: "Strategy Deck",
        href: "/#knowledge",
        tertiary: [
          { label: "Principles", href: "/portal/knowledge.html#deck" },
          { label: "Allocation", href: "/#knowledge" }
        ]
      },
      {
        id: "platform-intel",
        label: "Platform Intel",
        href: "/#knowledge",
        tertiary: [
          { label: "Crypto Intel", href: "/portal/knowledge.html#platform-intel" },
          { label: "Finance Intel", href: "/#knowledge" }
        ]
      }
    ]
  },
  research: {
    label: "Research",
    href: "/",
    secondary: [
      {
        id: "finance-report",
        label: "Finance Dashboard Report",
        href: "/#research",
        tertiary: [
          { label: "Rendered Page", href: "/research/finance-investment-dashboard-platform-intelligence.html" },
          { label: "Source Code", href: "/research/finance-investment-dashboard-platform-intelligence-source.html" },
          { label: "PDF Material", href: "/assets/files/finance-investment-dashboard-platform-intelligence-comprehensive-research-report.pdf" }
        ]
      },
      {
        id: "archives",
        label: "Archives",
        href: "/#research",
        tertiary: [
          { label: "Legacy Hub", href: "/legacy.html#knowledge" },
          { label: "Platform Tab", href: "/legacy.html#knowledge" }
        ]
      }
    ]
  }
};

function createChip(item, isActive, extraClass = "") {
  const a = document.createElement("a");
  a.href = item.href;
  a.textContent = item.label;
  a.className = `nav-chip ${extraClass} ${isActive ? "active" : ""}`.trim();
  return a;
}

function renderPortalHeader() {
  const host = document.getElementById("portalHeader");
  if (!host) return;

  const primaryKey = document.body.dataset.primary || "home";
  const activePrimary = PORTAL_NAV[primaryKey] || PORTAL_NAV.home;
  const secondaryKey = document.body.dataset.secondary || activePrimary.secondary[0].id;
  const activeSecondary =
    activePrimary.secondary.find((item) => item.id === secondaryKey) ||
    activePrimary.secondary[0];

  const primary = document.createElement("div");
  primary.className = "tier tier-primary";
  primary.innerHTML = '<div class="inner" id="primaryWrap"></div>';

  const secondary = document.createElement("div");
  secondary.className = "tier tier-secondary";
  secondary.innerHTML = '<div class="inner" id="secondaryWrap"></div>';

  const tertiary = document.createElement("div");
  tertiary.className = "tier tier-tertiary";
  tertiary.innerHTML = '<div class="inner" id="tertiaryWrap"></div>';

  host.append(primary, secondary, tertiary);

  const primaryWrap = document.getElementById("primaryWrap");
  const brand = document.createElement("a");
  brand.href = "/";
  brand.className = "brand";
  brand.innerHTML = '<span class="brand-dot"></span><span>IBNU CRYPTOSPHERE PORTAL</span>';
  primaryWrap.appendChild(brand);

  Object.entries(PORTAL_NAV).forEach(([key, item]) => {
    primaryWrap.appendChild(createChip(item, key === primaryKey));
  });

  const legacyLink = {
    label: "Legacy One-Page",
    href: "/legacy.html#knowledge"
  };
  primaryWrap.appendChild(createChip(legacyLink, false, "ghost"));

  const secondaryWrap = document.getElementById("secondaryWrap");
  activePrimary.secondary.forEach((item) => {
    secondaryWrap.appendChild(createChip(item, item.id === activeSecondary.id, "small"));
  });

  const tertiaryWrap = document.getElementById("tertiaryWrap");
  activeSecondary.tertiary.forEach((item) => {
    tertiaryWrap.appendChild(createChip(item, false, "small"));
  });
}

document.addEventListener("DOMContentLoaded", renderPortalHeader);
