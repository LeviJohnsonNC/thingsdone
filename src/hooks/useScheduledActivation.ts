import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useScheduledActivation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || hasRun.current) return;
    hasRun.current = true;

    supabase.functions
      .invoke("activate-scheduled-items")
      .then(({ data }) => {
        if (data?.activated > 0) {
          queryClient.invalidateQueries({ queryKey: ["items"] });
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
      })
      .catch(() => {
        // Silent fail — cron will handle it
      });
  }, [user, queryClient]);
}
