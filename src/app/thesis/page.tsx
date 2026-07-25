import type { Metadata } from "next";
import Link from "next/link";
import { MascotFrame } from "../../components/MascotFrame";
import { PageShell } from "../../components/PageShell";
import {
  bearCase,
  bullCase,
  flywheelDisclaimer,
  flywheelSteps,
  invalidationConditions,
} from "../../lib/content";
import { siteConfig, strategyDataLabel } from "../../lib/config";

export const metadata: Metadata = {
  title: `Thesis — ${siteConfig.projectName}`,
  description: siteConfig.metaDescription,
};

export default function ThesisPage() {
  return (
    <PageShell>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Thesis
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {siteConfig.mainHeadline}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        {siteConfig.thesisLine} {siteConfig.primarySlogan}
      </p>
      <p className="mt-2 text-sm text-[var(--text-dim)]">
        {siteConfig.creed} — {siteConfig.communityName}.
      </p>

      <div className="not-prose relative mx-auto mt-8 max-w-xl">
        <MascotFrame
          src={siteConfig.brand.thesis}
          alt={siteConfig.brand.thesisAlt}
          blend="ambient"
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>The market&apos;s bearish view</h2>
        <p>
          Parts of the market have written off Bitcoin after a deep drawdown.
          Separately, parts of the market have written off Strategy (MSTR) as a
          broken capital engine — too levered, too complex, or too dependent on
          continuous access to equity and credit markets.
        </p>
        <p>
          In that framing, MSTR is reduced to risky levered beta: when Bitcoin
          falls, the equity story dies with it. The possibility that MSTR
          strength could again support capital formation — and, over time,
          Bitcoin demand — is discounted or ignored.
        </p>
      </section>

      <section className="prose-section">
        <h2>MSTR capital engine</h2>
        <p>
          Our thesis is that the market{" "}
          <strong>may be underestimating</strong> the relationship between MSTR,
          Strategy&apos;s access to capital, and future Bitcoin demand.
        </p>
        <p>
          A sustained MSTR recovery could improve Strategy&apos;s financing
          flexibility. If new capital is raised and deployed into Bitcoin, the
          capital engine may contribute to Bitcoin&apos;s next major move.
        </p>
        <p>
          This is a thesis, not a guaranteed causal chain. A higher MSTR price
          does not automatically cause Strategy to raise capital, buy Bitcoin, or
          move Bitcoin&apos;s price.
        </p>
        <p className="accent-line">{siteConfig.tagline}</p>
      </section>

      <section className="prose-section">
        <h2>The capital flywheel</h2>
        <ol>
          {flywheelSteps.map((step) => (
            <li key={step.id}>
              <strong>{step.title}.</strong> {step.body}
            </li>
          ))}
        </ol>
        <p>
          <strong>Disclaimer:</strong> {flywheelDisclaimer}
        </p>
      </section>

      <section className="prose-section">
        <h2>Bull case</h2>
        <ul>
          {bullCase.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>Bear case</h2>
        <ul>
          {bearCase.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>What would prove the thesis wrong</h2>
        <ul>
          {invalidationConditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>Market facts</h2>
        <p>
          Holdings, short interest, and other Strategy metrics must be published
          with a source and date. Current status:{" "}
          <strong>{strategyDataLabel()}</strong>
        </p>
      </section>

      <section className="prose-section">
        <h2>What ${siteConfig.ticker} is (and is not)</h2>
        <p>
          Roaring Stacker is an independent cultural meme. Primary pair: $
          {siteConfig.ticker} / tokenized MSTR on Bankr / {siteConfig.chainName}.
          Buying ${siteConfig.ticker} through the MSTR pair adds tokenized MSTR
          exposure to the pool. Not Strategy equity. Not Bitcoin. Not backed by
          MSTR. Not a claim on pool assets.
        </p>
        <p>{siteConfig.memeDisclaimer}</p>
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
          The stack never stops.
        </p>
        <p className="mt-4 text-lg font-semibold text-[var(--accent)]">
          We like the stock.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/terminal"
            className="text-sm font-medium text-[var(--accent)] hover:opacity-85"
          >
            Terminal →
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
