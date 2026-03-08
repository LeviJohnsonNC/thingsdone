import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Project, ProjectState } from "@/lib/types";

export function useProjects(state?: ProjectState | ProjectState[], areaId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["projects", state, areaId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("projects")
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
      return data as Project[];
    },
    enabled: !!user,
  });
}

export function useCreateProject() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string }) => {
      const { data: project, error } = await supabase
        .from("projects")
        .insert({ ...data, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
