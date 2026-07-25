import Link from "next/link";
import { isLive, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

const nav = [
  { href: "/#thesis", label: "Thesis" },
  { href: "/#flywheel", label: "Flywheel" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/thesis", label: "Full Thesis" },
  { href: "/#transparency", label: "Transparency" },
  { href: "/risks", label: "Risks" },
  { href: "/faq", label: "FAQ" },
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
          className="hidden items-center gap-4 xl:flex"
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
          <span className="hidden text-xs text-[var(--text-dim)] md:inline">
            ${siteConfig.ticker}
          </span>
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
        className="flex gap-1 overflow-x-auto overscroll-x-contain border-t border-[var(--border)] px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] active:bg-[var(--bg-card)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
