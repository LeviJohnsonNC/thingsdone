import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { path: "/features", label: "Features" },
  { path: "/pricing", label: "Pricing" },
  { path: "/blog", label: "Blog" },
  { path: "/about", label: "About" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-semibold text-foreground tracking-tight">
          Things Done.
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[15px] font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild className="ml-2">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border/50">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
