import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { useProjects, useUpdateProject } from "@/hooks/useProjects";
import { useProjectItems } from "@/hooks/useItems";
import { useAreas } from "@/hooks/useAreas";
import { SortableItemList } from "@/components/SortableItemList";
import { QuickAddBar } from "@/components/QuickAddBar";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { Progress } from "@/components/ui/progress";
import { DoneSection } from "@/components/DoneSection";
import { cn } from "@/lib/utils";

export default function ProjectDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const project = projects?.find((p) => p.id === id);
  const { data: items } = useProjectItems(id!);
  const { data: areas } = useAreas();
  const updateProject = useUpdateProject();
  const { filters, setFilters } = useItemFilters();

  const area = areas?.find((a) => a.id === project?.area_id);
  const total = items?.length ?? 0;
  const done = items?.filter((i) => i.state === "completed").length ?? 0;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const activeItems = items?.filter((i) => i.state !== "completed") ?? [];
  const filteredActiveItems = applyItemFilters(activeItems as any, filters);
  const completedItems = items?.filter((i) => i.state === "completed") ?? [];

  const dimmedIds = useMemo(() => {
    const ids = new Set<string>();
    activeItems.forEach((item, i) => {
      if (i > 0) ids.add(item.id);
    });
    return ids;
  }, [activeItems]);

  if (!project) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => navigate("/projects")} className="p-1">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold flex-1 truncate">{project.title}</h1>
          <button
            onClick={() => updateProject.mutate({ id: project.id, is_focused: !project.is_focused })}
          >
            <Star
              className={cn(
                "h-5 w-5",
                project.is_focused ? "fill-focus-gold text-focus-gold" : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {area && <span className="text-xs text-muted-foreground">{area.name}</span>}
          <span className="text-xs text-muted-foreground ml-auto">{done}/{total}</span>
        </div>

        <Progress value={progress} className="h-1.5" />
      </div>

      <ItemFilterBar filters={filters} onChange={setFilters} />
      <QuickAddBar placeholder="Add action…" defaultState="next" projectId={project.id} />

      {/* Actions list */}
      <div className="flex-1 overflow-y-auto">
        <SortableItemList
          items={filteredActiveItems}
          dimmedIds={dimmedIds}
          orderField="sort_order_project"
        />
        <DoneSection items={completedItems} restoreState="next" />
      </div>
    </div>
  );
}
