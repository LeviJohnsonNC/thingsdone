import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      // Batch update all items with their new order
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
