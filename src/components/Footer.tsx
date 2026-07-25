import Link from "next/link";
import { getMemeContractDisplay, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const contract = getMemeContractDisplay();

  const links: {
    label: string;
    href?: string;
    value?: string;
    mono?: boolean;
    internal?: boolean;
  }[] = [
    {
      label: "Contract",
      value: contract,
      mono: true,
      href:
        siteConfig.memeTokenAddress != null
          ? `${siteConfig.chain.explorerAddressBase}${siteConfig.memeTokenAddress}`
          : undefined,
    },
    {
      label: "Explorer",
      href: siteConfig.chain.explorerUrl,
    },
    { label: "X", href: siteConfig.officialX },
    { label: "GitHub", href: siteConfig.officialGitHub },
    { label: "How It Works", href: "/how-it-works", internal: true },
    { label: "Thesis", href: "/thesis", internal: true },
    { label: "Risks", href: "/risks", internal: true },
    { label: "FAQ", href: "/faq", internal: true },
    { label: "Transparency", href: "/transparency", internal: true },
    { label: "Terms", href: "/terms", internal: true },
    { label: "Privacy", href: "/privacy", internal: true },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)]">
      <div className="pointer-events-none absolute -bottom-20 -left-12 opacity-[0.14] sm:-bottom-24 sm:-left-16">
        <BrandMark size="xl" variant="transparent" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <BrandMark size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {siteConfig.projectName}
                </p>
                <p className="text-sm text-[var(--accent)]">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
              {siteConfig.thesisLine} {siteConfig.catalystLine} Community:{" "}
              {siteConfig.communityName}. Working ticker: ${siteConfig.ticker}.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-dim)]">
              {siteConfig.riskStatement}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 sm:gap-x-10">
            {links.map((link) => {
              const content = (
                <>
                  <span className="card-label mb-0.5 block">{link.label}</span>
                  <span
                    className={`text-sm text-[var(--text-muted)] group-hover:text-white ${
                      link.mono ? "stat-value text-xs" : ""
                    }`}
                  >
                    {link.value ?? link.label}
                  </span>
                </>
              );

              if (link.internal && link.href) {
                return (
                  <Link key={link.label} href={link.href} className="group">
                    {content}
                  </Link>
                );
              }

              if (!link.href) {
                return <div key={link.label}>{content}</div>;
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>

        <hr className="section-rule my-8" />

        <div className="space-y-3">
          <p className="text-[11px] leading-relaxed text-[var(--text-dim)]">
            {siteConfig.nonAffiliation}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[var(--text-dim)]">
              {siteConfig.creed}
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
