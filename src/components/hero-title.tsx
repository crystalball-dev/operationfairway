import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface HeroTitleProps {
  /** One entry per line, e.g. ["OPERATION", "FAIRWAY"]. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "p";
}

/**
 * The hero name, one letter at a time. Each letter gets its own entrance
 * delay (pure CSS, see .hero-letter-inner) and a slight fixed tilt, and the
 * whole block sits in difference mode over the blobs. The longest line sets
 * the size so nothing ever wraps or overflows. Screen readers get the words
 * once, not letter by letter.
 */
export function HeroTitle({ lines, className, as: Tag = "h1" }: HeroTitleProps) {
  const letters = Math.max(4, ...lines.map((l) => l.length));
  let index = 0;
  return (
    <Tag className={cn("hero-name display", className)} style={{ "--letters": letters } as CSSProperties}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} className="hero-line" aria-hidden="true">
          {Array.from(line).map((ch, ci) => (
            <span key={ci} className="hero-letter">
              <span className="hero-letter-inner" style={{ animationDelay: `${index++ * 45}ms` }}>
                {ch === " " ? " " : ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
