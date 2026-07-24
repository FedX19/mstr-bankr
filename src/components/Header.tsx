import Link from "next/link";
import { siteConfig } from "../lib/config";

const nav = [
  { href: "#stats", label: "Stats" },
  { href: "#accumulation", label: "Treasury" },
  { href: "#thesis", label: "Thesis" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "/thesis", label: "Full Thesis" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]"
            aria-hidden
          >
            RS
          </span>
          <span className="text-sm font-semibold tracking-tight text-[var(--text)] group-hover:text-white">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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
            Fee → MSTR
          </span>
          <a
            href={siteConfig.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            X
          </a>
        </div>
      </div>
    </header>
  );
}
