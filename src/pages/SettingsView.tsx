import { useState } from "react";
import { ArrowLeft, Plus, Trash2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ViewHeader } from "@/components/ViewHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAreas, useCreateArea, useDeleteArea } from "@/hooks/useAreas";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsReview } from "@/hooks/useUserSettings";
import { useAppStore } from "@/stores/appStore";

export default function SettingsView() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: areas } = useAreas();
  const { data: tags } = useTags();
  const createArea = useCreateArea();
  const deleteArea = useDeleteArea();
  const createTag = useCreateTag();
  const needsReview = useNeedsReview();
  const { setWeeklyReviewOpen } = useAppStore();
  const [newArea, setNewArea] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    await createArea.mutateAsync(newArea.trim());
    setNewArea("");
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    await createTag.mutateAsync(newTag.trim());
    setNewTag("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="p-1 md:hidden">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 max-w-lg">
        {/* Account */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-2">Account</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </section>

        {/* Areas */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Areas of Focus</h2>
          <div className="space-y-2 mb-3">
            {areas?.map((area) => (
              <div key={area.id} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
                <span className="text-sm">{area.name}</span>
                <button onClick={() => deleteArea.mutate(area.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddArea} className="flex gap-2">
            <Input placeholder="New area…" value={newArea} onChange={(e) => setNewArea(e.target.value)} className="flex-1" />
            <Button type="submit" size="sm" variant="outline" disabled={!newArea.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </section>

        {/* Tags */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Context Tags</h2>
          <div className="space-y-2 mb-3">
            {tags?.map((tag) => (
              <div key={tag.id} className="flex items-center bg-card border border-border rounded-md px-3 py-2">
                <span className="text-sm">{tag.name}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddTag} className="flex gap-2">
            <Input placeholder="New tag (e.g. @home)…" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="flex-1" />
            <Button type="submit" size="sm" variant="outline" disabled={!newTag.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <Button variant="outline" onClick={signOut} className="w-full">Sign Out</Button>
      </div>
    </div>
  );
}
