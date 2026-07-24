import { siteConfig } from "../lib/config";

const shortMessages: Record<typeof siteConfig.launchStatus, string> = {
  prelaunch: "PRELAUNCH — No official token is live.",
  research: "RESEARCH — No official token is live.",
  cleared: "CLEARED — Contract announcement pending.",
  live: "LIVE — Verify the contract before trading.",
  paused: "PAUSED — Trading temporarily suspended.",
};

export function StatusBar() {
  const status = siteConfig.launchStatus;
  const message = siteConfig.statusMessages[status];
  const short = shortMessages[status];
  const isLive = status === "live";
  const isPaused = status === "paused";

  return (
    <div
      role="status"
      className={`border-b px-3 py-2 text-center text-[11px] font-medium leading-snug sm:px-4 sm:py-2.5 sm:text-sm ${
        isLive
          ? "border-[rgba(34,197,94,0.25)] bg-[var(--positive-soft)] text-[var(--positive)]"
          : isPaused
            ? "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[var(--negative)]"
            : "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
      }`}
    >
      <span className="inline-flex max-w-full items-center justify-center gap-2">
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
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{message}</span>
      </span>
    </div>
  );
}
