import { cn } from "@/lib/utils";

export function PropertyRow({ icon, label, children, className }: { icon: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-[80px] sm:w-[100px] shrink-0 flex items-center gap-1.5">
        {typeof icon === "string" && icon.length <= 2 ? (
          <span className="text-sm">{icon}</span>
        ) : (
          <img src={icon} alt={label} className="h-3.5 w-3.5 opacity-60" />
        )}
        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 min-h-[36px]",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
