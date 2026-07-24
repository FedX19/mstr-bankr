import Link from "next/link";
import { publicTimeline, whatToExpect } from "../lib/content";

const statusBadge = {
  current: "badge badge-live",
  next: "badge badge-accent",
  later: "badge",
} as const;

/**
 * Consumer timeline — no internal gates or operator checklists.
 */
export function WhatsNext() {
  return (
    <section id="whats-next" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="card-label mb-2">Status</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What’s next
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Roaring Saylor is in prelaunch. Here’s what that means for you.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {publicTimeline.map((step) => (
            <div
              key={step.id}
              className={`card p-4 sm:p-5 ${
                step.status === "current"
                  ? "border-[var(--accent-border)]"
                  : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                  {step.label}
                </span>
                <span className={statusBadge[step.status]}>
                  {step.status === "current"
                    ? "Now"
                    : step.status === "next"
                      ? "Next"
                      : "Later"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {whatToExpect.map((item) => (
            <div key={item.title} className="card p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-dim)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--text-dim)]">
          Questions?{" "}
          <Link href="/faq" className="text-[var(--accent)] hover:opacity-85">
            Read the FAQ
          </Link>
          {" · "}
          <Link href="/risks" className="text-[var(--accent)] hover:opacity-85">
            Risks
          </Link>
        </p>
      </div>
    </section>
  );
}
