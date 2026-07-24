import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { StatusBar } from "./StatusBar";

type Props = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PageShell({
  children,
  backHref = "/",
  backLabel = "← Home",
}: Props) {
  return (
    <>
      <StatusBar />
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
          <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
            <Link
              href={backHref}
              className="min-h-10 inline-flex items-center text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
            >
              {backLabel}
            </Link>
            <BrandMark size="xs" />
          </div>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
