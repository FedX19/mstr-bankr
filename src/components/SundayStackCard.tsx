"use client";

import { useCallback, useRef, useState } from "react";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { StackCheckChart } from "./StackCheckChart";
import { StackrMascotStanding } from "./StackrMascotStanding";

type Props = {
  data: StackCheckSnapshot;
  /** Hide the external export toolbar (used when parent provides actions) */
  hideToolbar?: boolean;
};

function fmtBtc(n: number | null | undefined) {
  if (n == null) return "—";
  return `${formatNumber(n, { digits: n >= 100 ? 0 : 2 })} BTC`;
}

function HeroMetric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8b8b96] sm:text-[10px]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums tracking-tight text-white sm:text-xl md:text-2xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 truncate text-[10px] text-[#a1a1aa] sm:text-[11px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Premium 16:9 Sunday Stack Check social card + optional export control.
 * Layout: header → reserve metrics → chart (clean axes) → stats strip → footer
 * Mascot sits bottom-right outside the chart plot, not over data.
 */
export function SundayStackCard({ data, hideToolbar = false }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const s = data.strategy;
  const rhj = data.rhj;
  const latest = s?.latestEvent;
  const isSale = (latest?.btcAmount ?? 0) < 0;

  const reserve =
    s?.reserveValueUsd != null
      ? formatUsd(s.reserveValueUsd, { compact: true })
      : s?.reserveValueUsdM != null
        ? `$${formatNumber(s.reserveValueUsdM, { digits: 1 })}M`
        : "—";

  const exportPng = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        width: 1200,
        height: 675,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#070708",
        style: {
          width: "1200px",
          height: "675px",
          transform: "none",
        },
      });
      const a = document.createElement("a");
      a.download = `sunday-stack-check-${data.weekEnding}.png`;
      a.href = dataUrl;
      a.click();
      setExportMsg("Downloaded 1200×675 card — ready for X.");
    } catch {
      setExportMsg(
        "Auto-export failed in this browser. Screenshot the card below, or try Chrome/desktop.",
      );
    } finally {
      setExporting(false);
    }
  }, [data.weekEnding]);

  return (
    <div className="space-y-4">
      {!hideToolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-dim)]">
            Week ending <span className="text-white">{data.weekEnding}</span>
            {" · "}
            {new Date(data.generatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting}
            className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export for X · 16:9"}
          </button>
        </div>
      ) : null}
      {exportMsg ? (
        <p className="text-xs text-[var(--text-muted)]">{exportMsg}</p>
      ) : null}

      <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref={cardRef}
          className="stack-check-hero-card relative mx-auto w-full min-w-[340px] max-w-5xl overflow-hidden text-white"
          style={{ aspectRatio: "16 / 9" }}
        >
          {/* Atmosphere */}
          <div className="absolute inset-0 bg-[#070708]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_92%_8%,rgba(247,147,26,0.14),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_8%_92%,rgba(247,147,26,0.05),transparent_55%)]" />

          {/*
            Mascot: bottom-right of the CARD, in the reserved right gutter —
            chart/stats use pr-* so plot + labels stay clear of the silhouette.
          */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-20 flex h-[52%] w-[17%] min-h-[140px] min-w-[96px] max-w-[180px] items-end justify-end sm:w-[16%]">
            <div className="absolute inset-x-0 bottom-0 top-[15%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.4),transparent_68%)]" />
            <StackrMascotStanding size="lg" priority className="relative z-10 mb-0 mr-1 h-full w-auto max-h-full" />
          </div>

          <div className="relative z-10 flex h-full flex-col px-[2.8%] py-[2.4%] pr-[3%]">
            {/* Header */}
            <div className="mb-[1.1%] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[clamp(9px,1.05vw,12px)] font-bold uppercase tracking-[0.2em] text-[#f7931a]">
                  Sunday Stack Check
                </p>
                <p className="mt-0.5 text-[clamp(13px,1.55vw,20px)] font-semibold tracking-tight text-white">
                  ${siteConfig.ticker} × Strategy BTC Reserve
                </p>
                <p className="mt-0.5 text-[clamp(10px,1.05vw,13px)] font-medium text-[#f7931a]/90">
                  {data.tagline}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[clamp(8px,0.85vw,10px)] font-semibold uppercase tracking-[0.14em] text-[#71717a]">
                  Week ending
                </p>
                <p className="font-mono text-[clamp(12px,1.35vw,16px)] font-semibold text-white">
                  {data.weekEnding}
                </p>
              </div>
            </div>

            {/* Reserve metrics — ABOVE chart only */}
            <div className="mb-[1%] grid grid-cols-2 gap-x-4 gap-y-1.5 border-y border-white/[0.08] py-[1.3%] sm:grid-cols-4 sm:gap-x-6">
              <HeroMetric label="Strategy BTC reserve" value={reserve} />
              <HeroMetric label="Total BTC" value={fmtBtc(s?.totalBtc)} />
              <HeroMetric
                label="Average cost"
                value={
                  s?.averageCostUsd != null
                    ? formatUsd(s.averageCostUsd, { digits: 0 })
                    : "—"
                }
              />
              <HeroMetric
                label={isSale ? "Latest sale" : "Latest acquisition"}
                value={
                  latest
                    ? `${latest.btcAmount > 0 ? "+" : ""}${formatNumber(latest.btcAmount, { digits: 0 })} BTC`
                    : "—"
                }
                sub={
                  latest
                    ? `${latest.date}${
                        latest.pricePerBtc != null
                          ? ` · $${Math.round(latest.pricePerBtc).toLocaleString()}`
                          : ""
                      }`
                    : undefined
                }
              />
            </div>

            {/* Chart — pure plot; right pad clears mascot silhouette */}
            <div className="min-h-0 flex-1 pr-[15%] sm:pr-[16%]">
              <StackCheckChart
                btcHistory={data.btcHistory}
                events={data.chartEvents}
                averageCost={s?.averageCostUsd ?? null}
                compact
                className="h-full w-full"
              />
            </div>

            {/* Stats strip — BELOW chart (pool + tokenized MSTR) */}
            <div className="mt-[0.8%] grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-white/[0.08] pt-[1.1%] pr-[16%] sm:grid-cols-6 sm:gap-x-3">
              <StripCell
                label="MSTR in pool"
                value={
                  data.pool.mstrInPool != null
                    ? formatNumber(data.pool.mstrInPool, { digits: 2 })
                    : "—"
                }
              />
              <StripCell
                label="Pool value"
                value={
                  data.pool.poolValueUsd != null
                    ? formatUsd(data.pool.poolValueUsd, { compact: true })
                    : "—"
                }
              />
              <StripCell
                label="24h volume"
                value={
                  data.pool.volume24hUsd != null
                    ? formatUsd(data.pool.volume24hUsd, { compact: true })
                    : "—"
                }
              />
              <StripCell
                label="Holders"
                value={
                  data.pool.holders != null
                    ? formatNumber(data.pool.holders, { compact: true })
                    : "—"
                }
              />
              <StripCell
                label="MSTR bid/ask"
                value={
                  rhj?.quote?.bid != null && rhj?.quote?.ask != null
                    ? `${rhj.quote.bid.toFixed(1)}/${rhj.quote.ask.toFixed(1)}`
                    : "—"
                }
              />
              <StripCell
                label="MSTR day vol"
                value={
                  rhj?.quote?.dailyTradingVolume != null
                    ? formatUsd(rhj.quote.dailyTradingVolume, {
                        compact: true,
                      })
                    : "—"
                }
              />
            </div>

            {/* Footer */}
            <div className="mt-[0.6%] flex items-end justify-between gap-3 border-t border-white/[0.08] pt-[0.9%] pr-[18%]">
              <p className="text-[clamp(8px,0.9vw,11px)] leading-snug text-[#71717a]">
                {data.disclaimer}
              </p>
              <p className="hidden shrink-0 text-[clamp(9px,1vw,11px)] font-medium text-[#f7931a]/85 sm:block">
                {siteConfig.thesisLine}
              </p>
            </div>
          </div>
        </div>
      </div>

      {hideToolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-dim)]">
            Export-ready · 1200×675 · week ending {data.weekEnding}
          </p>
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting}
            className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export for X · 16:9 PNG"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function StripCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#71717a] sm:text-[9px]">
        {label}
      </p>
      <p className="mt-0.5 truncate font-mono text-[11px] font-medium text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}

export { type Props as SundayStackCardProps };
