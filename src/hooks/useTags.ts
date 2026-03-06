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
