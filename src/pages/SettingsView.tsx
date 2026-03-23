import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, RefreshCw, Calendar, Check, Loader2, AlertTriangle, Key, Copy, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ViewHeader } from "@/components/ViewHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAreas, useCreateArea, useDeleteArea } from "@/hooks/useAreas";
import { useTags, useCreateTag, useDeleteTag, usePurgeAllData } from "@/hooks/useTags";
import { useContacts, useCreateContact, useDeleteContact } from "@/hooks/useContacts";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleCalendarStatus, useConnectGoogleCalendar, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { AdminSection } from "@/components/AdminSection";
import { SubscriptionSection } from "@/components/SubscriptionSection";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSaveGlobalTheme, useSaveAreaTheme } from "@/hooks/useTheme";
import { ThemePicker } from "@/components/ThemePicker";
import { toast } from "sonner";

export default function SettingsView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { data: areas } = useAreas();
  const { data: tags } = useTags();
  const { data: contacts } = useContacts();
  const createArea = useCreateArea();
  const deleteArea = useDeleteArea();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const purgeAllData = usePurgeAllData();
  const { data: calendarToken, refetch: refetchCalendar } = useGoogleCalendarStatus();
  const connectCalendar = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectGoogleCalendar();
  const [newArea, setNewArea] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newContact, setNewContact] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { canCreateArea, areaCount, areaLimit } = useUsageLimits();
  const { data: settings } = useUserSettings();
  const saveGlobalTheme = useSaveGlobalTheme();
  const saveAreaTheme = useSaveAreaTheme();

  // Handle callback from Google OAuth
  useEffect(() => {
    const subParam = searchParams.get("subscription");
    if (subParam === "success") {
      toast.success("Welcome to Pro! 🎉");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["usage-limits"] });
      setSearchParams({}, { replace: true });
    } else if (subParam === "canceled") {
      setSearchParams({}, { replace: true });
    }

    const calendarParam = searchParams.get("calendar");
    if (calendarParam === "connected") {
      toast.success("Google Calendar connected!");
      refetchCalendar();
      setSearchParams({}, { replace: true });
    } else if (calendarParam === "error") {
      toast.error("Failed to connect Google Calendar");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, refetchCalendar, setSearchParams, queryClient]);

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    if (!canCreateArea) {
      setShowUpgrade(true);
      return;
    }
    await createArea.mutateAsync(newArea.trim());
    setNewArea("");
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    await createTag.mutateAsync(newTag.trim());
    setNewTag("");
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.trim()) return;
    await createContact.mutateAsync(newContact.trim());
    setNewContact("");
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

        {/* Subscription */}
        <SubscriptionSection />

        {/* Global Theme */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-2">Theme</h2>
          <p className="text-xs text-muted-foreground mb-3">Choose a global color palette for the app.</p>
          <ThemePicker
            value={settings?.theme ?? "default"}
            onChange={(id) => saveGlobalTheme.mutate(id)}
          />
        </section>

        {/* Areas */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Areas of Focus</h2>
          <div className="space-y-3 mb-3">
            {areas?.map((area) => (
              <div key={area.id} className="bg-card border border-border rounded-md px-3 py-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{area.name}</span>
                  <button onClick={() => deleteArea.mutate(area.id)} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Area theme</p>
                  <ThemePicker
                    value={(area as any).theme}
                    onChange={(id) => saveAreaTheme.mutate({ areaId: area.id, themeId: id })}
                    allowNone
                    onNone={() => saveAreaTheme.mutate({ areaId: area.id, themeId: null })}
                  />
                </div>
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
              <div key={tag.id} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
                <span className="text-sm">{tag.name}</span>
                <button onClick={() => deleteTag.mutate(tag.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
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

        {/* Contacts */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Contacts</h2>
          <p className="text-xs text-muted-foreground mb-3">People you delegate tasks to. Used in the "Waiting On" field.</p>
          <div className="space-y-2 mb-3">
            {contacts?.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2">
                <span className="text-sm">{contact.name}</span>
                <button onClick={() => deleteContact.mutate(contact.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddContact} className="flex gap-2">
            <Input placeholder="New contact…" value={newContact} onChange={(e) => setNewContact(e.target.value)} className="flex-1" />
            <Button type="submit" size="sm" variant="outline" disabled={!newContact.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <Button variant="outline" onClick={signOut} className="w-full">Sign Out</Button>

        {/* Admin Section - only visible to admin */}
        {user?.email === "levijohnson@gmail.com" && (
          <AdminSection />
        )}

        {/* Purge All Data */}
        <section>
          <h2 className="text-sm font-medium text-destructive mb-3">Danger Zone</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <AlertTriangle className="h-4 w-4" />
                Purge All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your tasks, projects, areas, tags, and settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    purgeAllData.mutate(undefined, {
                      onSuccess: () => {
                        toast.success("All data has been purged");
                        navigate("/inbox");
                      },
                      onError: () => toast.error("Failed to purge data"),
                    });
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {purgeAllData.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, delete everything"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
      <UpgradePrompt
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        trigger="areas"
        currentUsage={areaCount}
        limit={areaLimit === Infinity ? 3 : areaLimit}
      />
    </div>
  );
}
