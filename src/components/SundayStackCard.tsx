"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { StackCheckSnapshot } from "../lib/stack-check";
import { siteConfig } from "../lib/config";
import { formatNumber, formatUsd } from "../lib/format";
import {
  captureElementPng,
  saveImageCrossPlatform,
  triggerDownload,
} from "../lib/capture-card";
import { StackCheckChart } from "./StackCheckChart";

type Props = {
  data: StackCheckSnapshot;
  hideToolbar?: boolean;
};

const DESKTOP = { w: 1200, h: 675, margin: 24 } as const;
const PORTRAIT = { w: 1080, h: 1350, margin: 36 } as const;
const MOBILE_MQ = "(max-width: 767px)";

function fmtBtc(n: number | null | undefined) {
  if (n == null) return "—";
  return `${formatNumber(n, { digits: n >= 100 ? 0 : 2 })} BTC`;
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

/** Plain <img> — Next/Image breaks html-to-image (lazy/srcset/CORS). */
function MascotAccent({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteConfig.brand.mascotStanding}
      alt={siteConfig.brand.mascotStandingAlt}
      width={220}
      height={246}
      draggable={false}
      className={`h-full w-full object-contain object-bottom drop-shadow-[0_8px_24px_rgba(247,147,26,0.4)] ${className}`}
      // Eager load so export capture always has pixels
      loading="eager"
      decoding="sync"
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
 * Fixed-size export stage.
 * Parked off-viewport but NOT with opacity:0 / display:none.
 * Capture moves it on-screen briefly so the browser paints.
 */
function ExportStage({
  stageRef,
  w,
  h,
  margin,
  children,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  w: number;
  h: number;
  margin: number;
  children: ReactNode;
}) {
  return (
    <div
      ref={stageRef}
      aria-hidden
      data-export-stage="true"
      className="stack-check-export-stage"
      style={{
        position: "fixed",
        // Far left but still “real” layout box; capture repositions to 0,0
        left: "-200vw",
        top: "0",
        width: w,
        height: h,
        margin: 0,
        padding: 0,
        background: "#050506",
        zIndex: -1,
        opacity: 1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: margin,
        }}
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

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
        <div className="relative h-full w-full box-border p-[3.33%]">
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
      <div className="relative h-full w-full box-border p-[2%]">
        <div className="h-full w-full">
          <DesktopCardFace data={data} m={metrics} />
        </div>
      </div>
    </div>
  );
}

/** Fullscreen image for iOS long-press → Save Image */
function ImageLightbox({
  url,
  filename,
  onClose,
}: {
  url: string;
  filename: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Save card image"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Save this image</p>
          <p className="text-[11px] text-white/60">
            Long-press the card → Save Image
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white"
        >
          Done
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={filename}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}

function xIntentUrl(text: string) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/**
 * Share modal — Post to X with image when the platform allows it.
 *
 * Reality check (senior note):
 * - Mobile: Web Share API with a File is the ONLY browser way to hand image+text
 *   to the X app already attached. Intent URLs cannot attach local files.
 * - Desktop: X intent cannot attach files. We download PNG + open compose.
 */
function ShareModal({
  open,
  onClose,
  isMobile,
  tweetText,
  filename,
  prepareImage,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  tweetText: string;
  filename: string;
  prepareImage: () => Promise<{ dataUrl: string; blob: Blob }>;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("idle");
      setPreviewUrl(null);
      setBlob(null);
      setNote(null);
      return;
    }
    let cancelled = false;
    setPhase("loading");
    setNote(null);
    (async () => {
      try {
        const { blob: b } = await prepareImage();
        if (cancelled) return;
        setBlob(b);
        const obj = URL.createObjectURL(b);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return obj;
        });
        setPhase("ready");
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setPhase("error");
          setNote(
            e instanceof Error
              ? e.message
              : "Could not generate the card image.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, prepareImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const postToX = async () => {
    if (!blob) return;
    setBusy(true);
    setNote(null);
    try {
      const file = new File([blob], filename, { type: "image/png" });

      // Mobile / supporting browsers: share file+text → pick X → image attached
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
        setNote("Pick X from the sheet — your card image is attached.");
        return;
      }

      // Desktop: no file attach via intent — download then open X
      triggerDownload(blob, filename);
      window.open(xIntentUrl(tweetText), "_blank", "noopener,noreferrer");
      setNote(
        "Image downloaded and X opened. Click the image icon in compose and attach the PNG.",
      );
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setNote(null);
      } else {
        setNote("Share cancelled or failed. Try Save Image, then Open X.");
      }
    } finally {
      setBusy(false);
    }
  };

  const saveImage = async () => {
    if (!blob) return;
    setBusy(true);
    setNote(null);
    try {
      const result = await saveImageCrossPlatform(blob, filename, {
        preferShare: true,
        text: tweetText,
      });
      if (result === "shared") {
        setNote("Use Save Image / Files / X in the sheet.");
      } else if (result === "lightbox") {
        const url = URL.createObjectURL(blob);
        setLightbox(url);
        setNote("Long-press the image → Save Image.");
      } else {
        setNote(`Downloaded ${filename}`);
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setNote(null);
      } else if (blob) {
        // Force lightbox on failure (best iOS path)
        const url = URL.createObjectURL(blob);
        setLightbox(url);
        setNote("Long-press the image → Save Image.");
      }
    } finally {
      setBusy(false);
    }
  };

  const openXOnly = () => {
    window.open(xIntentUrl(tweetText), "_blank", "noopener,noreferrer");
    setNote("X opened with text only. Attach the saved PNG in compose.");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Sunday Stack Check
              </p>
              <h2
                id="share-title"
                className="mt-1 text-lg font-semibold text-white"
              >
                Post to X
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-black">
              {phase === "loading" ? (
                <div className="flex h-48 items-center justify-center text-xs text-[var(--text-dim)]">
                  Rendering card…
                </div>
              ) : phase === "error" ? (
                <div className="flex h-40 items-center justify-center px-4 text-center text-xs text-red-400">
                  {note ?? "Failed to render card."}
                </div>
              ) : previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Stack Check card"
                  className="mx-auto max-h-64 w-auto object-contain"
                />
              ) : null}
            </div>

            {isMobile ? (
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                On iPhone, <span className="text-white">Post to X</span> opens
                the system share sheet with your card image + text. Choose{" "}
                <span className="text-white">X</span> — the image is attached.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Desktop browsers can&apos;t auto-attach a local image to X.
                We&apos;ll <span className="text-white">download the PNG</span>{" "}
                and open X with your text — attach the file in compose.
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={postToX}
                disabled={phase !== "ready" || busy || !blob}
                className="btn-primary rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {busy ? "Working…" : "Post to X"}
              </button>
              <button
                type="button"
                onClick={saveImage}
                disabled={phase !== "ready" || busy || !blob}
                className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save Image
              </button>
              {!isMobile ? (
                <button
                  type="button"
                  onClick={openXOnly}
                  disabled={phase !== "ready"}
                  className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Open X (text only)
                </button>
              ) : null}
            </div>

            {note ? (
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {lightbox ? (
        <ImageLightbox
          url={lightbox}
          filename={filename}
          onClose={() => {
            URL.revokeObjectURL(lightbox);
            setLightbox(null);
          }}
        />
      ) : null}
    </>
  );
}

export function SundayStackCard({ data }: Props) {
  const desktopExportRef = useRef<HTMLDivElement>(null);
  const portraitExportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [busy, setBusy] = useState<null | "download" | "tweet">(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const metrics = useCardMetrics(data);
  const tweetText = useMemo(() => buildTweetText(data), [data]);

  const filename = useMemo(
    () =>
      isMobile
        ? `sunday-stack-check-${data.weekEnding}.png`
        : `sunday-stack-check-${data.weekEnding}-16x9.png`,
    [data.weekEnding, isMobile],
  );

  const size = isMobile ? PORTRAIT : DESKTOP;
  const exportRef = isMobile ? portraitExportRef : desktopExportRef;

  const prepareImage = useCallback(async () => {
    const el = exportRef.current;
    if (!el) throw new Error("Export stage not ready");
    return captureElementPng(el, { w: size.w, h: size.h });
  }, [exportRef, size.h, size.w]);

  const downloadImage = useCallback(async () => {
    setBusy("download");
    setMsg(null);
    try {
      const { blob } = await prepareImage();
      const result = await saveImageCrossPlatform(blob, filename, {
        preferShare: true,
        text: tweetText,
      });
      if (result === "shared") {
        setMsg("Choose Save Image, Files, or X from the sheet.");
      } else if (result === "lightbox") {
        setLightbox(URL.createObjectURL(blob));
        setMsg("Long-press the image → Save Image.");
      } else {
        setMsg(`Downloaded ${filename}`);
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setMsg(null);
      } else {
        console.error(e);
        try {
          const { blob } = await prepareImage();
          setLightbox(URL.createObjectURL(blob));
          setMsg("Long-press the image → Save Image.");
        } catch {
          setMsg("Could not generate image. Refresh and try again.");
        }
      }
    } finally {
      setBusy(null);
    }
  }, [filename, prepareImage, tweetText]);

  const copyTweet = useCallback(async () => {
    setBusy("tweet");
    setMsg(null);
    try {
      await navigator.clipboard.writeText(tweetText);
      setMsg("Tweet text copied.");
    } catch {
      setMsg("Clipboard blocked — expand draft below.");
    } finally {
      setBusy(null);
    }
  }, [tweetText]);

  return (
    <div className="space-y-4">
      <VisiblePreview isMobile={isMobile} data={data} metrics={metrics} />

      {/* Fixed-size export stages (off-viewport; capture moves them on-screen) */}
      <ExportStage
        stageRef={desktopExportRef}
        w={DESKTOP.w}
        h={DESKTOP.h}
        margin={DESKTOP.margin}
      >
        <DesktopCardFace data={data} m={metrics} />
      </ExportStage>
      <ExportStage
        stageRef={portraitExportRef}
        w={PORTRAIT.w}
        h={PORTRAIT.h}
        margin={PORTRAIT.margin}
      >
        <PortraitCardFace data={data} m={metrics} />
      </ExportStage>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--text-dim)]">
          Week ending <span className="text-white">{data.weekEnding}</span>
          {" · "}
          {isMobile ? "1080×1350 portrait" : "1200×675 desktop"}
        </p>

        <div
          className={
            isMobile ? "grid grid-cols-1 gap-2" : "flex flex-wrap gap-2"
          }
        >
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="btn-primary rounded-lg px-4 py-3 text-sm font-semibold sm:px-5 sm:py-2.5"
          >
            Post to X
          </button>
          <button
            type="button"
            onClick={downloadImage}
            disabled={!!busy}
            className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:px-5 sm:py-2.5"
          >
            {busy === "download" ? "Saving…" : "Save Image"}
          </button>
          <button
            type="button"
            onClick={copyTweet}
            disabled={!!busy}
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:px-5 sm:py-2.5"
          >
            {busy === "tweet" ? "Copying…" : "Copy Tweet"}
          </button>
        </div>

        {msg ? (
          <p className="text-xs text-[var(--text-muted)]">{msg}</p>
        ) : (
          <p className="text-[11px] text-[var(--text-dim)]">
            {isMobile
              ? "Post to X shares the full card image + text — pick X in the sheet so the image is attached."
              : "Post to X downloads the card and opens compose. Attach the PNG in the image picker."}
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

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        isMobile={isMobile}
        tweetText={tweetText}
        filename={filename}
        prepareImage={prepareImage}
      />

      {lightbox ? (
        <ImageLightbox
          url={lightbox}
          filename={filename}
          onClose={() => {
            URL.revokeObjectURL(lightbox);
            setLightbox(null);
          }}
        />
      ) : null}
    </div>
  );
}

export { type Props as SundayStackCardProps };
