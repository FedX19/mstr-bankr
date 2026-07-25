import Link from "next/link";
import {
  getBankrUrl,
  getMemeContractDisplay,
  getPairLabel,
  isLive,
  siteConfig,
} from "../lib/config";
import { BrandMark } from "./BrandMark";
import { BuyNowButton } from "./BuyNowButton";

export function Footer() {
  const links: { label: string; href: string; external?: boolean }[] = [
    { label: "Thesis", href: "/thesis" },
    { label: "Tokenomics", href: "/tokenomics" },
    { label: "Terminal", href: "/terminal" },
    { label: "Risks", href: "/risks" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "X", href: siteConfig.officialX, external: true },
  ];

  if (isLive()) {
    links.unshift({
      label: "Buy on Bankr",
      href: getBankrUrl(),
      external: true,
    });
  }

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
            {isLive() ? (
              <div className="mt-4">
                <BuyNowButton className="btn-primary inline-flex rounded-lg px-4 py-2 text-xs font-semibold" />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--text-muted)] hover:text-white"
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
          <p className="text-[11px] text-[var(--text-dim)]">
            © {new Date().getFullYear()} {siteConfig.projectName}
          </p>
        </div>
      </div>
    </footer>
  );
}
