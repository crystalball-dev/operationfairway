import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { longestWord } from "@/lib/releases";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** One line, or one word per line. */
  variant?: "inline" | "stacked";
  /** Stroked outline instead of a fill. */
  outline?: boolean;
  /** Decorative instances should be hidden from assistive tech. */
  decorative?: boolean;
}

/**
 * The label name set in the display face. It is text, not a drawing, so it
 * inherits `currentColor`, scales with the type system and stays selectable.
 * The stacked variant sizes itself to its container by letter count (see
 * .fit-title), so it fills whatever width it is given without wrapping.
 */
export function Wordmark({ className, variant = "inline", outline = false, decorative = false }: WordmarkProps) {
  const words = site.name.split(/\s+/);
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img" as const, "aria-label": site.name };

  if (variant === "stacked") {
    return (
      <span className={cn("block", className)} style={{ containerType: "inline-size" }} {...a11y}>
        <span
          className={cn("display fit-title block", outline && "text-outline")}
          style={{ "--letters": longestWord(site.name), "--fit-max": "30rem" } as CSSProperties}
        >
          {words.map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("display inline-block whitespace-nowrap", outline && "text-outline", className)} {...a11y}>
      {site.name}
    </span>
  );
}
