import Link from "next/link";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { SundayStackCard } from "./SundayStackCard";

type Props = {
  data: StackCheckSnapshot;
};

export function SundayStackCheck({ data }: Props) {
  const s = data.strategy;
  const rhj = data.rhj;

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="card-label mb-2">Weekly</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sunday Stack Check
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
          Strategy BTC reserve + onchain ${siteConfig.ticker}/MSTR market — one
          card for the feed. {data.pairLine}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--accent)]">
          {data.tagline}
        </p>
      </div>

      {data.errors.length > 0 ? (
        <div className="card border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-4">
          <p className="text-sm font-medium text-[var(--negative)]">
            Some data sources failed
          </p>
          <ul className="mt-2 list-inside list-disc text-xs text-[var(--text-muted)]">
            {data.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <SundayStackCard data={data} />

      {/* Detail panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="card-label mb-3">Strategy BTC reserve</p>
          {!s ? (
            <p className="text-sm text-[var(--text-dim)]">
              Ledger unavailable. Source:{" "}
              <a
                href="https://www.strategy.com/ledger"
                className="link-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                strategy.com/ledger
              </a>
            </p>
          ) : (
            <dl className="space-y-2 text-sm">
              <Row
                k="Total BTC"
                v={
                  s.totalBtc != null
                    ? formatNumber(s.totalBtc, { digits: 0 })
                    : "—"
                }
              />
              <Row
                k="Avg cost"
                v={
                  s.averageCostUsd != null
                    ? formatUsd(s.averageCostUsd, { digits: 0 })
                    : "—"
                }
              />
              <Row
                k="Reserve value"
                v={
                  s.reserveValueUsd != null
                    ? formatUsd(s.reserveValueUsd, { compact: true })
                    : "—"
                }
              />
              <Row
                k="BTC yield YTD"
                v={
                  s.btcYieldYtdPct != null
                    ? `${s.btcYieldYtdPct.toFixed(1)}%`
                    : "—"
                }
              />
              <Row k="Events" v={String(s.eventCount)} />
              <Row
                k="Latest"
                v={
                  s.latestEvent
                    ? `${s.latestEvent.date} · ${s.latestEvent.btcAmount > 0 ? "+" : ""}${formatNumber(s.latestEvent.btcAmount, { digits: 0 })} BTC`
                    : "—"
                }
              />
            </dl>
          )}
        </div>

        <div className="card p-5">
          <p className="card-label mb-3">Tokenized MSTR (Robinhood)</p>
          {!rhj ? (
            <p className="text-sm text-[var(--text-dim)]">
              RHJ registry/price unavailable.
            </p>
          ) : (
            <dl className="space-y-2 text-sm">
              <Row
                k="Canonical contract"
                v={rhj.canonicalContract ?? "—"}
                mono
              />
              <Row
                k="Registry verified"
                v={rhj.registryVerified ? "Yes" : "Mismatch / check config"}
              />
              <Row
                k="Multiplier"
                v={rhj.asset?.currentMultiplier ?? "—"}
              />
              <Row
                k="Bid / Ask"
                v={
                  rhj.quote?.bid != null && rhj.quote?.ask != null
                    ? `${formatUsd(rhj.quote.bid)} / ${formatUsd(rhj.quote.ask)}`
                    : "—"
                }
              />
              <Row
                k="Daily volume"
                v={
                  rhj.quote?.dailyTradingVolume != null
                    ? formatUsd(rhj.quote.dailyTradingVolume, {
                        compact: true,
                      })
                    : "—"
                }
              />
              <Row k="Status" v={rhj.quote?.status ?? rhj.asset?.status ?? "—"} />
              <Row
                k="Quote time"
                v={
                  rhj.quote?.generatedAt
                    ? new Date(rhj.quote.generatedAt).toUTCString()
                    : "—"
                }
              />
            </dl>
          )}
        </div>
      </div>

      <div className="card p-5">
        <p className="card-label mb-3">${siteConfig.ticker} / MSTR pool</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Mini
            label="MSTR in pool"
            value={
              data.pool.mstrInPool != null
                ? formatNumber(data.pool.mstrInPool, { digits: 4 })
                : "—"
            }
          />
          <Mini
            label="Pool value"
            value={
              data.pool.poolValueUsd != null
                ? formatUsd(data.pool.poolValueUsd, { compact: true })
                : "—"
            }
          />
          <Mini
            label="24h volume"
            value={
              data.pool.volume24hUsd != null
                ? formatUsd(data.pool.volume24hUsd, { compact: true })
                : "—"
            }
          />
          <Mini
            label="Holders"
            value={
              data.pool.holders != null
                ? formatNumber(data.pool.holders, { compact: true })
                : "—"
            }
          />
        </div>
        <p className="mt-4 text-xs text-[var(--text-dim)]">{data.pairLine}</p>
      </div>

      {/* Sources */}
      <div className="card p-5">
        <p className="card-label mb-3">Data sources & timestamps</p>
        <div className="divide-y divide-[var(--border)]">
          {data.sources.map((src) => (
            <div
              key={src.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {src.label}{" "}
                  <span
                    className={
                      src.ok ? "text-[var(--positive)]" : "text-[var(--negative)]"
                    }
                  >
                    {src.ok ? "· ok" : "· error"}
                  </span>
                </p>
                {src.detail ? (
                  <p className="mt-0.5 text-xs text-[var(--text-dim)]">
                    {src.detail}
                  </p>
                ) : null}
                {src.error ? (
                  <p className="mt-0.5 text-xs text-[var(--negative)]">
                    {src.error}
                  </p>
                ) : null}
              </div>
              <p className="shrink-0 font-mono text-[11px] text-[var(--text-dim)]">
                {src.fetchedAt
                  ? new Date(src.fetchedAt).toISOString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
          Card week label uses the most recent Sunday (UTC). Snapshot time:{" "}
          {new Date(data.generatedAt).toISOString()}. Primary references:{" "}
          <a
            href="https://www.strategy.com/ledger"
            className="link-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            Strategy ledger
          </a>
          , Robinhood{" "}
          <code className="text-[var(--text-muted)]">/rhj/assets</code> +{" "}
          <code className="text-[var(--text-muted)]">/rhj/prices/MSTR</code>,
          CoinGecko BTC history, DexScreener + Blockscout for the pool.
        </p>
        <p className="mt-2 text-xs text-[var(--text-dim)]">{data.disclaimer}</p>
        <Link
          href="/risks"
          className="mt-3 inline-block text-sm text-[var(--accent)] hover:opacity-85"
        >
          Full risks →
        </Link>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  mono,
}: {
  k: string;
  v: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-[var(--text-dim)]">{k}</dt>
      <dd
        className={`text-white sm:text-right ${
          mono ? "stat-value break-all text-xs" : ""
        }`}
      >
        {v}
      </dd>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <p className="card-label mb-1">{label}</p>
      <p className="stat-value text-sm text-white">{value}</p>
    </div>
  );
}
