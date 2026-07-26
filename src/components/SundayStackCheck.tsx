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
  const failCount = data.sources.filter((x) => !x.ok).length;

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

      {/* Soft source health — not a debug dump */}
      {failCount > 0 ? (
        <p className="rounded-lg border border-[rgba(247,147,26,0.25)] bg-[rgba(247,147,26,0.06)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
          <span className="font-medium text-[var(--accent)]">
            {failCount} source{failCount > 1 ? "s" : ""} delayed
          </span>
          {" — "}
          card still renders with available data and chart fallbacks.
        </p>
      ) : null}

      {/* 2–3. Hero export card + export actions */}
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

      {/* 5–6. Compact sources — not a debug dump */}
      <section className="card overflow-hidden border-[var(--border-strong)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <p className="card-label">Sources</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Week ending {data.weekEnding} (UTC Sunday) · Snapshot{" "}
            <span className="font-mono text-xs text-white">
              {new Date(data.generatedAt).toISOString()}
            </span>
          </p>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {data.sources.map((src) => (
            <div
              key={src.id}
              className="border-b border-[var(--border)] px-5 py-3 last:border-b-0 sm:border-r sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    src.ok ? "bg-[var(--positive)]" : "bg-[var(--negative)]"
                  }`}
                />
                <p className="text-xs font-medium text-white">{src.label}</p>
              </div>
              <p className="mt-1 font-mono text-[10px] text-[var(--text-dim)]">
                {src.fetchedAt
                  ? new Date(src.fetchedAt).toISOString().replace("T", " ").slice(0, 19)
                  : "—"}
                {" UTC"}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
          <p className="text-[11px] text-[var(--text-dim)]">
            {data.disclaimer}
          </p>
          <Link
            href="/risks"
            className="shrink-0 text-xs font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full risks →
          </Link>
        </div>
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
