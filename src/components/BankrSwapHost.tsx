"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  explorerAddressUrl,
  getBankrUrl,
  getMemeContractDisplay,
  getPairLabel,
  isLive,
  siteConfig,
} from "../lib/config";
import { BrandMark } from "./BrandMark";

type Props = {
  /** Optional live price line for the chrome bar */
  priceLabel?: string;
};

/**
 * Hosts Bankr’s token page inside the app shell so the swap UX feels in-house.
 *
 * Bankr does not publish a white-label swap SDK for third-party sites.
 * This embeds their official token URL. Wallets/cookies may still require
 * opening Bankr full-screen on some browsers.
 */
export function BankrSwapHost({ priceLabel }: Props) {
  const live = isLive() && Boolean(siteConfig.memeTokenAddress);
  const bankrUrl = getBankrUrl();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "blocked">(
    "loading",
  );
  const [copied, setCopied] = useState(false);

  const onLoad = useCallback(() => {
    // If the iframe loaded an empty/error document, treat as blocked.
    // Cross-origin prevents reading content — use a soft ready state.
    setStatus((s) => (s === "blocked" ? s : "ready"));
  }, []);

  useEffect(() => {
    if (!live) return;
    const t = window.setTimeout(() => {
      // Still "loading" after 12s → likely framed/blocked or very slow
      setStatus((s) => (s === "loading" ? "blocked" : s));
    }, 12_000);
    return () => window.clearTimeout(t);
  }, [live]);

  async function copyContract() {
    if (!siteConfig.memeTokenAddress) return;
    try {
      await navigator.clipboard.writeText(siteConfig.memeTokenAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  if (!live) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-white">Swap not live yet</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          When ${siteConfig.ticker} is live, the Bankr swap will appear here.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-7rem)] flex-col">
      {/* App chrome — looks like an in-app swap header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark size="sm" glow />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  Swap ${siteConfig.ticker}
                </p>
                <span className="badge badge-live">Bankr</span>
              </div>
              <p className="truncate text-xs text-[var(--text-dim)]">
                {getPairLabel()}
                {priceLabel ? ` · ${priceLabel}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyContract}
              className="btn-ghost rounded-lg px-3 py-2 text-xs font-medium"
            >
              {copied ? "Copied CA" : "Copy contract"}
            </button>
            {siteConfig.memeTokenAddress ? (
              <a
                href={explorerAddressUrl(siteConfig.memeTokenAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost rounded-lg px-3 py-2 text-xs font-medium"
              >
                Explorer
              </a>
            ) : null}
            <a
              href={bankrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Open Bankr ↗
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-3 pb-3 sm:px-6">
          <p className="stat-value break-all text-[10px] text-[var(--text-dim)] sm:text-[11px]">
            Official CA: {getMemeContractDisplay()}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-[var(--text-dim)]">
            Trading runs on Bankr’s official interface, hosted inside this page.
            Always confirm the contract before approving a transaction.
          </p>
        </div>
      </div>

      {/* Hosted Bankr surface */}
      <div className="relative flex-1 bg-[#0b0b0f]">
        {status === "loading" ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--bg)]/90 px-4">
            <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[var(--accent-border)] border-t-[var(--accent)]" />
            <p className="text-sm text-[var(--text-muted)]">
              Loading Bankr swap…
            </p>
          </div>
        ) : null}

        {status === "blocked" ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg)] px-4">
            <div className="card max-w-md p-6 text-center">
              <p className="text-base font-semibold text-white">
                Bankr needs a full window
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Your browser or Bankr is blocking the embedded swap (common with
                wallets and third-party cookies). Open Bankr full-screen to
                finish the trade — same official ${siteConfig.ticker} page.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <a
                  href={bankrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold"
                >
                  Open Bankr swap
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("loading");
                    if (iframeRef.current) {
                      iframeRef.current.src = bankrUrl;
                    }
                  }}
                  className="btn-ghost inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium"
                >
                  Retry embed
                </button>
              </div>
              <p className="mt-4 text-xs text-[var(--text-dim)]">
                Contract: {getMemeContractDisplay()}
              </p>
            </div>
          </div>
        ) : null}

        <iframe
          ref={iframeRef}
          title={`Bankr swap — $${siteConfig.ticker}`}
          src={bankrUrl}
          onLoad={onLoad}
          className="h-[min(85svh,900px)] w-full border-0 bg-[#0b0b0f] sm:h-[calc(100svh-11rem)]"
          // Permissions needed for wallet connect / popups inside Bankr
          allow="clipboard-read; clipboard-write; ethereum; publickey-credentials-get"
          // sandbox deliberately omitted — Bankr needs full app capabilities;
          // using referrerpolicy + our chrome for trust UI instead
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-center sm:px-6">
        <p className="text-[11px] leading-relaxed text-[var(--text-dim)]">
          ${siteConfig.ticker} is highly speculative. This site does not custody
          funds. Swaps are executed through Bankr.{" "}
          <Link href="/risks" className="text-[var(--accent)] hover:opacity-85">
            Risks
          </Link>
          {" · "}
          <Link href="/buy" className="text-[var(--accent)] hover:opacity-85">
            Beginner guide
          </Link>
        </p>
      </div>
    </div>
  );
}
