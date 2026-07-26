/**
 * Strategy Bitcoin Ledger — public Next.js SSG data from strategy.com/ledger
 * Source of truth for purchase history; page: https://www.strategy.com/ledger
 */

import type { AdapterResult } from "./types";

export type LedgerEvent = {
  date: string; // YYYY-MM-DD
  btcAmount: number; // purchase positive, sale negative
  pricePerBtc: number | null;
  cumulativeHoldings: number | null;
  averageCost: number | null;
  totalAcquisitionCostUsd: number | null; // often in USD millions in source
  totalPurchasePriceUsd: number | null;
  btcYieldYtdPct: number | null;
  btcNavUsdM: number | null; // reserve value $M
  rowIndex: number | null;
  sourceUrl: string | null;
};

export type StrategyLedgerSnapshot = {
  totalBtc: number | null;
  averageCostUsd: number | null;
  /** USD millions from ledger btc_nav when present */
  reserveValueUsdM: number | null;
  /** Estimated reserve USD from BTC * latest BTC price when nav missing */
  reserveValueUsd: number | null;
  btcYieldYtdPct: number | null;
  eventCount: number;
  purchaseCount: number;
  saleCount: number;
  latestEvent: LedgerEvent | null;
  events: LedgerEvent[];
  ledgerUrl: string;
  buildId: string | null;
};

const LEDGER_PAGE = "https://www.strategy.com/ledger";

async function resolveBuildId(): Promise<string | null> {
  try {
    const res = await fetch(LEDGER_PAGE, {
      headers: { "User-Agent": "RoaringStackerStackCheck/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/"buildId":"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function mapRow(raw: Record<string, unknown>): LedgerEvent {
  const sec = raw.sec as { url?: string } | null | undefined;
  const count = raw.count != null ? Number(raw.count) : 0;
  const totalAcq = raw.total_acquisition_cost;
  // Source often stores cumulative acquisition cost in $M on totals row;
  // per-row total_purchase_price is full USD for that event.
  return {
    date: String(raw.date_of_purchase).slice(0, 10),
    btcAmount: count,
    pricePerBtc:
      raw.purchase_price != null ? Number(raw.purchase_price) : null,
    cumulativeHoldings:
      raw.btc_holdings != null ? Number(raw.btc_holdings) : null,
    averageCost:
      raw.average_price != null ? Number(raw.average_price) : null,
    totalAcquisitionCostUsd:
      totalAcq != null ? Number(totalAcq) * 1_000_000 : null,
    totalPurchasePriceUsd:
      raw.total_purchase_price != null
        ? Number(raw.total_purchase_price)
        : null,
    btcYieldYtdPct:
      raw.btc_yield_ytd != null ? Number(raw.btc_yield_ytd) : null,
    btcNavUsdM: raw.btc_nav != null ? Number(raw.btc_nav) : null,
    rowIndex: raw.row_index != null ? Number(raw.row_index) : null,
    sourceUrl: sec?.url ?? null,
  };
}

export async function fetchStrategyLedger(): Promise<
  AdapterResult<StrategyLedgerSnapshot>
> {
  const source = "strategy.com/ledger";
  const fetchedAt = new Date().toISOString();

  try {
    const buildId = await resolveBuildId();
    if (!buildId) {
      return {
        ok: false,
        error: "Could not resolve Strategy site buildId for ledger data.",
        fetchedAt,
        source,
      };
    }

    const dataUrl = `https://www.strategy.com/_next/data/${buildId}/en/ledger.json`;
    const res = await fetch(dataUrl, {
      headers: {
        "User-Agent": "RoaringStackerStackCheck/1.0",
        Accept: "application/json",
        "x-nextjs-data": "1",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Ledger data HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }

    const json = (await res.json()) as {
      pageProps?: { bitcoinData?: Record<string, unknown>[] };
    };
    const raw = json.pageProps?.bitcoinData;
    if (!Array.isArray(raw) || raw.length === 0) {
      return {
        ok: false,
        error: "Ledger payload missing bitcoinData array.",
        fetchedAt,
        source,
      };
    }

    const events = raw
      .map(mapRow)
      .filter((e) => e.date && !Number.isNaN(Date.parse(e.date)))
      .sort((a, b) => a.date.localeCompare(b.date));

    const latest = events[events.length - 1] ?? null;
    const purchaseCount = events.filter((e) => e.btcAmount > 0).length;
    const saleCount = events.filter((e) => e.btcAmount < 0).length;

    // Prefer latest row with nav; else last event
    const withNav = [...events].reverse().find((e) => e.btcNavUsdM != null);

    const snapshot: StrategyLedgerSnapshot = {
      totalBtc: latest?.cumulativeHoldings ?? null,
      averageCostUsd: latest?.averageCost ?? null,
      reserveValueUsdM: withNav?.btcNavUsdM ?? latest?.btcNavUsdM ?? null,
      reserveValueUsd:
        withNav?.btcNavUsdM != null
          ? withNav.btcNavUsdM * 1_000_000
          : null,
      btcYieldYtdPct: latest?.btcYieldYtdPct ?? null,
      eventCount: events.length,
      purchaseCount,
      saleCount,
      latestEvent: latest,
      events,
      ledgerUrl: LEDGER_PAGE,
      buildId,
    };

    return { ok: true, data: snapshot, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Ledger fetch failed",
      fetchedAt,
      source,
    };
  }
}
