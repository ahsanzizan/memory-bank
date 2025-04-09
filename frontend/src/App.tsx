import { useState } from "react";
import { MemoryLayout } from "./components/widgets/memory-layout";
import { MemoryTimeline } from "./components/pages/memory-timeline";
import { SearchMemories } from "./components/pages/search-memories";
import { WriteMemory } from "./components/pages/write-memory";
import { useMemory } from "./hooks/useMemory";
import { Tab } from "./types/tabs";

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>("write");

  const { entries, error, loading, saveEntry, searchMemories, searchResults } =
    useMemory();

  return (
    <MemoryLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      error={error}
    >
      {activeTab === "write" && (
        <WriteMemory loading={loading} saveEntry={saveEntry} />
      )}
      {activeTab === "search" && (
        <SearchMemories
          searchMemories={searchMemories}
          searchResults={searchResults}
          loading={loading}
        />
      )}

      {activeTab === "timeline" && (
        <MemoryTimeline entries={entries} loading={loading} />
      )}
    </MemoryLayout>
  );
};

export default App;
