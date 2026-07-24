/**
 * Prelaunch roadmap, gates, and product facts.
 * Website/product work can be completed here; token deploy stays human-gated.
 */

export type GateStatus = "done" | "in_progress" | "pending" | "human";

export type LaunchGate = {
  id: string;
  title: string;
  status: GateStatus;
  owner: "website" | "ops" | "legal" | "platform" | "brand";
  summary: string;
  details: string[];
};

export type RoadmapPhase = {
  id: string;
  phase: string;
  title: string;
  status: "complete" | "current" | "next" | "later";
  summary: string;
  items: string[];
};

/** Intended Bankr launch configuration (do not invent API fields). */
export const launchConfig = {
  chain: "Robinhood Chain",
  chainId: 4663,
  primaryQuote: "Canonical MSTR Stock Token",
  launchType: "Fair launch",
  presale: "None",
  creatorAllocation: "Disabled",
  creatorVesting: "Disabled",
  tokenSupply: "Bankr standard fixed supply (typically 100B; confirm at deploy)",
  liquidityPlacement:
    "Bankr standard — 100% into launch when vesting disabled (confirm stock-pair path)",
  tradingFee: "0.7% swap fee (Bankr Uniswap V4 standard — confirm for stock pairs)",
  creatorFeeShare: "95% of creator-fee portion to project beneficiary",
  protocolFeeShare: "5% to Doppler",
  feeBeneficiary: "Project multisig (2-of-3 hardware) — assign at deploy after Bankr approval",
  associatedWebsite: "This site (update official domain in config when reserved)",
  associatedX: "Official contract announcement post only after gates clear",
} as const;

export const productIs = [
  "A cultural meme token",
  "An onchain market paired with tokenized MSTR exposure",
  "A public dashboard showing actual pool mechanics",
  "A research and community surface covering MSTR and Bitcoin",
  "An independent project with transparent creator fees",
] as const;

export const productIsNot = [
  "Strategy stock or Bitcoin",
  "A share in the project company",
  "Redeemable for MSTR",
  "Backed by MSTR in a holder-owned reserve sense",
  "A claim on pool assets, dividends, income, or liquidation rights",
  "Affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood, or Bankr",
] as const;

export const feePolicy = {
  publicPolicy:
    "Creator fees are generated automatically by trading through the Bankr liquidity pool. The current Bankr structure allocates 95% of the pool’s creator-fee share to the designated beneficiary and 5% to the Doppler protocol. Creator fees belong to the project company and do not belong to tokenholders.",
  mayFund: [
    "Website infrastructure and data services",
    "Development and security",
    "Legal and accounting",
    "Community operations and content",
    "Marketing and contingency reserves",
    "Other disclosed business expenses",
  ],
  willNotPromise: [
    "Token buybacks",
    "Price support",
    "Permanent MSTR purchases for holders",
    "Revenue distributions or holder dividends",
    "Guaranteed liquidity additions or burns",
  ],
  feeDenominationNote:
    "Stock-paired fee denomination is not assumed. Written Bankr confirmation is required before launch.",
} as const;

export const bankrOpenQuestions = [
  "Whether a U.S. creator may deploy a stock-paired pool",
  "Whether a U.S.-controlled entity may be the fee beneficiary",
  "Which assets creator fees accrue in for an MSTR-paired pool",
  "Whether the creator can decline any MSTR-denominated fee portion",
  "Whether fees can be routed directly to a Safe / multisig",
  "Whether the no-vesting option works with stock-paired launches",
  "How the initial MSTR side of liquidity is sourced",
  "Whether Bankr handles location verification for the deployer",
  "Whether a stock-paired token can later add a WETH or USDG pool",
  "What frontend restrictions Bankr expects from project operators",
] as const;

/**
 * Hard gates from the master plan.
 * Website items marked done when the product site is complete.
 * Human/legal/platform gates stay pending until operators clear them.
 */
export const launchGates: LaunchGate[] = [
  {
    id: "website",
    title: "Gate 6 — Website readiness",
    status: "done",
    owner: "website",
    summary:
      "Dashboard, disclosures, pages, brand art, prelaunch mode, and contract placeholders are complete.",
    details: [
      "Stock-paired positioning (no fee-recycle treasury language)",
      "Prelaunch status bar and disabled trade route",
      "How it works, thesis, transparency, risks, FAQ, roadmap, terms, privacy",
      "Hero, token icon, pair marks",
      "Central config for chain, quote asset, and contracts",
      "Jurisdiction notice and non-affiliation / risk statements",
    ],
  },
  {
    id: "bankr",
    title: "Gate 1 — Bankr confirmation",
    status: "human",
    owner: "platform",
    summary:
      "Written confirmation that the stock-paired launch and fee-recipient structure are supported.",
    details: [
      "Stock-paired MSTR quote asset supported",
      "No-vesting / no creator allocation path confirmed",
      "Fee denomination and multisig beneficiary routing confirmed",
      "Initial MSTR inventory / seeding path confirmed",
      "Deployer geo / eligibility expectations confirmed",
    ],
  },
  {
    id: "counsel",
    title: "Gate 2 — Securities counsel",
    status: "human",
    owner: "legal",
    summary:
      "Written legal analysis covering U.S. participation, Reg S, Howey framing, geo-restrictions, and disclosures.",
    details: [
      "U.S. founder / fee-beneficiary exposure",
      "Whether deployment could facilitate restricted securities activity",
      "Geo-restriction and marketing limits",
      "Trademark and right-of-publicity review",
      "Approved disclosure language",
    ],
  },
  {
    id: "liquidity",
    title: "Gate 3 — Liquidity validation",
    status: "human",
    owner: "ops",
    summary:
      "Eligible non-U.S. tester executes MSTR Stock Token quotes at size with acceptable impact.",
    details: [
      "$1,000 order < 1% total impact under normal conditions",
      "$5,000 order < 2% total impact under normal conditions",
      "Quotes available outside U.S. market hours and on weekends",
      "Pool can be seeded without a distorted open",
      "Fallback to COIN if MSTR fails thresholds",
    ],
  },
  {
    id: "security",
    title: "Gate 4 — Security review",
    status: "in_progress",
    owner: "ops",
    summary:
      "Allowlists, env audit, phishing safeguards, incident response, and multisig recovery.",
    details: [
      "Dependency and wallet-integration review",
      "No private keys in frontend or Vercel env",
      "Contract-address allowlist after deploy",
      "Incident-response and multisig recovery docs",
      "Analytics privacy review",
    ],
  },
  {
    id: "brand",
    title: "Gate 5 — Brand review",
    status: "in_progress",
    owner: "brand",
    summary:
      "Name, ticker, domain, and socials checked; original art in place; no unauthorized likeness.",
    details: [
      "Original hero and token icon live on site",
      "Ticker candidates still provisional ($ROAR first)",
      "Domain and social handle reservation pending",
      "Trademark / publicity counsel pending with Gate 2",
      "No copied Strategy or Roaring Kitty assets",
    ],
  },
];

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: "phase-0",
    phase: "Phase 0",
    title: "Build and verify",
    status: "complete",
    summary:
      "Convert the product to stock-paired prelaunch mode, ship the public site, and lock configuration.",
    items: [
      "Central config with prelaunch defaults",
      "Remove fee-recycling / permanent treasury language",
      "Homepage, pool mechanics, thesis, transparency, risks, FAQ",
      "Brand art (hero, token icon, pair mark)",
      "Terms, privacy, roadmap, launch gates",
      "Data adapter stubs for RPC, Bankr fees, Chainlink",
    ],
  },
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Public research launch",
    status: "current",
    summary:
      "Run the website without a token. Own the narrative. Educate. No funds, no presale, no unofficial contracts.",
    items: [
      "Publish MSTR thesis and stock-paired mechanics",
      "Publish risk disclosures and non-affiliation",
      "Official social verification when handles are reserved",
      "Gather community interest without accepting deposits",
      "Monitor impersonation contracts and copycats",
    ],
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "Clearance",
    status: "next",
    summary:
      "Only after every hard gate passes. Announce configuration and verification procedure — not private keys or deploy timing secrets.",
    items: [
      "Bankr support confirmed in writing",
      "Legal review completed",
      "MSTR (or COIN fallback) selected after liquidity tests",
      "Fair-launch settings locked: no presale, no vesting, no allocation",
      "Official launch window and contract-verification procedure",
    ],
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Token launch",
    status: "later",
    summary:
      "Human-approved Bankr fair launch on Robinhood Chain. Publish contracts immediately.",
    items: [
      "Deploy via approved Bankr stock-paired flow",
      "Publish meme contract, pool ID, canonical MSTR, deployment tx",
      "Publish fee beneficiary, vesting status, Bankr page, Blockscout links",
      "Enable trade route only for eligible jurisdictions",
      "Flip config: launchStatus live, tradingEnabled true",
    ],
  },
  {
    id: "phase-4",
    phase: "Phase 4",
    title: "First 24 hours",
    status: "later",
    summary: "Operate the market. Do not hype, target prices, or shame sellers.",
    items: [
      "Monitor pool depth, impact, oracle freshness",
      "Watch fake contracts and impersonation accounts",
      "Confirm fee calculations and holder concentration",
      "No price targets, coordinated-buying language, or squeeze claims",
    ],
  },
  {
    id: "phase-5",
    phase: "Phase 5",
    title: "First seven days",
    status: "later",
    summary: "Publish factual ops metrics and correct any disclosure errors.",
    items: [
      "Volume, liquidity, unique holders",
      "Pool MSTR inflows and outflows",
      "Creator fees and technical incidents",
      "Any disclosure corrections",
    ],
  },
  {
    id: "phase-6",
    phase: "Phase 6",
    title: "Ongoing operations",
    status: "later",
    summary: "Weekly verification and monthly transparency.",
    items: [
      "Weekly: contracts, liquidity, oracles, fees, impersonation",
      "Monthly: transparency report, fee spend, wallet permissions, legal changes",
      "Never mix creator fees with personal wallets",
    ],
  },
];

export function gatesByStatus(status: GateStatus) {
  return launchGates.filter((g) => g.status === status);
}

export function websiteReady(): boolean {
  return launchGates.find((g) => g.id === "website")?.status === "done";
}

export function allHumanGatesClear(): boolean {
  return launchGates
    .filter((g) => g.owner !== "website")
    .every((g) => g.status === "done");
}

export function launchBlockedReason(): string {
  const open = launchGates.filter((g) => g.status !== "done");
  if (open.length === 0) return "All gates complete.";
  return open.map((g) => g.title).join("; ");
}
