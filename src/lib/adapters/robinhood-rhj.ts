/**
 * Robinhood Stock Token (RHJ) public APIs — asset registry + prices.
 * https://api.robinhood.com/rhj/assets
 * https://api.robinhood.com/rhj/prices/MSTR
 *
 * Always resolve MSTR contract from the live registry before trusting config.
 */

import type { AdapterResult } from "./types";

export type RhjAsset = {
  tokenSymbol: string;
  tokenName: string;
  contractAddress: string | null;
  chainId: number | null;
  currentMultiplier: string | null;
  status: string | null;
  logoUrl: string | null;
};

export type RhjPriceQuote = {
  tokenSymbol: string;
  contractAddress: string | null;
  chainId: number | null;
  bid: number | null;
  ask: number | null;
  mid: number | null;
  currency: string | null;
  dailyTradingVolume: number | null;
  generatedAt: string | null;
  dailyHigh: number | null;
  dailyLow: number | null;
  isTradingHalt: boolean | null;
  status: string | null;
};

export type RhjMstrSnapshot = {
  asset: RhjAsset | null;
  quote: RhjPriceQuote | null;
  /** Contract from registry — use this as canonical */
  canonicalContract: string | null;
  registryVerified: boolean;
};

const ASSETS_URL = "https://api.robinhood.com/rhj/assets";
const PRICE_URL = "https://api.robinhood.com/rhj/prices/MSTR";

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function fetchRhjAssets(): Promise<
  AdapterResult<RhjAsset[]>
> {
  const source = "robinhood-rhj-assets";
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(ASSETS_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "RoaringStackerStackCheck/1.0",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `RHJ assets HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }
    const json = (await res.json()) as {
      assets?: Array<{
        tokenSymbol?: string;
        tokenName?: string;
        currentMultiplier?: string;
        status?: string;
        logoUrl?: string;
        deployments?: Array<{ contractAddress?: string; chainId?: number }>;
      }>;
    };
    const assets = (json.assets ?? []).map((a) => {
      const dep =
        a.deployments?.find((d) => d.chainId === 4663) ??
        a.deployments?.[0];
      return {
        tokenSymbol: a.tokenSymbol ?? "",
        tokenName: a.tokenName ?? "",
        contractAddress: dep?.contractAddress ?? null,
        chainId: dep?.chainId ?? null,
        currentMultiplier: a.currentMultiplier ?? null,
        status: a.status ?? null,
        logoUrl: a.logoUrl ?? null,
      } satisfies RhjAsset;
    });
    return { ok: true, data: assets, fetchedAt, source };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "RHJ assets failed",
      fetchedAt,
      source,
    };
  }
}

export async function fetchRhjMstrPrice(): Promise<
  AdapterResult<RhjPriceQuote>
> {
  const source = "robinhood-rhj-prices/MSTR";
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(PRICE_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "RoaringStackerStackCheck/1.0",
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `RHJ price HTTP ${res.status}`,
        fetchedAt,
        source,
      };
    }
    const json = (await res.json()) as {
      quotes?: Array<{
        tokenSymbol?: string;
        bid?: string;
        ask?: string;
        currency?: string;
        dailyTradingVolume?: string;
        generatedAt?: string;
        dailyHigh?: string;
        dailyLow?: string;
        isTradingHalt?: boolean;
        deployments?: Array<{ contractAddress?: string; chainId?: number }>;
      }>;
    };
    const q = json.quotes?.[0];
    if (!q) {
      return {
        ok: false,
        error: "No MSTR quote in RHJ prices response",
        fetchedAt,
        source,
      };
    }
    const dep =
      q.deployments?.find((d) => d.chainId === 4663) ?? q.deployments?.[0];
    const bid = num(q.bid);
    const ask = num(q.ask);
    const mid =
      bid != null && ask != null
        ? (bid + ask) / 2
        : bid ?? ask ?? null;

    return {
      ok: true,
      data: {
        tokenSymbol: q.tokenSymbol ?? "MSTR",
        contractAddress: dep?.contractAddress ?? null,
        chainId: dep?.chainId ?? null,
        bid,
        ask,
        mid,
        currency: q.currency ?? "USD",
        dailyTradingVolume: num(q.dailyTradingVolume),
        generatedAt: q.generatedAt ?? null,
        dailyHigh: num(q.dailyHigh),
        dailyLow: num(q.dailyLow),
        isTradingHalt: q.isTradingHalt ?? null,
        status: q.isTradingHalt ? "HALTED" : "ACTIVE",
      },
      fetchedAt,
      source,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "RHJ price failed",
      fetchedAt,
      source,
    };
  }
}

/** Registry + price for MSTR Stock Token, with address verification. */
export async function fetchRhjMstrSnapshot(
  configAddress: string | null,
): Promise<AdapterResult<RhjMstrSnapshot>> {
  const source = "robinhood-rhj-mstr";
  const fetchedAt = new Date().toISOString();

  const [assetsRes, priceRes] = await Promise.all([
    fetchRhjAssets(),
    fetchRhjMstrPrice(),
  ]);

  const asset =
    assetsRes.ok
      ? assetsRes.data.find((a) => a.tokenSymbol === "MSTR") ?? null
      : null;
  const quote = priceRes.ok ? priceRes.data : null;

  const canonical =
    asset?.contractAddress ??
    quote?.contractAddress ??
    null;

  const registryVerified =
    canonical != null &&
    (configAddress == null ||
      canonical.toLowerCase() === configAddress.toLowerCase());

  if (!asset && !quote) {
    return {
      ok: false,
      error: [
        assetsRes.ok ? null : assetsRes.error,
        priceRes.ok ? null : priceRes.error,
      ]
        .filter(Boolean)
        .join("; "),
      fetchedAt,
      source,
    };
  }

  return {
    ok: true,
    data: {
      asset,
      quote,
      canonicalContract: canonical,
      registryVerified,
    },
    fetchedAt,
    source,
  };
}
