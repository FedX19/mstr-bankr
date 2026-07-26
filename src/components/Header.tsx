import Link from "next/link";
import { isLive, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";
import { BuyNowButton } from "./BuyNowButton";

const nav = [
  { href: "/", label: "Home" },
  { href: "/thesis", label: "Thesis" },
  { href: "/tokenomics", label: "Tokenomics" },
  { href: "/terminal", label: "Terminal" },
  { href: "/stack-check", label: "Stack Check" },
  { href: "/risks", label: "Risks" },
];

export function Header() {
  const live = isLive();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/75">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-3 sm:h-14 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
        >
          <BrandMark size="xs" priority />
          <span className="truncate text-sm font-semibold tracking-tight text-[var(--text)] group-hover:text-white">
            {siteConfig.projectName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="badge badge-accent hidden sm:inline-flex">
            {live ? "Live" : "Prelaunch"}
          </span>
          {live ? (
            <BuyNowButton
              label="Buy now"
              className="btn-primary hidden rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider sm:inline-flex"
            />
          ) : (
            <span className="text-xs text-[var(--text-dim)]">
              ${siteConfig.ticker}
            </span>
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

      <nav
        className="flex gap-1 overflow-x-auto overscroll-x-contain border-t border-[var(--border)] px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
          >
            {item.label}
          </Link>
        ))}
        {live ? (
          <BuyNowButton
            label="Buy now"
            className="btn-primary shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
          />
        ) : null}
      </nav>
    </header>
  );
}
