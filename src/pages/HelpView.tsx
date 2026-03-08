import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { helpTopics, type HelpTopic } from "@/lib/helpContent";

function HelpCard({ topic, onClick }: { topic: HelpTopic; onClick: () => void }) {
  const Icon = topic.icon;
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent min-h-[44px]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{topic.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{topic.description}</p>
      </div>
    </button>
  );
}

/** Render markdown-lite content: **bold**, ## headings, - lists */
function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="mt-5 mb-2 text-sm font-semibold text-foreground">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="ml-4 text-sm text-foreground/90 leading-relaxed list-disc">
          <InlineFormat text={line.slice(2)} />
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, "");
      elements.push(
        <li key={i} className="ml-4 text-sm text-foreground/90 leading-relaxed list-decimal">
          <InlineFormat text={text} />
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-foreground/90 leading-relaxed">
          <InlineFormat text={line} />
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}

function InlineFormat({ text }: { text: string }) {
  // Handle **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function HelpView() {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<HelpTopic | null>(null);

  const gtdTopics = helpTopics.filter((t) => t.section === "gtd");
  const appTopics = helpTopics.filter((t) => t.section === "app");

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <HelpCircle className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Help Center</h1>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-8">
        {/* GTD Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-1">Getting Things Done</h2>
          <p className="text-sm text-muted-foreground mb-4">Learn the GTD methodology and how it helps you stay organized.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gtdTopics.map((topic) => (
              <HelpCard key={topic.id} topic={topic} onClick={() => setActiveTopic(topic)} />
            ))}
          </div>
        </section>

        {/* App Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-1">Using Things Done.</h2>
          <p className="text-sm text-muted-foreground mb-4">Learn how to use the app to apply the GTD methodology.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {appTopics.map((topic) => (
              <HelpCard key={topic.id} topic={topic} onClick={() => setActiveTopic(topic)} />
            ))}
          </div>
        </section>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!activeTopic} onOpenChange={(open) => !open && setActiveTopic(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {activeTopic && <activeTopic.icon className="h-4 w-4 text-primary" />}
              {activeTopic?.title}
            </DialogTitle>
          </DialogHeader>
          {activeTopic && <ContentRenderer content={activeTopic.content} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
