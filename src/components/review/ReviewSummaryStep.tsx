import type { ReviewStats } from "@/hooks/useReview";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";

interface ReviewSummaryStepProps {
  stats: ReviewStats;
  summaryText: string | null;
  reflectionText: string | null;
  onGenerateSummary: () => void;
  onFinish: () => void;
  aiLoading: boolean;
  isCompleting: boolean;
  canUseAI: boolean;
  aiReviewsUsed: number;
  aiReviewLimit: number;
}

export function ReviewSummaryStep({
  stats,
  summaryText,
  reflectionText,
  onGenerateSummary,
  onFinish,
  aiLoading,
  isCompleting,
  canUseAI,
  aiReviewsUsed,
  aiReviewLimit,
}: ReviewSummaryStepProps) {
  const statItems = [
    { label: "Inbox items processed", value: stats.inboxProcessed },
    { label: "Items completed", value: stats.itemsCompleted },
    { label: "Items moved", value: stats.itemsMoved },
    { label: "Items trashed", value: stats.itemsTrashed },
    { label: "New items created", value: stats.itemsCreated },
    { label: "Projects flagged", value: stats.projectsFlagged },
  ];

  const aiCountLabel = aiReviewLimit !== Infinity
    ? ` (${aiReviewsUsed}/${aiReviewLimit} used)`
    : "";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Trophy className="h-10 w-10 text-focus-gold mx-auto" />
        <h3 className="text-lg font-semibold text-foreground">Review Complete!</h3>
        <p className="text-sm text-muted-foreground">
          Great job keeping your system clean and trustworthy.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card p-3 text-center"
            >
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
      </div>

      {/* Summary */}
      {summaryText && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-focus-gold" />
            Summary
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {summaryText}
          </p>
        </div>
      )}

      {/* Reflection */}
      {reflectionText && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Reflection</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {reflectionText}
          </p>
        </div>
      )}

      {/* Generate / Finish buttons */}
      <div className="space-y-2">
        {!summaryText && (
          <Button
            onClick={onGenerateSummary}
            disabled={aiLoading || !canUseAI}
            variant="outline"
            className="w-full"
          >
            {aiLoading
              ? "Generating summary..."
              : !canUseAI
              ? `AI limit reached${aiCountLabel}`
              : `Generate AI Summary${aiCountLabel}`}
          </Button>
        )}
        <Button
          onClick={onFinish}
          disabled={isCompleting}
          className="w-full"
        >
          {isCompleting ? "Saving..." : "Save & Finish Review"}
        </Button>
      </div>
    </div>
  );
}
