import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemoryEntry } from "@/types/memory-entry";
import { formatDate } from "@/utils/date";
import { Clock, Loader2 } from "lucide-react";

interface MemoryTimelineProps {
  entries: MemoryEntry[];
  loading: boolean;
}

export const MemoryTimeline = ({ entries, loading }: MemoryTimelineProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex-1 overflow-hidden">
        <h2 className="text-xl font-semibold mb-6">Memory Timeline</h2>

        {loading && entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading memories...</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="relative pl-6">
              {/* Timeline line */}
              <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-muted" />

              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p>No memories yet. Create your first entry!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {entries.map((entry) => (
                    <div key={entry.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-[-18px] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>{formatDate(entry.timestamp)}</span>
                          </div>
                          <p className="text-sm">{entry.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
