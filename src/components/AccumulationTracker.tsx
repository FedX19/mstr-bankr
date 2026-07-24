import { siteConfig } from "../lib/config";
import type { DashboardData } from "../lib/data";
import { formatDate, formatNumber, formatUsd, shortenHash } from "../lib/format";

type Props = {
  data: DashboardData;
};

export function AccumulationTracker({ data }: Props) {
  const { accumulation, fees } = data;
  const recycledRatio =
    fees.totalCreatorFeesUsd > 0
      ? Math.min(100, (fees.recycledUsd / fees.totalCreatorFeesUsd) * 100)
      : 0;
  // Target allocation progress (visual only): how much of intended 60% path is filled
  const targetProgress =
    fees.totalCreatorFeesUsd > 0
      ? Math.min(
          100,
          (fees.recycledUsd / (fees.totalCreatorFeesUsd * (fees.recycledPct / 100))) *
            100,
        )
      : 0;

  const purchases = accumulation.recentPurchases;

  return (
    <section id="accumulation" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Core Feature</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              MSTR Accumulation Tracker
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
              Every meaningful tranche of creator fees is recycled into tokenized
              MSTR. Running totals are public. Purchases are listed with
              transaction hashes.
            </p>
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            All purchases are public and verifiable
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Summary cards */}
          <div className="card p-5 lg:col-span-1">
            <p className="card-label mb-3">Running Total</p>
            <p className="stat-value text-3xl font-medium text-[var(--accent)]">
              {formatUsd(accumulation.totalMstrUsd)}
            </p>
            <p className="mt-1 stat-value text-sm text-[var(--text-muted)]">
              {formatNumber(accumulation.totalMstrUnits, { digits: 4 })} MSTR units
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="dim">Fees recycled into MSTR</span>
                  <span className="stat-value text-[var(--text-muted)]">
                    {fees.totalCreatorFeesUsd > 0
                      ? `${recycledRatio.toFixed(0)}% of fees`
                      : "—"}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${fees.totalCreatorFeesUsd > 0 ? Math.max(targetProgress, recycledRatio > 0 ? 8 : 0) : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[var(--text-dim)]">
                  Target allocation: {fees.recycledPct}% of creator fees
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="card-label mb-1">Fees earned</p>
                  <p className="stat-value text-sm text-white">
                    {formatUsd(fees.totalCreatorFeesUsd)}
                  </p>
                </div>
                <div>
                  <p className="card-label mb-1">Purchases</p>
                  <p className="stat-value text-sm text-white">
                    {formatNumber(accumulation.purchaseCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase log */}
          <div className="card overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <p className="text-sm font-medium text-white">Recent Purchases</p>
              <span className="badge">On-chain</span>
            </div>

            {purchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  No purchases yet
                </p>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-dim)]">
                  After launch, every fee → MSTR buy will appear here with a
                  verifiable transaction hash. Recycling volume into the treasury.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="tx-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>MSTR</th>
                      <th>USD</th>
                      <th>Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <tr key={p.id}>
                        <td className="dim whitespace-nowrap text-xs">
                          {formatDate(p.timestamp)}
                        </td>
                        <td className="stat-value text-white">
                          {formatNumber(p.mstrUnits, { digits: 2 })}
                        </td>
                        <td className="stat-value text-[var(--text-muted)]">
                          {formatUsd(p.usdValue)}
                        </td>
                        <td>
                          {p.txHash ? (
                            <a
                              href={
                                p.txHash.startsWith("0xdemo")
                                  ? undefined
                                  : `${siteConfig.explorerTxBase}${p.txHash}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`stat-value text-xs ${
                                p.txHash.startsWith("0xdemo")
                                  ? "dim"
                                  : "link-accent"
                              }`}
                            >
                              {shortenHash(p.txHash)}
                            </a>
                          ) : (
                            <span className="dim text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
