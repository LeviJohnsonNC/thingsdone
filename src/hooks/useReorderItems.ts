import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Item } from "@/lib/types";

interface ReorderUpdate {
  id: string;
  order: number;
}

interface ReorderParams {
  updates: ReorderUpdate[];
  field: "sort_order" | "sort_order_project";
}

export function useReorderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ updates, field }: ReorderParams) => {
      const promises = updates.map(({ id, order }) =>
        supabase
          .from("items")
          .update({ [field]: order })
          .eq("id", id)
      );
      const results = await Promise.all(promises);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onMutate: async ({ updates, field }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["items"] });

      // Snapshot all item queries for rollback
      const previousQueries = queryClient.getQueriesData<Item[]>({ queryKey: ["items"] });

      // Build order map
      const orderMap = new Map(updates.map((u) => [u.id, u.order]));

      // Update every cached query that contains items
      queryClient.setQueriesData<Item[]>({ queryKey: ["items"] }, (old) => {
        if (!old) return old;
        return old
          .map((item) => {
            const newOrder = orderMap.get(item.id);
            if (newOrder !== undefined) {
              return { ...item, [field]: newOrder };
            }
            return item;
          })
          .sort((a, b) => ((a as any)[field] ?? 0) - ((b as any)[field] ?? 0));
      });

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      // Rollback to previous state
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
        onSettled: (_data, error) => {
                if (error) {
                          queryClient.invalidateQueries({ queryKey: ["items"] });
                }
        },
  });
}
