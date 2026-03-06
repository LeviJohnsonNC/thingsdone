import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickAddFAB } from "../QuickAddFAB";
import { ClarifySheet } from "../ClarifySheet";

export function AppLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <MobileBottomNav />
        <QuickAddFAB />
        <ClarifySheet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <QuickAddFAB />
      <ClarifySheet />
    </div>
  );
}
