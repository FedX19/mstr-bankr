import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Intrinsic width of the source image */
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  /** sizes attr for responsive loading */
  sizes?: string;
};

/**
 * Terminal-styled mascot frame: rounded, orange glow border, no layout shift.
 */
export function MascotFrame({
  src,
  alt,
  width = 1672,
  height = 941,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 520px",
}: Props) {
  return (
    <div
      className={`mascot-frame relative w-full overflow-hidden rounded-2xl border border-[var(--accent-border)] bg-[var(--bg-elevated)] shadow-[0_0_40px_rgba(247,147,26,0.12)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        className="h-auto w-full object-cover object-center"
      />
    </div>
  );
}
