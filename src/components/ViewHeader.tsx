interface ViewHeaderProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
}

export function ViewHeader({ title, count, children }: ViewHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {count !== undefined && count > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground px-1.5">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
