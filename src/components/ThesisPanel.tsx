import Link from "next/link";
import { thesisSummaryBullets } from "../lib/content";
import { siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function ThesisPanel() {
  return (
    <section id="thesis" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="card-label mb-2">Thesis summary</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The market may have both wrong
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Our thesis is that the market may be underestimating the
              relationship between MSTR, Strategy&apos;s access to capital, and
              future Bitcoin demand. This is a thesis — not a guaranteed causal
              chain.
            </p>

            <ul className="mt-8 space-y-4">
              {thesisSummaryBullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/thesis"
                className="btn-ghost inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                Read full thesis
                <span className="text-[var(--text-dim)]">→</span>
              </Link>
              <p className="text-sm font-medium text-[var(--accent)]">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="card relative overflow-hidden border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
              <div className="pointer-events-none absolute -right-4 -top-4 opacity-30">
                <BrandMark size="lg" />
              </div>
              <p className="card-label mb-2 text-[var(--accent)]">
                Core lines
              </p>
              <p className="text-lg font-semibold leading-snug text-white">
                {siteConfig.thesisLine}
              </p>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                {siteConfig.catalystLine}
              </p>
              <p className="mt-4 text-xs uppercase tracking-wider text-[var(--text-dim)]">
                {siteConfig.creed}
              </p>
            </div>

            <div className="card p-5">
              <p className="card-label mb-2">What this is not</p>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Not a claim that MSTR has limited downside. Not a short-squeeze
                product. Not a promise that Strategy will raise capital or buy
                Bitcoin. Not affiliation with Strategy or any public figure.
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                Community
              </p>
              <p className="mt-1 text-sm text-white">
                {siteConfig.communityName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
