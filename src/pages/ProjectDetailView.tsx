import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Target, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useProjects, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useProjectItems } from "@/hooks/useItems";
import { useAreas } from "@/hooks/useAreas";
import { SortableItemList } from "@/components/SortableItemList";
import { QuickAddBar } from "@/components/QuickAddBar";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { useAllItemTags } from "@/hooks/useTags";
import { Progress } from "@/components/ui/progress";
import { DoneSection } from "@/components/DoneSection";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ProjectDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const project = projects?.find((p) => p.id === id);
  const { data: items } = useProjectItems(id!);
  const { data: areas } = useAreas();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { data: itemTagMap } = useAllItemTags();
  const { filters, setFilters } = useItemFilters();
  const [outcome, setOutcome] = useState("");

  const [showRename, setShowRename] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const area = areas?.find((a) => a.id === project?.area_id);
  const total = items?.length ?? 0;
  const done = items?.filter((i) => i.state === "completed").length ?? 0;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const activeItems = items?.filter((i) => i.state !== "completed") ?? [];
  const filteredActiveItems = applyItemFilters(activeItems as any, filters, itemTagMap);
  const completedItems = items?.filter((i) => i.state === "completed") ?? [];

  const dimmedIds = useMemo(() => {
    const ids = new Set<string>();
    activeItems.forEach((item, i) => {
      if (i > 0) ids.add(item.id);
    });
    return ids;
  }, [activeItems]);

  if (!project) return null;

  const handleRename = () => {
    const val = renameValue.trim();
    if (val && val !== project.title) {
      updateProject.mutate({ id: project.id, title: val });
      toast.success("Project renamed");
    }
    setShowRename(false);
  };

  const handleAreaChange = (value: string) => {
    const areaId = value === "none" ? null : value;
    updateProject.mutate({ id: project.id, area_id: areaId });
  };

  const handleDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        toast.success("Project deleted");
        navigate("/projects");
      },
    });
    setShowDelete(false);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setRenameValue(project.title);
                  setShowRename(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDelete(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Select
            value={project.area_id ?? "none"}
            onValueChange={handleAreaChange}
          >
            <SelectTrigger className="h-7 w-auto text-xs border-0 bg-muted px-2 py-0.5 gap-1">
              <SelectValue placeholder="No area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No area</SelectItem>
              {areas?.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{done}/{total}</span>
        </div>

        <Progress value={progress} className="h-1.5" />

        {/* Desired Outcome */}
        <div className="mt-3 flex items-start gap-2">
          <Target className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
          <input
            value={outcome || project.desired_outcome || ""}
            onChange={(e) => setOutcome(e.target.value)}
            onFocus={() => setOutcome(project.desired_outcome || "")}
            onBlur={() => {
              const val = outcome.trim();
              if (val !== (project.desired_outcome || "")) {
                updateProject.mutate({ id: project.id, desired_outcome: val || null });
              }
            }}
            placeholder="What does 'done' look like for this project?"
            className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 border-0 outline-none focus:text-foreground"
          />
        </div>
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

      {/* Rename dialog */}
      <Dialog open={showRename} onOpenChange={setShowRename}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRename();
            }}
            className="flex gap-2"
          >
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!renameValue.trim()}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{project.title}" and unlink all its actions. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
