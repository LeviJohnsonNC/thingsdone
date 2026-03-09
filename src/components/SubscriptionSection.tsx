import { useState } from "react";
import { Zap, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export function SubscriptionSection() {
  const sub = useSubscription();
  const limits = useUsageLimits();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to open subscription management");
    } finally {
      setPortalLoading(false);
    }
  };

  // Past due state
  if (sub.status === "past_due") {
    return (
      <section>
        <h2 className="text-sm font-medium text-foreground mb-3">Subscription</h2>
        <div className="rounded-lg border border-destructive/50 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Payment failed</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Update your payment method to keep Pro.
          </p>
          <Button size="sm" variant="outline" className="w-full" onClick={handleManage} disabled={portalLoading}>
            {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Payment"}
          </Button>
        </div>
      </section>
    );
  }

  // Active Pro (possibly canceling)
  if (sub.isPro) {
    const endDate = sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), "MMMM d, yyyy") : "";
    return (
      <section>
        <h2 className="text-sm font-medium text-foreground mb-3">Subscription</h2>
        <div className="rounded-lg border border-primary/30 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-focus" />
            <span className="text-sm font-medium">
              {sub.cancelAtPeriodEnd ? `Pro Plan — Cancels ${endDate}` : `Pro Plan — $4/month`}
            </span>
          </div>
          {sub.cancelAtPeriodEnd ? (
            <p className="text-xs text-muted-foreground">
              You'll switch to the Free plan after your current billing period.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Renews {endDate}</p>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={handleManage} disabled={portalLoading}>
            {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : sub.cancelAtPeriodEnd ? "Resubscribe" : "Manage Subscription"}
          </Button>
        </div>
      </section>
    );
  }

  // Free tier
  return (
    <section>
      <h2 className="text-sm font-medium text-foreground mb-3">Subscription</h2>
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <span className="text-sm font-medium">Free Plan</span>
        <div className="space-y-2">
          <UsageBar label="Items" used={limits.activeItemCount} max={limits.activeItemLimit} />
          <UsageBar label="Projects" used={limits.activeProjectCount} max={limits.activeProjectLimit} />
          <UsageBar label="Areas" used={limits.areaCount} max={limits.areaLimit} />
          <UsageBar label="AI Reviews" used={limits.aiReviewsUsed} max={limits.aiReviewLimit} suffix="/month" />
        </div>
        <Button size="sm" className="w-full gap-2" onClick={handleUpgrade} disabled={checkoutLoading}>
          {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          Upgrade to Pro — $4/mo
        </Button>
      </div>
    </section>
  );
}

function UsageBar({ label, used, max, suffix }: { label: string; used: number; max: number; suffix?: string }) {
  const pct = max === Infinity ? 0 : Math.min((used / max) * 100, 100);
  const atLimit = max !== Infinity && used >= max;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={atLimit ? "text-destructive font-medium" : ""}>
          {used} / {max === Infinity ? "∞" : max}{suffix ?? ""}
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
