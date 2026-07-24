/**
 * Dashboard data layer.
 *
 * Pre-launch: demo / zeroed values so the UI is complete.
 * Post-launch: replace `getDashboardData` with live fetches
 * (Bankr API, on-chain indexer, or a simple JSON endpoint).
 */

export type Purchase = {
  id: string;
  timestamp: string; // ISO
  mstrUnits: number;
  usdValue: number;
  feeSourceUsd: number;
  txHash: string | null;
  note?: string;
};

export type DashboardData = {
  token: {
    priceUsd: number | null;
    marketCapUsd: number | null;
    volume24hUsd: number | null;
    holders: number | null;
    priceChange24hPct: number | null;
  };
  fees: {
    totalCreatorFeesUsd: number;
    recycledPct: number;
    recycledUsd: number;
  };
  accumulation: {
    totalMstrUnits: number;
    totalMstrUsd: number;
    purchaseCount: number;
    recentPurchases: Purchase[];
  };
  market: {
    btcHoldings: number;
    shortInterestFloatPct: number;
    cycleNote: string;
  };
  lastUpdated: string | null;
  isLive: boolean;
};

/** Seed data — all zeros / placeholders until the token is live and feeds are wired. */
export const seedDashboardData: DashboardData = {
  token: {
    priceUsd: null,
    marketCapUsd: null,
    volume24hUsd: null,
    holders: null,
    priceChange24hPct: null,
  },
  fees: {
    totalCreatorFeesUsd: 0,
    recycledPct: 60,
    recycledUsd: 0,
  },
  accumulation: {
    totalMstrUnits: 0,
    totalMstrUsd: 0,
    purchaseCount: 0,
    recentPurchases: [],
  },
  market: {
    btcHoldings: 843_775,
    shortInterestFloatPct: 13,
    cycleNote:
      "Bear market conditions largely exhausted. Probability the low is in is rising.",
  },
  lastUpdated: null,
  isLive: false,
};

/**
 * Demo purchases for UI preview (set USE_DEMO_DATA = true in getDashboardData).
 * Remove or gate before production if you want a pure zero state.
 */
export const demoPurchases: Purchase[] = [
  {
    id: "1",
    timestamp: "2026-07-20T14:22:00.000Z",
    mstrUnits: 12.4,
    usdValue: 4_820.5,
    feeSourceUsd: 8_034.17,
    txHash: "0xdemo0001aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  },
  {
    id: "2",
    timestamp: "2026-07-18T09:05:00.000Z",
    mstrUnits: 8.15,
    usdValue: 3_210.0,
    feeSourceUsd: 5_350.0,
    txHash: "0xdemo0002bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  },
  {
    id: "3",
    timestamp: "2026-07-15T18:40:00.000Z",
    mstrUnits: 21.7,
    usdValue: 8_640.25,
    feeSourceUsd: 14_400.42,
    txHash: "0xdemo0003cccccccccccccccccccccccccccccccccccccccccccccccccccc",
  },
];

const USE_DEMO_DATA = false;

export async function getDashboardData(): Promise<DashboardData> {
  // TODO: wire live sources (token price, holders, fee totals, purchase log).
  if (!USE_DEMO_DATA) {
    return seedDashboardData;
  }

  const totalMstrUnits = demoPurchases.reduce((s, p) => s + p.mstrUnits, 0);
  const totalMstrUsd = demoPurchases.reduce((s, p) => s + p.usdValue, 0);
  const totalFees = demoPurchases.reduce((s, p) => s + p.feeSourceUsd, 0);

  return {
    token: {
      priceUsd: 0.00042,
      marketCapUsd: 420_000,
      volume24hUsd: 85_200,
      holders: 1_284,
      priceChange24hPct: 6.2,
    },
    fees: {
      totalCreatorFeesUsd: totalFees,
      recycledPct: 60,
      recycledUsd: totalMstrUsd,
    },
    accumulation: {
      totalMstrUnits,
      totalMstrUsd,
      purchaseCount: demoPurchases.length,
      recentPurchases: demoPurchases,
    },
    market: {
      btcHoldings: 843_775,
      shortInterestFloatPct: 13,
      cycleNote:
        "Bear market conditions largely exhausted. Probability the low is in is rising.",
    },
    lastUpdated: new Date().toISOString(),
    isLive: false,
  };
}
