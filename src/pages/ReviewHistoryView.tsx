import { useReviewHistory, type ReviewStats } from "@/hooks/useReview";
import { ViewHeader } from "@/components/ViewHeader";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ClipboardList, ChevronDown, CheckCircle2, Trash2, Plus, ArrowRightLeft, ArrowLeft } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

function StatBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{value} {label}</span>
    </div>
  );
}

export default function ReviewHistoryView() {
  const { data: reviews, isLoading } = useReviewHistory();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background">
      <ViewHeader title="Review History">
        <Button variant="ghost" size="sm" onClick={() => navigate("/review")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Review
        </Button>
      </ViewHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoading && (!reviews || reviews.length === 0) && (
            <EmptyState
              icon={ClipboardList}
              title="No reviews yet"
              description="Complete your first Weekly Review to see it here."
              actionLabel="Start a Review"
              onAction={() => navigate("/review")}
            />
          )}

          {reviews?.map((review) => {
            const stats = (review.stats ?? {}) as unknown as ReviewStats;
            const completedDate = review.completed_at ? new Date(review.completed_at) : null;

            return (
              <Collapsible key={review.id}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {completedDate
                              ? format(completedDate, "EEEE, MMM d, yyyy")
                              : "Unknown date"}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {completedDate && formatDistanceToNow(completedDate, { addSuffix: true })}
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <StatBadge icon={CheckCircle2} label="completed" value={stats.itemsCompleted} />
                        <StatBadge icon={ArrowRightLeft} label="moved" value={stats.itemsMoved} />
                        <StatBadge icon={Plus} label="created" value={stats.itemsCreated} />
                        <StatBadge icon={Trash2} label="trashed" value={stats.itemsTrashed} />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0 space-y-3">
                      {review.summary_text && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Summary</h4>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{review.summary_text}</p>
                        </div>
                      )}
                      {review.reflection_text && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Reflection</h4>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{review.reflection_text}</p>
                        </div>
                      )}
                      {!review.summary_text && !review.reflection_text && (
                        <p className="text-sm text-muted-foreground italic">No summary or reflection was saved for this review.</p>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
