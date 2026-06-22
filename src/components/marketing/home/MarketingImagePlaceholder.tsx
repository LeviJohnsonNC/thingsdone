import { cn } from "@/lib/utils";

interface MarketingImagePlaceholderProps {
  /** Label rendered as a caption beneath the placeholder */
  caption?: string;
  /** Short identifier rendered inside the placeholder */
  label: string;
  /** Optional final image src; when present, the placeholder swaps out for the image */
  src?: string;
  alt?: string;
  /** Aspect variant - controls the placeholder shape */
  variant?: "hero" | "wide" | "module" | "card" | "tall";
  className?: string;
  /** Accent dot color on the corner marker */
  accent?: "moss" | "clay" | "amber";
}

const aspectByVariant: Record<NonNullable<MarketingImagePlaceholderProps["variant"]>, string> = {
  hero: "aspect-[16/10]",
  wide: "aspect-[21/9]",
  module: "aspect-[5/4]",
  card: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

const accentColor: Record<NonNullable<MarketingImagePlaceholderProps["accent"]>, string> = {
  moss: "bg-moss",
  clay: "bg-clay",
  amber: "bg-amber",
};

export function MarketingImagePlaceholder({
  caption,
  label,
  src,
  alt,
  variant = "module",
  className,
  accent = "moss",
}: MarketingImagePlaceholderProps) {
  return (
    <figure className={cn("group", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl",
          "border border-hairline bg-paper shadow-tactile",
          aspectByVariant[variant]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <>
            {/* Quiet paper grain */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              }}
            />
            {/* Diagonal hairline grid */}
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full text-ink/[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="mp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mp-grid)" />
            </svg>

            {/* Corner marker */}
            <div className="absolute left-5 top-5 flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", accentColor[accent])} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Image
              </span>
            </div>

            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="font-display text-xl md:text-2xl text-ink/70 leading-tight">
                {label}
              </p>
            </div>

            {/* Bottom caption rule */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">
              <span>Things Done</span>
              <span>Placeholder</span>
            </div>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-ink-soft tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
