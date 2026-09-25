import { site } from "@/content/site";
import { cn } from "@/lib/utils";

interface MarkProps {
  className?: string;
  /** Decorative instances should be hidden from assistive tech. */
  decorative?: boolean;
  /** Must be unique per document when more than one mark renders. */
  id?: string;
}

/**
 * The roundel: a heavy ring cut by a diagonal fairway, with the point of the
 * operation at its center. Inline SVG so it inherits `currentColor` and
 * therefore works inside the difference-blended nav, on themed pages and in
 * OG cards. The cut is a mask, so the gap shows whatever sits behind it.
 */
export function Mark({ className, decorative = false, id = "mark" }: MarkProps) {
  const maskId = `${id}-cut`;
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("block", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : site.name}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <rect x="-30" y="41" width="160" height="18" fill="#000" transform="rotate(-40 50 50)" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="15" mask={`url(#${maskId})`} />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}
