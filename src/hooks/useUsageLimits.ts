import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";

const FREE_LIMITS = {
  activeItems: 30,
  activeProjects: 3,
  areas: 3,
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
  isOverAnyLimit: boolean;
}

export function useUsageLimits(): UsageLimits & { isLoading: boolean } {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const isUnlimited = isPro || user?.email === "levijohnson@gmail.com";

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

      return {
        activeItemCount: itemCount ?? 0,
        activeProjectCount: projectCount ?? 0,
        areaCount: areaCount ?? 0,
      };
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const activeItemCount = data?.activeItemCount ?? 0;
  const activeProjectCount = data?.activeProjectCount ?? 0;
  const areaCount = data?.areaCount ?? 0;

  const activeItemLimit = isUnlimited ? Infinity : FREE_LIMITS.activeItems;
  const activeProjectLimit = isUnlimited ? Infinity : FREE_LIMITS.activeProjects;
  const areaLimit = isUnlimited ? Infinity : FREE_LIMITS.areas;

  const canCreateItem = isUnlimited || activeItemCount < FREE_LIMITS.activeItems;
  const canCreateProject = isUnlimited || activeProjectCount < FREE_LIMITS.activeProjects;
  const canCreateArea = isUnlimited || areaCount < FREE_LIMITS.areas;

  const isOverAnyLimit =
    !isUnlimited &&
    (activeItemCount >= FREE_LIMITS.activeItems ||
      activeProjectCount >= FREE_LIMITS.activeProjects ||
      areaCount >= FREE_LIMITS.areas);

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
    isOverAnyLimit,
    isLoading,
  };
}
