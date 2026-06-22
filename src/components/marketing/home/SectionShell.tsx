import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionShellProps {
  children: ReactNode;
  /** Section background: cream (default) or sand panel */
  tone?: "cream" | "sand" | "paper" | "ink";
  /** Container width */
  width?: "default" | "wide";
  /** Add subtle paper grain texture */
  grain?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Optional eyebrow label rendered above children */
  eyebrow?: string;
}

const toneStyles: Record<NonNullable<SectionShellProps["tone"]>, string> = {
  cream: "bg-cream text-ink",
  sand: "bg-sand text-ink",
  paper: "bg-paper text-ink",
  ink: "bg-moss-deep text-cream",
};

export function SectionShell({
  children,
  tone = "cream",
  width = "default",
  grain = false,
  id,
  className,
  containerClassName,
  eyebrow,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        "py-20 md:py-28 lg:py-36",
        toneStyles[tone],
        grain && "marketing-grain",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto px-6 md:px-10 lg:px-12",
          width === "wide" ? "max-w-[1440px]" : "max-w-6xl",
          containerClassName
        )}
      >
        {eyebrow && (
          <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-ink-soft/80 font-medium">
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
