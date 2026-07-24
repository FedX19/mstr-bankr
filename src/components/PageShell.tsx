import Link from "next/link";
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
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href={backHref}
            className="text-xs font-medium uppercase tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
          >
            {backLabel}
          </Link>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
