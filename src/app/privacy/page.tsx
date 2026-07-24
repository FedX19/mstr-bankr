import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import { siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Privacy — ${siteConfig.projectName}`,
  description:
    "Privacy practices for the Roaring Saylor website. Minimal data collection; no seed phrases; no unnecessary location logging.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Privacy
      </h1>
      <p className="mt-4 text-sm text-[var(--text-dim)]">
        Last updated: July 24, 2026.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>1. Overview</h2>
        <p>
          This site is a public research and product dashboard. We aim to
          collect as little personal data as practical.
        </p>
      </section>

      <section className="prose-section">
        <h2>2. What we do not collect</h2>
        <ul>
          <li>Seed phrases or private keys (never request them)</li>
          <li>Presale deposits or investor commitment forms</li>
          <li>Unnecessary precise GPS location for curiosity tracking</li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>3. What may be processed</h2>
        <ul>
          <li>
            Standard web logs and hosting telemetry (IP address, user agent,
            request paths) via the hosting provider (e.g. Vercel)
          </li>
          <li>
            Optional analytics if enabled later — configured to minimize
            personal data
          </li>
          <li>
            Coarse jurisdiction signals only if required to gate stock-paired
            trading routes after launch (not for marketing surveillance)
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>4. Third parties</h2>
        <p>
          The site may link to Blockscout, Bankr, social platforms, RPC
          providers, and market-data sources. Their privacy policies apply when
          you leave this site.
        </p>
      </section>

      <section className="prose-section">
        <h2>5. Cookies</h2>
        <p>
          Essential cookies or local storage may be used for site operation.
          Non-essential tracking will not be added without updating this page.
        </p>
      </section>

      <section className="prose-section">
        <h2>6. Children</h2>
        <p>
          This site is not directed at children under 13 (or the applicable age
          in your jurisdiction).
        </p>
      </section>

      <section className="prose-section">
        <h2>7. Changes</h2>
        <p>
          We may update this policy as the product evolves. Material changes will
          be reflected by the date above.
        </p>
      </section>

      <section className="prose-section">
        <h2>8. Contact</h2>
        <p>
          For privacy questions, use official project channels once published on
          the Transparency page.
        </p>
      </section>
    </PageShell>
  );
}
