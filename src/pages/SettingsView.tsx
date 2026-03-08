import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, RefreshCw, Calendar, Check, Loader2, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ViewHeader } from "@/components/ViewHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAreas, useCreateArea, useDeleteArea } from "@/hooks/useAreas";
import { useTags, useCreateTag, useDeleteTag, usePurgeAllData } from "@/hooks/useTags";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsReview } from "@/hooks/useUserSettings";
import { useGoogleCalendarStatus, useConnectGoogleCalendar, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useAppStore } from "@/stores/appStore";
import { toast } from "sonner";

export default function SettingsView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { data: areas } = useAreas();
  const { data: tags } = useTags();
  const createArea = useCreateArea();
  const deleteArea = useDeleteArea();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const purgeAllData = usePurgeAllData();
  const needsReview = useNeedsReview();
  const { setWeeklyReviewOpen } = useAppStore();
  const { data: calendarToken, refetch: refetchCalendar } = useGoogleCalendarStatus();
  const connectCalendar = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectGoogleCalendar();
  const [newArea, setNewArea] = useState("");
  const [newTag, setNewTag] = useState("");

  // Handle callback from Google OAuth
  useEffect(() => {
    const calendarParam = searchParams.get("calendar");
    if (calendarParam === "connected") {
      toast.success("Google Calendar connected!");
      refetchCalendar();
      setSearchParams({}, { replace: true });
    } else if (calendarParam === "error") {
      toast.error("Failed to connect Google Calendar");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, refetchCalendar, setSearchParams]);

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
        {/* Weekly Review */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Weekly Review</h2>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setWeeklyReviewOpen(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Start Weekly Review
            {needsReview && (
              <Badge variant="destructive" className="ml-auto text-[10px] h-5">Due</Badge>
            )}
          </Button>
        </section>

        {/* Connected Accounts */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Connected Accounts</h2>
          {calendarToken ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">Google Calendar</span>
                  <Check className="h-4 w-4 text-success-green" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground"
                  onClick={() => disconnectCalendar.mutate()}
                  disabled={disconnectCalendar.isPending}
                >
                  Disconnect
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["google_calendar_events"] });
                  toast.success("Calendar synced!");
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sync now
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => connectCalendar.mutate()}
              disabled={connectCalendar.isPending}
            >
              {connectCalendar.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              Connect Google Calendar
            </Button>
          )}
        </section>

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
