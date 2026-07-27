"use client";

import { useEffect, useMemo, useState } from "react";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { StackCheckChart } from "./StackCheckChart";

type Props = {
  data: StackCheckSnapshot;
  /** Kept for call-site compatibility */
  hideToolbar?: boolean;
};

const DESKTOP = { w: 1200, h: 675 } as const;
const PORTRAIT = { w: 1080, h: 1350 } as const;
const MOBILE_MQ = "(max-width: 767px)";

function fmtBtc(n: number | null | undefined) {
  if (n == null) return "—";
  return `${formatNumber(n, { digits: n >= 100 ? 0 : 2 })} BTC`;
}

function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

function HeroMetric({
  label,
  value,
  sub,
  compact,
}: {
  label: string;
  value: string;
  sub?: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`font-semibold uppercase tracking-[0.12em] text-[#8b8b96] ${
          compact ? "text-[8px]" : "text-[9px] sm:text-[10px]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-0.5 font-mono font-semibold tabular-nums tracking-tight text-white ${
          compact ? "text-sm sm:text-base" : "text-[15px] sm:text-lg md:text-xl"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 truncate text-[9px] text-[#a1a1aa] sm:text-[10px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function StripCell({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`font-semibold uppercase tracking-[0.1em] text-[#71717a] ${
          compact ? "text-[7.5px]" : "text-[8px] sm:text-[9px]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-0.5 truncate font-mono font-medium text-white ${
          compact ? "text-[11px]" : "text-[11px] sm:text-sm"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type CardMetrics = {
  reserve: string;
  totalBtc: string;
  avgCost: string;
  latestLabel: string;
  latestValue: string;
  latestSub?: string;
  mstrInPool: string;
  poolValue: string;
  vol24h: string;
  holders: string;
  bidAsk: string;
  mstrDayVol: string;
};

function useCardMetrics(data: StackCheckSnapshot): CardMetrics {
  const s = data.strategy;
  const rhj = data.rhj;
  const latest = s?.latestEvent;
  const isSale = (latest?.btcAmount ?? 0) < 0;

  return useMemo(
    () => ({
      reserve:
        s?.reserveValueUsd != null
          ? formatUsd(s.reserveValueUsd, { compact: true })
          : s?.reserveValueUsdM != null
            ? `$${formatNumber(s.reserveValueUsdM, { digits: 1 })}M`
            : "—",
      totalBtc: fmtBtc(s?.totalBtc),
      avgCost:
        s?.averageCostUsd != null
          ? formatUsd(s.averageCostUsd, { digits: 0 })
          : "—",
      latestLabel: isSale ? "Latest sale" : "Latest acquisition",
      latestValue: latest
        ? `${latest.btcAmount > 0 ? "+" : ""}${formatNumber(latest.btcAmount, { digits: 0 })} BTC`
        : "—",
      latestSub: latest
        ? `${latest.date}${
            latest.pricePerBtc != null
              ? ` · $${Math.round(latest.pricePerBtc).toLocaleString()}`
              : ""
          }`
        : undefined,
      mstrInPool:
        data.pool.mstrInPool != null
          ? formatNumber(data.pool.mstrInPool, { digits: 2 })
          : "—",
      poolValue:
        data.pool.poolValueUsd != null
          ? formatUsd(data.pool.poolValueUsd, { compact: true })
          : "—",
      vol24h:
        data.pool.volume24hUsd != null
          ? formatUsd(data.pool.volume24hUsd, { compact: true })
          : "—",
      holders:
        data.pool.holders != null
          ? formatNumber(data.pool.holders, { compact: true })
          : "—",
      bidAsk:
        rhj?.quote?.bid != null && rhj?.quote?.ask != null
          ? `${rhj.quote.bid.toFixed(1)}/${rhj.quote.ask.toFixed(1)}`
          : "—",
      mstrDayVol:
        rhj?.quote?.dailyTradingVolume != null
          ? formatUsd(rhj.quote.dailyTradingVolume, { compact: true })
          : "—",
    }),
    [data, s, rhj, latest, isSale],
  );
}

function MascotAccent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteConfig.brand.mascotStanding}
      alt={siteConfig.brand.mascotStandingAlt}
      width={220}
      height={246}
      draggable={false}
      className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_24px_rgba(247,147,26,0.4)]"
      loading="eager"
      decoding="async"
    />
  );
}

function DesktopCardFace({
  data,
  m,
}: {
  data: StackCheckSnapshot;
  m: CardMetrics;
}) {
  const s = data.strategy;
  return (
    <div
      className="stack-check-hero-card relative h-full w-full overflow-hidden text-white"
      style={{ background: "#070708" }}
    >
      <div className="absolute inset-0 bg-[#070708]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_95%_5%,rgba(247,147,26,0.12),transparent_55%)]" />

      <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-[34%] w-[11%] min-w-[64px] max-w-[110px]">
        <div className="absolute inset-x-0 bottom-0 top-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.34),transparent_70%)]" />
        <MascotAccent />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[2.4%] py-[1.8%]">
        <div className="mb-[0.7%] flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[clamp(8px,0.95vw,11px)] font-bold uppercase tracking-[0.18em] text-[#f7931a]">
              Sunday Stack Check
            </p>
            <p className="mt-0.5 text-[clamp(12px,1.35vw,17px)] font-semibold tracking-tight text-white">
              ${siteConfig.ticker} × Strategy BTC Reserve
            </p>
            <p className="mt-0.5 text-[clamp(9px,0.95vw,12px)] font-medium text-[#f7931a]/90">
              {data.tagline}
            </p>
          </div>
          <div className="w-[7.5rem] shrink-0 text-right sm:w-[8.5rem]">
            <p className="text-[clamp(7px,0.75vw,9px)] font-semibold uppercase tracking-[0.12em] text-[#71717a]">
              Week ending
            </p>
            <p className="font-mono text-[clamp(11px,1.2vw,15px)] font-semibold tabular-nums text-white">
              {data.weekEnding}
            </p>
          </div>
        </div>

        <div className="mb-[0.7%] grid grid-cols-4 gap-x-3 border-y border-white/[0.08] py-[0.9%]">
          <HeroMetric compact label="Strategy BTC reserve" value={m.reserve} />
          <HeroMetric compact label="Total BTC" value={m.totalBtc} />
          <HeroMetric compact label="Average cost" value={m.avgCost} />
          <HeroMetric
            compact
            label={m.latestLabel}
            value={m.latestValue}
            sub={m.latestSub}
          />
        </div>

        <div className="min-h-0 flex-[1.75] pr-[4%]">
          <StackCheckChart
            btcHistory={data.btcHistory}
            events={data.chartEvents}
            averageCost={s?.averageCostUsd ?? null}
            endDate={data.weekEnding}
            compact
            className="h-full w-full"
          />
        </div>

        <div className="mt-[0.65%] grid grid-cols-6 gap-x-2 border-t border-white/[0.08] pt-[0.75%] pr-[9%]">
          <StripCell compact label="MSTR in pool" value={m.mstrInPool} />
          <StripCell compact label="Pool value" value={m.poolValue} />
          <StripCell compact label="24h volume" value={m.vol24h} />
          <StripCell compact label="Holders" value={m.holders} />
          <StripCell compact label="MSTR bid/ask" value={m.bidAsk} />
          <StripCell compact label="MSTR day vol" value={m.mstrDayVol} />
        </div>

        <div className="mt-[0.5%] flex items-end justify-between gap-2 border-t border-white/[0.08] pt-[0.6%] pr-[11%]">
          <p className="text-[clamp(7px,0.8vw,10px)] leading-snug text-[#71717a]">
            {data.disclaimer}
          </p>
          <p className="shrink-0 text-[clamp(8px,0.9vw,10px)] font-medium text-[#f7931a]/85">
            {siteConfig.thesisLine}
          </p>
        </div>
      </div>
    </div>
  );
}

function PortraitCardFace({
  data,
  m,
}: {
  data: StackCheckSnapshot;
  m: CardMetrics;
}) {
  const s = data.strategy;
  return (
    <div
      className="stack-check-hero-card relative h-full w-full overflow-hidden text-white"
      style={{ background: "#070708" }}
    >
      <div className="absolute inset-0 bg-[#070708]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(247,147,26,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_100%_100%,rgba(247,147,26,0.1),transparent_55%)]" />

      <div className="pointer-events-none absolute bottom-1 right-1 z-20 h-[18%] w-[22%] max-w-[160px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.3),transparent_70%)]" />
        <MascotAccent />
      </div>

      <div className="relative z-10 flex h-full flex-col px-[5%] py-[3.5%]">
        <div className="mb-2.5 flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f7931a]">
              Sunday Stack Check
            </p>
            <p className="mt-1 text-[20px] font-semibold leading-tight tracking-tight text-white">
              ${siteConfig.ticker} × Strategy BTC Reserve
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#f7931a]/90">
              {data.tagline}
            </p>
          </div>
          <div className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#71717a]">
              Week ending
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-white">
              {data.weekEnding}
            </p>
          </div>
        </div>

        <div className="mb-2.5 grid shrink-0 grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
          <HeroMetric compact label="Strategy BTC reserve" value={m.reserve} />
          <HeroMetric compact label="Total BTC" value={m.totalBtc} />
          <HeroMetric compact label="Average cost" value={m.avgCost} />
          <HeroMetric
            compact
            label={m.latestLabel}
            value={m.latestValue}
            sub={m.latestSub}
          />
        </div>

        <div className="relative min-h-[42%] w-full flex-[2] basis-[42%]">
          <StackCheckChart
            btcHistory={data.btcHistory}
            events={data.chartEvents}
            averageCost={s?.averageCostUsd ?? null}
            endDate={data.weekEnding}
            height={520}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-2.5 grid shrink-0 grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 pr-[26%]">
          <StripCell compact label="MSTR in pool" value={m.mstrInPool} />
          <StripCell compact label="Pool value" value={m.poolValue} />
          <StripCell compact label="24h volume" value={m.vol24h} />
          <StripCell compact label="Holders" value={m.holders} />
          <StripCell compact label="MSTR bid/ask" value={m.bidAsk} />
          <StripCell compact label="MSTR day vol" value={m.mstrDayVol} />
        </div>

        <div className="mt-2.5 shrink-0 border-t border-white/[0.08] pt-2 pr-[24%]">
          <p className="text-[11px] font-medium text-[#f7931a]/90">
            {siteConfig.thesisLine}
          </p>
          <p className="mt-1 text-[10px] leading-snug text-[#71717a]">
            {data.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Consumer scoreboard card only — no share/download/debug chrome.
 * Responsive: portrait on mobile, landscape on desktop.
 */
export function SundayStackCard({ data }: Props) {
  const isMobile = useIsMobile();
  const metrics = useCardMetrics(data);
  const ready = isMobile !== null;
  const mobile = isMobile === true;

  if (!ready) {
    return (
      <div
        className="mx-auto w-full max-w-sm rounded-xl bg-[#050506]"
        style={{ aspectRatio: "4 / 5" }}
        aria-hidden
      />
    );
  }

  if (mobile) {
    return (
      <div
        className="stack-check-export-stage mx-auto w-full max-w-sm"
        style={{
          aspectRatio: `${PORTRAIT.w} / ${PORTRAIT.h}`,
          background: "#050506",
        }}
      >
        <div className="box-border h-full w-full p-[3.33%]">
          <div className="h-full w-full">
            <PortraitCardFace data={data} m={metrics} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="stack-check-export-stage mx-auto w-full max-w-5xl"
      style={{
        aspectRatio: `${DESKTOP.w} / ${DESKTOP.h}`,
        background: "#050506",
      }}
    >
      <div className="box-border h-full w-full p-[2%]">
        <div className="h-full w-full">
          <DesktopCardFace data={data} m={metrics} />
        </div>
      </div>
    </div>
  );
}

export { type Props as SundayStackCardProps };
