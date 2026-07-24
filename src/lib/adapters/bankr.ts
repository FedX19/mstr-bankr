/**
 * Bankr public fee-data adapter.
 *
 * Bankr documents unauthenticated fee-read endpoints for dashboards
 * (approx. 2-minute cache). Do not invent undocumented API fields.
 * Stock-paired fee denomination must be confirmed in writing before launch.
 */

import { siteConfig } from "../config";
import type { AdapterResult, CreatorFeeSnapshot } from "./types";

export async function fetchCreatorFees(): Promise<
  AdapterResult<CreatorFeeSnapshot>
> {
  const source = "bankr-public-api";
  const fetchedAt = new Date().toISOString();

  if (!siteConfig.memeTokenAddress && !siteConfig.feeBeneficiary) {
    return {
      ok: false,
      error: "Token and fee beneficiary not configured (prelaunch).",
      fetchedAt,
      source,
    };
  }

  // TODO: call documented Bankr public fee endpoints only.
  // Avoid excessive polling. Surface stale status when cache is old.
  return {
    ok: false,
    error: "Bankr fee adapter not wired — confirm stock-pair fee docs first.",
    fetchedAt,
    source,
  };
}
