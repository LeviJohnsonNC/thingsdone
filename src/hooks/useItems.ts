import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Item, ItemState } from "@/lib/types";
import { getNextOccurrence } from "@/components/RecurrenceSelector";

// Fields that affect which list an item appears in
const LIST_AFFECTING_FIELDS = new Set(["state", "is_focused", "project_id", "area_id", "scheduled_date"]);

/** Update an item in all cached list queries (in-place, no refetch) */
function updateItemInListCaches(queryClient: QueryClient, updatedItem: Item) {
  queryClient.setQueriesData<Item[]>(
    { queryKey: ["items"], type: "active" },
    (old) => {
      if (!old || !Array.isArray(old)) return old;
      return old.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    }
  );
}

/** Remove an item from all cached list queries */
function removeItemFromListCaches(queryClient: QueryClient, itemId: string) {
  queryClient.setQueriesData<Item[]>(
    { queryKey: ["items"], type: "active" },
    (old) => {
      if (!old || !Array.isArray(old)) return old;
      return old.filter((item) => item.id !== itemId);
    }
  );
}

export function useItem(id: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["items", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Item;
    },
    enabled: !!user && !!id,
  });
}

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
      const today = new Date().toISOString().split("T")[0];

      let nextQuery = supabase
        .from("items")
        .select("*")
        .eq("state", "next")
        .order("sort_order", { ascending: true });
      if (areaId) nextQuery = nextQuery.eq("area_id", areaId);

      let inboxQuery = supabase
        .from("items")
        .select("*")
        .eq("state", "inbox")
        .order("created_at", { ascending: true });
      if (areaId) inboxQuery = inboxQuery.eq("area_id", areaId);

      let scheduledQuery = supabase
        .from("items")
        .select("*")
        .eq("state", "scheduled")
        .lte("scheduled_date", today)
        .order("scheduled_date", { ascending: true });
      if (areaId) scheduledQuery = scheduledQuery.eq("area_id", areaId);

      const [nextRes, inboxRes, scheduledRes] = await Promise.all([
        nextQuery, inboxQuery, scheduledQuery,
      ]);
      if (nextRes.error) throw nextRes.error;
      if (inboxRes.error) throw inboxRes.error;
      if (scheduledRes.error) throw scheduledRes.error;

      const nextItems = nextRes.data as Item[];
      const inboxItems = inboxRes.data as Item[];
      const scheduledItems = scheduledRes.data as Item[];

      const projectIds = [...new Set(
        nextItems.filter(i => i.project_id).map(i => i.project_id!)
      )];

      let filteredNextItems = nextItems;
      if (projectIds.length > 0) {
        const { data: seqItems, error: seqError } = await supabase
          .from("items")
          .select("id, project_id, sort_order_project")
          .in("project_id", projectIds)
          .neq("state", "completed")
          .order("sort_order_project", { ascending: true });
        if (seqError) throw seqError;

        const firstActionByProject = new Map<string, string>();
        for (const si of seqItems ?? []) {
          if (si.project_id && !firstActionByProject.has(si.project_id)) {
            firstActionByProject.set(si.project_id, si.id);
          }
        }

        filteredNextItems = nextItems.filter(item => {
          if (!item.project_id) return true;
          return firstActionByProject.get(item.project_id) === item.id;
        });
      }

      const seen = new Set<string>();
      const merged: Item[] = [];
      for (const item of [...filteredNextItems, ...inboxItems, ...scheduledItems]) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
      return merged;
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
    mutationFn: async (data: { title: string; state?: ItemState; project_id?: string; area_id?: string | null; scheduled_date?: string }) => {
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
      return { item: item as Item, changedFields: Object.keys(data) };
    },
    onSuccess: ({ item: updatedItem, changedFields }) => {
      // Always update the detail cache
      queryClient.setQueryData(["items", "detail", updatedItem.id], updatedItem);

      // If the change affects list membership, refetch all lists
      const affectsList = changedFields.some((f) => LIST_AFFECTING_FIELDS.has(f));
      if (affectsList) {
        queryClient.invalidateQueries({ queryKey: ["items"], predicate: (q) => q.queryKey[1] !== "detail" });
      } else {
        // Just update the item in-place in all list caches (no refetch)
        updateItemInListCaches(queryClient, updatedItem);
      }
    },
  });
}

export function useCompleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: { id: string; recurrence_rule?: string | null; title?: string; user_id?: string; scheduled_date?: string | null; project_id?: string | null; area_id?: string | null; energy?: string | null; time_estimate?: number | null }) => {
      const { error } = await supabase
        .from("items")
        .update({ state: "completed", completed_at: new Date().toISOString() })
        .eq("id", item.id);
      if (error) throw error;

      if (item.recurrence_rule) {
        const nextDate = getNextOccurrence(item.recurrence_rule, item.scheduled_date ?? undefined);
        const { error: createError } = await supabase
          .from("items")
          .insert({
            title: item.title ?? "Recurring item",
            user_id: item.user_id!,
            state: "scheduled" as string,
            scheduled_date: nextDate,
            recurrence_rule: item.recurrence_rule,
            project_id: item.project_id ?? null,
            area_id: item.area_id ?? null,
            energy: item.energy ?? null,
            time_estimate: item.time_estimate ?? null,
          });
        if (createError) throw createError;
      }

      return item.id;
    },
    // Optimistic: remove item from lists immediately
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      // Snapshot all item list caches for rollback
      const previousQueries = queryClient.getQueriesData<Item[]>({ queryKey: ["items"] });

      removeItemFromListCaches(queryClient, item.id);

      return { previousQueries };
    },
    onError: (_err, _item, context) => {
      // Roll back all caches
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useToggleFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_focused }: { id: string; is_focused: boolean }) => {
      const { data: item, error } = await supabase
        .from("items")
        .update({ is_focused })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return item as Item;
    },
    onMutate: async ({ id, is_focused }) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const previousQueries = queryClient.getQueriesData<Item[]>({ queryKey: ["items"] });

      // Optimistically toggle focus in all caches
      queryClient.setQueriesData<Item[] | Item>(
        { queryKey: ["items"], type: "active" },
        (old) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return old.map((item) => (item.id === id ? { ...item, is_focused } : item));
          }
          // Detail query
          if ((old as Item).id === id) return { ...old, is_focused };
          return old;
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"], predicate: (q) => q.queryKey[1] !== "detail" });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    // Optimistic: remove item from lists immediately
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const previousQueries = queryClient.getQueriesData<Item[]>({ queryKey: ["items"] });
      removeItemFromListCaches(queryClient, id);
      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
