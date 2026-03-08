import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useTags() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tags", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useItemTags(itemId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["item_tags", itemId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_tags")
        .select("tag_id")
        .eq("item_id", itemId);
      if (error) throw error;
      return data.map((r) => r.tag_id);
    },
    enabled: !!user && !!itemId,
  });
}

export function useSetItemTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, tagIds }: { itemId: string; tagIds: string[] }) => {
      await supabase.from("item_tags").delete().eq("item_id", itemId);
      if (tagIds.length > 0) {
        const { error } = await supabase
          .from("item_tags")
          .insert(tagIds.map((tag_id) => ({ item_id: itemId, tag_id })));
        if (error) throw error;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["item_tags", variables.itemId] });
    },
  });
}

export function useAllItemTags() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["item_tags", "all", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_tags")
        .select("item_id, tag_id");
      if (error) throw error;
      const map = new Map<string, string[]>();
      for (const row of data) {
        const tags = map.get(row.item_id) ?? [];
        tags.push(row.tag_id);
        map.set(row.item_id, tags);
      }
      return map;
    },
    enabled: !!user,
  });
}


export function useCreateTag() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("tags")
        .insert({ name, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      // item_tags rows will be cascade-deleted via FK
      const { error } = await supabase.from("tags").delete().eq("id", tagId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["item_tags"] });
    },
  });
}

export function usePurgeAllData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Delete in order respecting FK constraints
      const uid = user!.id;
      await supabase.from("item_tags").delete().in("item_id",
        (await supabase.from("items").select("id").eq("user_id", uid)).data?.map(i => i.id) ?? []
      );
      await supabase.from("items").delete().eq("user_id", uid);
      await supabase.from("projects").delete().eq("user_id", uid);
      await supabase.from("tags").delete().eq("user_id", uid);
      await supabase.from("areas").delete().eq("user_id", uid);
      await supabase.from("google_calendar_tokens").delete().eq("user_id", uid);
      await supabase.from("user_settings").delete().eq("user_id", uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
