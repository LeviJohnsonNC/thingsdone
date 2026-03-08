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

export function useReviewAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStepSuggestions = useCallback(
    async (
      step: number,
      items: Item[],
      projects: Project[],
      context: StepContext
    ): Promise<AIResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "review-ai",
          {
            body: { step, items, projects, context },
          }
        );
        if (fnError) throw fnError;
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

  return { getStepSuggestions, loading, error };
}
