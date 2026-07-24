import { productIs, productIsNot } from "../lib/launch";
import { siteConfig } from "../lib/config";
import { BrandMark } from "./BrandMark";

export function ProductIdentity() {
  return (
    <section id="product" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="card-label mb-2">Product</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              What this is
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              {siteConfig.positioning}
            </p>
          </div>
          <BrandMark size="md" glow />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <p className="card-label mb-4 text-[var(--positive)]">
              What the project is
            </p>
            <ul className="space-y-3">
              {productIs.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--positive)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 sm:p-6">
            <p className="card-label mb-4 text-[var(--negative)]">
              What the project is not
            </p>
            <ul className="space-y-3">
              {productIsNot.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--negative)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <p className="card-label mb-1">Launch type</p>
            <p className="text-sm font-medium text-white">
              Fair launch · no presale
            </p>
          </div>
          <div className="card p-4">
            <p className="card-label mb-1">Creator allocation</p>
            <p className="text-sm font-medium text-white">
              None · vesting disabled
            </p>
          </div>
          <div className="card p-4">
            <p className="card-label mb-1">Primary pair</p>
            <p className="text-sm font-medium text-white">
              Meme / tokenized MSTR
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
