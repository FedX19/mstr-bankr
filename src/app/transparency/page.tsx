import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import {
  getMemeContractDisplay,
  getPairLabel,
  getQuoteAsset,
  siteConfig,
} from "../../lib/config";
import { feePolicyPublic } from "../../lib/content";

export const metadata: Metadata = {
  title: `Transparency — ${siteConfig.projectName}`,
  description: `Official status, contracts, and verification details for ${siteConfig.projectName}.`,
};

export default function TransparencyPage() {
  const quote = getQuoteAsset();

  const rows: { label: string; value: string; mono?: boolean }[] = [
    {
      label: "Status",
      value: siteConfig.launchStatus === "live" ? "Live" : "Prelaunch",
    },
    {
      label: "Official token",
      value:
        siteConfig.memeTokenAddress != null ? "Deployed" : "Not deployed",
    },
    {
      label: "Official contract",
      value: getMemeContractDisplay(),
      mono: true,
    },
    {
      label: "Proposed pair",
      value: getPairLabel(),
    },
    {
      label: "Pair status",
      value: siteConfig.pairStatus,
    },
    {
      label: `Quote asset (${quote.symbol})`,
      value: quote.address ?? "—",
      mono: true,
    },
    {
      label: "Pool address",
      value: siteConfig.poolAddress ?? "Not available",
      mono: true,
    },
    {
      label: "Fee beneficiary",
      value: siteConfig.feeBeneficiary ?? "Announced at launch if applicable",
      mono: true,
    },
    {
      label: "Deployment transaction",
      value: siteConfig.deploymentTx ?? "Not available",
      mono: true,
    },
    { label: "Presale", value: "None planned" },
    { label: "Creator allocation", value: "None planned" },
    {
      label: "Platform",
      value: `${siteConfig.platformName}, ${siteConfig.platformStatus}`,
    },
    {
      label: "Chain",
      value: `${siteConfig.chainName} (${siteConfig.chainId})`,
    },
    {
      label: "Explorer",
      value: siteConfig.explorerUrl,
    },
  ];

  return (
    <PageShell>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Transparency
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Status & verification
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
        Use this page to confirm what is official. Never trust a ticker or a
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

      <div className="card mt-6 border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-5">
        <p className="text-sm font-medium text-[var(--negative)]">
          Impersonation warning
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Do not trust any contract unless it is published on this official site
          and the official social account. Prelaunch: there is no official{" "}
          {siteConfig.projectName} token. Do not send funds to addresses that
          claim to represent this project.
        </p>
      </div>

      <section className="prose-section mt-10">
        <h2>Fee policy (if live)</h2>
        <p>{feePolicyPublic.summary}</p>
        <ul>
          {feePolicyPublic.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm text-[var(--text-dim)]">
        <Link href="/risks" className="text-[var(--accent)] hover:opacity-85">
          Read full risks
        </Link>
        {" · "}
        <Link href="/faq" className="text-[var(--accent)] hover:opacity-85">
          FAQ
        </Link>
      </p>
    </PageShell>
  );
}
