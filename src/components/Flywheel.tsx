import { flywheelDisclaimer, flywheelSteps } from "../lib/content";

export function Flywheel() {
  return (
    <section id="flywheel" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="card-label mb-2">Potential flywheel</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            MSTR–Bitcoin capital engine
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Our thesis is that strength in MSTR{" "}
            <em className="text-[var(--text)]">may</em> improve Strategy’s
            access to capital, which{" "}
            <em className="text-[var(--text)]">could</em> support further
            Bitcoin purchases — and that Bitcoin appreciation{" "}
            <em className="text-[var(--text)]">may</em> feed back into MSTR’s
            asset value. This is a thesis, not a guaranteed causal chain.
          </p>
        </div>

        {/* Desktop: horizontal cycle */}
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-6 gap-3">
            {flywheelSteps.map((step, i) => (
              <div key={step.id} className="relative">
                <div className="flywheel-node card h-full border-[var(--accent-border)]/60 p-4">
                  <p className="stat-value mb-2 text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-sm font-semibold leading-snug text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-[var(--text-dim)]">
                    {step.body}
                  </p>
                </div>
                {i < flywheelSteps.length - 1 ? (
                  <span
                    className="flywheel-arrow absolute -right-2 top-1/2 z-10 -translate-y-1/2 text-[var(--accent)]"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[var(--text-dim)]">
            <span className="flywheel-loop inline-flex items-center gap-2 text-[var(--accent)]">
              ↻ loops back to MSTR Strength
            </span>
          </p>
        </div>

        {/* Mobile / tablet: vertical stack */}
        <ol className="relative space-y-0 lg:hidden">
          {flywheelSteps.map((step, i) => (
            <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flywheel-node flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                  {i + 1}
                </span>
                {i < flywheelSteps.length - 1 ? (
                  <span
                    className="flywheel-line mt-1 w-px flex-1 bg-gradient-to-b from-[var(--accent)] to-[var(--border)]"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="flywheel-line mt-1 w-px flex-1 bg-[var(--accent)]/40"
                    aria-hidden
                  />
                )}
              </div>
              <div className="card mb-1 flex-1 border-[var(--accent-border)]/50 p-4">
                <h3 className="text-sm font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
          <li className="flex gap-4 pt-1">
            <div className="flex w-9 justify-center">
              <span className="text-lg text-[var(--accent)]" aria-hidden>
                ↻
              </span>
            </div>
            <p className="text-xs text-[var(--text-dim)]">
              Back to <strong className="text-white">MSTR Strength</strong> —
              if conditions allow.
            </p>
          </li>
        </ol>

        <div className="card mt-8 border-[var(--border-strong)] bg-[var(--bg-elevated)] p-4 sm:p-5">
          <p className="text-xs leading-relaxed text-[var(--text-dim)] sm:text-sm">
            {flywheelDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
