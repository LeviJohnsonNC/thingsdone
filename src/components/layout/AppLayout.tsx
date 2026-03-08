import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickAddFAB } from "../QuickAddFAB";
import { WeeklyReviewWizard } from "../WeeklyReviewWizard";
import { useAppStore } from "@/stores/appStore";

export function AppLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const setEditingItemId = useAppStore((s) => s.setEditingItemId);

  useEffect(() => {
    setEditingItemId(null);
  }, [location.pathname, setEditingItemId]);

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <MobileBottomNav />
        <QuickAddFAB />
        <WeeklyReviewWizard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <QuickAddFAB />
      <WeeklyReviewWizard />
    </div>
  );
}
