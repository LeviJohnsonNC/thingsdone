import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useOnboarding() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["user_settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check if user has existing items (skip onboarding for pre-existing users)
  const { data: existingItemCount } = useQuery({
    queryKey: ["item_count_check", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .limit(1);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user && !settings?.has_completed_onboarding,
  });

  const needsOnboarding = !isLoading && settings?.has_completed_onboarding !== true && (existingItemCount === 0);

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_settings")
          .update({ has_completed_onboarding: true })
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_settings")
          .insert({ user_id: user!.id, has_completed_onboarding: true });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_settings"] });
    },
  });

  return {
    needsOnboarding,
    isLoading,
    completeOnboarding,
  };
}
