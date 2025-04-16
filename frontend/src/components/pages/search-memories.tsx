"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SearchResult } from "@/types/memory-entry";
import { formatDate } from "@/utils/date";
import { Clock, Loader2, Search } from "lucide-react";
import { useState } from "react";

interface SearchMemoriesProps {
  searchMemories: (query: string) => Promise<void>;
  searchResults: SearchResult[];
  loading: boolean;
}

export const SearchMemories = ({
  searchMemories,
  searchResults,
  loading,
}: SearchMemoriesProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    await searchMemories(searchQuery);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Search Memories</CardTitle>
        <CardDescription>
          Find your past thoughts and reflections using semantic search
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              className="pl-8"
              placeholder="Search your thoughts semantically..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim() && !loading) {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {searchResults.length === 0 && searchQuery && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Press the search button to find your memories</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((entry, index) => {
                const similarityPercent = Math.round(entry.similarity * 100);

                return (
                  <Card
                    key={entry.id}
                    className={cn(
                      "overflow-hidden",
                      index === 0 && "bg-primary text-background"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div
                          className={cn(
                            "flex items-center text-sm",
                            index === 0
                              ? "text-background/75"
                              : "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>{formatDate(entry.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Badge variant="default">
                            {similarityPercent}% match
                          </Badge>
                          {similarityPercent > 70 && (
                            <Badge variant="secondary">TOP MATCH</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{entry.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
