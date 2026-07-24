import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import { siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Terms — ${siteConfig.projectName}`,
  description: `Terms of use for the ${siteConfig.projectName} website.`,
};

export default function TermsPage() {
  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Terms of use
      </h1>
      <p className="mt-4 text-sm text-[var(--text-dim)]">
        Last updated: July 24, 2026.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>1. Acceptance</h2>
        <p>
          By using this site you agree to these terms. If you do not agree, do
          not use the site.
        </p>
      </section>

      <section className="prose-section">
        <h2>2. About the project</h2>
        <p>
          Roaring Saylor is an independent cultural project. During prelaunch
          there is no official token. Any third-party token claiming to represent
          this project is unauthorized.
        </p>
        <p>{siteConfig.nonAffiliation}</p>
      </section>

      <section className="prose-section">
        <h2>3. No investment advice</h2>
        <p>
          Nothing on this site is investment, legal, tax, or accounting advice,
          or an offer to sell any security. Content is informational and cultural.
          You are responsible for your own decisions and for following applicable
          law.
        </p>
      </section>

      <section className="prose-section">
        <h2>4. Risks</h2>
        <p>{siteConfig.riskStatement}</p>
      </section>

      <section className="prose-section">
        <h2>5. Jurisdictional limits</h2>
        <p>
          Tokenized stock products related to this market may be unavailable in
          the United States and other places. You must determine your own
          eligibility. Do not try to evade location rules.
        </p>
      </section>

      <section className="prose-section">
        <h2>6. No custody on this site</h2>
        <p>
          This website does not hold your assets or ask for seed phrases. Any
          trading happens through third-party interfaces after launch. You use
          those services at your own risk.
        </p>
      </section>

      <section className="prose-section">
        <h2>7. Accuracy</h2>
        <p>
          Information can be delayed or incomplete. Always verify contracts and
          balances yourself. We may update content without notice.
        </p>
      </section>

      <section className="prose-section">
        <h2>8. Intellectual property</h2>
        <p>
          Original site content and branding belong to the project operators or
          their licensors. Third-party names and trademarks belong to their
          owners.
        </p>
      </section>

      <section className="prose-section">
        <h2>9. Limitation of liability</h2>
        <p>
          To the fullest extent allowed by law, the project operators are not
          liable for losses from using this site, relying on its content, or
          interacting with any related token or third party. Use is at your own
          risk.
        </p>
      </section>

      <section className="prose-section">
        <h2>10. Changes</h2>
        <p>
          We may update these terms. Continued use after changes means you accept
          the updated terms.
        </p>
      </section>
    </PageShell>
  );
}
