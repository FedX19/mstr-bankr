import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import {
  bankrOpenQuestions,
  feePolicy,
  launchConfig,
  launchGates,
  roadmapPhases,
} from "../../lib/launch";
import { siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Roadmap — ${siteConfig.projectName}`,
  description:
    "Roaring Saylor path to token launch: phases, hard gates, Bankr configuration, and what remains human-approved only.",
};

const phaseLabel = {
  complete: "Complete",
  current: "Current",
  next: "Next",
  later: "Later",
} as const;

const gateLabel = {
  done: "Done",
  in_progress: "In progress",
  pending: "Pending",
  human: "Human gate",
} as const;

export default function RoadmapPage() {
  const open = launchGates.filter((g) => g.status !== "done");

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Launch plan
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Roadmap to token launch
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Complete the public product in prelaunch. Deploy the token only after
        every hard gate is satisfied. This page is the operating checklist.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>Current status</h2>
        <p>
          <strong>Launch status:</strong> {siteConfig.launchStatus.toUpperCase()}
          . <strong>Trading:</strong>{" "}
          {siteConfig.tradingEnabled ? "enabled" : "disabled"}. Official meme
          contract: <strong>not live</strong>.
        </p>
        <p>
          Website readiness is complete. Remaining work is operational and legal
          — not more marketing pages.
        </p>
        {open.length > 0 ? (
          <div className="card mt-4 border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
            <p className="text-sm text-[var(--text-muted)]">
              <strong className="text-white">Still open:</strong>{" "}
              {open.map((g) => g.title).join(" · ")}
            </p>
          </div>
        ) : (
          <div className="card mt-4 border-[rgba(34,197,94,0.35)] bg-[var(--positive-soft)] p-4">
            <p className="text-sm text-[var(--positive)]">
              All documented gates marked complete. Human may authorize Bankr
              deployment.
            </p>
          </div>
        )}
      </section>

      <section className="prose-section">
        <h2>Phases</h2>
        <div className="mt-4 space-y-4">
          {roadmapPhases.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
                  {p.phase}
                </p>
                <span
                  className={
                    p.status === "complete"
                      ? "badge badge-accent"
                      : p.status === "current"
                        ? "badge badge-live"
                        : "badge"
                  }
                >
                  {phaseLabel[p.status]}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{p.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {p.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-[var(--text-dim)]"
                  >
                    <span className="text-[var(--accent)]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="prose-section">
        <h2>Hard launch gates</h2>
        <p>
          The token remains PRELAUNCH until every mandatory gate is satisfied.
        </p>
        <div className="mt-4 space-y-4">
          {launchGates.map((g) => (
            <div key={g.id} className="card p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-white">{g.title}</h3>
                <span
                  className={
                    g.status === "done"
                      ? "badge badge-live"
                      : g.status === "in_progress"
                        ? "badge badge-accent"
                        : "badge"
                  }
                >
                  {gateLabel[g.status]}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{g.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {g.details.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-[var(--text-dim)]">
                    <span className="text-[var(--accent)]">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="prose-section">
        <h2>Intended Bankr launch settings</h2>
        <div className="card overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {Object.entries(launchConfig).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between sm:gap-6 sm:px-5"
              >
                <p className="card-label shrink-0 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-sm text-white sm:text-right">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prose-section">
        <h2>Creator-fee policy</h2>
        <p>{feePolicy.publicPolicy}</p>
        <h3>Fees may fund</h3>
        <ul>
          {feePolicy.mayFund.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>We will not promise</h3>
        <ul>
          {feePolicy.willNotPromise.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          <em>{feePolicy.feeDenominationNote}</em>
        </p>
      </section>

      <section className="prose-section">
        <h2>Questions for Bankr (before deploy)</h2>
        <ol>
          {bankrOpenQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>

      <section className="prose-section">
        <h2>When is it time to launch?</h2>
        <p>
          Only when Gates 1–6 are all done, a human approves Bankr deployment,
          and the official contract is published on the Transparency page before
          any trade link goes live.
        </p>
        <p>
          If MSTR fails liquidity thresholds, use the same architecture with{" "}
          <strong>COIN</strong> as the first fallback — change{" "}
          <code className="stat-value text-xs text-[var(--accent)]">
            quoteAssetKey
          </code>{" "}
          in config, not the whole site.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/transparency"
          className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
        >
          Transparency →
        </Link>
        <Link
          href="/risks"
          className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
        >
          Risks →
        </Link>
        <Link
          href="/how-it-works"
          className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
        >
          How it works →
        </Link>
      </div>
    </PageShell>
  );
}
