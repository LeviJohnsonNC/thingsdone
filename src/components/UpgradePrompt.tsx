import { useState } from "react";
import { Zap, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UpgradeTrigger = "items" | "projects" | "areas" | "ai_review" | "ai_coach";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: UpgradeTrigger;
  currentUsage: number;
  limit: number;
}

const triggerMessages: Record<UpgradeTrigger, (used: number, limit: number) => string> = {
  items: (u, l) => `You're using ${u} of ${l} active items.`,
  projects: (u, l) => `You're using ${u} of ${l} active projects.`,
  areas: (u, l) => `You're using ${u} of ${l} areas of focus.`,
  ai_review: (u, l) => `You've used ${u} of ${l} free AI reviews this month.`,
  ai_coach: (u, l) => `You've used ${u} of ${l} free AI coach messages this month.`,
};

const PRO_FEATURES = [
  "Unlimited items & projects",
  "Unlimited areas of focus",
  "Unlimited AI weekly reviews *",
  "AI coach *",
  "Review history & insights *",
  "Quick Review mode *",
];

export function UpgradePrompt({ open, onOpenChange, trigger, currentUsage, limit }: UpgradePromptProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-focus" />
            You've reached the free plan limit
          </DialogTitle>
          <DialogDescription className="text-sm">
            {triggerMessages[trigger](currentUsage, limit)} Upgrade to Pro for unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-card p-4 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Things Done Pro</span>
            <span className="text-sm text-muted-foreground">$4/month</span>
          </div>
          <ul className="space-y-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-success-green shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">* coming soon</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button onClick={handleUpgrade} disabled={loading} className="w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Upgrade to Pro
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full text-muted-foreground">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
