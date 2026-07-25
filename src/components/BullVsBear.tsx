import { bearCase, bullCase } from "../lib/content";

export function BullVsBear() {
  return (
    <section id="bull-bear" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="card-label mb-2">Scenarios</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Bull case versus bear case
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Both sides can be argued in good faith. The Stackers hold a view —
            they do not claim certainty.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <p className="card-label mb-4 text-[var(--positive)]">
              What could go right
            </p>
            <ul className="space-y-3">
              {bullCase.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--positive)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 sm:p-6">
            <p className="card-label mb-4 text-[var(--negative)]">
              What could go wrong
            </p>
            <ul className="space-y-3">
              {bearCase.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--negative)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
