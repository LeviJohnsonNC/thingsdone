import type { ReviewStats } from "@/hooks/useReview";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  isPro: boolean;
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
  isPro,
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

        {!isPro && (
          <div className="rounded-lg border border-focus-gold/20 bg-focus-gold/5 p-3 mt-2">
            <p className="text-sm text-foreground font-medium flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-focus-gold" />
              Great review! Want unlimited AI suggestions?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Upgrade to Pro for unlimited AI reviews, recurring tasks, and more — just $4/mo.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs border-focus-gold/30 text-focus-gold hover:bg-focus-gold/10"
              onClick={async () => {
                try {
                  const { data, error } = await supabase.functions.invoke("create-checkout");
                  if (error) throw error;
                  if (data?.url) window.open(data.url, "_blank");
                } catch {
                  toast.error("Failed to start checkout");
                }
              }}
            >
              <Zap className="h-3 w-3 mr-1" />
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
