import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Inbox, ArrowRight, FolderOpen, Cloud, Calendar, PartyPopper, Check, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/stores/appStore";
import { useItems, useUpdateItem, useCompleteItem, useDeleteItem } from "@/hooks/useItems";
import { useProjects } from "@/hooks/useProjects";
import { useProjectItems } from "@/hooks/useItems";
import { useSaveReviewTimestamp } from "@/hooks/useUserSettings";
import { useNavigate } from "react-router-dom";
import type { Item, Project } from "@/lib/types";

const STEPS = [
  { title: "Get Clear", subtitle: "Process every inbox item", icon: Inbox },
  { title: "Review Next Actions", subtitle: "Are these still relevant?", icon: ArrowRight },
  { title: "Review Projects", subtitle: "Does every project have a next action?", icon: FolderOpen },
  { title: "Review Someday/Maybe", subtitle: "Is now the time?", icon: Cloud },
  { title: "Review Scheduled", subtitle: "Check upcoming commitments", icon: Calendar },
  { title: "Complete!", subtitle: "Your system is up to date", icon: PartyPopper },
];

export function WeeklyReviewWizard() {
  const {
    weeklyReviewOpen, setWeeklyReviewOpen,
    weeklyReviewStep, setWeeklyReviewStep,
    reviewStats, incrementReviewStat, resetReviewState,
  } = useAppStore();
  const navigate = useNavigate();

  if (!weeklyReviewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative flex flex-col w-full h-full md:h-auto md:max-h-[85vh] md:max-w-[640px] md:rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Weekly Review</h2>
            <p className="text-xs text-muted-foreground">Step {weeklyReviewStep + 1} of {STEPS.length}</p>
          </div>
          <button onClick={() => setWeeklyReviewOpen(false)} className="p-2 rounded-md hover:bg-accent text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <Progress value={((weeklyReviewStep + 1) / STEPS.length) * 100} className="h-1.5" />
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium transition-colors ${
                i <= weeklyReviewStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < weeklyReviewStep ? <Check className="h-3 w-3" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={weeklyReviewStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {weeklyReviewStep === 0 && <InboxStep />}
              {weeklyReviewStep === 1 && <NextActionsStep />}
              {weeklyReviewStep === 2 && <ProjectsStep />}
              {weeklyReviewStep === 3 && <SomedayStep />}
              {weeklyReviewStep === 4 && <ScheduledStep />}
              {weeklyReviewStep === 5 && <CompleteStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            disabled={weeklyReviewStep === 0}
            onClick={() => setWeeklyReviewStep(weeklyReviewStep - 1)}
          >
            Back
          </Button>
          {weeklyReviewStep < 5 ? (
            <Button size="sm" onClick={() => setWeeklyReviewStep(weeklyReviewStep + 1)}>
              {weeklyReviewStep === 0 ? "Continue" : "Next Step"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <CompleteButton />
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* Step 1: Inbox */
function InboxStep() {
  const { data: items } = useItems("inbox");
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { incrementReviewStat } = useAppStore();

  if (!items || items.length === 0) {
    return <StepEmpty title="Inbox Zero!" message="Nothing to process. Your mind is clear." />;
  }

  const handleClarify = (id: string, state: string) => {
    updateItem.mutate({ id, state } as any);
    incrementReviewStat("processed");
  };

  return (
    <div>
      <StepHeader title="Process Inbox" count={items.length} />
      <div className="space-y-2 mt-4">
        {items.map((item) => (
          <ReviewItemRow key={item.id} item={item}>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleClarify(item.id, "next")}>Next</Button>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleClarify(item.id, "someday")}>Someday</Button>
              <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => { deleteItem.mutate(item.id); incrementReviewStat("processed"); }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </ReviewItemRow>
        ))}
      </div>
    </div>
  );
}

/* Step 2: Next Actions */
function NextActionsStep() {
  const { data: items } = useItems("next");
  const completeItem = useCompleteItem();
  const updateItem = useUpdateItem();
  const { incrementReviewStat } = useAppStore();

  if (!items || items.length === 0) {
    return <StepEmpty title="No next actions" message="Add some from your inbox or projects." />;
  }

  return (
    <div>
      <StepHeader title="Review Next Actions" count={items.length} />
      <div className="space-y-2 mt-4">
        {items.map((item) => (
          <ReviewItemRow key={item.id} item={item}>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { completeItem.mutate(item.id); incrementReviewStat("completed"); }}>
                <Check className="h-3 w-3 mr-1" /> Done
              </Button>
              <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => updateItem.mutate({ id: item.id, state: "someday" } as any)}>
                Defer
              </Button>
            </div>
          </ReviewItemRow>
        ))}
      </div>
    </div>
  );
}

/* Step 3: Projects */
function ProjectsStep() {
  const { data: projects } = useProjects("active");
  const { incrementReviewStat } = useAppStore();

  if (!projects || projects.length === 0) {
    return <StepEmpty title="No active projects" message="You have no projects to review." />;
  }

  return (
    <div>
      <StepHeader title="Review Projects" count={projects.length} />
      <div className="space-y-2 mt-4">
        {projects.map((p) => (
          <ProjectReviewRow key={p.id} project={p} onReviewed={() => incrementReviewStat("projectsReviewed")} />
        ))}
      </div>
    </div>
  );
}

function ProjectReviewRow({ project, onReviewed }: { project: Project; onReviewed: () => void }) {
  const { data: items } = useProjectItems(project.id);
  const incomplete = items?.filter((i) => i.state !== "completed") ?? [];
  const total = items?.length ?? 0;
  const done = total - incomplete.length;
  const hasNextAction = incomplete.length > 0;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{project.title}</p>
        <p className="text-xs text-muted-foreground">{done}/{total} actions · {project.type}</p>
      </div>
      {hasNextAction ? (
        <button onClick={onReviewed} className="flex items-center gap-1 text-xs text-success-green hover:underline">
          <Check className="h-3.5 w-3.5" /> OK
        </button>
      ) : (
        <span className="text-xs text-overdue-red font-medium">Needs action</span>
      )}
    </div>
  );
}

/* Step 4: Someday */
function SomedayStep() {
  const { data: items } = useItems("someday");
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { incrementReviewStat } = useAppStore();

  if (!items || items.length === 0) {
    return <StepEmpty title="No someday items" message="Nothing waiting in the wings." />;
  }

  return (
    <div>
      <StepHeader title="Someday/Maybe" count={items.length} />
      <p className="text-sm text-muted-foreground mb-4">Is now the time for any of these?</p>
      <div className="space-y-2">
        {items.map((item) => (
          <ReviewItemRow key={item.id} item={item}>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { updateItem.mutate({ id: item.id, state: "next" } as any); incrementReviewStat("processed"); }}>
                Promote
              </Button>
              <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => deleteItem.mutate(item.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </ReviewItemRow>
        ))}
      </div>
    </div>
  );
}

/* Step 5: Scheduled */
function ScheduledStep() {
  const { data: items } = useItems("scheduled");
  const updateItem = useUpdateItem();

  if (!items || items.length === 0) {
    return <StepEmpty title="No scheduled items" message="Nothing on the calendar." />;
  }

  return (
    <div>
      <StepHeader title="Scheduled Items" count={items.length} />
      <div className="space-y-2 mt-4">
        {items.map((item) => (
          <ReviewItemRow key={item.id} item={item}>
            <div className="flex items-center gap-2">
              {item.scheduled_date && (
                <span className="text-xs text-muted-foreground">{item.scheduled_date}</span>
              )}
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateItem.mutate({ id: item.id, state: "next" } as any)}>
                Act Now
              </Button>
            </div>
          </ReviewItemRow>
        ))}
      </div>
    </div>
  );
}

/* Step 6: Complete */
function CompleteStep() {
  const { reviewStats } = useAppStore();
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <PartyPopper className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Review Complete!</h3>
      <p className="text-muted-foreground mb-6">Your system is clean and trusted.</p>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">{reviewStats.processed}</p>
          <p className="text-xs text-muted-foreground">Processed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{reviewStats.completed}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{reviewStats.projectsReviewed}</p>
          <p className="text-xs text-muted-foreground">Projects Reviewed</p>
        </div>
      </div>
    </div>
  );
}

function CompleteButton() {
  const { setWeeklyReviewOpen, resetReviewState } = useAppStore();
  const saveReview = useSaveReviewTimestamp();
  const navigate = useNavigate();

  return (
    <Button
      size="sm"
      onClick={async () => {
        await saveReview.mutateAsync();
        setWeeklyReviewOpen(false);
        resetReviewState();
        navigate("/inbox");
      }}
    >
      Close Review
    </Button>
  );
}

/* Shared components */
function StepHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{count} items</span>
    </div>
  );
}

function StepEmpty({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <Check className="h-10 w-10 text-primary mb-3" />
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function ReviewItemRow({ item, children }: { item: Item; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3 gap-3">
      <p className="text-sm text-foreground truncate min-w-0 flex-1">{item.title}</p>
      {children}
    </div>
  );
}
