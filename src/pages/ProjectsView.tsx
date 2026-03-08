import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { useProjects, useCreateProject } from "@/hooks/useProjects";
import { useItems } from "@/hooks/useItems";
import { useAreas } from "@/hooks/useAreas";
import { useAppStore } from "@/stores/appStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ProjectsView() {
  const navigate = useNavigate();
  const { selectedAreaId } = useAppStore();
  const { data: projects, isLoading } = useProjects(["active", "someday", "scheduled"], selectedAreaId);
  const { data: allItems } = useItems();
  const { data: areas } = useAreas();
  const createProject = useCreateProject();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const project = await createProject.mutateAsync({ title: newTitle.trim() });
    setNewTitle("");
    setShowCreate(false);
    navigate(`/projects/${project.id}`);
  };

  const getProjectStats = (projectId: string) => {
    const projectItems = allItems?.filter((i) => i.project_id === projectId) ?? [];
    const total = projectItems.length;
    const done = projectItems.filter((i) => i.state === "completed").length;
    // First incomplete item by sort_order_project (sequential)
    const incompleteItems = projectItems
      .filter((i) => i.state !== "completed" && i.state !== "trash")
      .sort((a, b) => (a.sort_order_project ?? 0) - (b.sort_order_project ?? 0));
    const nextAction = incompleteItems[0];
    return { total, done, nextAction, progress: total > 0 ? (done / total) * 100 : 0 };
  };

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Projects" count={projects?.length}>
        <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </ViewHeader>

      <div className="flex-1">
        {isLoading ? null : projects?.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create a project for outcomes requiring multiple actions."
          />
        ) : (
          <div className="divide-y divide-border">
            {projects?.map((project) => {
              const stats = getProjectStats(project.id);
              const area = areas?.find((a) => a.id === project.area_id);
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {stats.done}/{stats.total}
                      </span>
                      {stats.nextAction && (
                        <span className="text-xs text-muted-foreground truncate">
                          → {stats.nextAction.title}
                        </span>
                      )}
                      {area && (
                        <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {area.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 pt-1.5">
                    <Progress value={stats.progress} className="h-1.5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              placeholder="Project title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!newTitle.trim()}>Create</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
