import { siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

/**
 * Visual identity break — large token mark + tagline.
 * Anchors the mascot between dashboard sections.
 */
export function BrandShowcase() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="bg-radial-glow bg-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
        <BrandMark size="xl" glow />
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
          Official mark
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {siteConfig.tagline}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
          {siteConfig.secondarySlogan}
        </p>
        <p className="mt-5 text-sm font-medium text-[var(--accent)]">
          {siteConfig.supportingPhrase}
        </p>
      </div>
    </section>
  );
}
