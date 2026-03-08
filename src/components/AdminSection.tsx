import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Database, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminSection() {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTestData = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-test-data");

      if (error) throw error;

      if (data?.success) {
        const s = data.summary;
        toast.success(
          `Generated: ${s.areas} areas, ${s.tags} tags, ${s.projects} projects, ${s.items} items, ${s.item_tags} tag links`
        );
        // Invalidate all relevant queries
        queryClient.invalidateQueries({ queryKey: ["areas"] });
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
        queryClient.invalidateQueries({ queryKey: ["item_tags"] });
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("Generate test data error:", err);
      toast.error(err.message || "Failed to generate test data");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="border-2 border-dashed border-purple-400/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-purple-500" />
        <h2 className="text-sm font-medium text-purple-600 dark:text-purple-400">Admin</h2>
      </div>
      <Button
        variant="outline"
        className="w-full gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-950"
        onClick={handleGenerateTestData}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {isGenerating ? "Generating…" : "Generate Test Data"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Uses AI to generate realistic GTD data (areas, tags, projects, items).
      </p>
    </section>
  );
}
