import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";

const FREE_LIMITS = {
  activeItems: 30,
  activeProjects: 3,
  areas: 3,
  aiReviews: 3,
};

export interface UsageLimits {
  activeItemCount: number;
  activeItemLimit: number;
  canCreateItem: boolean;
  activeProjectCount: number;
  activeProjectLimit: number;
  canCreateProject: boolean;
  areaCount: number;
  areaLimit: number;
  canCreateArea: boolean;
  aiReviewsUsed: number;
  aiReviewLimit: number;
  canUseAI: boolean;
  isOverAnyLimit: boolean;
}

export function useUsageLimits(): UsageLimits & { isLoading: boolean } {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const isUnlimited = isPro || user?.email === "levijohnson@gmail.com" || user?.email === "christyj@gmail.com";

  const { data, isLoading } = useQuery({
    queryKey: ["usage-limits", user?.id, isPro],
    queryFn: async () => {
      // Count active items (not completed, not trash)
      const { count: itemCount } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .not("state", "in", '("completed","trash")');

      // Count active projects
      const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("state", "active");

      // Count areas
      const { count: areaCount } = await supabase
        .from("areas")
        .select("*", { count: "exact", head: true });

      // Get AI usage from user_settings
      const { data: settings } = await supabase
        .from("user_settings")
        .select("ai_reviews_used, ai_reviews_reset_at")
        .maybeSingle();

      let aiReviewsUsed = (settings as any)?.ai_reviews_used ?? 0;
      const resetAt = (settings as any)?.ai_reviews_reset_at ? new Date((settings as any).ai_reviews_reset_at) : null;
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // If reset_at is before this month, the count should be considered 0
      if (resetAt && resetAt < monthStart) {
        aiReviewsUsed = 0;
      }

      return {
        activeItemCount: itemCount ?? 0,
        activeProjectCount: projectCount ?? 0,
        areaCount: areaCount ?? 0,
        aiReviewsUsed,
      };
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const activeItemCount = data?.activeItemCount ?? 0;
  const activeProjectCount = data?.activeProjectCount ?? 0;
  const areaCount = data?.areaCount ?? 0;
  const aiReviewsUsed = data?.aiReviewsUsed ?? 0;

  const activeItemLimit = isUnlimited ? Infinity : FREE_LIMITS.activeItems;
  const activeProjectLimit = isUnlimited ? Infinity : FREE_LIMITS.activeProjects;
  const areaLimit = isUnlimited ? Infinity : FREE_LIMITS.areas;
  const aiReviewLimit = isUnlimited ? Infinity : FREE_LIMITS.aiReviews;

  const canCreateItem = isUnlimited || activeItemCount < FREE_LIMITS.activeItems;
  const canCreateProject = isUnlimited || activeProjectCount < FREE_LIMITS.activeProjects;
  const canCreateArea = isUnlimited || areaCount < FREE_LIMITS.areas;
  const canUseAI = isUnlimited || aiReviewsUsed < FREE_LIMITS.aiReviews;

  const isOverAnyLimit =
    !isUnlimited &&
    (activeItemCount >= FREE_LIMITS.activeItems ||
      activeProjectCount >= FREE_LIMITS.activeProjects ||
      areaCount >= FREE_LIMITS.areas);

  const isApproachingLimit =
    !isUnlimited &&
    !isOverAnyLimit &&
    (activeItemCount >= FREE_LIMITS.activeItems * 0.8 ||
      activeProjectCount >= FREE_LIMITS.activeProjects * 0.8 ||
      areaCount >= FREE_LIMITS.areas * 0.8);

  return {
    activeItemCount,
    activeItemLimit,
    canCreateItem,
    activeProjectCount,
    activeProjectLimit,
    canCreateProject,
    areaCount,
    areaLimit,
    canCreateArea,
    aiReviewsUsed,
    aiReviewLimit,
    canUseAI,
    isOverAnyLimit,
    isApproachingLimit,
    isLoading,
  };
}
