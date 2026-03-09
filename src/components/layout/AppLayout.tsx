import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickAddFAB } from "../QuickAddFAB";
import { useAppStore } from "@/stores/appStore";
import { OverLimitBanner } from "../OverLimitBanner";
import { useActiveTheme } from "@/hooks/useTheme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingModal } from "../onboarding/OnboardingModal";
import { SearchModal } from "../SearchModal";
import { GlobalQuickAdd } from "../GlobalQuickAdd";
import { BatchActionBar } from "../BatchActionBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function AppLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const setEditingItemId = useAppStore((s) => s.setEditingItemId);
  const { needsOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  useActiveTheme();
  useKeyboardShortcuts();

  useEffect(() => {
    setEditingItemId(null);
  }, [location.pathname, setEditingItemId]);

  useEffect(() => {
    if (!onboardingLoading && needsOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 300);
      return () => clearTimeout(timer);
    }
  }, [needsOnboarding, onboardingLoading]);

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <OverLimitBanner />
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <MobileBottomNav />
        <QuickAddFAB />
        <OnboardingModal open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
        <SearchModal />
        <GlobalQuickAdd />
        <BatchActionBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OverLimitBanner />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <QuickAddFAB />
      <OnboardingModal open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
      <SearchModal />
      <GlobalQuickAdd />
    </div>
  );
}
