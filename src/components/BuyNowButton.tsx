import { getBankrUrl, isLive, siteConfig } from "../lib/config";

type Props = {
  className?: string;
  label?: string;
};

/** Single CTA — opens the official Bankr token page. */
export function BuyNowButton({
  className = "btn-primary inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold",
  label,
}: Props) {
  if (!isLive()) {
    return (
      <span className={`${className} cursor-not-allowed opacity-50`}>
        {label ?? "Coming soon"}
      </span>
    );
  }

  return (
    <a
      href={getBankrUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label ?? `Buy $${siteConfig.ticker}`}
    </a>
  );
}
