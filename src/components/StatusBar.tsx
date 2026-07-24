import { siteConfig } from "../lib/config";

export function StatusBar() {
  const status = siteConfig.launchStatus;
  const message = siteConfig.statusMessages[status];
  const isLive = status === "live";
  const isPaused = status === "paused";

  return (
    <div
      role="status"
      className={`border-b px-4 py-2.5 text-center text-xs font-medium leading-snug sm:text-sm ${
        isLive
          ? "border-[rgba(34,197,94,0.25)] bg-[var(--positive-soft)] text-[var(--positive)]"
          : isPaused
            ? "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[var(--negative)]"
            : "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
      }`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {!isLive && !isPaused ? (
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
            aria-hidden
          />
        ) : null}
        {isLive ? (
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[var(--positive)]"
            aria-hidden
          />
        ) : null}
        <span>{message}</span>
      </span>
    </div>
  );
}
