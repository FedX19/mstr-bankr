import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /**
   * How the image fades into the page background.
   * - ambient: soft vignette (default)
   * - edge-left: stronger fade on left (sits beside copy)
   * - edge-right: stronger fade on right
   * - soft: light overall blend
   */
  blend?: "ambient" | "edge-left" | "edge-right" | "soft";
};

/**
 * Mascot art blended into the dark page — no card/box chrome.
 * Soft masks keep the subject readable without a modal frame.
 */
export function MascotFrame({
  src,
  alt,
  width = 1672,
  height = 941,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 520px",
  blend = "ambient",
}: Props) {
  const blendClass =
    blend === "edge-left"
      ? "mascot-blend-edge-left"
      : blend === "edge-right"
        ? "mascot-blend-edge-right"
        : blend === "soft"
          ? "mascot-blend-soft"
          : "mascot-blend-ambient";

  return (
    <div
      className={`mascot-scene relative w-full overflow-hidden ${blendClass} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        className="h-auto w-full scale-[1.02] object-cover object-center"
      />
    </div>
  );
}
