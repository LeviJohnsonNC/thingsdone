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
      const { error } = await supabase.rpc("batch_reorder_items", {
        p_ids: updates.map((u) => u.id),
        p_orders: updates.map((u) => u.order),
        p_field: field,
      });
      if (error) throw error;
    },
    onMutate: async ({ updates, field }) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      const previousQueries = queryClient.getQueriesData<Item[]>({ queryKey: ["items"] });

      const orderMap = new Map(updates.map((u) => [u.id, u.order]));

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
