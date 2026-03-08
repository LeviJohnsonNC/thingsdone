import { useNavigate, useLocation } from "react-router-dom";
import {
  Inbox, Star, ArrowRight, Calendar, Hourglass, Cloud,
  FolderOpen, BookOpen, Settings, LogOut, ClipboardList
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useItems } from "@/hooks/useItems";
import { useAreas } from "@/hooks/useAreas";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAppStore } from "@/stores/appStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NAV_GROUPS = [
  {
    label: "Collect",
    items: [
      { path: "/inbox", icon: Inbox, label: "Inbox", badge: true },
    ],
  },
  {
    label: "Action",
    items: [
      { path: "/focus", icon: Star, label: "Focus" },
      { path: "/next", icon: ArrowRight, label: "Next" },
      { path: "/scheduled", icon: Calendar, label: "Scheduled" },
      { path: "/waiting", icon: Hourglass, label: "Waiting" },
      { path: "/someday", icon: Cloud, label: "Someday" },
    ],
  },
  {
    label: "Organize",
    items: [
      { path: "/projects", icon: FolderOpen, label: "Projects" },
      { path: "/review", icon: ClipboardList, label: "Weekly Review", reviewBadge: true },
    ],
  },
  {
    label: "Archive",
    items: [
      { path: "/logbook", icon: BookOpen, label: "Logbook" },
    ],
  },
];

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { data: inboxItems } = useItems("inbox");
  const { data: areas } = useAreas();
  const { selectedAreaId, setSelectedAreaId } = useAppStore();

  const inboxCount = inboxItems?.length ?? 0;

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Things Done.</h1>
        <div className="mt-3">
          <Select
            value={selectedAreaId ?? "all"}
            onValueChange={(v) => setSelectedAreaId(v === "all" ? null : v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas?.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === "/inbox" && location.pathname === "/");
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && inboxCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground px-1.5">
                      {inboxCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={() => navigate("/settings")}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
