import Image from "next/image";
import { siteConfig } from "../lib/config";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

/** Match BrandMark sizes so both pair tokens read as the same class of icon. */
const sizes: Record<Size, { px: number; className: string }> = {
  xs: { px: 28, className: "h-7 w-7" },
  sm: { px: 36, className: "h-9 w-9" },
  md: { px: 56, className: "h-14 w-14" },
  lg: { px: 96, className: "h-24 w-24" },
  xl: { px: 160, className: "h-40 w-40 sm:h-44 sm:w-44" },
};

type Props = {
  size?: Size;
  className?: string;
  priority?: boolean;
  glow?: boolean;
};

/**
 * Circular token badge for the quote stock (MSTR).
 * Same footprint as BrandMark so the pair diagram feels balanced.
 */
export function StockTokenMark({
  size = "sm",
  className = "",
  priority = false,
  glow = false,
}: Props) {
  const { px, className: sizeClass } = sizes[size];

  return (
    <span
      className={`stock-token-mark relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${sizeClass} ${
        glow ? "stock-token-mark-glow" : ""
      } ${className}`}
    >
      <Image
        src={siteConfig.brand.mstrLogo}
        alt={siteConfig.brand.mstrLogoAlt}
        width={px}
        height={px}
        priority={priority}
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}
