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

/** Export canvas size (true 16:9 social) */
const EXPORT_W = 1200;
const EXPORT_H = 675;
/** Equal outer margin around the card on the export canvas (px @ 1200 width) */
const EXPORT_MARGIN = 36;

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
      <p className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums tracking-tight text-white sm:text-xl md:text-[1.35rem]">
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
 * Premium 16:9 Sunday Stack Check social card + export control.
 *
 * Export structure:
 *   [ export canvas 1200×675 — dark stage ]
 *     [ equal margin ]
 *       [ rounded glowing card — fully visible ]
 */
export function SundayStackCard({ data, hideToolbar = false }: Props) {
  /** Outer export stage (full 16:9 frame with margins) */
  const stageRef = useRef<HTMLDivElement>(null);
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
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const { toPng } = await import("html-to-image");
      // Capture the full stage so outer margins + card glow are preserved
      // and the card is centered on a true 16:9 canvas.
      const dataUrl = await toPng(stage, {
        width: EXPORT_W,
        height: EXPORT_H,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#050506",
        style: {
          width: `${EXPORT_W}px`,
          height: `${EXPORT_H}px`,
          transform: "none",
          margin: "0",
        },
      });
      const a = document.createElement("a");
      a.download = `sunday-stack-check-${data.weekEnding}.png`;
      a.href = dataUrl;
      a.click();
      setExportMsg("Downloaded 1200×675 — centered card, ready for X.");
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

      {/* Horizontal scroll only if viewport narrower than min card */}
      <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/*
          Export stage = true 16:9 canvas.
          Equal padding on all sides keeps the card centered with breathing room
          so border + orange glow are never clipped.
        */}
        <div
          ref={stageRef}
          className="stack-check-export-stage relative mx-auto w-full min-w-[360px] max-w-5xl"
          style={{
            aspectRatio: "16 / 9",
            background: "#050506",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              padding: `${(EXPORT_MARGIN / EXPORT_W) * 100}%`,
            }}
          >
            {/* Inner card — rounded + glow fully inside the stage */}
            <div className="stack-check-hero-card relative h-full w-full overflow-hidden text-white">
              {/* Atmosphere */}
              <div className="absolute inset-0 bg-[#070708]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_92%_8%,rgba(247,147,26,0.14),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_8%_92%,rgba(247,147,26,0.05),transparent_55%)]" />

              {/* Mascot — bottom-right accent, outside plot */}
              <div className="pointer-events-none absolute bottom-0 right-0 z-20 flex h-[48%] w-[15.5%] min-h-[120px] min-w-[88px] max-w-[170px] items-end justify-end">
                <div className="absolute inset-x-0 bottom-0 top-[18%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.38),transparent_68%)]" />
                <StackrMascotStanding
                  size="lg"
                  priority
                  className="relative z-10 mb-0.5 mr-1 h-full w-auto max-h-full"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col px-[3%] py-[2.6%]">
                {/* 1. Header */}
                <div className="mb-[1.2%] flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[clamp(9px,1.05vw,12px)] font-bold uppercase tracking-[0.2em] text-[#f7931a]">
                      Sunday Stack Check
                    </p>
                    <p className="mt-0.5 text-[clamp(13px,1.5vw,19px)] font-semibold tracking-tight text-white">
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

                {/* 2. Reserve metrics */}
                <div className="mb-[1.2%] grid grid-cols-2 gap-x-4 gap-y-1.5 border-y border-white/[0.08] py-[1.4%] sm:grid-cols-4 sm:gap-x-6">
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

                {/* 3. Main chart — dominant; right pad for mascot */}
                <div className="min-h-0 flex-[1.4] pr-[14.5%] sm:pr-[15%]">
                  <StackCheckChart
                    btcHistory={data.btcHistory}
                    events={data.chartEvents}
                    averageCost={s?.averageCostUsd ?? null}
                    endDate={data.weekEnding}
                    compact
                    className="h-full w-full"
                  />
                </div>

                {/* 4. Stats strip BELOW chart */}
                <div className="mt-[1.1%] grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-white/[0.08] pt-[1.2%] pr-[15.5%] sm:grid-cols-6 sm:gap-x-3">
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

                {/* 5. Footer */}
                <div className="mt-[0.9%] flex items-end justify-between gap-3 border-t border-white/[0.08] pt-[1%] pr-[16%]">
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
        </div>
      </div>

      {hideToolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-dim)]">
            Export-ready · {EXPORT_W}×{EXPORT_H} · equal outer margin · week
            ending {data.weekEnding}
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
