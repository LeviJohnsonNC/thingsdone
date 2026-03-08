import { useProjects } from "@/hooks/useProjects";
import { useItems } from "@/hooks/useItems";
import { Button } from "@/components/ui/button";
import { SuggestionCard } from "./SuggestionCard";
import type { ReviewSuggestion } from "@/hooks/useReview";
import { CheckCircle2, AlertTriangle, FolderOpen } from "lucide-react";

interface ProjectReviewStepProps {
  suggestions: ReviewSuggestion[];
  observations: string[];
  onAcceptSuggestion: (s: ReviewSuggestion) => void;
  onDismissSuggestion: (s: ReviewSuggestion) => void;
  onRequestAI: () => void;
  aiLoading: boolean;
}

export function ProjectReviewStep({
  suggestions,
  observations,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRequestAI,
  aiLoading,
}: ProjectReviewStepProps) {
  const { data: projects, isLoading: projectsLoading } = useProjects("active");
  const { data: nextItems } = useItems("next");

  // Check which projects have no next action
  const projectsWithoutNext = projects?.filter(
    (p) => !nextItems?.some((i) => i.project_id === p.id)
  );

  const isEmpty = !projects?.length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Review Projects</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Check that every active project has a clear next action.
        </p>
      </div>

      {observations.length > 0 && (
        <div className="space-y-1">
          {observations.map((obs, i) => (
            <p key={i} className="text-xs text-muted-foreground italic">{obs}</p>
          ))}
        </div>
      )}

      {projectsLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : isEmpty ? (
        <div className="flex items-center gap-2 py-6 justify-center text-success-green">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">No active projects</span>
        </div>
      ) : (
        <div className="space-y-2">
          {projects?.map((project) => {
            const hasNoNext = projectsWithoutNext?.some((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.type} · {project.state}
                  </p>
                </div>
                {hasNoNext && (
                  <div className="flex items-center gap-1 text-focus-gold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium">No next action</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">AI suggestions:</p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => suggestions.forEach(onAcceptSuggestion)}
            >
              Accept all
            </Button>
          </div>
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              itemTitle={
                s.suggested_title ??
                projects?.find((p) => p.id === s.project_id)?.title
              }
              onAccept={onAcceptSuggestion}
              onDismiss={onDismissSuggestion}
            />
          ))}
        </div>
      )}

      <Button
        onClick={onRequestAI}
        disabled={aiLoading || isEmpty}
        variant="outline"
        className="w-full"
      >
        {aiLoading ? "Analyzing..." : "Get AI Suggestions"}
      </Button>
    </div>
  );
}
