"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Tab } from "@/types/tabs";
import { AlertCircle, BookOpen, Calendar, Search } from "lucide-react";

interface MemoryLayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  error: string | null;
}

export const MemoryLayout = ({
  children,
  activeTab,
  setActiveTab,
  error,
}: MemoryLayoutProps) => {
  const tabs = [
    { id: "write" as Tab, icon: BookOpen, label: "Write" },
    { id: "search" as Tab, icon: Search, label: "Search" },
    { id: "timeline" as Tab, icon: Calendar, label: "Timeline" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-16 bg-muted/50 border-r border-border py-4 items-center">
        <div className="flex flex-col items-center gap-2 mt-2">
          <TooltipProvider delayDuration={0}>
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "h-10 w-10 rounded-md",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="sr-only">{tab.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden flex items-center justify-around border-b border-border bg-background p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-background p-4 flex items-center">
          <h1 className="text-xl font-semibold">Memory Bank</h1>
        </header>

        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden p-4">{children}</div>
      </main>
    </div>
  );
};
