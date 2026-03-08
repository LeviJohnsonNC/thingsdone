import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReview, REVIEW_STEPS, type ReviewSuggestion } from "@/hooks/useReview";
import { useReviewAI } from "@/hooks/useReviewAI";
import { useItems, useUpdateItem, useCompleteItem, useDeleteItem, useCreateItem } from "@/hooks/useItems";
import { useProjects } from "@/hooks/useProjects";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/hooks/useAuth";
import { ReviewProgress } from "@/components/review/ReviewProgress";
import { ClearAndInboxStep } from "@/components/review/ClearAndInboxStep";
import { StateReviewStep } from "@/components/review/StateReviewStep";
import { ProjectReviewStep } from "@/components/review/ProjectReviewStep";
import { ReviewSummaryStep } from "@/components/review/ReviewSummaryStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const STEP_CONFIG: Record<number, { state: string; title: string; description: string }> = {
  2: { state: "next", title: "Next Actions", description: "Are these still relevant? Move stale items out." },
  3: { state: "waiting", title: "Waiting For", description: "Follow up on anything overdue. Add contacts if missing." },
  4: { state: "scheduled", title: "Scheduled", description: "Check overdue items. Reschedule or activate as needed." },
  5: { state: "someday", title: "Someday / Maybe", description: "Anything ready to activate? Trash what no longer interests you." },
};

export default function ReviewView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const review = useReview();
  const ai = useReviewAI();
  const updateItem = useUpdateItem();
  const completeItem = useCompleteItem();
  const deleteItem = useDeleteItem();
  const createItem = useCreateItem();
  const { data: settings } = useUserSettings();

  // Per-step AI data
  const [stepSuggestions, setStepSuggestions] = useState<Record<number, ReviewSuggestion[]>>({});
  const [stepObservations, setStepObservations] = useState<Record<number, string[]>>({});
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Data for AI context
  const { data: inboxItems } = useItems("inbox");
  const { data: nextItems } = useItems("next");
  const { data: waitingItems } = useItems("waiting");
  const { data: scheduledItems } = useItems("scheduled");
  const { data: somedayItems } = useItems("someday");
  const { data: projects } = useProjects("active");

  const itemsByStep: Record<number, unknown[]> = {
    1: inboxItems ?? [],
    2: nextItems ?? [],
    3: waitingItems ?? [],
    4: scheduledItems ?? [],
    5: somedayItems ?? [],
  };

  // Auto-start review on mount if none exists
  useEffect(() => {
    if (user && !review.reviewId && review.existingReview === null) {
      review.startReview();
    }
  }, [user, review.reviewId, review.existingReview]);

  const daysSinceReview = settings?.last_review_at
    ? Math.floor((Date.now() - new Date(settings.last_review_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const requestAI = useCallback(
    async (step: number) => {
      const items = itemsByStep[step] ?? [];
      const context = {
        total_items_by_state: {
          inbox: inboxItems?.length ?? 0,
          next: nextItems?.length ?? 0,
          waiting: waitingItems?.length ?? 0,
          scheduled: scheduledItems?.length ?? 0,
          someday: somedayItems?.length ?? 0,
        },
        days_since_last_review: daysSinceReview,
        completed_this_week: 0,
      };

      const result = await ai.getStepSuggestions(step, items as any, projects ?? [], context);
      if (result) {
        setStepSuggestions((prev) => ({ ...prev, [step]: result.suggestions }));
        setStepObservations((prev) => ({ ...prev, [step]: result.observations }));
        if (result.summary_text) setSummaryText(result.summary_text);
        if (result.reflection_text) setReflectionText(result.reflection_text);
      }
    },
    [ai, inboxItems, nextItems, waitingItems, scheduledItems, somedayItems, projects, daysSinceReview]
  );

  const handleAcceptSuggestion = useCallback(
    async (suggestion: ReviewSuggestion) => {
      try {
        switch (suggestion.action) {
          case "move":
            if (suggestion.item_id && suggestion.target_state) {
              const moveFields: Record<string, unknown> = {
                id: suggestion.item_id,
                state: suggestion.target_state,
              };
              if (suggestion.suggested_fields) {
                const allowed = ["energy", "time_estimate", "waiting_on", "project_id", "due_date", "scheduled_date"];
                for (const [k, v] of Object.entries(suggestion.suggested_fields)) {
                  if (allowed.includes(k) && v != null) moveFields[k] = v;
                }
              }
              await updateItem.mutateAsync(moveFields as any);
              review.incrementStat("itemsMoved");
            }
            break;
          case "complete":
            if (suggestion.item_id) {
              await completeItem.mutateAsync(suggestion.item_id);
              review.incrementStat("itemsCompleted");
            }
            break;
          case "trash":
            if (suggestion.item_id) {
              await updateItem.mutateAsync({ id: suggestion.item_id, state: "trash" });
              review.incrementStat("itemsTrashed");
            }
            break;
          case "create":
          case "follow_up":
            if (suggestion.suggested_title) {
              await createItem.mutateAsync({
                title: suggestion.suggested_title,
                state: (suggestion.target_state as any) ?? "next",
              });
              review.incrementStat("itemsCreated");
            }
            break;
          case "update":
            if (suggestion.item_id && suggestion.suggested_fields) {
              // Only pass known item fields to avoid DB errors
              const allowedFields = ["energy", "time_estimate", "waiting_on", "project_id", "due_date", "scheduled_date", "notes", "is_focused", "area_id"];
              const sanitized: Record<string, unknown> = { id: suggestion.item_id };
              for (const [key, value] of Object.entries(suggestion.suggested_fields)) {
                if (allowedFields.includes(key) && value != null) {
                  sanitized[key] = value;
                }
              }
              if (Object.keys(sanitized).length > 1) {
                await updateItem.mutateAsync(sanitized as any);
              }
            }
            break;
        }
        // Remove the suggestion
        setStepSuggestions((prev) => ({
          ...prev,
          [review.currentStep]: (prev[review.currentStep] ?? []).filter((s) => s !== suggestion),
        }));
        toast.success("Action applied");
      } catch (err) {
        console.error("Review action failed:", err);
        toast.error("Failed to apply action");
      }
    },
    [updateItem, completeItem, createItem, review]
  );

  const handleDismissSuggestion = useCallback(
    (suggestion: ReviewSuggestion) => {
      setStepSuggestions((prev) => ({
        ...prev,
        [review.currentStep]: (prev[review.currentStep] ?? []).filter((s) => s !== suggestion),
      }));
    },
    [review.currentStep]
  );

  const handleFinish = useCallback(async () => {
    setIsCompleting(true);
    try {
      await review.completeReview(summaryText ?? undefined, reflectionText ?? undefined);
      toast.success("Review saved!");
      navigate("/inbox");
    } catch {
      toast.error("Failed to save review");
    } finally {
      setIsCompleting(false);
    }
  }, [review, summaryText, reflectionText, navigate]);

  const currentSuggestions = stepSuggestions[review.currentStep] ?? [];
  const currentObservations = stepObservations[review.currentStep] ?? [];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Progress bar */}
      <div className="border-b border-border bg-card">
        <ReviewProgress
          currentStep={review.currentStep}
          onStepClick={(step) => review.setStep(step)}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {review.currentStep === 1 && (
            <ClearAndInboxStep
              suggestions={currentSuggestions}
              observations={currentObservations}
              onAcceptSuggestion={handleAcceptSuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onRequestAI={() => requestAI(1)}
              aiLoading={ai.loading}
            />
          )}

          {review.currentStep >= 2 && review.currentStep <= 5 && (
            <StateReviewStep
              state={STEP_CONFIG[review.currentStep].state as any}
              title={STEP_CONFIG[review.currentStep].title}
              description={STEP_CONFIG[review.currentStep].description}
              suggestions={currentSuggestions}
              observations={currentObservations}
              onAcceptSuggestion={handleAcceptSuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onRequestAI={() => requestAI(review.currentStep)}
              aiLoading={ai.loading}
            />
          )}

          {review.currentStep === 6 && (
            <ProjectReviewStep
              suggestions={currentSuggestions}
              observations={currentObservations}
              onAcceptSuggestion={handleAcceptSuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              onRequestAI={() => requestAI(6)}
              aiLoading={ai.loading}
            />
          )}

          {review.currentStep === 7 && (
            <ReviewSummaryStep
              stats={review.stats}
              summaryText={summaryText}
              reflectionText={reflectionText}
              onGenerateSummary={() => requestAI(7)}
              onFinish={handleFinish}
              aiLoading={ai.loading}
              isCompleting={isCompleting}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={review.prevStep}
            disabled={review.currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span className="text-xs text-muted-foreground">
            {review.currentStep} / {REVIEW_STEPS.length}
          </span>
          {review.currentStep < REVIEW_STEPS.length ? (
            <Button size="sm" onClick={review.nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
