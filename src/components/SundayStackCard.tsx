"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { StackCheckChart } from "./StackCheckChart";

type Props = {
  data: StackCheckSnapshot;
};

function fmtBtc(n: number | null | undefined) {
  if (n == null) return "—";
  return `${formatNumber(n, { digits: n >= 100 ? 0 : 2 })} BTC`;
}

function Metric({
  label,
  value,
  sub,
  align = "left",
}: {
  label: string;
  value: string;
  sub?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#71717a]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-white sm:text-xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[11px] text-[#a1a1aa]">{sub}</p>
      ) : null}
    </div>
  );
}

/**
 * 16:9 Sunday Stack Check social card + export control.
 */
export function SundayStackCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const s = data.strategy;
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
      // Dynamic import keeps SSR clean; optional peer-like use of browser API
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#070708",
      });
      const a = document.createElement("a");
      a.download = `sunday-stack-check-${data.weekEnding}.png`;
      a.href = dataUrl;
      a.click();
      setExportMsg("Downloaded 16:9 card.");
    } catch {
      // Fallback: open print / instruct screenshot
      setExportMsg(
        "Export helper unavailable — use the card below and screenshot, or install html-to-image.",
      );
      try {
        window.print();
      } catch {
        /* ignore */
      }
    } finally {
      setExporting(false);
    }
  }, [data.weekEnding]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--text-dim)]">
            Week ending {data.weekEnding} · Generated{" "}
            {new Date(data.generatedAt).toUTCString()}
          </p>
        </div>
        <button
          type="button"
          onClick={exportPng}
          disabled={exporting}
          className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {exporting ? "Exporting…" : "Export 16:9 PNG"}
        </button>
      </div>
      {exportMsg ? (
        <p className="text-xs text-[var(--text-muted)]">{exportMsg}</p>
      ) : null}

      {/* Fixed aspect social card */}
      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-[#2a2a30] bg-[#070708] text-white shadow-[0_0_60px_rgba(247,147,26,0.08)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_15%,rgba(247,147,26,0.1),transparent_55%)]" />

        {/* Corner mascot */}
        <div className="pointer-events-none absolute bottom-10 right-3 h-24 w-40 opacity-90 sm:bottom-12 sm:right-4 sm:h-28 sm:w-48">
          <Image
            src={siteConfig.brand.mascotHero}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="200px"
          />
        </div>

        <div className="relative flex h-full flex-col p-4 sm:p-6">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7931a]">
                Sunday Stack Check
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                ${siteConfig.ticker} · Strategy BTC reserve
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#71717a]">
                Week ending
              </p>
              <p className="font-mono text-sm text-white">{data.weekEnding}</p>
            </div>
          </div>

          {/* Top metrics */}
          <div className="mb-3 grid grid-cols-2 gap-3 border-b border-[#1e1e22] pb-3 sm:grid-cols-4">
            <Metric label="Strategy BTC reserve" value={reserve} />
            <Metric
              label="Total BTC"
              value={fmtBtc(s?.totalBtc)}
              align="right"
            />
            <Metric
              label="Average cost"
              value={
                s?.averageCostUsd != null
                  ? formatUsd(s.averageCostUsd, { digits: 0 })
                  : "—"
              }
            />
            <Metric
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
              align="right"
            />
          </div>

          {/* Chart */}
          <div className="min-h-0 flex-1">
            <StackCheckChart
              btcHistory={data.btcHistory}
              events={data.chartEvents}
              averageCost={s?.averageCostUsd ?? null}
              className="h-full max-h-[48%]"
            />
          </div>

          {/* Pool strip */}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#1e1e22] pt-2 sm:grid-cols-5">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#71717a]">
                MSTR in pool
              </p>
              <p className="font-mono text-xs text-white sm:text-sm">
                {data.pool.mstrInPool != null
                  ? formatNumber(data.pool.mstrInPool, { digits: 2 })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#71717a]">
                ${siteConfig.ticker} in pool
              </p>
              <p className="font-mono text-xs text-white sm:text-sm">
                {data.pool.stackrInPool != null
                  ? formatNumber(data.pool.stackrInPool, {
                      compact: true,
                      digits: 1,
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#71717a]">
                Pool value
              </p>
              <p className="font-mono text-xs text-white sm:text-sm">
                {data.pool.poolValueUsd != null
                  ? formatUsd(data.pool.poolValueUsd, { compact: true })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#71717a]">
                24h volume
              </p>
              <p className="font-mono text-xs text-white sm:text-sm">
                {data.pool.volume24hUsd != null
                  ? formatUsd(data.pool.volume24hUsd, { compact: true })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#71717a]">
                Holders
              </p>
              <p className="font-mono text-xs text-white sm:text-sm">
                {data.pool.holders != null
                  ? formatNumber(data.pool.holders, { compact: true })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 flex flex-col gap-0.5 border-t border-[#1e1e22] pt-2 pr-28 sm:pr-40">
            <p className="text-xs font-semibold text-[#f7931a]">
              {data.tagline}
            </p>
            <p className="text-[9px] leading-snug text-[#71717a] sm:text-[10px]">
              {data.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
