import Image from "next/image";
import { siteConfig } from "../lib/config";
import { MascotFrame } from "./MascotFrame";

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
    <section
      id="flywheel"
      className="relative isolate overflow-hidden border-b border-[var(--border)]"
    >
      {/* Blended side atmosphere (desktop) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block"
        aria-hidden
      >
        <Image
          src={siteConfig.brand.flywheel}
          alt=""
          fill
          sizes="48vw"
          className="object-cover object-center opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_75%_50%,rgba(247,147,26,0.1),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div className="relative z-10 max-w-xl">
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

            <p className="mt-5 text-sm leading-relaxed text-white">
              Buy ${siteConfig.ticker} → tokenized MSTR enters the pool → the
              market grows → the thesis spreads → repeat.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-dim)]">
              Buying ${siteConfig.ticker} through the MSTR pair adds tokenized
              MSTR exposure to the pool. Holders do not own pool assets, MSTR, or
              Bitcoin.
            </p>
          </div>

          {/* Mobile / tablet: blended plate under copy */}
          <div className="relative z-10 mx-auto w-full max-w-md lg:hidden">
            <MascotFrame
              src={siteConfig.brand.flywheel}
              alt={siteConfig.brand.flywheelAlt}
              blend="soft"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
          <span className="sr-only lg:not-sr-only lg:absolute lg:opacity-0">
            {siteConfig.brand.flywheelAlt}
          </span>
        </div>

        <div className="relative z-10 mt-10 hidden flex-wrap items-center justify-center gap-2 lg:flex">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flywheel-node rounded-lg border border-[var(--accent-border)]/40 bg-[var(--bg)]/70 px-3 py-2.5 backdrop-blur-sm">
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

        <ol className="relative z-10 mt-8 space-y-0 lg:hidden">
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
