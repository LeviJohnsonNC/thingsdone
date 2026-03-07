import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Plus } from "lucide-react";
import { useProjects, useUpdateProject } from "@/hooks/useProjects";
import { useProjectItems, useCreateItem } from "@/hooks/useItems";
import { useAreas } from "@/hooks/useAreas";
import { ItemRow } from "@/components/ItemRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const createItem = useCreateItem();
  const [addTitle, setAddTitle] = useState("");

  if (!project) return null;

  const area = areas?.find((a) => a.id === project.area_id);
  const total = items?.length ?? 0;
  const done = items?.filter((i) => i.state === "completed").length ?? 0;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) return;
    await createItem.mutateAsync({
      title: addTitle.trim(),
      state: "next",
      project_id: project.id,
    });
    setAddTitle("");
  };

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
          <Badge
            variant={project.type === "sequential" ? "default" : "outline"}
            className="text-xs cursor-pointer"
            onClick={() => updateProject.mutate({
              id: project.id,
              type: project.type === "sequential" ? "parallel" : "sequential",
            })}
          >
            {project.type === "sequential" ? "Sequential" : "Parallel"}
          </Badge>
          {area && <span className="text-xs text-muted-foreground">{area.name}</span>}
          <span className="text-xs text-muted-foreground ml-auto">{done}/{total}</span>
        </div>

        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Actions list */}
      <div className="flex-1 overflow-y-auto">
        {items?.map((item, index) => {
          const isSequentialFuture =
            project.type === "sequential" &&
            item.state !== "completed" &&
            items.filter((i) => i.state !== "completed").indexOf(item) > 0;

          return <ItemRow key={item.id} item={item} dimmed={isSequentialFuture} />;
        })}
      </div>

      {/* Add action */}
      <form onSubmit={handleAddAction} className="flex gap-2 p-4 border-t border-border bg-card">
        <Input
          placeholder="Add action…"
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!addTitle.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
