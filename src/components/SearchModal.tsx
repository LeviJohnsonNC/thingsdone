import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Inbox, ArrowRight, Star, Calendar, Hourglass, Cloud, FileText, FolderOpen, Search } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { useProjects } from "@/hooks/useProjects";
import { useAppStore } from "@/stores/appStore";

const STATE_ICONS: Record<string, typeof Inbox> = {
  inbox: Inbox,
  next: ArrowRight,
  focus: Star,
  scheduled: Calendar,
  waiting: Hourglass,
  someday: Cloud,
  reference: FileText,
};

export function SearchModal() {
  const { searchOpen, setSearchOpen, setEditingItemId } = useAppStore();
  const navigate = useNavigate();
  const { data: items } = useItems();
  const { data: projects } = useProjects("active");

  const filteredItems = useMemo(() => items?.slice(0, 100) ?? [], [items]);

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Search items, projects…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredItems.length > 0 && (
          <CommandGroup heading="Items">
            {filteredItems.map((item) => {
              const Icon = STATE_ICONS[item.state] ?? Inbox;
              return (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => {
                    setSearchOpen(false);
                    // Navigate to the right view and open editor
                    const route = item.state === "next" ? "/next" : item.state === "scheduled" ? "/scheduled" : item.state === "waiting" ? "/waiting" : item.state === "someday" ? "/someday" : item.state === "reference" ? "/reference" : "/inbox";
                    navigate(route);
                    setTimeout(() => setEditingItemId(item.id), 100);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{item.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">{item.state}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {projects && projects.length > 0 && (
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.title}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate(`/projects/${project.id}`);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{project.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
