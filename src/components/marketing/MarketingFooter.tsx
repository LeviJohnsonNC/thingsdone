import { Link } from "react-router-dom";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-[13px] text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Things Done.</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
