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

/**
 * Build a minimal synthetic series from purchase prices when live history fails,
 * so the hero card never collapses into an empty state.
 */
function syntheticFromEvents(
  events: LedgerEvent[],
  averageCost: number | null,
): BtcHistoryPoint[] {
  const pts = events
    .filter((e) => e.pricePerBtc != null && e.date)
    .map((e) => ({ date: e.date, priceUsd: e.pricePerBtc as number }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length >= 2) return pts;
  if (averageCost != null) {
    const today = new Date().toISOString().slice(0, 10);
    const yearAgo = new Date();
    yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
    return [
      { date: yearAgo.toISOString().slice(0, 10), priceUsd: averageCost * 0.85 },
      { date: today, priceUsd: averageCost * 1.05 },
    ];
  }
  return [];
}

/**
 * Pure SVG chart: BTC price line + area, average-cost dashed line,
 * purchase (orange) / sale (red) bubbles sized by |BTC amount|.
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
  const pad = compact
    ? { t: 14, r: 14, b: 26, l: 48 }
    : { t: 20, r: 18, b: 32, l: 56 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const liveHistory = btcHistory.length >= 2;
  const series =
    liveHistory
      ? btcHistory
      : syntheticFromEvents(events, averageCost);
  const degraded = !liveHistory && series.length >= 2;
  const empty = series.length < 2;

  if (empty) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-[#2a2a30] bg-[#0c0c0e] ${className}`}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(247,147,26,0.08),transparent_70%)]" />
        <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#f7931a]/40 to-transparent" />
        <span className="relative rounded-full border border-[#f7931a]/40 bg-[#f7931a]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#f7931a]">
          Data temporarily unavailable
        </span>
        <p className="relative mt-2 max-w-xs text-center text-[11px] text-[#71717a]">
          BTC price history could not be loaded. Metrics above still reflect the
          latest ledger snapshot.
        </p>
      </div>
    );
  }

  const t0 = Date.parse(series[0].date);
  const t1 = Date.parse(series[series.length - 1].date);
  const span = Math.max(t1 - t0, 1);

  const prices = series.map((p) => p.priceUsd);
  let yMin = Math.min(...prices);
  let yMax = Math.max(...prices);
  if (averageCost != null) {
    yMin = Math.min(yMin, averageCost);
    yMax = Math.max(yMax, averageCost);
  }
  const padY = (yMax - yMin) * 0.1 || yMax * 0.05;
  yMin = Math.max(0, yMin - padY);
  yMax = yMax + padY;
  const ySpan = yMax - yMin || 1;

  const xOf = (date: string) =>
    pad.l + ((Date.parse(date) - t0) / span) * iw;
  const yOf = (price: number) =>
    pad.t + (1 - (price - yMin) / ySpan) * ih;

  const linePath = series
    .map((p, i) => {
      const x = xOf(p.date);
      const y = yOf(p.priceUsd);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L${xOf(series[series.length - 1].date).toFixed(1)},${(pad.t + ih).toFixed(1)} L${xOf(series[0].date).toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;

  const maxAbs = Math.max(
    ...events.map((e) => Math.abs(e.btcAmount)),
    1,
  );

  const visibleEvents = events.filter((e) => {
    const t = Date.parse(e.date);
    return t >= t0 && t <= t1 && e.btcAmount !== 0;
  });

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => {
    const v = yMin + (ySpan * i) / yTicks;
    return { v, y: yOf(v) };
  });

  const uid = "scg";

  return (
    <div className={`relative ${className}`}>
      {degraded ? (
        <span className="absolute right-2 top-2 z-10 rounded-full border border-[#f7931a]/35 bg-[#0c0c0e]/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#f7931a]">
          Chart estimate
        </span>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Bitcoin price with Strategy purchase and sale events"
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7931a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t.v}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={t.y}
              y2={t.y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={1}
            />
            <text
              x={pad.l - 8}
              y={t.y + 3}
              textAnchor="end"
              fill="#8b8b96"
              fontSize={compact ? 10 : 11}
              fontFamily="ui-monospace, monospace"
            >
              {t.v >= 1000
                ? `$${(t.v / 1000).toFixed(0)}k`
                : `$${t.v.toFixed(0)}`}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${uid}-fill)`} />
        <path
          d={linePath}
          fill="none"
          stroke="#f7931a"
          strokeWidth={compact ? 2.25 : 2.75}
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
            strokeWidth={1.75}
            strokeDasharray="7 5"
          />
        ) : null}

        {visibleEvents.map((e, i) => {
          const x = xOf(e.date);
          const price =
            e.pricePerBtc ??
            series.find((p) => p.date === e.date)?.priceUsd ??
            averageCost ??
            (yMin + yMax) / 2;
          const y = yOf(price);
          const r = clamp(
            4 + (Math.abs(e.btcAmount) / maxAbs) * (compact ? 12 : 16),
            4,
            compact ? 16 : 20,
          );
          const isSale = e.btcAmount < 0;
          return (
            <circle
              key={`${e.date}-${i}`}
              cx={x}
              cy={y}
              r={r}
              fill={isSale ? "rgba(239,68,68,0.5)" : "rgba(247,147,26,0.5)"}
              stroke={isSale ? "#ef4444" : "#f7931a"}
              strokeWidth={1.5}
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

        <g transform={`translate(${pad.l},${height - 10})`}>
          <circle cx={0} cy={0} r={3.5} fill="#f7931a" />
          <text x={8} y={3} fill="#a1a1aa" fontSize={10}>
            BTC
          </text>
          <line
            x1={42}
            x2={58}
            y1={0}
            y2={0}
            stroke="#c4c4cc"
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />
          <text x={62} y={3} fill="#a1a1aa" fontSize={10}>
            Avg cost
          </text>
          <circle cx={128} cy={0} r={3.5} fill="rgba(247,147,26,0.85)" />
          <text x={136} y={3} fill="#a1a1aa" fontSize={10}>
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
