import { useNavigate } from "react-router-dom";
import { Calendar, Hourglass, Cloud, BookOpen, Settings, LogOut, ClipboardList } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/hooks/useAuth";
import { useAreas } from "@/hooks/useAreas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MORE_ITEMS = [
  { path: "/scheduled", icon: Calendar, label: "Scheduled" },
  { path: "/waiting", icon: Hourglass, label: "Waiting" },
  { path: "/someday", icon: Cloud, label: "Someday" },
  { path: "/logbook", icon: BookOpen, label: "Logbook" },
];

export function MobileMoreMenu() {
  const navigate = useNavigate();
  const { moreMenuOpen, setMoreMenuOpen, selectedAreaId, setSelectedAreaId } = useAppStore();
  const { signOut, user } = useAuth();
  const { data: areas } = useAreas();

  const handleNav = (path: string) => {
    navigate(path);
    setMoreMenuOpen(false);
  };

  return (
    <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <div className="py-2 space-y-1">
          {/* Area of Focus */}
          <div className="px-2 pb-3">
            <p className="text-xs text-muted-foreground mb-1.5">Area of Focus</p>
            <Select
              value={selectedAreaId ?? "all"}
              onValueChange={(v) => setSelectedAreaId(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Navigation */}
          {MORE_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent rounded-md transition-colors min-h-[44px]"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span>{item.label}</span>
            </button>
          ))}

          <Separator />

          <button
            onClick={() => handleNav("/settings")}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent rounded-md transition-colors min-h-[44px]"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => { signOut(); setMoreMenuOpen(false); }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-accent rounded-md transition-colors min-h-[44px]"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>

          {/* User info */}
          {user?.email && (
            <>
              <Separator />
              <p className="px-4 py-2 text-xs text-muted-foreground truncate">{user.email}</p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
