import { useMemo } from "react";
import { BarChart3, TrendingUp, CheckCircle2, ListTodo } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { useCompletedItems, useItems } from "@/hooks/useItems";
import { useUserSettings } from "@/hooks/useUserSettings";
import { ViewHeader } from "@/components/ViewHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATE_COLORS: Record<string, string> = {
  inbox: "hsl(var(--primary))",
  next: "hsl(var(--success-green))",
  scheduled: "hsl(var(--focus-gold))",
  waiting: "hsl(var(--muted-foreground))",
  someday: "hsl(var(--accent-foreground))",
};

export default function StatsView() {
  const { data: completedItems } = useCompletedItems();
  const { data: inboxItems } = useItems("inbox");
  const { data: nextItems } = useItems("next");
  const { data: scheduledItems } = useItems("scheduled");
  const { data: waitingItems } = useItems("waiting");
  const { data: somedayItems } = useItems("someday");
  const { data: settings } = useUserSettings();

  // Completed per day (last 14 days)
  const completionData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayStr = format(day, "yyyy-MM-dd");
      const count = (completedItems ?? []).filter((item) => {
        if (!item.completed_at) return false;
        return format(parseISO(item.completed_at), "yyyy-MM-dd") === dayStr;
      }).length;
      days.push({ date: format(day, "MMM d"), count });
    }
    return days;
  }, [completedItems]);

  // State distribution
  const stateData = useMemo(() => {
    const states = [
      { name: "Inbox", value: inboxItems?.length ?? 0, color: STATE_COLORS.inbox },
      { name: "Next", value: nextItems?.length ?? 0, color: STATE_COLORS.next },
      { name: "Scheduled", value: scheduledItems?.length ?? 0, color: STATE_COLORS.scheduled },
      { name: "Waiting", value: waitingItems?.length ?? 0, color: STATE_COLORS.waiting },
      { name: "Someday", value: somedayItems?.length ?? 0, color: STATE_COLORS.someday },
    ];
    return states.filter((s) => s.value > 0);
  }, [inboxItems, nextItems, scheduledItems, waitingItems, somedayItems]);

  const totalActive = stateData.reduce((sum, s) => sum + s.value, 0);
  const totalCompleted = completedItems?.length ?? 0;
  const todayCompleted = completionData[completionData.length - 1]?.count ?? 0;

  // Review streak (days since last review)
  const daysSinceReview = useMemo(() => {
    if (!settings?.last_review_at) return null;
    const diff = Math.floor((Date.now() - new Date(settings.last_review_at).getTime()) / 86400000);
    return diff;
  }, [settings]);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Stats" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <CheckCircle2 className="h-5 w-5 text-success-green mb-1" />
              <p className="text-2xl font-bold text-foreground">{todayCompleted}</p>
              <p className="text-xs text-muted-foreground">Done today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <TrendingUp className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <ListTodo className="h-5 w-5 text-focus-gold mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalActive}</p>
              <p className="text-xs text-muted-foreground">Active items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <BarChart3 className="h-5 w-5 text-muted-foreground mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {daysSinceReview !== null ? `${daysSinceReview}d` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Since review</p>
            </CardContent>
          </Card>
        </div>

        {/* Completion chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items completed (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* State distribution */}
        {stateData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active items by state</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-40 w-40 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stateData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2}>
                        {stateData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5">
                  {stateData.map((s) => (
                    <div key={s.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="font-medium text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
