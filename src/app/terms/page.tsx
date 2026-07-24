import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import { siteConfig } from "../../lib/config";

export const metadata: Metadata = {
  title: `Terms — ${siteConfig.projectName}`,
  description:
    "Terms of use for the Roaring Saylor website and prelaunch product materials.",
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
        Last updated: July 24, 2026. These terms govern use of this website and
        related public materials. They are not a substitute for counsel review
        before token launch.
      </p>

      <hr className="section-rule my-10" />

      <section className="prose-section">
        <h2>1. Acceptance</h2>
        <p>
          By accessing this site you agree to these terms. If you do not agree,
          do not use the site.
        </p>
      </section>

      <section className="prose-section">
        <h2>2. Nature of the project</h2>
        <p>
          Roaring Saylor is an independent cultural project. During prelaunch
          there is no official token contract. Any third-party token claiming to
          represent this project is unauthorized.
        </p>
        <p>{siteConfig.nonAffiliation}</p>
      </section>

      <section className="prose-section">
        <h2>3. No offer of securities or investment advice</h2>
        <p>
          Nothing on this site is an offer to sell, or a solicitation to buy,
          any security, investment contract, or financial product. Content is
          informational and cultural. It is not investment, legal, tax, or
          accounting advice. You are solely responsible for your own decisions
          and compliance with applicable law.
        </p>
      </section>

      <section className="prose-section">
        <h2>4. Token and market risks</h2>
        <p>{siteConfig.riskStatement}</p>
      </section>

      <section className="prose-section">
        <h2>5. Jurisdictional restrictions</h2>
        <p>
          Robinhood Stock Tokens are not registered under U.S. securities laws
          and may not be offered, sold, or delivered in the United States or to
          U.S. persons. Other jurisdictions may restrict access. You must
          determine your eligibility. Do not use tools to evade location checks.
        </p>
      </section>

      <section className="prose-section">
        <h2>6. No custody or execution on this site (Version 1)</h2>
        <p>
          This website does not custody user assets, request seed phrases, or
          execute swaps in Version 1. Any future trading link will route to an
          approved third-party interface after launch gates clear. You interact
          with third-party protocols at your own risk.
        </p>
      </section>

      <section className="prose-section">
        <h2>7. Accuracy of information</h2>
        <p>
          Market figures, research notes, and dashboard metrics may be delayed,
          incomplete, or incorrect. Onchain data and primary filings control.
          We may update content without notice.
        </p>
      </section>

      <section className="prose-section">
        <h2>8. Intellectual property</h2>
        <p>
          Original site content, branding, and graphics are owned by the project
          operators or licensed to them. Third-party names and trademarks belong
          to their respective owners and are used only for identification or
          commentary.
        </p>
      </section>

      <section className="prose-section">
        <h2>9. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the project operators are not
          liable for any loss or damage arising from use of this site, reliance
          on its content, or interaction with any related token, pool, or third
          party. Use is at your own risk.
        </p>
      </section>

      <section className="prose-section">
        <h2>10. Changes</h2>
        <p>
          We may revise these terms. Continued use after changes constitutes
          acceptance of the revised terms.
        </p>
      </section>

      <section className="prose-section">
        <h2>11. Contact</h2>
        <p>
          Official updates will be published on this website and verified social
          channels once reserved. Do not send funds to any address that is not
          listed on the Transparency page.
        </p>
      </section>
    </PageShell>
  );
}
