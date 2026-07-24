import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import {
  getMemeContractDisplay,
  getQuoteAsset,
  siteConfig,
} from "../../lib/config";
import { feePolicyPublic } from "../../lib/content";

export const metadata: Metadata = {
  title: `Transparency — ${siteConfig.projectName}`,
  description:
    "Official contracts, fees, and verification details for Roaring Saylor.",
};

export default function TransparencyPage() {
  const quote = getQuoteAsset();

  const rows: { label: string; value: string; mono?: boolean }[] = [
    {
      label: "Status",
      value: "Prelaunch — no official token yet",
    },
    {
      label: "Official meme contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: `Canonical ${quote.symbol} Stock Token`,
      value: quote.address ?? "—",
      mono: true,
    },
    {
      label: "Pool address",
      value: siteConfig.poolAddress ?? "Not live yet",
      mono: true,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "Announced at launch",
      mono: true,
    },
    {
      label: "Deployment transaction",
      value: siteConfig.deploymentTx ?? "Not live yet",
      mono: true,
    },
    { label: "Creator allocation", value: "None" },
    { label: "Creator vesting", value: "None" },
    { label: "Presale", value: "None" },
    {
      label: "Swap fee",
      value: `${siteConfig.tradingFeeBps / 100}% (standard launch structure)`,
    },
    {
      label: "Network",
      value: siteConfig.chain.chainName,
    },
    {
      label: "Explorer",
      value: siteConfig.chain.explorerUrl,
    },
  ];

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Transparency
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Contracts & verification
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Use this page to confirm official addresses. Never trust a ticker or a
        random link alone.
      </p>

      <hr className="section-rule my-10" />

      <div className="card overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5"
            >
              <p className="card-label shrink-0 sm:max-w-[40%]">{row.label}</p>
              <p
                className={`text-sm text-white sm:text-right ${
                  row.mono ? "stat-value break-all text-xs sm:text-sm" : ""
                }`}
              >
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="prose-section mt-10">
        <h2>Before you trade</h2>
        <ul>
          <li>Confirm you are on this official website.</li>
          <li>
            Match the meme contract and {quote.symbol} address to this page.
          </li>
          <li>
            Open the explorer links and double-check the address character by
            character.
          </li>
          <li>
            Ignore lookalike tokens, DMs, and “early launch” contracts.
          </li>
        </ul>
      </section>

      <section className="prose-section">
        <h2>Fees</h2>
        <p>{feePolicyPublic.summary}</p>
        <ul>
          {feePolicyPublic.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prose-section">
        <h2>Links</h2>
        <ul>
          <li>
            <a
              href={siteConfig.chain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Block explorer
            </a>
          </li>
          {siteConfig.bankrLaunchUrl ? (
            <li>
              <a
                href={siteConfig.bankrLaunchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                Official launch page
              </a>
            </li>
          ) : null}
          <li>
            <Link href="/risks" className="link-accent">
              Risks
            </Link>
          </li>
          <li>
            <Link href="/faq" className="link-accent">
              FAQ
            </Link>
          </li>
        </ul>
      </section>

      <div className="card mt-8 border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-5">
        <p className="text-sm text-[var(--text-muted)]">
          Prelaunch: there is no official Roaring Saylor token. Do not send
          funds to any address that is not published on this page after launch.
        </p>
      </div>
    </PageShell>
  );
}
