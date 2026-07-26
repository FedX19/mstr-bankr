"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import { StackCheckChart } from "./StackCheckChart";
import { StackrMascotStanding } from "./StackrMascotStanding";

type Props = {
  data: StackCheckSnapshot;
  /** Kept for call-site compatibility; actions always render. */
  hideToolbar?: boolean;
};

const DESKTOP = { w: 1200, h: 675, margin: 24 } as const;
const PORTRAIT = { w: 1080, h: 1350, margin: 36 } as const;
/** match max-width for “mobile” share UX */
const MOBILE_MQ = "(max-width: 767px)";

function fmtBtc(n: number | null | undefined) {
  if (n == null) return "—";
  return `${formatNumber(n, { digits: n >= 100 ? 0 : 2 })} BTC`;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(",");
  const mime = /data:([^;]+);/.exec(header)?.[1] ?? "image/png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = dataUrl;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
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

function buildTweetText(data: StackCheckSnapshot): string {
  const s = data.strategy;
  const reserve =
    s?.reserveValueUsd != null
      ? formatUsd(s.reserveValueUsd, { compact: true })
      : "—";
  const btc =
    s?.totalBtc != null ? formatNumber(s.totalBtc, { digits: 0 }) : "—";
  const avg =
    s?.averageCostUsd != null
      ? formatUsd(s.averageCostUsd, { digits: 0 })
      : "—";

  return [
    `Sunday Stack Check — week ending ${data.weekEnding}`,
    ``,
    `Strategy BTC reserve: ${reserve}`,
    `Total BTC: ${btc}`,
    `Avg cost: ${avg}`,
    ``,
    data.tagline,
    siteConfig.thesisLine,
    ``,
    `$${siteConfig.ticker} × Strategy`,
    `https://roaring-stackr.com/stack-check`,
  ].join("\n");
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

/** Desktop 16:9 card face — chart-dominant */
function DesktopCardFace({
  data,
  m,
}: {
  data: StackCheckSnapshot;
  m: CardMetrics;
}) {
  const s = data.strategy;
  return (
    <div className="stack-check-hero-card relative h-full w-full overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#070708]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_95%_5%,rgba(247,147,26,0.12),transparent_55%)]" />

      <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-[34%] w-[11%] min-w-[64px] max-w-[110px]">
        <div className="absolute inset-x-0 bottom-0 top-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.34),transparent_70%)]" />
        <StackrMascotStanding
          size="sm"
          priority
          className="!h-full !w-full !min-h-0 !min-w-0"
        />
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

/** Portrait 4:5 card face — phone share */
function PortraitCardFace({
  data,
  m,
}: {
  data: StackCheckSnapshot;
  m: CardMetrics;
}) {
  const s = data.strategy;
  return (
    <div className="stack-check-hero-card relative h-full w-full overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#070708]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(247,147,26,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_100%_100%,rgba(247,147,26,0.1),transparent_55%)]" />

      <div className="pointer-events-none absolute bottom-1 right-1 z-20 h-[18%] w-[22%] max-w-[160px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.3),transparent_70%)]" />
        <StackrMascotStanding
          size="md"
          priority
          className="!h-full !w-full !min-h-0"
        />
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
 * Fixed-size export stage (always offscreen — never takes layout space).
 * html-to-image captures this node only.
 */
function OffscreenExportStage({
  stageRef,
  w,
  h,
  margin,
  children,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  w: number;
  h: number;
  margin: number;
  children: React.ReactNode;
}) {
  // rendered at exact pixel size offscreen — never display:none
  return (
    <div
      ref={stageRef}
      aria-hidden
      className="stack-check-export-stage pointer-events-none"
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        width: w,
        height: h,
        margin: 0,
        padding: 0,
        background: "#050506",
        zIndex: -1,
        opacity: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: margin,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive on-page preview only (not used for capture).
 */
function VisiblePreview({
  isMobile,
  data,
  metrics,
}: {
  isMobile: boolean;
  data: StackCheckSnapshot;
  metrics: CardMetrics;
}) {
  if (isMobile) {
    return (
      <div
        className="stack-check-export-stage mx-auto w-full max-w-sm"
        style={{
          aspectRatio: `${PORTRAIT.w} / ${PORTRAIT.h}`,
          background: "#050506",
        }}
      >
        <div
          className="relative h-full w-full"
          style={{ padding: `${(PORTRAIT.margin / PORTRAIT.w) * 100}%` }}
        >
          <div className="absolute inset-[3.33%]">
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
      <div
        className="relative h-full w-full"
        style={{ padding: `${(DESKTOP.margin / DESKTOP.w) * 100}%` }}
      >
        <div className="absolute inset-[2%]">
          <DesktopCardFace data={data} m={metrics} />
        </div>
      </div>
    </div>
  );
}

/**
 * Auto format by viewport. Offscreen fixed-size export nodes.
 * Mobile: Share / Open Image / Copy Tweet
 * Desktop: Post on X / Download / Copy Tweet
 */
export function SundayStackCard({ data }: Props) {
  const desktopExportRef = useRef<HTMLDivElement>(null);
  const portraitExportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [busy, setBusy] = useState<null | "share" | "open" | "download" | "tweet">(
    null,
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const metrics = useCardMetrics(data);
  const tweetText = useMemo(() => buildTweetText(data), [data]);

  // Revoke blob URLs on change/unmount
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const filename = useMemo(
    () =>
      isMobile
        ? `sunday-stack-check-${data.weekEnding}.png`
        : `sunday-stack-check-${data.weekEnding}-16x9.png`,
    [data.weekEnding, isMobile],
  );

  /** Capture ONLY the selected offscreen export stage */
  const renderSelectedPng = useCallback(async () => {
    const conf = isMobile ? PORTRAIT : DESKTOP;
    const el = isMobile
      ? portraitExportRef.current
      : desktopExportRef.current;
    if (!el) throw new Error("Export node not ready");

    const { toPng } = await import("html-to-image");
    return toPng(el, {
      width: conf.w,
      height: conf.h,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#050506",
      style: {
        // Force exact export geometry; node is already fixed offscreen
        left: "0",
        top: "0",
        transform: "none",
        margin: "0",
        width: `${conf.w}px`,
        height: `${conf.h}px`,
        position: "relative",
      },
    });
  }, [isMobile]);

  const makeFile = useCallback(
    async () => {
      const dataUrl = await renderSelectedPng();
      const blob = dataUrlToBlob(dataUrl);
      const file = new File([blob], filename, { type: "image/png" });
      return { dataUrl, blob, file };
    },
    [filename, renderSelectedPng],
  );

  /** Mobile: Web Share with PNG file */
  const sharePortrait = useCallback(async () => {
    setBusy("share");
    setMsg(null);
    try {
      const { dataUrl, file } = await makeFile();
      const canFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canFiles) {
        await navigator.share({
          files: [file],
          title: "Sunday Stack Check",
          text: tweetText,
        });
        setMsg("Shared — choose X, Photos, or Messages.");
        return;
      }

      // Fallback: open image for long-press save
      const url = URL.createObjectURL(dataUrlToBlob(dataUrl));
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      window.open(url, "_blank", "noopener,noreferrer");
      setMsg("Share not available — image opened. Long-press to save.");
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setMsg(null);
      } else {
        setMsg("Share failed. Try Open Image.");
      }
    } finally {
      setBusy(null);
    }
  }, [makeFile, tweetText]);

  /** iOS-friendly: open PNG in new tab for long-press save */
  const openImage = useCallback(async () => {
    setBusy("open");
    setMsg(null);
    try {
      const { dataUrl, blob } = await makeFile();
      const url = URL.createObjectURL(blob);
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup blocked — download as last resort
        downloadDataUrl(dataUrl, filename);
        setMsg("Popup blocked — download started instead.");
      } else {
        setMsg("Image opened — long-press to save to Photos.");
      }
    } catch {
      setMsg("Could not open image. Try again.");
    } finally {
      setBusy(null);
    }
  }, [filename, makeFile]);

  /** Desktop: download PNG */
  const downloadImage = useCallback(async () => {
    setBusy("download");
    setMsg(null);
    try {
      const { dataUrl } = await makeFile();
      downloadDataUrl(dataUrl, filename);
      setMsg(`Downloaded ${filename}`);
    } catch {
      setMsg("Download failed. Try Chrome/desktop.");
    } finally {
      setBusy(null);
    }
  }, [filename, makeFile]);

  /** Desktop: open X compose (no local file attach via intent) */
  const postOnX = useCallback(() => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setMsg("X compose opened — download the image and attach it to your post.");
  }, [tweetText]);

  const copyTweet = useCallback(async () => {
    setBusy("tweet");
    setMsg(null);
    try {
      await navigator.clipboard.writeText(tweetText);
      setMsg("Tweet text copied.");
    } catch {
      setMsg("Clipboard blocked — expand tweet draft below.");
    } finally {
      setBusy(null);
    }
  }, [tweetText]);

  return (
    <div className="space-y-4">
      {/* Visible preview only — one format, no dead space */}
      <VisiblePreview isMobile={isMobile} data={data} metrics={metrics} />

      {/* Offscreen fixed-size export nodes — never affect layout */}
      <OffscreenExportStage
        stageRef={desktopExportRef}
        w={DESKTOP.w}
        h={DESKTOP.h}
        margin={DESKTOP.margin}
      >
        <DesktopCardFace data={data} m={metrics} />
      </OffscreenExportStage>
      <OffscreenExportStage
        stageRef={portraitExportRef}
        w={PORTRAIT.w}
        h={PORTRAIT.h}
        margin={PORTRAIT.margin}
      >
        <PortraitCardFace data={data} m={metrics} />
      </OffscreenExportStage>

      {/* Device-specific actions */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--text-dim)]">
          Week ending <span className="text-white">{data.weekEnding}</span>
          {" · "}
          {isMobile ? "1080×1350 portrait" : "1200×675 desktop"}
        </p>

        {isMobile ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={sharePortrait}
              disabled={!!busy}
              className="btn-primary rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {busy === "share" ? "Sharing…" : "Share Portrait Card"}
            </button>
            <button
              type="button"
              onClick={openImage}
              disabled={!!busy}
              className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "open" ? "Opening…" : "Open Image"}
            </button>
            <button
              type="button"
              onClick={copyTweet}
              disabled={!!busy}
              className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "tweet" ? "Copying…" : "Copy Tweet"}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={postOnX}
              disabled={!!busy}
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Post on X
            </button>
            <button
              type="button"
              onClick={downloadImage}
              disabled={!!busy}
              className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "download" ? "Downloading…" : "Download Image"}
            </button>
            <button
              type="button"
              onClick={copyTweet}
              disabled={!!busy}
              className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "tweet" ? "Copying…" : "Copy Tweet"}
            </button>
          </div>
        )}

        {msg ? (
          <p className="text-xs text-[var(--text-muted)]">{msg}</p>
        ) : isMobile ? (
          <p className="text-[11px] text-[var(--text-dim)]">
            Share opens your phone share sheet with the full portrait PNG. Open
            Image lets you long-press → Save Image on iOS.
          </p>
        ) : (
          <p className="text-[11px] text-[var(--text-dim)]">
            Post on X opens compose with the weekly text. Download the image
            and attach it manually (X web intent cannot attach local files).
          </p>
        )}
      </div>

      <details className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
        <summary className="cursor-pointer text-xs font-medium text-[var(--text-muted)]">
          Tweet draft preview
        </summary>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[var(--text-dim)]">
          {tweetText}
        </pre>
      </details>
    </div>
  );
}

export { type Props as SundayStackCardProps };
