export function formatUsd(
  value: number | null | undefined,
  opts?: { compact?: boolean; digits?: number },
): string {
  if (value == null || Number.isNaN(value)) return "—";
  const { compact = false, digits } = opts ?? {};

  if (compact && Math.abs(value) >= 1_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: digits ?? 2,
    }).format(value);
  }

  const abs = Math.abs(value);
  const fractionDigits =
    digits ?? (abs > 0 && abs < 0.01 ? 6 : abs < 1 ? 4 : 2);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(
  value: number | null | undefined,
  opts?: { compact?: boolean; digits?: number },
): string {
  if (value == null || Number.isNaN(value)) return "—";
  const { compact = false, digits = 0 } = opts ?? {};

  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? Math.min(digits, 2) : 0,
  }).format(value);
}

export function formatPct(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export function shortenHash(hash: string, left = 6, right = 4): string {
  if (hash.length <= left + right + 2) return hash;
  return `${hash.slice(0, left)}…${hash.slice(-right)}`;
}

export function formatBtc(value: number): string {
  return new Intl.NumberFormat("en-US").format(value) + " BTC";
}
