import { useReducer, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ReviewStats {
  inboxProcessed: number;
  itemsCompleted: number;
  itemsTrashed: number;
  itemsCreated: number;
  itemsMoved: number;
  projectsFlagged: number;
}

export interface ReviewSuggestion {
  item_id?: string;
  project_id?: string;
  action: "move" | "complete" | "trash" | "create" | "update" | "follow_up";
  target_state?: string;
  reasoning: string;
  suggested_fields?: Record<string, unknown>;
  suggested_title?: string;
}

export interface ReviewState {
  reviewId: string | null;
  currentStep: number;
  stats: ReviewStats;
  isLoading: boolean;
}

type ReviewAction =
  | { type: "SET_REVIEW_ID"; id: string }
  | { type: "SET_STEP"; step: number }
  | { type: "INCREMENT_STAT"; stat: keyof ReviewStats; amount?: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "RESET" };

const INITIAL_STATS: ReviewStats = {
  inboxProcessed: 0,
  itemsCompleted: 0,
  itemsTrashed: 0,
  itemsCreated: 0,
  itemsMoved: 0,
  projectsFlagged: 0,
};

const initialState: ReviewState = {
  reviewId: null,
  currentStep: 1,
  stats: { ...INITIAL_STATS },
  isLoading: false,
};

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case "SET_REVIEW_ID":
      return { ...state, reviewId: action.id };
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "INCREMENT_STAT":
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.stat]: state.stats[action.stat] + (action.amount ?? 1),
        },
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export const REVIEW_STEPS = [
  { id: 1, label: "Inbox", shortLabel: "Inbox" },
  { id: 2, label: "Next Actions", shortLabel: "Next" },
  { id: 3, label: "Waiting For", shortLabel: "Waiting" },
  { id: 4, label: "Scheduled", shortLabel: "Sched." },
  { id: 5, label: "Someday", shortLabel: "Someday" },
  { id: 6, label: "Projects", shortLabel: "Projects" },
  { id: 7, label: "Summary", shortLabel: "Summary" },
] as const;

export function useReview() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Check for in-progress review
  const { data: existingReview } = useQuery({
    queryKey: ["reviews", "in-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user!.id)
        .is("completed_at", null)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Resume existing review
  useEffect(() => {
    if (existingReview && !state.reviewId) {
      dispatch({ type: "SET_REVIEW_ID", id: existingReview.id });
      dispatch({ type: "SET_STEP", step: existingReview.current_step });
    }
  }, [existingReview, state.reviewId]);

  // Start a new review
  const startReview = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("reviews")
      .insert({ user_id: user.id, current_step: 1 })
      .select()
      .single();
    if (error) throw error;
    dispatch({ type: "RESET" });
    dispatch({ type: "SET_REVIEW_ID", id: data.id });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
    return data.id;
  }, [user, queryClient]);

  // Persist current step
  const setStep = useCallback(
    async (step: number) => {
      dispatch({ type: "SET_STEP", step });
      if (state.reviewId) {
        await supabase
          .from("reviews")
          .update({ current_step: step } as Record<string, unknown>)
          .eq("id", state.reviewId);
      }
    },
    [state.reviewId]
  );

  // Complete the review
  const completeReview = useCallback(
    async (summaryText?: string, reflectionText?: string) => {
      if (!state.reviewId || !user) return;
      const now = new Date().toISOString();
      await supabase
        .from("reviews")
        .update({
          completed_at: now,
          summary_text: summaryText ?? null,
          reflection_text: reflectionText ?? null,
          stats: state.stats as unknown as Record<string, unknown>,
        } as Record<string, unknown>)
        .eq("id", state.reviewId);

      // Update last_review_at
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_settings")
          .update({ last_review_at: now })
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("user_settings")
          .insert({ user_id: user.id, last_review_at: now });
      }

      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user_settings"] });
    },
    [state.reviewId, state.stats, user, queryClient]
  );

  const incrementStat = useCallback(
    (stat: keyof ReviewStats, amount?: number) => {
      dispatch({ type: "INCREMENT_STAT", stat, amount });
    },
    []
  );

  const nextStep = useCallback(() => {
    const next = Math.min(state.currentStep + 1, REVIEW_STEPS.length);
    setStep(next);
  }, [state.currentStep, setStep]);

  const prevStep = useCallback(() => {
    const prev = Math.max(state.currentStep - 1, 1);
    setStep(prev);
  }, [state.currentStep, setStep]);

  return {
    ...state,
    startReview,
    setStep,
    nextStep,
    prevStep,
    completeReview,
    incrementStat,
    existingReview,
  };
}

// Hook to fetch past completed reviews
export function useReviewHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reviews", "history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user!.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
