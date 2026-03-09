import { useState } from "react";
import { Zap, X } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function OverLimitBanner() {
  const { isPro } = useSubscription();
  const { isOverAnyLimit, isApproachingLimit, activeItemCount, activeItemLimit } = useUsageLimits();
  const [dismissed, setDismissed] = useState(false);
  const [approachingDismissed, setApproachingDismissed] = useState(false);

  if (isPro) return null;

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to start checkout");
    }
  };

  if (isOverAnyLimit && !dismissed) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-focus/10 border-b border-focus/20">
        <Zap className="h-4 w-4 text-focus shrink-0" />
        <p className="text-xs text-foreground flex-1">
          You're over the free plan limits. <button onClick={handleUpgrade} className="underline font-medium text-focus">Upgrade to Pro</button> or archive some items to continue creating.
        </p>
        <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (isApproachingLimit && !approachingDismissed) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-focus-gold/8 border-b border-focus-gold/15">
        <Zap className="h-4 w-4 text-focus-gold shrink-0" />
        <p className="text-xs text-muted-foreground flex-1">
          You're approaching the free limit ({activeItemCount}/{activeItemLimit} items). <button onClick={handleUpgrade} className="underline font-medium text-focus-gold">Upgrade for unlimited</button>
        </p>
        <button onClick={() => setApproachingDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
