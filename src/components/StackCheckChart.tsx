import type { BtcHistoryPoint } from "../lib/adapters/btc-history";
import type { LedgerEvent } from "../lib/adapters/strategy-ledger";

type Props = {
  btcHistory: BtcHistoryPoint[];
  events: LedgerEvent[];
  averageCost: number | null;
  width?: number;
  height?: number;
  className?: string;
  /** Compact legend for social-card export */
  compact?: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function niceYTicks(min: number, max: number, count = 5): number[] {
  const span = Math.max(max - min, 1);
  const raw = span / count;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow);
  const step =
    candidates.find((c) => span / c <= count + 1) ?? candidates[candidates.length - 1];
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.01; v += step) {
    if (v >= min - step * 0.01) ticks.push(v);
  }
  return ticks.length ? ticks : [min, max];
}

function formatY(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  if (v >= 100) return `$${v.toFixed(0)}`;
  return `$${v.toFixed(0)}`;
}

function yearTicks(t0: number, t1: number): { t: number; label: string }[] {
  const startY = new Date(t0).getUTCFullYear();
  const endY = new Date(t1).getUTCFullYear();
  const years = endY - startY;
  const out: { t: number; label: string }[] = [];

  if (years >= 3) {
    for (let y = startY; y <= endY; y++) {
      const t = Date.UTC(y, 0, 1);
      if (t >= t0 - 86400000 && t <= t1 + 86400000) {
        out.push({ t, label: String(y) });
      }
    }
    // Ensure first/last year labels if range starts mid-year
    if (out.length === 0 || out[0].t > t0 + 90 * 86400000) {
      out.unshift({ t: t0, label: String(startY) });
    }
    return out;
  }

  // Shorter ranges: month/year ticks
  const d = new Date(t0);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  const stepMonths = years >= 1 ? 3 : 1;
  while (d.getTime() <= t1) {
    const t = d.getTime();
    if (t >= t0) {
      const label =
        stepMonths >= 3
          ? d.toLocaleString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" })
          : d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      out.push({ t, label });
    }
    d.setUTCMonth(d.getUTCMonth() + stepMonths);
  }
  return out.length ? out : [{ t: t0, label: new Date(t0).getUTCFullYear().toString() }];
}

/**
 * Pure SVG chart: real BTC USD axis + real date axis,
 * average-cost dashed line, purchase/sale bubbles.
 * Never collapses — empty/degraded states keep the plot frame.
 */
export function StackCheckChart({
  btcHistory,
  events,
  averageCost,
  width = 1100,
  height = 380,
  className = "",
  compact = false,
}: Props) {
  // Extra bottom padding for x-axis labels + legend (legend outside plot)
  const pad = compact
    ? { t: 12, r: 12, b: 40, l: 52 }
    : { t: 18, r: 16, b: 48, l: 58 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const liveHistory = btcHistory.length >= 2;
  const series = liveHistory ? btcHistory : [];
  const empty = series.length < 2;

  if (empty) {
    return (
      <div
        className={`relative flex flex-col overflow-hidden rounded-md border border-[#2a2a30] bg-[#0c0c0e] ${className}`}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
      >
        {/* Ghost axes so the card never looks empty */}
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
            Chart frame held for layout. Metrics and markers use the latest ledger
            snapshot.
          </p>
        </div>
      </div>
    );
  }

  // Expand time range to include event dates outside history window
  const eventTimes = events
    .map((e) => Date.parse(e.date))
    .filter((t) => Number.isFinite(t));
  const seriesT0 = Date.parse(series[0].date);
  const seriesT1 = Date.parse(series[series.length - 1].date);
  const t0 = Math.min(seriesT0, ...eventTimes, seriesT0);
  const t1 = Math.max(seriesT1, ...eventTimes, seriesT1);
  const span = Math.max(t1 - t0, 1);

  const prices = series.map((p) => p.priceUsd);
  let yMin = Math.min(...prices);
  let yMax = Math.max(...prices);
  if (averageCost != null) {
    yMin = Math.min(yMin, averageCost);
    yMax = Math.max(yMax, averageCost);
  }
  for (const e of events) {
    if (e.pricePerBtc != null) {
      yMin = Math.min(yMin, e.pricePerBtc);
      yMax = Math.max(yMax, e.pricePerBtc);
    }
  }
  // Round to nice currency domain
  const rawPad = (yMax - yMin) * 0.08 || yMax * 0.05;
  yMin = Math.max(0, yMin - rawPad);
  yMax = yMax + rawPad;
  // Snap domain slightly for cleaner ticks
  const approxStep = (yMax - yMin) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(approxStep, 1))));
  yMin = Math.floor(yMin / mag) * mag;
  yMax = Math.ceil(yMax / mag) * mag;
  if (yMax <= yMin) yMax = yMin + mag;
  const ySpan = yMax - yMin;

  const xOf = (dateOrTs: string | number) => {
    const t = typeof dateOrTs === "number" ? dateOrTs : Date.parse(dateOrTs);
    return pad.l + ((t - t0) / span) * iw;
  };
  const yOf = (price: number) =>
    pad.t + (1 - (price - yMin) / ySpan) * ih;

  // Downsample dense series for SVG path performance
  const maxPts = compact ? 220 : 360;
  const step = Math.max(1, Math.floor(series.length / maxPts));
  const drawn = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  const linePath = drawn
    .map((p, i) => {
      const x = xOf(p.date);
      const y = yOf(p.priceUsd);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${xOf(drawn[drawn.length - 1].date).toFixed(1)},${(pad.t + ih).toFixed(1)} L${xOf(drawn[0].date).toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;

  const maxAbs = Math.max(...events.map((e) => Math.abs(e.btcAmount)), 1);

  const visibleEvents = events.filter((e) => {
    const t = Date.parse(e.date);
    return Number.isFinite(t) && t >= t0 && t <= t1 && e.btcAmount !== 0;
  });

  // Price at event date from series (nearest) for y if no purchase price
  const priceAt = (date: string): number | null => {
    const t = Date.parse(date);
    let best: BtcHistoryPoint | null = null;
    let bestD = Infinity;
    for (const p of series) {
      const d = Math.abs(Date.parse(p.date) - t);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
      if (d === 0) break;
    }
    return best?.priceUsd ?? null;
  };

  const yTickVals = niceYTicks(yMin, yMax, compact ? 4 : 5);
  const xTickVals = yearTicks(t0, t1);
  const uid = "scg";
  const fontY = compact ? 10 : 11;
  const fontX = compact ? 9 : 10;

  return (
    <div className={`relative min-h-0 ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Bitcoin price with Strategy purchase and sale events"
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7931a" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-plot`}>
            <rect x={pad.l} y={pad.t} width={iw} height={ih} />
          </clipPath>
        </defs>

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
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
              <text
                x={pad.l - 8}
                y={y + 3}
                textAnchor="end"
                fill="#8b8b96"
                fontSize={fontY}
                fontFamily="ui-monospace, monospace"
              >
                {formatY(v)}
              </text>
            </g>
          );
        })}

        {/* X axis ticks + labels (below plot, never over data) */}
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
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={pad.t + ih + 14}
                textAnchor="middle"
                fill="#71717a"
                fontSize={fontX}
                fontFamily="ui-monospace, monospace"
              >
                {xt.label}
              </text>
            </g>
          );
        })}

        {/* Baseline axes */}
        <line
          x1={pad.l}
          x2={pad.l}
          y1={pad.t}
          y2={pad.t + ih}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />
        <line
          x1={pad.l}
          x2={width - pad.r}
          y1={pad.t + ih}
          y2={pad.t + ih}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />

        <g clipPath={`url(#${uid}-plot)`}>
          <path d={areaPath} fill={`url(#${uid}-fill)`} />
          <path
            d={linePath}
            fill="none"
            stroke="#f7931a"
            strokeWidth={compact ? 2.1 : 2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {averageCost != null ? (
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={yOf(averageCost)}
              y2={yOf(averageCost)}
              stroke="#c4c4cc"
              strokeWidth={1.6}
              strokeDasharray="7 5"
            />
          ) : null}

          {visibleEvents.map((e, i) => {
            const x = xOf(e.date);
            const price =
              e.pricePerBtc ?? priceAt(e.date) ?? averageCost ?? (yMin + yMax) / 2;
            const y = yOf(price);
            const r = clamp(
              3.5 + (Math.abs(e.btcAmount) / maxAbs) * (compact ? 10 : 14),
              3.5,
              compact ? 14 : 18,
            );
            const isSale = e.btcAmount < 0;
            return (
              <circle
                key={`${e.date}-${i}`}
                cx={x}
                cy={y}
                r={r}
                fill={isSale ? "rgba(239,68,68,0.45)" : "rgba(247,147,26,0.45)"}
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

        {/* Legend — bottom row, clear of plot */}
        <g transform={`translate(${pad.l},${height - 8})`}>
          <circle cx={0} cy={0} r={3.5} fill="#f7931a" />
          <text x={8} y={3} fill="#a1a1aa" fontSize={10}>
            BTC
          </text>
          <line
            x1={40}
            x2={56}
            y1={0}
            y2={0}
            stroke="#c4c4cc"
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />
          <text x={60} y={3} fill="#a1a1aa" fontSize={10}>
            Avg cost
          </text>
          <circle cx={126} cy={0} r={3.5} fill="rgba(247,147,26,0.85)" />
          <text x={134} y={3} fill="#a1a1aa" fontSize={10}>
            Buy
          </text>
          <circle cx={168} cy={0} r={3.5} fill="rgba(239,68,68,0.85)" />
          <text x={176} y={3} fill="#a1a1aa" fontSize={10}>
            Sale
          </text>
        </g>
      </svg>
    </div>
  );
}
