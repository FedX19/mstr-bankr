"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  explorerAddressUrl,
  getBankrUrl,
  getMemeContractDisplay,
  getPairLabel,
  isLive,
  siteConfig,
} from "../lib/config";
import {
  beginnerFaqs,
  buyReadiness,
  buySteps,
  robinhoodChainWalletParams,
} from "../lib/buy-guide";
import { formatNumber, formatUsd } from "../lib/format";
import { BrandMark } from "./BrandMark";
import { StockTokenMark } from "./StockTokenMark";

type Props = {
  priceUsd: number | null;
  priceChange24hPct: number | null;
  liquidityUsd: number | null;
};

type StepId = "eligible" | "verify" | "setup" | "swap";

const steps: { id: StepId; label: string }[] = [
  { id: "eligible", label: "1 · Eligible?" },
  { id: "verify", label: "2 · Verify" },
  { id: "setup", label: "3 · Setup" },
  { id: "swap", label: "4 · Buy" },
];

export function BeginnerBuy({
  priceUsd,
  priceChange24hPct,
  liquidityUsd,
}: Props) {
  const live = isLive() && Boolean(siteConfig.memeTokenAddress);
  const [step, setStep] = useState<StepId>("eligible");
  const [eligible, setEligible] = useState(false);
  const [verified, setVerified] = useState(false);
  const [usdAmount, setUsdAmount] = useState("50");
  const [copied, setCopied] = useState(false);
  const [walletMsg, setWalletMsg] = useState<string | null>(null);

  const contract = getMemeContractDisplay();
  const bankrUrl = getBankrUrl();

  const usdNum = Number.parseFloat(usdAmount.replace(/,/g, ""));
  const spendUsd =
    Number.isFinite(usdNum) && usdNum > 0 ? usdNum : null;

  const estTokens = useMemo(() => {
    if (spendUsd == null || priceUsd == null || priceUsd <= 0) return null;
    // Rough estimate only — ignore fees/slippage
    return spendUsd / priceUsd;
  }, [spendUsd, priceUsd]);

  const canAdvanceFromEligible = eligible;
  const canAdvanceFromVerify = verified;
  const readyForBankr = live && eligible && verified;

  async function copyContract() {
    if (!siteConfig.memeTokenAddress) return;
    try {
      await navigator.clipboard.writeText(siteConfig.memeTokenAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function addRobinhoodChain() {
    setWalletMsg(null);
    const eth = (
      window as unknown as {
        ethereum?: {
          request: (args: {
            method: string;
            params?: unknown[];
          }) => Promise<unknown>;
        };
      }
    ).ethereum;

    if (!eth) {
      setWalletMsg(
        "No browser wallet detected. Install MetaMask, Rainbow, or Coinbase Wallet — or use Robinhood Wallet on mobile.",
      );
      return;
    }

    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: robinhoodChainWalletParams.chainId }],
      });
      setWalletMsg("Wallet is on Robinhood Chain. You’re ready for the next step.");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code: number }).code
          : null;
      // 4902 = chain not added
      if (code === 4902) {
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [robinhoodChainWalletParams],
          });
          setWalletMsg("Robinhood Chain added. Switch to it, then continue.");
        } catch {
          setWalletMsg(
            "Could not add the network automatically. Add Robinhood Chain manually in your wallet settings (chain ID 4663).",
          );
        }
      } else if (code === 4001) {
        setWalletMsg("Request cancelled in your wallet.");
      } else {
        setWalletMsg(
          "Could not switch networks. Add Robinhood Chain manually (chain ID 4663) if needed.",
        );
      }
    }
  }

  function goNext() {
    if (step === "eligible" && canAdvanceFromEligible) setStep("verify");
    else if (step === "verify" && canAdvanceFromVerify) setStep("setup");
    else if (step === "setup") setStep("swap");
  }

  function goBack() {
    if (step === "verify") setStep("eligible");
    else if (step === "setup") setStep("verify");
    else if (step === "swap") setStep("setup");
  }

  if (!live) {
    return (
      <div className="card border-[var(--accent-border)] bg-[var(--accent-soft)] p-6 text-center">
        <p className="text-sm font-medium text-white">Buying isn’t open yet</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          There is no official live market to swap on this site right now.
          Check back when the status bar says Live.
        </p>
        <Link
          href="/thesis"
          className="btn-primary mt-5 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Read the thesis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="max-w-2xl">
        <p className="card-label mb-2">For beginners</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Buy ${siteConfig.ticker}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
          New to crypto? We’ll walk you through it. You stay in control of your
          wallet the whole time — this site never holds your funds or asks for a
          seed phrase.
        </p>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Pair: {getPairLabel()} · Swaps complete on {siteConfig.platformName}
        </p>
      </div>

      {/* Step tabs */}
      <div
        className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Buy steps"
      >
        {steps.map((s) => {
          const active = s.id === step;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStep(s.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]"
                  : "border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step panels */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="card p-5 sm:p-6">
          {step === "eligible" ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">
                Are you allowed to trade this pair?
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                The primary market uses tokenized MSTR. Those products are{" "}
                <strong className="text-white">not available in the United States</strong>{" "}
                or to U.S. persons, and may be restricted elsewhere.
              </p>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li className="flex gap-2">
                  <span className="text-[var(--accent)]">·</span>
                  Do not use a VPN to pretend you’re somewhere else.
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--accent)]">·</span>
                  You are responsible for following the laws where you live.
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--accent)]">·</span>
                  Reading this site is fine either way; trading may not be.
                </li>
              </ul>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  checked={eligible}
                  onChange={(e) => setEligible(e.target.checked)}
                />
                <span className="text-sm text-[var(--text-muted)]">
                  I understand eligibility rules and believe I am allowed to
                  participate where I live.
                </span>
              </label>
            </div>
          ) : null}

          {step === "verify" ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">
                Verify the official ${siteConfig.ticker} contract
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Only this address is official. If a chat, ad, or “helper” sends a
                different one, ignore it.
              </p>
              <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
                <p className="card-label mb-2">Official contract</p>
                <p className="stat-value break-all text-sm text-white">
                  {contract}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyContract}
                    className="btn-ghost rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    {copied ? "Copied" : "Copy address"}
                  </button>
                  {siteConfig.memeTokenAddress ? (
                    <a
                      href={explorerAddressUrl(siteConfig.memeTokenAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      Open in explorer
                    </a>
                  ) : null}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <span className="text-sm text-[var(--text-muted)]">
                  I checked that the contract on Bankr will match this official
                  address.
                </span>
              </label>
            </div>
          ) : null}

          {step === "setup" ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">
                Get ready in 4 pieces
              </h2>
              <div className="space-y-3">
                {buyReadiness.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[var(--border)] p-4"
                  >
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                      {item.body}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-dim)]">
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRobinhoodChain}
                className="btn-ghost w-full rounded-lg px-4 py-3 text-sm font-medium sm:w-auto"
              >
                Add / switch to Robinhood Chain
              </button>
              {walletMsg ? (
                <p className="text-sm text-[var(--text-muted)]">{walletMsg}</p>
              ) : null}
              <p className="text-xs text-[var(--text-dim)]">
                Network: {siteConfig.chain.chainName} · Chain ID{" "}
                {siteConfig.chain.chainId} · Currency: ETH
              </p>
            </div>
          ) : null}

          {step === "swap" ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">
                Estimate, then buy on Bankr
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                This is a rough estimate using the latest public price. Your
                final amount is set when you confirm the trade on Bankr.
              </p>

              {!readyForBankr ? (
                <div className="rounded-lg border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[var(--text-muted)]">
                  Finish steps 1 and 2 (eligibility + contract check) before
                  opening Bankr.
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="card-label">You spend (approx. USD)</p>
                    <span className="text-xs text-[var(--text-dim)]">Guide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-[var(--text-dim)]">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={usdAmount}
                      onChange={(e) =>
                        setUsdAmount(e.target.value.replace(/[^\d.]/g, ""))
                      }
                      className="stat-value w-full bg-transparent text-3xl font-medium text-white outline-none"
                      aria-label="USD amount to spend"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["25", "50", "100", "250"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setUsdAmount(v)}
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-dim)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                      >
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-dim)]">
                    ↓ estimate
                  </span>
                </div>

                <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="card-label text-[var(--accent)]">
                      You may receive
                    </p>
                    <div className="flex items-center gap-2">
                      <BrandMark size="xs" />
                      <span className="text-xs font-medium text-white">
                        ${siteConfig.ticker}
                      </span>
                    </div>
                  </div>
                  <p className="stat-value text-3xl font-medium text-white">
                    {estTokens != null
                      ? formatNumber(estTokens, {
                          digits: estTokens < 1 ? 4 : 2,
                          compact: estTokens >= 1_000_000,
                        })
                      : "—"}
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-dim)]">
                    {priceUsd != null
                      ? `Based on ~${formatUsd(priceUsd, { digits: priceUsd < 0.01 ? 6 : 4 })} per token`
                      : "Live price unavailable — open Bankr for a live quote"}
                    {priceChange24hPct != null
                      ? ` · 24h ${priceChange24hPct >= 0 ? "+" : ""}${priceChange24hPct.toFixed(1)}%`
                      : ""}
                  </p>
                </div>
              </div>

              <a
                href={readyForBankr ? bankrUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!readyForBankr}
                className={`btn-primary inline-flex w-full items-center justify-center rounded-lg px-5 py-3.5 text-sm font-semibold ${
                  readyForBankr
                    ? ""
                    : "pointer-events-none opacity-40"
                }`}
                onClick={(e) => {
                  if (!readyForBankr) e.preventDefault();
                }}
              >
                Continue to Bankr to buy ${siteConfig.ticker}
              </a>
              <p className="text-center text-xs text-[var(--text-dim)]">
                You’ll leave this site. Confirm the contract and quote in Bankr
                before approving anything in your wallet.
              </p>
            </div>
          ) : null}

          {/* Nav buttons for steps 1-3 */}
          {step !== "swap" ? (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--border)] pt-5">
              {step !== "eligible" ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="btn-ghost rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={goNext}
                disabled={
                  (step === "eligible" && !canAdvanceFromEligible) ||
                  (step === "verify" && !canAdvanceFromVerify)
                }
                className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === "setup" ? "Go to buy estimate" : "Continue"}
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]"
              >
                ← Back to setup
              </button>
            </div>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-3">
              <BrandMark size="sm" glow />
              <div>
                <p className="text-sm font-medium text-white">
                  ${siteConfig.ticker}
                </p>
                <p className="text-xs text-[var(--text-dim)]">
                  {getPairLabel()}
                </p>
              </div>
              <StockTokenMark size="xs" className="ml-auto" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="card-label mb-1">Price</p>
                <p className="stat-value text-sm text-white">
                  {priceUsd != null
                    ? formatUsd(priceUsd, {
                        digits: priceUsd < 0.01 ? 6 : 4,
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="card-label mb-1">Liquidity</p>
                <p className="stat-value text-sm text-white">
                  {liquidityUsd != null
                    ? formatUsd(liquidityUsd, { compact: true })
                    : "—"}
                </p>
              </div>
            </div>
            <Link
              href="/terminal"
              className="mt-4 inline-block text-xs font-medium text-[var(--accent)] hover:opacity-85"
            >
              Open full terminal →
            </Link>
          </div>

          <div className="card p-5">
            <p className="card-label mb-3">Path at a glance</p>
            <ol className="space-y-3">
              {buySteps.map((s) => (
                <li key={s.n} className="flex gap-3 text-sm">
                  <span className="stat-value shrink-0 text-[var(--accent)]">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-medium text-white">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-dim)]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] p-5">
            <p className="card-label mb-2 text-[var(--negative)]">
              Safety first
            </p>
            <ul className="space-y-2 text-xs leading-relaxed text-[var(--text-muted)]">
              <li>Never share your seed phrase or recovery words.</li>
              <li>Bookmark this site so you return to the real one.</li>
              <li>If Bankr shows a different contract, stop.</li>
              <li>
                Crypto is risky — you can lose everything you put in.{" "}
                <Link href="/risks" className="text-[var(--accent)]">
                  Full risks
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Beginner FAQ */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Beginner questions
        </h2>
        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {beginnerFaqs.map((item) => (
            <div key={item.q} className="px-4 py-4 sm:px-5">
              <h3 className="text-sm font-medium text-white">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
