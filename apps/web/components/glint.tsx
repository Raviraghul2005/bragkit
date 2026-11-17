import Image from "next/image";

export type GlintPose = "pearl" | "headphones" | "shades" | "asleep";

/** Glint, as drawn. Decorative everywhere, so the alt text is empty. */
export function Glint({
  pose,
  size,
  sticker = false,
  priority = false,
}: {
  pose: GlintPose;
  size: number;
  /** Sticker shadow, for coloured or dark backgrounds. */
  sticker?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/assets/glint-${pose}.svg`}
      width={size}
      height={size}
      alt=""
      priority={priority}
      className={sticker ? "glint stk" : "glint"}
    />
  );
}

/** The wordmark. The dot of the i is Glint's brass pearl. */
export function Wordmark({ className, size }: { className?: string; size?: number }) {
  return (
    <span
      className={className ? `wm ${className}` : "wm"}
      role="img"
      aria-label="bragkit"
      style={size ? { fontSize: size } : undefined}
    >
      bragk<i>ı</i>t
    </span>
  );
}
