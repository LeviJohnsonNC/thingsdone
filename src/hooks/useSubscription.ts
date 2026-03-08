import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SubscriptionInfo {
  status: "free" | "active" | "past_due" | "canceled" | "incomplete";
  isPro: boolean;
  subscribed: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}

const DEFAULT_SUB: SubscriptionInfo = {
  status: "free",
  isPro: false,
  subscribed: false,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: null,
};

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<SubscriptionInfo> => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("check-subscription error:", error);
        return DEFAULT_SUB;
      }
      return {
        status: data.status ?? "free",
        isPro: data.subscribed === true,
        subscribed: data.subscribed === true,
        cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
        currentPeriodEnd: data.subscription_end ?? null,
      };
    },
    enabled: !!user,
    staleTime: 60_000, // 1 minute
    refetchInterval: 60_000,
  });

  // Refetch on visibility change (user returns from Stripe tab)
  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
  }, [queryClient]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [refetch]);

  return {
    ...(query.data ?? DEFAULT_SUB),
    isLoading: query.isLoading,
    refetch,
  };
}
