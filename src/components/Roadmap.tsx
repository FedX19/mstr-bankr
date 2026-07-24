const phases = [
  {
    phase: "Phase 1",
    status: "Current",
    title: "Narrative + fee recycling",
    body: "Launch the token (non-paired). Collect creator fees. Allocate a fixed percentage to buying tokenized MSTR. Publish every purchase. Own the Roaring Saylor narrative early.",
    current: true,
  },
  {
    phase: "Phase 2",
    status: "Next",
    title: "Stock-paired upgrade",
    body: "When Bankr liquidity allows, path to a true stock-paired version. Door remains open; Phase 1 compounds either way.",
    current: false,
  },
  {
    phase: "Ongoing",
    status: "Always",
    title: "Transparent accumulation",
    body: "Public purchase log. Trackable fee → treasury recycling. Dashboard as the single source of truth for the story.",
    current: false,
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="card-label mb-2">Roadmap</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Build in the open
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {phases.map((p) => (
            <div
              key={p.phase}
              className={`card p-5 ${
                p.current ? "border-[var(--accent-border)]" : ""
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                  {p.phase}
                </span>
                <span className={p.current ? "badge badge-accent" : "badge"}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
