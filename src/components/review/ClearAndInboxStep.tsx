import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemRow } from "@/components/ItemRow";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuggestionCard } from "./SuggestionCard";
import type { ReviewSuggestion } from "@/hooks/useReview";
import { CheckCircle2, Lightbulb, Lock, Sparkles } from "lucide-react";

interface ClearAndInboxStepProps {
  suggestions: ReviewSuggestion[];
  observations: string[];
  onAcceptSuggestion: (s: ReviewSuggestion) => void;
  onDismissSuggestion: (s: ReviewSuggestion) => void;
  onRequestAI: (brainDump?: string) => void;
  aiLoading: boolean;
  canUseAI: boolean;
  isPro: boolean;
  aiReviewsUsed: number;
  aiReviewLimit: number;
}

export function ClearAndInboxStep({
  suggestions,
  observations,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRequestAI,
  aiLoading,
  canUseAI,
  isPro,
  aiReviewsUsed,
  aiReviewLimit,
}: ClearAndInboxStepProps) {
  const [brainDump, setBrainDump] = useState("");
  const { data: inboxItems, isLoading } = useItems("inbox");
  const { setEditingItemId } = useAppStore();

  const isEmpty = !inboxItems?.length;
  const createSuggestions = suggestions.filter((s) => s.action === "create");
  const inboxSuggestions = suggestions.filter((s) => s.action !== "create");

  const aiCountLabel = !isPro && aiReviewLimit !== Infinity
    ? ` (${aiReviewsUsed}/${aiReviewLimit} used)`
    : "";

  return (
    <div className="space-y-6">
      {/* Brain dump */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-focus-gold" />
          Clear Your Head
        </h3>
        <p className="text-xs text-muted-foreground">
          Dump anything on your mind — errands, ideas, follow-ups, worries. Anything.
        </p>
        <Textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="Meeting prep for Monday, call dentist, research new laptop, follow up with Sarah about budget..."
          className="min-h-[80px] text-sm"
        />
        {isPro ? (
          <Button
            onClick={() => onRequestAI(brainDump)}
            disabled={aiLoading || !brainDump.trim()}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {aiLoading ? "Generating tasks..." : "Turn into tasks"}
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>AI brain dump is a Pro feature. Upgrade to turn thoughts into tasks automatically.</span>
          </div>
        )}
      </div>

      {/* AI suggestions from brain dump */}
      {createSuggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">Suggested tasks from brain dump:</p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => createSuggestions.forEach(onAcceptSuggestion)}
            >
              Accept all
            </Button>
          </div>
          {createSuggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              onAccept={onAcceptSuggestion}
              onDismiss={onDismissSuggestion}
            />
          ))}
        </div>
      )}

      {/* Observations */}
      {observations.length > 0 && (
        <div className="space-y-1">
          {observations.map((obs, i) => (
            <p key={i} className="text-xs text-muted-foreground italic">
              {obs}
            </p>
          ))}
        </div>
      )}

      {/* Inbox items */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Process Inbox{" "}
          {inboxItems && (
            <span className="text-muted-foreground font-normal">
              ({inboxItems.length} items)
            </span>
          )}
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : isEmpty ? (
          <div className="flex items-center gap-2 py-6 justify-center text-success-green">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Inbox is empty!</span>
          </div>
        ) : (
          <div className="space-y-px rounded-lg border border-border overflow-hidden">
            {inboxItems?.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}

        {/* AI suggestions for inbox items */}
        {inboxSuggestions.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">AI suggestions:</p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => inboxSuggestions.forEach(onAcceptSuggestion)}
              >
                Accept all
              </Button>
            </div>
            {inboxSuggestions.map((s, i) => (
              <SuggestionCard
                key={i}
                suggestion={s}
                itemTitle={
                  inboxItems?.find((item) => item.id === s.item_id)?.title
                }
                onAccept={onAcceptSuggestion}
                onDismiss={onDismissSuggestion}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request AI help for inbox */}
      {!isEmpty && (
        <Button
          onClick={() => onRequestAI()}
          disabled={aiLoading || !canUseAI}
          variant="outline"
          className="w-full"
        >
          {aiLoading
            ? "Analyzing..."
            : !canUseAI
            ? `AI limit reached${aiCountLabel}`
            : `Get AI Suggestions for Inbox${aiCountLabel}`}
        </Button>
      )}
    </div>
  );
}
