import Image from "next/image";
import { siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

/**
 * Visual identity break — transparent mark over vault atmosphere.
 */
export function BrandShowcase() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0">
        <Image
          src={siteConfig.brand.vaultAbstract}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-55"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[var(--bg)]/55"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-20">
        <BrandMark size="xl" glow variant="transparent" />
        <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--accent)] sm:mt-8 sm:text-xs">
          Roaring Saylor
        </p>
        <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-white sm:mt-3 sm:text-4xl">
          {siteConfig.tagline}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
          {siteConfig.secondarySlogan}
        </p>
        <p className="mt-4 text-sm font-medium text-[var(--accent)] sm:mt-5">
          {siteConfig.supportingPhrase}
        </p>
      </div>
    </section>
  );
}
