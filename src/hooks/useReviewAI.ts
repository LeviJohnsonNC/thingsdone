import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ReviewSuggestion } from "./useReview";
import type { Item, Project } from "@/lib/types";

interface AIResponse {
  observations: string[];
  suggestions: ReviewSuggestion[];
  summary_text?: string;
  reflection_text?: string;
}

interface StepContext {
  total_items_by_state: Record<string, number>;
  days_since_last_review: number | null;
  completed_this_week: number;
}

export type AILimitError = "ai_limit_reached" | "pro_only_feature" | null;

export function useReviewAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<AILimitError>(null);

  const getStepSuggestions = useCallback(
    async (
      step: number,
      items: Item[],
      projects: Project[],
      context: StepContext,
      brainDump?: string
    ): Promise<AIResponse | null> => {
      setLoading(true);
      setError(null);
      setLimitError(null);
      try {
        const body: Record<string, unknown> = { step, items, projects, context };
        if (brainDump?.trim()) body.brain_dump = brainDump;
        
        const { data, error: fnError } = await supabase.functions.invoke(
          "review-ai",
          { body }
        );
        if (fnError) {
          // Check for limit errors from the response body
          const errorBody = data;
          if (errorBody?.error === "ai_limit_reached") {
            setLimitError("ai_limit_reached");
            return null;
          }
          if (errorBody?.error === "pro_only_feature") {
            setLimitError("pro_only_feature");
            return null;
          }
          throw fnError;
        }
        return data as AIResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "AI request failed";
        setError(msg);
        console.error("Review AI error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearLimitError = useCallback(() => setLimitError(null), []);

  return { getStepSuggestions, loading, error, limitError, clearLimitError };
}
