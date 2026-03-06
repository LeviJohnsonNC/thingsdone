import { useNavigate, useLocation } from "react-router-dom";
import { Inbox, Star, ArrowRight, FolderOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { MobileMoreMenu } from "./MobileMoreMenu";

const TABS = [
  { path: "/inbox", icon: Inbox, label: "Inbox", badge: true },
  { path: "/focus", icon: Star, label: "Focus" },
  { path: "/next", icon: ArrowRight, label: "Next" },
  { path: "/projects", icon: FolderOpen, label: "Projects" },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: inboxItems } = useItems("inbox");
  const { moreMenuOpen, setMoreMenuOpen } = useAppStore();

  const inboxCount = inboxItems?.length ?? 0;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm safe-area-inset-bottom">
        <div className="flex items-stretch">
          {TABS.map((tab) => {
            const isActive = location.pathname === tab.path ||
              (tab.path === "/inbox" && location.pathname === "/");
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors min-h-[52px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <tab.icon className="h-5 w-5" />
                  {tab.badge && inboxCount > 0 && (
                    <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-1">
                      {inboxCount}
                    </span>
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMoreMenuOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] min-h-[52px]",
              moreMenuOpen ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>
      <MobileMoreMenu />
    </>
  );
}
