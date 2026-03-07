import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  isAllDay: boolean;
  calendarSource: "google";
}

export function useGoogleCalendarStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["google_calendar_tokens", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_calendar_tokens")
        .select("id, calendar_id, expires_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useConnectGoogleCalendar() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("google-calendar-auth");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function useDisconnectGoogleCalendar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("google_calendar_tokens")
        .delete()
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google_calendar_tokens"] });
    },
  });
}

export function useGoogleCalendarEvents() {
  const { data: calendarToken } = useGoogleCalendarStatus();

  return useQuery({
    queryKey: ["google_calendar_events"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("sync-calendar-events");
      if (error) {
        console.error("Failed to fetch calendar events:", error);
        return [] as GoogleCalendarEvent[];
      }
      return (data?.events || []) as GoogleCalendarEvent[];
    },
    enabled: !!calendarToken,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });
}

export function usePushItemToCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      action: "upsert" | "delete";
      item_id: string;
      title?: string;
      date?: string;
      notes?: string;
      google_event_id?: string | null;
    }) => {
      const { data, error } = await supabase.functions.invoke("push-item-to-calendar", {
        body: params,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["google_calendar_events"] });
    },
  });
}

export function useDeleteCalendarEvent() {
  return useMutation({
    mutationFn: async (params: { item_id: string; google_event_id: string }) => {
      const { data, error } = await supabase.functions.invoke("push-item-to-calendar", {
        body: { action: "delete", ...params },
      });
      if (error) console.error("Failed to delete calendar event:", error);
      return data;
    },
  });
}
