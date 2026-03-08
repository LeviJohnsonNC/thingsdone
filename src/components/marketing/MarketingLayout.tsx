import { ReactNode } from "react";
import { MarketingNav } from "./MarketingNav";
import { MarketingFooter } from "./MarketingFooter";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1 pt-16">{children}</main>
      <MarketingFooter />
    </div>
  );
}
