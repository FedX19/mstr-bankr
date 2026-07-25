import Link from "next/link";
import {
  getMemeContractDisplay,
  getPairLabel,
  siteConfig,
} from "../lib/config";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const links: { label: string; href: string; external?: boolean }[] = [
    { label: "Thesis", href: "/thesis" },
    { label: "Terminal", href: "/terminal" },
    { label: "Risks", href: "/risks" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "GitHub", href: siteConfig.officialGitHub, external: true },
    { label: "X", href: siteConfig.officialX, external: true },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)]">
      <div className="pointer-events-none absolute -bottom-16 -left-10 opacity-[0.12]">
        <BrandMark size="xl" variant="transparent" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandMark size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {siteConfig.projectName}
                </p>
                <p className="text-xs text-[var(--accent)]">
                  {siteConfig.mainHeadline}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-dim)]">
              {siteConfig.thesisLine} {siteConfig.primarySlogan}{" "}
              {siteConfig.creed}
            </p>
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Pair: {getPairLabel()} · Contract: {getMemeContractDisplay()}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <hr className="section-rule my-8" />

        <div className="space-y-2">
          <p className="text-[11px] leading-relaxed text-[var(--text-dim)]">
            {siteConfig.nonAffiliation}
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <p className="text-[11px] text-[var(--text-dim)]">
              {siteConfig.communityName}
            </p>
            <p className="text-[11px] text-[var(--text-dim)]">
              © {new Date().getFullYear()} {siteConfig.projectName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
