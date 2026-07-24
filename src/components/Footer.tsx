import Link from "next/link";
import { siteConfig } from "../lib/config";

export function Footer() {
  const links = [
    {
      label: "Contract",
      href: siteConfig.contractAddress === "TBA" ? undefined : `#`,
      value: siteConfig.contractAddress,
      mono: true,
    },
    { label: "Bankr", href: siteConfig.bankrUrl },
    { label: "X", href: siteConfig.xUrl },
    { label: "Full Thesis", href: "/thesis", internal: true },
    { label: "GitHub", href: siteConfig.githubUrl },
  ];

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-[var(--accent)]">{siteConfig.tagline}</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-[var(--text-dim)]">
              Public research dashboard. Not financial advice. Do your own
              research. Tokenized equity and crypto involve significant risk.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => {
              const content = (
                <>
                  <span className="card-label block mb-0.5">{link.label}</span>
                  <span
                    className={`text-sm text-[var(--text-muted)] group-hover:text-white ${
                      "mono" in link && link.mono ? "stat-value text-xs" : ""
                    }`}
                  >
                    {"value" in link && link.value ? link.value : link.label}
                  </span>
                </>
              );

              if ("internal" in link && link.internal) {
                return (
                  <Link key={link.label} href={link.href!} className="group">
                    {content}
                  </Link>
                );
              }

              if (!link.href || link.href === "#") {
                return (
                  <div key={link.label}>
                    {content}
                  </div>
                );
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[var(--text-dim)]">
            Recycling volume into the treasury.
          </p>
          <p className="text-[11px] text-[var(--text-dim)]">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
