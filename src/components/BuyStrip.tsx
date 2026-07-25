import Link from "next/link";
import { isLive, siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

/** Homepage CTA for beginners to start the buy flow. */
export function BuyStrip() {
  if (!isLive()) return null;

  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="card flex flex-col gap-5 border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3 sm:items-center">
            <BrandMark size="md" glow />
            <div>
              <p className="text-sm font-semibold text-white sm:text-base">
                Trade ${siteConfig.ticker} in-app
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Bankr swap hosted inside Roaring Stacker. Prefer a walkthrough?
                Use the beginner guide — we never hold your funds.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              href="/swap"
              className="btn-primary inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold"
            >
              Open swap
            </Link>
            <Link
              href="/buy"
              className="btn-ghost inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium"
            >
              Beginner guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
