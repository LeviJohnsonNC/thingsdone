import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Star,
  Calendar,
  FolderOpen,
  Inbox,
  Clock,
  CircleDot,
  ChevronRight,
  Tag,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";

type MockupVariant = "tasks" | "inbox" | "editor" | "projects" | "project-detail" | "review";

interface ProductMockupProps {
  variant: MockupVariant;
  className?: string;
  compact?: boolean;
}

/* ── Shared chrome ── */
function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--focus-gold))]/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--success-green))]/25" />
      </div>
      <span className="ml-1 text-[11px] font-medium text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

function MockRow({
  icon: Icon,
  text,
  tag,
  checked,
  starred,
}: {
  icon: React.ElementType;
  text: string;
  tag?: string;
  checked?: boolean;
  starred?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Icon
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          checked ? "text-[hsl(var(--success-green))]" : "text-muted-foreground"
        )}
      />
      <span
        className={cn(
          "flex-1 text-[13px]",
          checked
            ? "text-muted-foreground line-through"
            : "text-foreground"
        )}
      >
        {text}
      </span>
      {starred && (
        <Star className="h-3.5 w-3.5 fill-[hsl(var(--focus-gold))] text-[hsl(var(--focus-gold))]" />
      )}
      {tag && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
          {tag}
        </span>
      )}
    </div>
  );
}

/* ── Variant content ── */

function TasksContent() {
  return (
    <div className="divide-y divide-border">
      <MockRow icon={CheckSquare} text="Review quarterly goals" tag="Focus" starred />
      <MockRow icon={Star} text="Prepare team presentation" tag="Next" />
      <MockRow icon={Calendar} text="Schedule dentist appointment" tag="Scheduled" />
      <MockRow icon={FolderOpen} text="Research new project tools" tag="Someday" />
      <MockRow icon={CheckSquare} text="Send invoice to client" checked />
    </div>
  );
}

function InboxContent() {
  return (
    <div>
      {/* Quick-add bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="text-[12px] text-muted-foreground/60">Add a task…</span>
        <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</span>
      </div>
      <div className="divide-y divide-border">
        <MockRow icon={Inbox} text="Book flights for conference" />
        <MockRow icon={Inbox} text="Read article on GTD® workflows" />
        <MockRow icon={Inbox} text="Call insurance company" />
        <MockRow icon={Inbox} text="Order new monitor cable" />
        <MockRow icon={Inbox} text="Review onboarding feedback" />
      </div>
    </div>
  );
}

function EditorContent() {
  return (
    <div className="p-4 space-y-3">
      <div className="text-sm font-medium text-foreground">
        Prepare team presentation
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <FolderOpen className="h-3 w-3" />
          <span>Q1 Planning</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>45 min</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <CircleDot className="h-3 w-3" />
          <span>High energy</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Due Mar 14</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span className="flex gap-1">
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">@office</span>
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">presentation</span>
          </span>
        </div>
      </div>
      {/* Checklist */}
      <div className="space-y-1 pt-1">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Checklist</div>
        <div className="flex items-center gap-2 text-[12px]">
          <Check className="h-3 w-3 text-[hsl(var(--success-green))]" />
          <span className="text-muted-foreground line-through">Gather sprint metrics</span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <div className="h-3 w-3 rounded-sm border border-border" />
          <span className="text-foreground">Draft slide outline</span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <div className="h-3 w-3 rounded-sm border border-border" />
          <span className="text-foreground">Add roadmap updates</span>
        </div>
      </div>
      <div className="rounded-md bg-accent/50 p-2.5 text-[12px] text-muted-foreground leading-relaxed">
        Outline slides for Monday standup. Include metrics from last sprint and roadmap updates.
      </div>
    </div>
  );
}

function ProjectsContent() {
  const projects = [
    { name: "Q1 Planning", count: 4, active: true },
    { name: "Website Redesign", count: 7 },
    { name: "Onboarding Flow", count: 3 },
    { name: "Move to new office", count: 2 },
  ];
  return (
    <div className="divide-y divide-border">
      {projects.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-3 px-4 py-2.5"
        >
          <FolderOpen
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              p.active ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span className="flex-1 text-[13px] text-foreground">
            {p.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {p.count} actions
          </span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}

function ProjectDetailContent() {
  const actions = [
    { text: "Define project scope", done: true },
    { text: "Create wireframes", done: true },
    { text: "Set up staging environment", done: false, isNext: true },
    { text: "Build landing page", done: false },
    { text: "Write launch copy", done: false },
    { text: "QA and deploy", done: false },
  ];
  const completed = actions.filter((a) => a.done).length;
  const pct = Math.round((completed / actions.length) * 100);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">Website Redesign</div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Sequential</span>
      </div>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{completed}/{actions.length} actions</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-accent overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {/* Area */}
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Zap className="h-3 w-3" />
        <span>Area: Work</span>
      </div>
      {/* Actions list */}
      <div className="space-y-0.5">
        {actions.map((a) => (
          <div
            key={a.text}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px]",
              a.isNext && "bg-primary/8 ring-1 ring-primary/20"
            )}
          >
            {a.done ? (
              <Check className="h-3 w-3 shrink-0 text-[hsl(var(--success-green))]" />
            ) : (
              <div className={cn(
                "h-3 w-3 shrink-0 rounded-sm border",
                a.isNext ? "border-primary" : "border-border"
              )} />
            )}
            <span className={cn(
              a.done ? "text-muted-foreground line-through" : "text-foreground",
              a.isNext && "font-medium text-primary"
            )}>
              {a.text}
            </span>
            {a.isNext && (
              <span className="ml-auto text-[10px] text-primary">Next →</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewContent() {
  const steps = [
    { label: "Clear your head", done: true },
    { label: "Process inbox", done: true },
    { label: "Review next actions", done: false, active: true },
    { label: "Review waiting", done: false },
    { label: "Review projects", done: false },
    { label: "Summary", done: false },
  ];
  return (
    <div className="p-4 space-y-3">
      <div className="text-sm font-medium text-foreground">Weekly Review</div>
      <div className="space-y-1.5">
        {steps.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px]",
              s.active
                ? "bg-primary/10 text-primary font-medium"
                : s.done
                ? "text-muted-foreground"
                : "text-muted-foreground/60"
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                s.done
                  ? "bg-[hsl(var(--success-green))]"
                  : s.active
                  ? "bg-primary"
                  : "bg-border"
              )}
            />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const VARIANT_MAP: Record<MockupVariant, { title: string; content: React.FC }> = {
  tasks: { title: "Things Done. — Next", content: TasksContent },
  inbox: { title: "Things Done. — Inbox", content: InboxContent },
  editor: { title: "Things Done. — Detail", content: EditorContent },
  projects: { title: "Things Done. — Projects", content: ProjectsContent },
  "project-detail": { title: "Things Done. — Project", content: ProjectDetailContent },
  review: { title: "Things Done. — Review", content: ReviewContent },
};

export function ProductMockup({ variant, className, compact }: ProductMockupProps) {
  const { title, content: Content } = VARIANT_MAP[variant];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-lg",
        compact && "text-[13px]",
        className
      )}
    >
      <WindowChrome title={title} />
      <Content />
    </div>
  );
}
