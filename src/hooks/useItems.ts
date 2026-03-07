import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Item, ItemState } from "@/lib/types";

export function useItems(state?: ItemState | ItemState[], areaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", state, areaId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (Array.isArray(state)) {
        query = query.in("state", state);
      } else if (state) {
        query = query.eq("state", state);
      }

      if (areaId) {
        query = query.eq("area_id", areaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user,
  });
}

export function useNextItems(areaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", "next", areaId, user?.id],
    queryFn: async () => {
      // Fetch next items
      let query = supabase
        .from("items")
        .select("*")
        .eq("state", "next")
        .order("sort_order", { ascending: true });

      if (areaId) {
        query = query.eq("area_id", areaId);
      }

      const { data: items, error } = await query;
      if (error) throw error;

      // Get unique project IDs from these items
      const projectIds = [...new Set(
        (items as Item[]).filter(i => i.project_id).map(i => i.project_id!)
      )];

      if (projectIds.length === 0) return items as Item[];

      // Fetch those projects to check type
      const { data: projects, error: projError } = await supabase
        .from("projects")
        .select("id, type")
        .in("id", projectIds);
      if (projError) throw projError;

      const sequentialProjectIds = new Set(
        projects?.filter(p => p.type === "sequential").map(p => p.id) ?? []
      );

      if (sequentialProjectIds.size === 0) return items as Item[];

      // For sequential projects, fetch ALL incomplete items to determine first action
      const { data: seqItems, error: seqError } = await supabase
        .from("items")
        .select("id, project_id, sort_order_project")
        .in("project_id", [...sequentialProjectIds])
        .neq("state", "completed")
        .order("sort_order_project", { ascending: true });
      if (seqError) throw seqError;

      // Build map: sequential project_id -> first incomplete item id
      const firstActionByProject = new Map<string, string>();
      for (const si of seqItems ?? []) {
        if (si.project_id && !firstActionByProject.has(si.project_id)) {
          firstActionByProject.set(si.project_id, si.id);
        }
      }

      // Filter: keep item if it's not in a sequential project, or if it IS the first action
      return (items as Item[]).filter(item => {
        if (!item.project_id || !sequentialProjectIds.has(item.project_id)) return true;
        return firstActionByProject.get(item.project_id) === item.id;
      });
    },
    enabled: !!user,
  });
}

export function useFocusedItems(areaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", "focused", areaId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*")
        .eq("is_focused", true)
        .not("state", "in", '("completed","trash")')
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("scheduled_date", { ascending: true, nullsFirst: false });

      if (areaId) {
        query = query.eq("area_id", areaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user,
  });
}

export function useCompletedItems(areaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", "completed", areaId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*")
        .eq("state", "completed")
        .order("completed_at", { ascending: false });

      if (areaId) {
        query = query.eq("area_id", areaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user,
  });
}

export function useProjectItems(projectId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", "project", projectId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order_project", { ascending: true });
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user && !!projectId,
  });
}

export function useCreateItem() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; state?: ItemState; project_id?: string }) => {
      const { data: item, error } = await supabase
        .from("items")
        .insert({ ...data, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Item> & { id: string }) => {
      const { data: item, error } = await supabase
        .from("items")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useCompleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("items")
        .update({ state: "completed", completed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
