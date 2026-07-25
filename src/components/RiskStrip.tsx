import Link from "next/link";
import { siteConfig } from "../lib/config";

export function RiskStrip() {
  return (
    <section id="risks-summary" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="card border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] p-5 sm:p-6">
          <p className="card-label mb-2 text-[var(--negative)]">Disclaimer</p>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            {siteConfig.memeDisclaimer}
          </p>
          <Link
            href="/risks"
            className="mt-4 inline-flex text-sm font-medium text-[var(--negative)] hover:opacity-85"
          >
            Full risk disclosures →
          </Link>
        </div>
      </div>
    </section>
  );
}
