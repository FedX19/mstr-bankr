import Image from "next/image";
import { siteConfig } from "../lib/config";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

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

export function BrandMark({
  size = "sm",
  className = "",
  priority = false,
  glow = false,
}: Props) {
  const { px, className: sizeClass } = sizes[size];

  return (
    <span
      className={`brand-mark relative inline-flex shrink-0 overflow-hidden rounded-full ${sizeClass} ${
        glow ? "brand-mark-glow" : ""
      } ${className}`}
    >
      <Image
        src={siteConfig.brand.tokenIcon}
        alt={siteConfig.brand.tokenIconAlt}
        width={px}
        height={px}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
