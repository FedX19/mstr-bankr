import Link from "next/link";
import { launchGates, roadmapPhases } from "../lib/launch";

const phaseStyles = {
  complete: "border-[var(--accent-border)] bg-[var(--accent-soft)]",
  current: "border-[var(--accent-border)]",
  next: "",
  later: "opacity-90",
} as const;

const statusBadge = {
  complete: "badge badge-accent",
  current: "badge badge-live",
  next: "badge",
  later: "badge",
} as const;

const statusLabel = {
  complete: "Complete",
  current: "Current",
  next: "Next",
  later: "Later",
} as const;

const gateBadge = {
  done: "badge badge-live",
  in_progress: "badge badge-accent",
  pending: "badge",
  human: "badge",
} as const;

const gateLabel = {
  done: "Done",
  in_progress: "In progress",
  pending: "Pending",
  human: "Human gate",
} as const;

export function RoadmapSection() {
  const openGates = launchGates.filter((g) => g.status !== "done");

  return (
    <section id="roadmap" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Roadmap</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Path to token launch
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Website and product packaging are complete. Token deployment stays
              blocked until Bankr, legal, liquidity, security, and brand gates
              clear.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Full roadmap →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {roadmapPhases.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className={`card p-4 sm:p-5 ${phaseStyles[p.status]}`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                  {p.phase}
                </span>
                <span className={statusBadge[p.status]}>
                  {statusLabel[p.status]}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {p.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="card-label mb-3">Launch gates</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {launchGates.map((g) => (
              <div key={g.id} className="card p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white">{g.title}</p>
                  <span className={gateBadge[g.status]}>
                    {gateLabel[g.status]}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-dim)]">
                  {g.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {openGates.length > 0 ? (
          <div className="card mt-6 border-[var(--accent-border)] bg-[var(--accent-soft)] p-5">
            <p className="text-sm font-medium text-white">
              Token launch is not authorized yet
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Remaining:{" "}
              {openGates.map((g) => g.title.replace(/^Gate \d+ — /, "")).join(" · ")}
              . No official contract, presale, or trade route until every gate is
              done.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
