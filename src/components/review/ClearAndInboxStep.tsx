import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemRow } from "@/components/ItemRow";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuggestionCard } from "./SuggestionCard";
import type { ReviewSuggestion } from "@/hooks/useReview";
import { CheckCircle2, Lightbulb } from "lucide-react";

interface ClearAndInboxStepProps {
  suggestions: ReviewSuggestion[];
  observations: string[];
  onAcceptSuggestion: (s: ReviewSuggestion) => void;
  onDismissSuggestion: (s: ReviewSuggestion) => void;
  onRequestAI: () => void;
  aiLoading: boolean;
}

export function ClearAndInboxStep({
  suggestions,
  observations,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRequestAI,
  aiLoading,
}: ClearAndInboxStepProps) {
  const [brainDump, setBrainDump] = useState("");
  const { data: inboxItems, isLoading } = useItems("inbox");
  const { setEditingItemId } = useAppStore();

  const isEmpty = !inboxItems?.length;

  return (
    <div className="space-y-6">
      {/* Brain dump */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-focus-gold" />
          Clear Your Head
        </h3>
        <p className="text-xs text-muted-foreground">
          Dump anything on your mind. The AI can turn these into tasks.
        </p>
        <Textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="Meeting prep for Monday, call dentist, research new laptop..."
          className="min-h-[80px] text-sm"
        />
      </div>

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

      {/* AI suggestions from brain dump */}
      {suggestions.filter((s) => s.action === "create").length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">AI-suggested tasks:</p>
          {suggestions
            .filter((s) => s.action === "create")
            .map((s, i) => (
              <SuggestionCard
                key={i}
                suggestion={s}
                onAccept={onAcceptSuggestion}
                onDismiss={onDismissSuggestion}
              />
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
        {suggestions.filter((s) => s.action !== "create").length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">AI suggestions:</p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() =>
                  suggestions
                    .filter((s) => s.action !== "create")
                    .forEach(onAcceptSuggestion)
                }
              >
                Accept all
              </Button>
            </div>
            {suggestions
              .filter((s) => s.action !== "create")
              .map((s, i) => (
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

      {/* Request AI help button */}
      <Button
        onClick={onRequestAI}
        disabled={aiLoading}
        variant="outline"
        className="w-full"
      >
        {aiLoading ? "Analyzing..." : "Get AI Suggestions"}
      </Button>
    </div>
  );
}
