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
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/legal" className="hover:text-foreground transition-colors">Terms &amp; Privacy</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-6">
        <p className="text-[11px] leading-relaxed text-muted-foreground/70 text-center">
          GTD® and Getting Things Done® are registered trademarks of the David Allen Company. Things Done. is not affiliated with or endorsed by the David Allen Company.
        </p>
      </div>
    </footer>
  );
}
