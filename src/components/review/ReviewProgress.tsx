import { cn } from "@/lib/utils";
import { REVIEW_STEPS } from "@/hooks/useReview";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReviewProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function ReviewProgress({ currentStep, onStepClick }: ReviewProgressProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    const step = REVIEW_STEPS.find((s) => s.id === currentStep);
    return (
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Step {currentStep} of {REVIEW_STEPS.length}
        </span>
        <span className="text-sm font-semibold text-foreground">{step?.label}</span>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / REVIEW_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-6 py-4">
      {REVIEW_STEPS.map((step, i) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center gap-1 flex-1">
            <button
              onClick={() => onStepClick?.(step.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors rounded px-2 py-1",
                isCompleted && "text-primary",
                isCurrent && "text-foreground bg-accent",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.id}
                </span>
              )}
              <span className="hidden lg:inline">{step.label}</span>
              <span className="lg:hidden">{step.shortLabel}</span>
            </button>
            {i < REVIEW_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  isCompleted ? "bg-primary/40" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
