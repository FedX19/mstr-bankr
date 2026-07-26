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
  openXCompose,
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
  /** null until mounted — avoid mounting desktop export on phones during hydration */
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
 * Fixed-size export stage for capture only.
 * Parked far off-screen at low z-index. Never mounts both formats on mobile.
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
      // Intentionally NO stack-check-export-stage class (avoids shared glow styles)
      style={{
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: w,
        height: h,
        margin: 0,
        padding: 0,
        background: "#050506",
        // Keep BELOW page content and lightbox always
        zIndex: 1,
        opacity: 1,
        overflow: "hidden",
        pointerEvents: "none",
        // Prevent any bleed into visual viewport on iOS
        contain: "strict",
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

/**
 * iOS long-press save UI.
 * z-index MUST beat capture stage (8999) and mask (9000).
 * Solid black + 100dvh so the page chart never shows through.
 */
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
    const prevOverflow = document.body.style.overflow;
    const prevBg = document.body.style.background;
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000";
    // Hide any leftover export stages while lightbox is open
    document.documentElement.classList.add("stack-check-lightbox-open");
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.background = prevBg;
      document.documentElement.classList.remove("stack-check-lightbox-open");
    };
  }, []);

  return (
    <div
      className="stack-check-lightbox fixed inset-0 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Save card image"
      style={{
        zIndex: 99999,
        background: "#000000",
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        minWidth: "100vw",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 bg-black px-4"
        style={{
          paddingTop: "max(20px, calc(env(safe-area-inset-top, 0px) + 8px))",
          paddingBottom: "14px",
          paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
          paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
        }}
      >
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">Save this image</p>
          <p className="mt-0.5 text-xs text-white/70">
            Long-press the card → Save Image
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
        >
          Done
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-black px-3"
        style={{
          paddingBottom: "max(20px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={filename}
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
}

export function SundayStackCard({ data }: Props) {
  const desktopExportRef = useRef<HTMLDivElement>(null);
  const portraitExportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [busy, setBusy] = useState<null | "download" | "tweet" | "post">(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const metrics = useCardMetrics(data);
  const tweetText = useMemo(() => buildTweetText(data), [data]);
  const ready = isMobile !== null;
  const mobile = isMobile === true;

  const filename = useMemo(
    () =>
      mobile
        ? `sunday-stack-check-${data.weekEnding}.png`
        : `sunday-stack-check-${data.weekEnding}-16x9.png`,
    [data.weekEnding, mobile],
  );

  const size = mobile ? PORTRAIT : DESKTOP;
  const exportRef = mobile ? portraitExportRef : desktopExportRef;

  const prepareImage = useCallback(async () => {
    const el = exportRef.current;
    if (!el) throw new Error("Export stage not ready");
    return captureElementPng(el, { w: size.w, h: size.h });
  }, [exportRef, size.h, size.w]);

  /**
   * One tap → straight to X compose with weekly text.
   * Same pattern every other web app uses (intent URL).
   * Image cannot auto-attach via web; Save Image is separate.
   */
  const postToX = useCallback(() => {
    setBusy("post");
    setMsg(null);
    try {
      // On desktop, also kick off image download so it's ready to attach
      if (!mobile) {
        void prepareImage()
          .then(({ blob }) => triggerDownload(blob, filename))
          .catch(() => {
            /* open X anyway */
          });
      }
      openXCompose(tweetText);
      setMsg(
        mobile
          ? "X opened with your text. Save Image first if you want to attach the card."
          : "X opened with your text. Your card PNG is downloading — attach it in compose.",
      );
    } finally {
      setBusy(null);
    }
  }, [filename, mobile, prepareImage, tweetText]);

  const downloadImage = useCallback(async () => {
    setBusy("download");
    setMsg(null);
    try {
      const { blob } = await prepareImage();
      const result = await saveImageCrossPlatform(blob, filename);
      if (result === "lightbox") {
        setLightbox(URL.createObjectURL(blob));
        setMsg("Long-press the image → Save Image.");
      } else {
        setMsg(`Downloaded ${filename}`);
      }
    } catch (e) {
      console.error(e);
      try {
        const { blob } = await prepareImage();
        setLightbox(URL.createObjectURL(blob));
        setMsg("Long-press the image → Save Image.");
      } catch {
        setMsg("Could not generate image. Refresh and try again.");
      }
    } finally {
      setBusy(null);
    }
  }, [filename, prepareImage]);

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
      {ready ? (
        <VisiblePreview isMobile={mobile} data={data} metrics={metrics} />
      ) : (
        <div
          className="mx-auto w-full max-w-sm rounded-xl bg-[#050506]"
          style={{ aspectRatio: "4 / 5" }}
          aria-hidden
        />
      )}

      {/* Only mount the format we need — never both (desktop chart was bleeding on mobile) */}
      {ready && mobile ? (
        <ExportStage
          stageRef={portraitExportRef}
          w={PORTRAIT.w}
          h={PORTRAIT.h}
          margin={PORTRAIT.margin}
        >
          <PortraitCardFace data={data} m={metrics} />
        </ExportStage>
      ) : null}
      {ready && !mobile ? (
        <ExportStage
          stageRef={desktopExportRef}
          w={DESKTOP.w}
          h={DESKTOP.h}
          margin={DESKTOP.margin}
        >
          <DesktopCardFace data={data} m={metrics} />
        </ExportStage>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--text-dim)]">
          Week ending <span className="text-white">{data.weekEnding}</span>
          {" · "}
          {mobile ? "1080×1350 portrait" : "1200×675 desktop"}
        </p>

        <div
          className={
            mobile ? "grid grid-cols-1 gap-2" : "flex flex-wrap gap-2"
          }
        >
          <button
            type="button"
            onClick={postToX}
            disabled={!!busy}
            className="btn-primary rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-50 sm:px-5 sm:py-2.5"
          >
            {busy === "post" ? "Opening X…" : "Post to X"}
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
            <span className="text-white">Post to X</span> opens X with your
            weekly text filled in.{" "}
            <span className="text-white">Save Image</span> for the card PNG to
            attach in compose.
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
