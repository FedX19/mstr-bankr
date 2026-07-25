import Link from "next/link";
import { homepageFaq } from "../lib/content";

export function FaqSummary() {
  return (
    <section id="faq" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">FAQ</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Quick answers
            </h2>
          </div>
          <Link
            href="/faq"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full FAQ →
          </Link>
        </div>

        <div className="space-y-3">
          {homepageFaq.map((item) => (
            <details
              key={item.q}
              className="card group open:border-[var(--accent-border)]"
            >
              <summary className="cursor-pointer list-none px-4 py-4 text-sm font-medium text-white sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-[var(--text-dim)] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--text-muted)] sm:px-5">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
