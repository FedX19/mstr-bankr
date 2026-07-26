import type { BtcHistoryPoint } from "../lib/adapters/btc-history";
import type { LedgerEvent } from "../lib/adapters/strategy-ledger";

type Props = {
  btcHistory: BtcHistoryPoint[];
  events: LedgerEvent[];
  averageCost: number | null;
  width?: number;
  height?: number;
  className?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Pure SVG chart: BTC price line, average-cost dashed line,
 * purchase (orange) / sale (red) bubbles sized by |BTC amount|.
 */
export function StackCheckChart({
  btcHistory,
  events,
  averageCost,
  width = 920,
  height = 320,
  className = "",
}: Props) {
  const pad = { t: 16, r: 16, b: 28, l: 52 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  if (btcHistory.length < 2) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]/40 text-sm text-[var(--text-dim)] ${className}`}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
      >
        BTC price history unavailable
      </div>
    );
  }

  const t0 = Date.parse(btcHistory[0].date);
  const t1 = Date.parse(btcHistory[btcHistory.length - 1].date);
  const span = Math.max(t1 - t0, 1);

  const prices = btcHistory.map((p) => p.priceUsd);
  let yMin = Math.min(...prices);
  let yMax = Math.max(...prices);
  if (averageCost != null) {
    yMin = Math.min(yMin, averageCost);
    yMax = Math.max(yMax, averageCost);
  }
  const padY = (yMax - yMin) * 0.08 || yMax * 0.05;
  yMin = Math.max(0, yMin - padY);
  yMax = yMax + padY;
  const ySpan = yMax - yMin || 1;

  const xOf = (date: string) =>
    pad.l + ((Date.parse(date) - t0) / span) * iw;
  const yOf = (price: number) =>
    pad.t + (1 - (price - yMin) / ySpan) * ih;

  const linePath = btcHistory
    .map((p, i) => {
      const x = xOf(p.date);
      const y = yOf(p.priceUsd);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

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

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Bitcoin price with Strategy purchase and sale events"
    >
      {/* grid */}
      {ticks.map((t) => (
        <g key={t.v}>
          <line
            x1={pad.l}
            x2={width - pad.r}
            y1={t.y}
            y2={t.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          <text
            x={pad.l - 8}
            y={t.y + 3}
            textAnchor="end"
            fill="#71717a"
            fontSize={10}
            fontFamily="ui-monospace, monospace"
          >
            {t.v >= 1000
              ? `$${(t.v / 1000).toFixed(0)}k`
              : `$${t.v.toFixed(0)}`}
          </text>
        </g>
      ))}

      {/* BTC price */}
      <path
        d={linePath}
        fill="none"
        stroke="#f7931a"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Average cost */}
      {averageCost != null ? (
        <line
          x1={pad.l}
          x2={width - pad.r}
          y1={yOf(averageCost)}
          y2={yOf(averageCost)}
          stroke="#a1a1aa"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
      ) : null}

      {/* Events */}
      {visibleEvents.map((e, i) => {
        const x = xOf(e.date);
        const price =
          e.pricePerBtc ??
          btcHistory.find((p) => p.date === e.date)?.priceUsd ??
          averageCost ??
          (yMin + yMax) / 2;
        const y = yOf(price);
        const r = clamp(
          4 + (Math.abs(e.btcAmount) / maxAbs) * 14,
          4,
          18,
        );
        const isSale = e.btcAmount < 0;
        return (
          <circle
            key={`${e.date}-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={isSale ? "rgba(239,68,68,0.55)" : "rgba(247,147,26,0.55)"}
            stroke={isSale ? "#ef4444" : "#f7931a"}
            strokeWidth={1.25}
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

      {/* Legend */}
      <g transform={`translate(${pad.l},${height - 12})`}>
        <circle cx={0} cy={0} r={4} fill="#f7931a" />
        <text x={8} y={3} fill="#a1a1aa" fontSize={10}>
          BTC price
        </text>
        <line
          x1={70}
          x2={88}
          y1={0}
          y2={0}
          stroke="#a1a1aa"
          strokeDasharray="4 3"
        />
        <text x={92} y={3} fill="#a1a1aa" fontSize={10}>
          Avg cost
        </text>
        <circle cx={160} cy={0} r={4} fill="rgba(247,147,26,0.7)" />
        <text x={168} y={3} fill="#a1a1aa" fontSize={10}>
          Buy
        </text>
        <circle cx={200} cy={0} r={4} fill="rgba(239,68,68,0.7)" />
        <text x={208} y={3} fill="#a1a1aa" fontSize={10}>
          Sale
        </text>
      </g>
    </svg>
  );
}
