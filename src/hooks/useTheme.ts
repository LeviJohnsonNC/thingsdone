import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useUserSettings } from "./useUserSettings";
import { useAreas } from "./useAreas";
import { useAppStore } from "@/stores/appStore";
import { applyTheme } from "@/lib/themes";

/**
 * Applies the active theme (area-specific or global fallback) to :root.
 * Call once in AppLayout.
 */
export function useActiveTheme() {
  const { data: settings } = useUserSettings();
  const { data: areas } = useAreas();
  const selectedAreaId = useAppStore((s) => s.selectedAreaId);

  useEffect(() => {
    const area = areas?.find((a) => a.id === selectedAreaId);
    const areaTheme = area?.theme;
    const activeTheme = areaTheme || settings?.theme || "default";
    applyTheme(activeTheme);
  }, [settings, areas, selectedAreaId]);
}

/** Mutation to save global theme preference */
export function useSaveGlobalTheme() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (themeId: string) => {
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_settings")
          .update({ theme: themeId } as any)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_settings")
          .insert({ user_id: user!.id, theme: themeId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_settings"] });
    },
  });
}

/** Mutation to save an area's theme */
export function useSaveAreaTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ areaId, themeId }: { areaId: string; themeId: string | null }) => {
      const { error } = await supabase
        .from("areas")
        .update({ theme: themeId } as any)
        .eq("id", areaId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
}
