import { siteConfig } from "../lib/config";

/**
 * Consumer-facing jurisdiction notice.
 */
export function JurisdictionNotice() {
  if (!siteConfig.jurisdictionNoticeEnabled) return null;

  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="card border-[var(--border-strong)] p-4 sm:p-5">
          <p className="card-label mb-2">Important</p>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Tokenized stock products paired with this market are unavailable in
            the United States and may be restricted elsewhere. You are
            responsible for knowing whether you are eligible. Do not use tools
            intended to evade location rules.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-dim)]">
            Research pages on this site are educational. They are not an offer
            to trade in a restricted jurisdiction.
          </p>
        </div>
      </div>
    </section>
  );
}
