import { siteConfig } from "../lib/config";

/**
 * Static jurisdiction notice for prelaunch / research mode.
 * Full geo-detection and trade-route gating land after legal clearance.
 */
export function JurisdictionNotice() {
  if (!siteConfig.jurisdictionNoticeEnabled) return null;

  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="card border-[var(--border-strong)] p-4 sm:p-5">
          <p className="card-label mb-2">Jurisdiction</p>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Robinhood Stock Tokens are not registered under U.S. securities laws
            and may not be offered, sold or delivered in the United States or to,
            or for the benefit of, U.S. persons. Stock-paired trading will not be
            enabled for restricted jurisdictions. Research pages remain available
            for educational purposes. Do not use a VPN or other methods to evade
            location checks.
          </p>
          {!siteConfig.tradingEnabled ? (
            <p className="mt-3 text-xs font-medium text-[var(--text-dim)]">
              Trade route: disabled until launch gates and legal clearance are
              satisfied.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
