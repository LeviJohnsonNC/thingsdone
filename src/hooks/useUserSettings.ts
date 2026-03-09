import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserSettings {
  id: string;
  user_id: string;
  last_review_at: string | null;
  theme: string | null;
  has_completed_onboarding: boolean | null;
}

export function useUserSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as UserSettings | null;
    },
    enabled: !!user,
  });
}

export function useNeedsReview() {
  const { data: settings } = useUserSettings();
  if (!settings?.last_review_at) return true;
  const lastReview = new Date(settings.last_review_at);
  const daysSince = (Date.now() - lastReview.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}

export function useSaveReviewTimestamp() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_settings")
          .update({ last_review_at: now })
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_settings")
          .insert({ user_id: user!.id, last_review_at: now });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_settings"] });
    },
  });
}
