const steps = [
  "MSTR Strength",
  "Access to Capital",
  "Potential Bitcoin Purchases",
  "Bitcoin Demand",
  "BTC Appreciation",
  "MSTR Asset Value",
] as const;

export function Flywheel() {
  return (
    <section id="flywheel" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="card-label mb-2">Capital engine</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            MSTR–Bitcoin flywheel
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Our thesis is that a sustained MSTR recovery could improve
            Strategy&apos;s financing flexibility. If new capital is raised and
            deployed into Bitcoin, the capital engine may contribute to
            Bitcoin&apos;s next major move.
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--accent)]">
            This is a thesis, not a guaranteed causal chain.
          </p>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden flex-wrap items-center justify-center gap-2 lg:flex">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flywheel-node card border-[var(--accent-border)]/50 px-3 py-2.5">
                <p className="text-xs font-semibold text-white">{step}</p>
              </div>
              {i < steps.length - 1 ? (
                <span
                  className="flywheel-arrow text-sm text-[var(--accent)]"
                  aria-hidden
                >
                  →
                </span>
              ) : (
                <span
                  className="flywheel-loop ml-1 text-sm text-[var(--accent)]"
                  aria-hidden
                >
                  → repeat
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <ol className="space-y-0 lg:hidden">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 pb-3 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flywheel-node flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[11px] font-semibold text-[var(--accent)]">
                  {i + 1}
                </span>
                {i < steps.length - 1 ? (
                  <span
                    className="mt-1 w-px flex-1 bg-gradient-to-b from-[var(--accent)] to-[var(--border)]"
                    aria-hidden
                  />
                ) : null}
              </div>
              <p className="pt-1.5 text-sm font-medium text-white">{step}</p>
            </li>
          ))}
          <li className="flex gap-3 pt-1">
            <div className="w-8 text-center text-[var(--accent)]" aria-hidden>
              ↻
            </div>
            <p className="text-xs text-[var(--text-dim)]">repeat</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
