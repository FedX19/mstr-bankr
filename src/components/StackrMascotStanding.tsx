import Image from "next/image";
import { siteConfig } from "../lib/config";

const SIZES = {
  sm: { box: "h-20 w-16", px: 64 },
  md: { box: "h-32 w-28", px: 112 },
  lg: { box: "h-full w-full min-h-[140px] min-w-[96px]", px: 220 },
} as const;

type Props = {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
  /** Fill a parent-sized container instead of fixed size tokens */
  fill?: boolean;
};

/**
 * Standalone The Stackr mascot — arms crossed, transparent PNG.
 * Reusable brand accent (Stack Check card, empty states, callouts).
 */
export function StackrMascotStanding({
  size = "md",
  className = "",
  priority = false,
  fill = false,
}: Props) {
  const alt =
    siteConfig.brand.mascotStandingAlt ??
    "The Stackr mascot smiling with arms crossed.";

  if (fill) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          src={siteConfig.brand.mascotStanding}
          alt={alt}
          fill
          priority={priority}
          sizes="280px"
          className="object-contain object-bottom drop-shadow-[0_8px_28px_rgba(247,147,26,0.45)] [filter:drop-shadow(0_0_18px_rgba(247,147,26,0.35))]"
        />
      </div>
    );
  }

  const s = SIZES[size];
  return (
    <div className={`relative shrink-0 ${s.box} ${className}`}>
      <Image
        src={siteConfig.brand.mascotStanding}
        alt={alt}
        width={s.px}
        height={Math.round(s.px * 1.12)}
        priority={priority}
        className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_28px_rgba(247,147,26,0.45)] [filter:drop-shadow(0_0_18px_rgba(247,147,26,0.35))]"
      />
    </div>
  );
}
