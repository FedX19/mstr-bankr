import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import {
  bearCase,
  bullCase,
  flywheelDisclaimer,
  flywheelSteps,
  invalidationConditions,
} from "../../lib/content";
import { siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Full Thesis — ${siteConfig.projectName}`,
  description: siteConfig.metaDescription,
};

export default function ThesisPage() {
  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {siteConfig.projectName} Thesis
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {siteConfig.primarySlogan}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        {siteConfig.thesisLine} {siteConfig.catalystLine}
      </p>
      <p className="mt-3 text-sm text-[var(--text-dim)]">
        {siteConfig.creed} — {siteConfig.communityName}.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>The market&apos;s bearish view</h2>
        <p>
          Parts of the market have written off Bitcoin after a deep and painful
          drawdown. Separately, parts of the market have written off Strategy
          (MSTR) as a broken capital engine — too levered, too complex, or too
          dependent on continuous access to equity and credit markets.
        </p>
        <p>
          In that framing, MSTR is often reduced to a risky levered beta trade:
          when Bitcoin falls, the equity story supposedly dies with it. The
          possibility that MSTR strength could again support capital formation
          and, over time, Bitcoin demand is discounted or ignored.
        </p>
      </section>

      <section className="prose-section">
        <h2>Our disagreement</h2>
        <p>
          Our thesis is that the market{" "}
          <strong>may be underestimating</strong> the relationship between MSTR,
          Strategy&apos;s access to capital, and future Bitcoin demand.
        </p>
        <p>
          Bitcoin has been written off. MSTR&apos;s capital engine has been
          written off. The Roaring Stacker thesis is that the market may have
          both wrong.
        </p>
        <p>
          This is a thesis, not a guaranteed causal chain. A higher MSTR price
          does not automatically cause Strategy to raise capital, buy Bitcoin, or
          move Bitcoin&apos;s price. Outcomes depend on financing conditions,
          management decisions, Bitcoin prices, investor demand, and Strategy&apos;s
          obligations.
        </p>
        <p className="accent-line">{siteConfig.tagline}</p>
      </section>

      <section className="prose-section">
        <h2>The MSTR–Bitcoin flywheel</h2>
        <p>Potential sequence (if conditions allow):</p>
        <ol>
          {flywheelSteps.map((step) => (
            <li key={step.id}>
              <strong>{step.title}.</strong> {step.body}
            </li>
          ))}
        </ol>
        <p>
          Then the cycle may strengthen again —{" "}
          <em>if</em> each link holds. That is the core of the Stacker view:
          MSTR is the stock; Bitcoin is the stack; the stock{" "}
          <em>may</em> be capable of restarting the stack.
        </p>
        <p>
          <strong>Disclaimer:</strong> {flywheelDisclaimer}
        </p>
      </section>

      <section className="prose-section">
        <h2>Why the setup may matter now</h2>
        <p>
          When both Bitcoin and the corporate treasury narrative are deeply
          discounted, the asymmetric question is not whether every path works —
          it is whether the market has fully priced the possibility that capital
          markets and Bitcoin demand could reinforce each other again.
        </p>
        <p>
          Roaring Stacker is a Bitcoin-native cultural meme around that debate.
          It is not Strategy equity, not Bitcoin ownership, and not a claim on
          any treasury or pool.
        </p>
      </section>

      <section className="prose-section">
        <h2>What could go right</h2>
        <ul>
          {bullCase.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>What could go wrong</h2>
        <ul>
          {bearCase.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>Clear invalidation conditions</h2>
        <p>
          The thesis weakens materially if several of the following persist:
        </p>
        <ul>
          {invalidationConditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>What Roaring Stacker is (and is not)</h2>
        <p>
          Roaring Stacker is an independent cultural meme. Working ticker: $
          {siteConfig.ticker}. Community: {siteConfig.communityName}. Proposed
          primary market: {siteConfig.proposedPair}. The pair is not yet
          confirmed. No official token is live.
        </p>
        <p>
          It is not Strategy stock, not Bitcoin, not redeemable for MSTR, not
          backed by a holder-owned reserve, and not affiliated with Strategy,
          Michael Saylor, Keith Gill, Robinhood, or Bankr.
        </p>
      </section>

      <div className="card mt-12 border-[var(--accent-border)] bg-[var(--accent-soft)] p-6">
        <p className="text-base leading-relaxed text-white">
          We are not waiting for the breakout to discover the thesis.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
          MSTR is the stock.
          <br />
          Bitcoin is the stack.
          <br />
          The stock may be capable of restarting the stack.
        </p>
        <p className="mt-4 text-lg font-semibold text-[var(--accent)]">
          We like the stock.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            See how it works →
          </Link>
          <Link
            href="/risks"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-white"
          >
            Risks
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
