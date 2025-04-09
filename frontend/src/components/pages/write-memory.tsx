"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface WriteMemoryProps {
  saveEntry: (content: string) => Promise<void>;
  loading: boolean;
}

export const WriteMemory = ({ saveEntry, loading }: WriteMemoryProps) => {
  const [currentEntry, setCurrentEntry] = useState("");

  const handleSaveEntry = async () => {
    await saveEntry(currentEntry);
    setCurrentEntry("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>New Memory</CardTitle>
        <CardDescription>
          Capture your thoughts, ideas, or reflections for future reference
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          className="h-full min-h-[200px] resize-none"
          placeholder="What's on your mind today? Write your thoughts, ideas, or reflections..."
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSaveEntry}
          disabled={loading || !currentEntry.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Memory"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
