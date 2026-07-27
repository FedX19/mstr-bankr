import Link from "next/link";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { SundayStackCard } from "./SundayStackCard";

type Props = {
  data: StackCheckSnapshot;
};

/**
 * Premium weekly scoreboard page body.
 * Hierarchy: minimal intro → hero export card → 3 insight panels → compact sources.
 */
export function SundayStackCheck({ data }: Props) {
  const s = data.strategy;
  const rhj = data.rhj;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. Minimal page header */}
      <header className="max-w-2xl">
        <p className="card-label mb-2">Weekly ritual</p>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Sunday Stack Check
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
          {siteConfig.thesisLine}{" "}
          <span className="text-[var(--accent)]">{data.tagline}</span>
        </p>
      </header>

      {/* 2–3. Hero card (visual scoreboard only) */}
      <SundayStackCard data={data} hideToolbar />

      {/* 4. Supporting insights — 3 premium panels */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="card-label mb-1">Scoreboard</p>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Reserve · Token · Pool
            </h2>
          </div>
          <p className="hidden text-xs text-[var(--text-dim)] sm:block">
            {data.pairLine}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Strategy Reserve */}
          <InsightPanel
            eyebrow="Strategy"
            title="BTC reserve"
            accent
            empty={!s}
            emptyMsg="Ledger unavailable"
          >
            <BigStat
              label="Total BTC"
              value={
                s?.totalBtc != null
                  ? formatNumber(s.totalBtc, { digits: 0 })
                  : "—"
              }
            />
            <StatGrid
              items={[
                {
                  label: "Reserve value",
                  value:
                    s?.reserveValueUsd != null
                      ? formatUsd(s.reserveValueUsd, { compact: true })
                      : "—",
                },
                {
                  label: "Avg cost",
                  value:
                    s?.averageCostUsd != null
                      ? formatUsd(s.averageCostUsd, { digits: 0 })
                      : "—",
                },
                {
                  label: "BTC yield YTD",
                  value:
                    s?.btcYieldYtdPct != null
                      ? `${s.btcYieldYtdPct.toFixed(1)}%`
                      : "—",
                  positive:
                    s?.btcYieldYtdPct != null
                      ? s.btcYieldYtdPct >= 0
                      : undefined,
                },
                {
                  label: "Events",
                  value: s != null ? String(s.eventCount) : "—",
                },
              ]}
            />
          </InsightPanel>

          {/* Tokenized MSTR */}
          <InsightPanel
            eyebrow="Robinhood"
            title="Tokenized MSTR"
            empty={!rhj}
            emptyMsg="RHJ feed unavailable"
          >
            <BigStat
              label="Mid quote"
              value={
                rhj?.quote?.mid != null
                  ? formatUsd(rhj.quote.mid, { digits: 2 })
                  : "—"
              }
              sub={
                rhj?.quote?.bid != null && rhj?.quote?.ask != null
                  ? `${formatUsd(rhj.quote.bid)} / ${formatUsd(rhj.quote.ask)}`
                  : undefined
              }
            />
            <StatGrid
              items={[
                {
                  label: "Daily volume",
                  value:
                    rhj?.quote?.dailyTradingVolume != null
                      ? formatUsd(rhj.quote.dailyTradingVolume, {
                          compact: true,
                        })
                      : "—",
                },
                {
                  label: "Registry",
                  value: rhj?.registryVerified ? "Verified" : "Check",
                  positive: rhj?.registryVerified,
                },
                {
                  label: "Status",
                  value: rhj?.quote?.status ?? rhj?.asset?.status ?? "—",
                },
                {
                  label: "Quote time",
                  value: rhj?.quote?.generatedAt
                    ? new Date(rhj.quote.generatedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—",
                },
              ]}
            />
            {rhj?.canonicalContract ? (
              <p className="mt-3 break-all font-mono text-[10px] leading-relaxed text-[var(--text-dim)]">
                {rhj.canonicalContract}
              </p>
            ) : null}
          </InsightPanel>

          {/* STACKR / MSTR pool */}
          <InsightPanel
            eyebrow={`$${siteConfig.ticker}`}
            title="MSTR pool"
            empty={false}
          >
            <BigStat
              label="Pool value"
              value={
                data.pool.poolValueUsd != null
                  ? formatUsd(data.pool.poolValueUsd, { compact: true })
                  : "—"
              }
            />
            <StatGrid
              items={[
                {
                  label: "MSTR in pool",
                  value:
                    data.pool.mstrInPool != null
                      ? formatNumber(data.pool.mstrInPool, { digits: 2 })
                      : "—",
                },
                {
                  label: `${siteConfig.ticker} in pool`,
                  value:
                    data.pool.stackrInPool != null
                      ? formatNumber(data.pool.stackrInPool, {
                          compact: true,
                          digits: 1,
                        })
                      : "—",
                },
                {
                  label: "24h volume",
                  value:
                    data.pool.volume24hUsd != null
                      ? formatUsd(data.pool.volume24hUsd, { compact: true })
                      : "—",
                },
                {
                  label: "Holders",
                  value:
                    data.pool.holders != null
                      ? formatNumber(data.pool.holders, { compact: true })
                      : "—",
                },
              ]}
            />
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-dim)]">
              {data.pairLine}
            </p>
          </InsightPanel>
        </div>
      </section>

      {/* Compact footer — no debug source grid for consumers */}
      <section className="border-t border-[var(--border)] pt-6">
        <p className="text-xs text-[var(--text-dim)]">
          Week ending {data.weekEnding} (UTC) · Updated{" "}
          {new Date(data.generatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-[var(--text-dim)]">
          Data from Strategy&apos;s public Bitcoin ledger, Robinhood RHJ, BTC
          market history, DexScreener, and Robinhood Chain explorers.{" "}
          {data.disclaimer}{" "}
          <Link
            href="/risks"
            className="font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full risks →
          </Link>
        </p>
      </section>
    </div>
  );
}

function InsightPanel({
  eyebrow,
  title,
  children,
  accent,
  empty,
  emptyMsg,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  empty?: boolean;
  emptyMsg?: string;
}) {
  return (
    <div
      className={`card flex flex-col p-5 sm:p-6 ${
        accent
          ? "border-[var(--accent-border)] bg-gradient-to-b from-[var(--accent-soft)] to-transparent"
          : ""
      }`}
    >
      <p className="card-label mb-1">{eyebrow}</p>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {empty ? (
        <p className="mt-6 text-sm text-[var(--text-dim)]">
          {emptyMsg ?? "Unavailable"}
        </p>
      ) : (
        <div className="mt-5 flex flex-1 flex-col">{children}</div>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-dim)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">{sub}</p>
      ) : null}
    </div>
  );
}

function StatGrid({
  items,
}: {
  items: {
    label: string;
    value: string;
    positive?: boolean;
  }[];
}) {
  return (
    <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
            {item.label}
          </p>
          <p
            className={`mt-0.5 font-mono text-sm font-medium tabular-nums ${
              item.positive === true
                ? "text-[var(--positive)]"
                : item.positive === false
                  ? "text-[var(--negative)]"
                  : "text-white"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
