import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Check, Brain, ListTodo, Zap } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Step = "welcome" | "capture" | "clarify" | "celebrate";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [thoughts, setThoughts] = useState(["", "", ""]);
  const [createdItemIds, setCreatedItemIds] = useState<string[]>([]);
  const [selectedItemTitle, setSelectedItemTitle] = useState<string | null>(null);
  const createItem = useCreateItem();
  const { completeOnboarding } = useOnboarding();
  const setClarifyItemId = useAppStore((s) => s.setClarifyItemId);

  const filledThoughts = thoughts.filter((t) => t.trim().length > 0);
  const canContinueCapture = filledThoughts.length >= 1;

  const handleThoughtChange = (index: number, value: string) => {
    const newThoughts = [...thoughts];
    newThoughts[index] = value;
    setThoughts(newThoughts);
  };

  const handleCaptureSubmit = async () => {
    const itemsToCreate = filledThoughts;
    const ids: string[] = [];

    for (const title of itemsToCreate) {
      const result = await createItem.mutateAsync({ title, state: "inbox" });
      if (result?.id) ids.push(result.id);
    }

    setCreatedItemIds(ids);
    setSelectedItemTitle(itemsToCreate[0]);
    setStep("clarify");
  };

  const handleClarifyItem = () => {
    if (createdItemIds.length > 0) {
      setClarifyItemId(createdItemIds[0]);
    }
    setStep("celebrate");
  };

  const handleFinish = async () => {
    await completeOnboarding.mutateAsync();
    onComplete();
  };

  const stepContent: Record<Step, React.ReactNode> = {
    welcome: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center text-center px-2"
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Welcome to Things Done
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Let's clear your mind in under 2 minutes. We'll show you the simple
          system that keeps everything organized.
        </p>
        <Button size="lg" onClick={() => setStep("capture")} className="gap-2">
          Get Started <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    ),

    capture: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center text-center px-2"
      >
        <div className="h-16 w-16 rounded-2xl bg-focus/10 flex items-center justify-center mb-6">
          <ListTodo className="h-8 w-8 text-focus" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          What's on your mind?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Type anything — tasks, ideas, reminders. Don't overthink it.
        </p>

        <div className="w-full max-w-sm space-y-3 mb-6">
          {thoughts.map((thought, i) => (
            <Input
              key={i}
              value={thought}
              onChange={(e) => handleThoughtChange(i, e.target.value)}
              placeholder={
                i === 0
                  ? "e.g., Call mom"
                  : i === 1
                  ? "e.g., Research vacation spots"
                  : "e.g., Buy groceries"
              }
              className="text-center"
            />
          ))}
        </div>

        <Button
          size="lg"
          onClick={handleCaptureSubmit}
          disabled={!canContinueCapture || createItem.isPending}
          className="gap-2"
        >
          {createItem.isPending ? "Saving..." : "Continue"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    ),

    clarify: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center text-center px-2"
      >
        <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
          <Zap className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Now let's clarify one
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Tap below to decide what to do with it — is it a next action, a
          project, or something for later?
        </p>

        <button
          onClick={handleClarifyItem}
          className={cn(
            "w-full max-w-sm p-4 rounded-xl border-2 border-dashed",
            "border-primary/30 bg-primary/5 hover:bg-primary/10",
            "transition-colors cursor-pointer text-left"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-primary/50" />
            <span className="text-foreground font-medium">{selectedItemTitle}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-8">
            Tap to open the clarify panel →
          </p>
        </button>
      </motion.div>
    ),

    celebrate: (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center text-center px-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-focus flex items-center justify-center mb-6"
        >
          <Sparkles className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          🎉 You just did GTD!
        </h2>
        <p className="text-muted-foreground mb-2 max-w-sm">
          That's the whole system:
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-6">
          <span className="px-2 py-1 rounded bg-primary/10 text-primary">Capture</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="px-2 py-1 rounded bg-focus/10 text-focus">Clarify</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="px-2 py-1 rounded bg-success/10 text-success">Do</span>
        </div>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs">
          Your thoughts are now in your Inbox. Clarify them when you're ready,
          and check the <strong>Next</strong> view to see what to do.
        </p>
        <Button size="lg" onClick={handleFinish} className="gap-2">
          <Check className="h-4 w-4" /> Start Using the App
        </Button>
      </motion.div>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md p-8"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">{stepContent[step]}</AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
