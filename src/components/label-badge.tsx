import { cn } from "@/lib/utils";

interface LabelBadgeProps {
  /** Text set around the ring, e.g. "OPERATION FAIRWAY". */
  text: string;
  /** How many times the text goes around the ring. Every copy gets an equal share. */
  repeat?: number;
  /** Must be unique per document when more than one badge renders. */
  id?: string;
  className?: string;
}

const CENTER = 50;
/** The letters stand on this circle and rise outward from it. */
const RADIUS = 37;
const FONT_SIZE = 9.5;
/** Empty arc around each separator dot, in degrees. */
const GAP_DEGREES = 16;
/** Separator dots sit halfway up the capitals, so they line up with the letters rather than their baseline. */
const DOT_RING = RADIUS + FONT_SIZE * 0.35;
const DOT_RADIUS = 1.1;

/**
 * Imprint stamp: the label set around a slowly rotating ring.
 *
 * Symmetric by construction. The path starts at the bottom and runs
 * clockwise, so its midpoint is the top of the ring. Every copy of the text
 * is centered there and then rotated onto its own spoke, and the separator
 * dots are drawn as circles exactly halfway between spokes. Nothing depends
 * on the font's metrics, or on a trailing space surviving SVG's whitespace
 * collapsing: that is what pushed one dot hard against the next word when
 * the whole ring was a single string.
 *
 * `textLength` stretches each copy to fill its share of the ring. A browser
 * that ignores it still draws a centered, symmetric ring, only with wider
 * gaps. Rotation stops under reduced motion (.spin-slow).
 */
export function LabelBadge({ text, repeat = 2, id, className }: LabelBadgeProps) {
  const pathId = `${id ?? `ring-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}-path`;
  const copies = Math.max(1, Math.floor(repeat));
  const step = 360 / copies;
  const span = (((step - GAP_DEGREES) / 360) * 2 * Math.PI * RADIUS).toFixed(2);
  const spokes = Array.from({ length: copies }, (_, i) => i * step);

  return (
    <svg viewBox="0 0 100 100" className={cn("spin-slow", className)} role="img" aria-label={text} focusable="false">
      <defs>
        <path
          id={pathId}
          fill="none"
          d={`M ${CENTER},${CENTER + RADIUS} a ${RADIUS},${RADIUS} 0 1,1 0,${-2 * RADIUS} a ${RADIUS},${RADIUS} 0 1,1 0,${2 * RADIUS}`}
        />
      </defs>
      <circle cx={CENTER} cy={CENTER} r="47" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx={CENTER} cy={CENTER} r="5.5" fill="currentColor" />
      {spokes.map((angle) => (
        <text
          key={`text-${angle}`}
          transform={angle ? `rotate(${angle} ${CENTER} ${CENTER})` : undefined}
          fill="currentColor"
          fontSize={FONT_SIZE}
          fontWeight="700"
          textAnchor="middle"
        >
          <textPath href={`#${pathId}`} startOffset="50%" textLength={span} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      ))}
      {spokes.map((angle) => {
        const between = ((angle + step / 2) * Math.PI) / 180;
        return (
          <circle
            key={`dot-${angle}`}
            cx={(CENTER + DOT_RING * Math.sin(between)).toFixed(3)}
            cy={(CENTER - DOT_RING * Math.cos(between)).toFixed(3)}
            r={DOT_RADIUS}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
