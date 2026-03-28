import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TIME_ESTIMATE_OPTIONS, ENERGY_OPTIONS } from "@/lib/types";
import type { Item, EnergyLevel } from "@/lib/types";
import { RecurrenceSelector } from "@/components/RecurrenceSelector";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { useContacts, useCreateContact } from "@/hooks/useContacts";
import { useSubscription } from "@/hooks/useSubscription";
import { PropertyRow, SegmentButton } from "./PropertyRow";
import timeEstIcon from "@/assets/icons/time-est.svg";
import energyIcon from "@/assets/icons/energy.svg";
import projectIcon from "@/assets/icons/project.svg";
import areaIcon from "@/assets/icons/area.svg";
import waitingOnIcon from "@/assets/icons/waiting-on.svg";
import scheduledIcon from "@/assets/icons/scheduled.svg";

interface ItemPropertiesProps {
  item: Item;
  currentState: string;
  saveField: (field: keyof Item, value: Item[keyof Item]) => void;
  onStateChange: (state: string) => void;
}

export function ItemProperties({ item, currentState, saveField, onStateChange }: ItemPropertiesProps) {
  const { isPro } = useSubscription();
  const [showRecurrenceUpgrade, setShowRecurrenceUpgrade] = useState(false);
  const { data: projects } = useProjects("active");
  const { data: areas } = useAreas();
  const { data: contacts } = useContacts();
  const [waitingOn, setWaitingOn] = useState(item.waiting_on ?? "");

  const energy = item.energy as EnergyLevel | null;

  return (
    <div className="p-4 space-y-3">
      {/* Time Estimate + Energy */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <PropertyRow icon={timeEstIcon} label="TIME EST." className="flex-1">
          <div className="inline-flex bg-muted rounded-lg p-0.5 gap-0.5">
            <SegmentButton active={!item.time_estimate} onClick={() => saveField("time_estimate", null)}>
              —
            </SegmentButton>
            {TIME_ESTIMATE_OPTIONS.map((opt) => (
              <SegmentButton
                key={opt.value}
                active={item.time_estimate === opt.value}
                onClick={() => saveField("time_estimate", opt.value)}
              >
                {opt.label}
              </SegmentButton>
            ))}
          </div>
        </PropertyRow>

        <PropertyRow icon={energyIcon} label="ENERGY" className="flex-1">
          <div className="inline-flex bg-muted rounded-lg p-0.5 gap-0.5">
            <SegmentButton active={!energy} onClick={() => saveField("energy", null)}>
              —
            </SegmentButton>
            {ENERGY_OPTIONS.map((opt) => (
              <SegmentButton
                key={opt.value}
                active={energy === opt.value}
                onClick={() => saveField("energy", opt.value)}
              >
                <span className="flex items-center gap-1">
                  {energy === opt.value && (
                    <span className={cn("h-1.5 w-1.5 rounded-full", opt.dot)} />
                  )}
                  {opt.label}
                </span>
              </SegmentButton>
            ))}
          </div>
        </PropertyRow>
      </div>

      {/* Project + Area + Waiting On */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <PropertyRow icon={projectIcon} label="PROJECT" className="flex-1">
          <Select
            value={item.project_id ?? "none"}
            onValueChange={(v) => saveField("project_id", v === "none" ? null : v)}
          >
            <SelectTrigger className="h-8 text-sm border-0 shadow-none px-2 bg-transparent">
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project</SelectItem>
              {projects?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PropertyRow>

        <PropertyRow icon={areaIcon} label="AREA" className="flex-1">
          <Select
            value={item.area_id ?? "none"}
            onValueChange={(v) => saveField("area_id", v === "none" ? null : v)}
          >
            <SelectTrigger className="h-8 text-sm border-0 shadow-none px-2 bg-transparent">
              <SelectValue placeholder="No area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No area</SelectItem>
              {areas?.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PropertyRow>

        <WaitingOnField
          value={waitingOn}
          contacts={contacts ?? []}
          onChange={(val) => {
            setWaitingOn(val);
            saveField("waiting_on", val || null);
            if (val && currentState !== "waiting") onStateChange("waiting");
            if (!val && currentState === "waiting") onStateChange("inbox");
          }}
        />
      </div>

      {/* Recurrence */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <PropertyRow icon={scheduledIcon} label="REPEAT" className="flex-1">
          {isPro ? (
            <RecurrenceSelector
              value={item.recurrence_rule ?? null}
              onChange={(v) => saveField("recurrence_rule", v)}
              compact
            />
          ) : (
            <button
              onClick={() => setShowRecurrenceUpgrade(true)}
              className="flex items-center gap-2 px-2 h-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>No repeat</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-focus text-focus font-semibold">
                PRO
              </Badge>
            </button>
          )}
        </PropertyRow>
      </div>
      {showRecurrenceUpgrade && (
        <UpgradePrompt
          open={showRecurrenceUpgrade}
          onOpenChange={setShowRecurrenceUpgrade}
          trigger="recurring"
          currentUsage={0}
          limit={0}
        />
      )}
    </div>
  );
}

function WaitingOnField({ value, contacts, onChange }: { value: string; contacts: { id: string; name: string }[]; onChange: (val: string) => void }) {
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const createContact = useCreateContact();

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await createContact.mutateAsync(trimmed);
    onChange(trimmed);
    setNewName("");
    setShowNew(false);
  };

  return (
    <PropertyRow icon={waitingOnIcon} label="WAITING ON" className="flex-1">
      <Select
        value={value || "none"}
        onValueChange={(v) => {
          if (v === "__new__") {
            setShowNew(true);
            return;
          }
          onChange(v === "none" ? "" : v);
        }}
      >
        <SelectTrigger className="h-8 text-sm border-0 shadow-none px-2 bg-transparent">
          <SelectValue placeholder="No one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No one</SelectItem>
          {contacts.map((c) => (
            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
          ))}
          <SelectItem value="__new__" className="text-primary">
            <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> Add contact…</span>
          </SelectItem>
        </SelectContent>
      </Select>
      {showNew && (
        <div className="flex items-center gap-1 mt-1">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name…"
            className="h-7 text-xs flex-1"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreate(); } if (e.key === "Escape") setShowNew(false); }}
          />
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleCreate} disabled={!newName.trim() || createContact.isPending}>
            <Check className="h-3 w-3" />
          </Button>
        </div>
      )}
    </PropertyRow>
  );
}
