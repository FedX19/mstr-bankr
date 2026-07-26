import type { BtcHistoryPoint } from "../lib/adapters/btc-history";
import type { LedgerEvent } from "../lib/adapters/strategy-ledger";

/** Strategy first BTC acquisition — never plot markers before this. */
export const STRATEGY_FIRST_BTC = "2020-08-10";

type Props = {
  btcHistory: BtcHistoryPoint[];
  events: LedgerEvent[];
  averageCost: number | null;
  /** Preferred chart end date (week ending Sunday) */
  endDate?: string | null;
  width?: number;
  height?: number;
  className?: string;
  /** Compact legend for social-card export */
  compact?: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** Prefer clean $25k-style ticks when domain is large. */
function yTicksForDomain(min: number, max: number): number[] {
  const prefer = [0, 25_000, 50_000, 75_000, 100_000, 125_000, 150_000];
  const inRange = prefer.filter((v) => v >= min - 1 && v <= max + 1);
  if (inRange.length >= 3) return inRange;

  const span = Math.max(max - min, 1);
  const raw = span / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow);
  const step =
    candidates.find((c) => span / c <= 6) ?? candidates[candidates.length - 1];
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.01; v += step) {
    if (v >= min - step * 0.01) ticks.push(v);
  }
  return ticks.length ? ticks : [min, max];
}

function formatY(v: number): string {
  if (Math.abs(v) < 0.5) return "$0";
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
}

function yearTicks(t0: number, t1: number): { t: number; label: string }[] {
  const startY = new Date(t0).getUTCFullYear();
  const endY = new Date(t1).getUTCFullYear();
  const out: { t: number; label: string }[] = [];

  for (let y = startY; y <= endY; y++) {
    const t = Date.UTC(y, 0, 1);
    if (t >= t0 - 86400000 && t <= t1 + 86400000) {
      out.push({ t, label: String(y) });
    }
  }
  // Label range start if mid-year (e.g. 2020-08)
  if (out.length === 0 || (out[0].t - t0) / (t1 - t0) > 0.08) {
    out.unshift({ t: t0, label: String(startY) });
  }
  // Dedupe by label+position proximity
  const deduped: typeof out = [];
  for (const xt of out) {
    const prev = deduped[deduped.length - 1];
    if (prev && Math.abs(prev.t - xt.t) < 60 * 86400000) continue;
    deduped.push(xt);
  }
  return deduped;
}

/**
 * Pure SVG chart: real BTC USD axis + real date axis,
 * average-cost dashed line, purchase/sale bubbles sized by BTC amount.
 * Range defaults to Strategy first buy (2020-08-10) → week ending.
 */
export function StackCheckChart({
  btcHistory,
  events,
  averageCost,
  endDate = null,
  width = 1100,
  height = 420,
  className = "",
  compact = false,
}: Props) {
  // Pad: left for y labels + axis title, bottom for x labels + legend
  // Compact mode keeps plot area large for social cards
  const pad = compact
    ? { t: 10, r: 8, b: 44, l: 50 }
    : { t: 18, r: 12, b: 52, l: 58 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const rangeStart = STRATEGY_FIRST_BTC;
  const rangeEnd =
    endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ? endDate
      : new Date().toISOString().slice(0, 10);

  const liveHistory = btcHistory.length >= 2;
  // Clip series to preferred Strategy era
  const series = liveHistory
    ? btcHistory.filter((p) => p.date >= rangeStart && p.date <= rangeEnd)
    : [];
  // If clip left us thin, fall back to full series after first buy
  const plotSeries =
    series.length >= 2
      ? series
      : liveHistory
        ? btcHistory.filter((p) => p.date >= rangeStart)
        : [];
  const empty = plotSeries.length < 2;

  if (empty) {
    return (
      <div
        className={`relative flex flex-col overflow-hidden rounded-md border border-[#2a2a30] bg-[#0c0c0e] ${className}`}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full opacity-40"
          aria-hidden
        >
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line
              key={f}
              x1={pad.l}
              x2={width - pad.r}
              y1={pad.t + ih * f}
              y2={pad.t + ih * f}
              stroke="rgba(255,255,255,0.08)"
            />
          ))}
          <line
            x1={pad.l}
            x2={pad.l}
            y1={pad.t}
            y2={pad.t + ih}
            stroke="rgba(255,255,255,0.12)"
          />
          <line
            x1={pad.l}
            x2={width - pad.r}
            y1={pad.t + ih}
            y2={pad.t + ih}
            stroke="rgba(255,255,255,0.12)"
          />
        </svg>
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
          <span className="rounded-full border border-[#f7931a]/40 bg-[#f7931a]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#f7931a]">
            BTC history temporarily unavailable
          </span>
          <p className="mt-2 max-w-xs text-center text-[11px] text-[#71717a]">
            Chart frame held for layout. Metrics still reflect the latest ledger
            snapshot.
          </p>
        </div>
      </div>
    );
  }

  const t0 = Date.parse(rangeStart);
  const t1 = Math.max(
    Date.parse(rangeEnd),
    Date.parse(plotSeries[plotSeries.length - 1].date),
  );
  const span = Math.max(t1 - t0, 1);

  const prices = plotSeries.map((p) => p.priceUsd);
  let yMin = 0;
  let yMax = Math.max(...prices, averageCost ?? 0, 100_000);
  // Headroom above peak
  yMax = Math.max(yMax * 1.06, 100_000);
  // Snap upper bound to $25k steps when sensible
  yMax = Math.ceil(yMax / 25_000) * 25_000;
  if (yMax < 100_000) yMax = 100_000;
  const ySpan = yMax - yMin || 1;

  const xOf = (dateOrTs: string | number) => {
    const t = typeof dateOrTs === "number" ? dateOrTs : Date.parse(dateOrTs);
    return pad.l + ((t - t0) / span) * iw;
  };
  const yOf = (price: number) =>
    pad.t + (1 - (price - yMin) / ySpan) * ih;

  const maxPts = compact ? 240 : 400;
  const step = Math.max(1, Math.floor(plotSeries.length / maxPts));
  const drawn = plotSeries.filter(
    (_, i) => i % step === 0 || i === plotSeries.length - 1,
  );

  const linePath = drawn
    .map((p, i) => {
      const x = xOf(p.date);
      const y = yOf(p.priceUsd);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${xOf(drawn[drawn.length - 1].date).toFixed(1)},${(pad.t + ih).toFixed(1)} L${xOf(drawn[0].date).toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;

  // Only Strategy events on/after first acquisition
  const strategyEvents = events.filter((e) => {
    if (!e.date || e.btcAmount === 0) return false;
    return e.date >= STRATEGY_FIRST_BTC && e.date <= rangeEnd;
  });
  const maxAbs = Math.max(
    ...strategyEvents.map((e) => Math.abs(e.btcAmount)),
    1,
  );

  const priceAt = (date: string): number | null => {
    const t = Date.parse(date);
    let best: BtcHistoryPoint | null = null;
    let bestD = Infinity;
    for (const p of plotSeries) {
      const d = Math.abs(Date.parse(p.date) - t);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best?.priceUsd ?? null;
  };

  const yTickVals = yTicksForDomain(yMin, yMax);
  const xTickVals = yearTicks(t0, t1);
  const uid = "scg";
  const fontY = compact ? 10 : 11;
  const fontX = compact ? 9.5 : 10.5;

  return (
    <div className={`relative min-h-0 ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Bitcoin USD price with Strategy purchase and sale events from August 2020"
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7931a" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-plot`}>
            <rect x={pad.l} y={pad.t} width={iw} height={ih} />
          </clipPath>
        </defs>

        {/* Y-axis title */}
        <text
          x={12}
          y={pad.t + ih / 2}
          fill="#a1a1aa"
          fontSize={compact ? 9 : 10}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight={600}
          letterSpacing="0.06em"
          transform={`rotate(-90 12 ${pad.t + ih / 2})`}
          textAnchor="middle"
        >
          BTC PRICE (USD)
        </text>

        {/* Y grid + labels */}
        {yTickVals.map((v) => {
          const y = yOf(v);
          if (y < pad.t - 1 || y > pad.t + ih + 1) return null;
          return (
            <g key={`y-${v}`}>
              <line
                x1={pad.l}
                x2={width - pad.r}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <text
                x={pad.l - 8}
                y={y + 3.5}
                textAnchor="end"
                fill="#b4b4be"
                fontSize={fontY}
                fontFamily="ui-monospace, monospace"
              >
                {formatY(v)}
              </text>
            </g>
          );
        })}

        {/* X axis ticks + labels */}
        {xTickVals.map((xt) => {
          const x = xOf(xt.t);
          if (x < pad.l - 2 || x > width - pad.r + 2) return null;
          return (
            <g key={`x-${xt.t}-${xt.label}`}>
              <line
                x1={x}
                x2={x}
                y1={pad.t}
                y2={pad.t + ih}
                stroke="rgba(255,255,255,0.045)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={pad.t + ih + 15}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize={fontX}
                fontFamily="ui-monospace, monospace"
              >
                {xt.label}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={pad.l}
          x2={pad.l}
          y1={pad.t}
          y2={pad.t + ih}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.25}
        />
        <line
          x1={pad.l}
          x2={width - pad.r}
          y1={pad.t + ih}
          y2={pad.t + ih}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.25}
        />

        <g clipPath={`url(#${uid}-plot)`}>
          <path d={areaPath} fill={`url(#${uid}-fill)`} />
          <path
            d={linePath}
            fill="none"
            stroke="#f7931a"
            strokeWidth={compact ? 2.2 : 2.6}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {averageCost != null ? (
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={yOf(averageCost)}
              y2={yOf(averageCost)}
              stroke="#d4d4d8"
              strokeWidth={1.75}
              strokeDasharray="7 5"
            />
          ) : null}

          {strategyEvents.map((e, i) => {
            const x = xOf(e.date);
            const price =
              e.pricePerBtc ??
              priceAt(e.date) ??
              averageCost ??
              (yMin + yMax) / 2;
            const y = yOf(price);
            const r = clamp(
              3.5 + (Math.abs(e.btcAmount) / maxAbs) * (compact ? 11 : 15),
              3.5,
              compact ? 15 : 19,
            );
            const isSale = e.btcAmount < 0;
            return (
              <circle
                key={`${e.date}-${i}`}
                cx={x}
                cy={y}
                r={r}
                fill={isSale ? "rgba(239,68,68,0.48)" : "rgba(247,147,26,0.48)"}
                stroke={isSale ? "#ef4444" : "#f7931a"}
                strokeWidth={1.4}
              >
                <title>
                  {e.date}: {isSale ? "Sale" : "Purchase"}{" "}
                  {Math.abs(e.btcAmount).toLocaleString()} BTC
                  {e.pricePerBtc != null
                    ? ` @ $${e.pricePerBtc.toLocaleString()}`
                    : ""}
                </title>
              </circle>
            );
          })}
        </g>

        {/* Legend — below x labels, clear of plot */}
        <g transform={`translate(${pad.l},${height - 10})`}>
          <circle cx={0} cy={0} r={3.5} fill="#f7931a" />
          <text x={8} y={3.5} fill="#c4c4cc" fontSize={10}>
            BTC
          </text>
          <line
            x1={38}
            x2={54}
            y1={0}
            y2={0}
            stroke="#d4d4d8"
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />
          <text x={58} y={3.5} fill="#c4c4cc" fontSize={10}>
            Avg cost
          </text>
          <circle cx={122} cy={0} r={3.5} fill="rgba(247,147,26,0.9)" />
          <text x={130} y={3.5} fill="#c4c4cc" fontSize={10}>
            Buy
          </text>
          <circle cx={164} cy={0} r={3.5} fill="rgba(239,68,68,0.9)" />
          <text x={172} y={3.5} fill="#c4c4cc" fontSize={10}>
            Sale
          </text>
          <circle cx={210} cy={0} r={2} fill="rgba(247,147,26,0.55)" />
          <circle cx={222} cy={0} r={4.5} fill="rgba(247,147,26,0.55)" />
          <text x={232} y={3.5} fill="#8b8b96" fontSize={9.5}>
            size = BTC amt
          </text>
        </g>
      </svg>
    </div>
  );
}
