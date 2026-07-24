import Link from "next/link";
import { isLive, siteConfig } from "../lib/config";

const nav = [
  { href: "/#market", label: "Live Market" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/thesis", label: "MSTR Thesis" },
  { href: "/transparency", label: "Transparency" },
  { href: "/risks", label: "Risks" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const live = isLive();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]"
            aria-hidden
          >
            RS
          </span>
          <span className="text-sm font-semibold tracking-tight text-[var(--text)] group-hover:text-white">
            {siteConfig.projectName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="badge badge-accent hidden sm:inline-flex">
            {live ? "Live" : "Prelaunch"}
          </span>
          {live && siteConfig.tradingEnabled ? (
            <span className="badge badge-live hidden md:inline-flex">
              Trade
            </span>
          ) : (
            <span className="badge hidden md:inline-flex">Trade disabled</span>
          )}
          <a
            href={siteConfig.officialX}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            X
          </a>
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className="flex gap-4 overflow-x-auto border-t border-[var(--border)] px-4 py-2 lg:hidden"
        aria-label="Mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
