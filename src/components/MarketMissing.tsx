import { marketMissingPoints } from "../lib/content";
import { siteConfig } from "../lib/config";

export function MarketMissing() {
  return (
    <section id="market-missing" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="card-label mb-2">Setup</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What the market may be missing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {siteConfig.positioning}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {marketMissingPoints.map((point) => (
            <div key={point.title} className="card p-5">
              <h3 className="text-sm font-semibold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {point.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
            <p className="card-label mb-2 text-[var(--accent)]">Thesis line</p>
            <p className="text-base font-medium text-white">
              {siteConfig.thesisLine}
            </p>
          </div>
          <div className="card p-5">
            <p className="card-label mb-2">Catalyst line</p>
            <p className="text-base font-medium text-white">
              {siteConfig.catalystLine}
            </p>
            <p className="mt-3 text-xs text-[var(--text-dim)]">
              Creed: {siteConfig.creed}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
