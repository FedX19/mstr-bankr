import { invalidationConditions } from "../lib/content";

export function Invalidation() {
  return (
    <section id="invalidation" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="card-label mb-2">Falsifiability</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What would prove the thesis wrong
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            A serious thesis states its own invalidation. If several of these
            persist together, the capital-engine story weakens materially.
          </p>
        </div>

        <div className="card p-5 sm:p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {invalidationConditions.map((item) => (
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
    </section>
  );
}
