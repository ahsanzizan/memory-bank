import { useEffect, useState } from "react";
import { memoryService } from "../services/memory-service";
import { MemoryEntry, SearchResult } from "../types/memory-entry";

export const useMemory = () => {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const loadEntries = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await memoryService.getEntries();
      setEntries(data);
    } catch (err) {
      setError("Failed to load entries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (content: string): Promise<MemoryEntry> => {
    setLoading(true);
    setError(null);

    try {
      const newEntry = await memoryService.createEntry(content);
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError("Failed to save entry");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchMemories = async (query: string): Promise<MemoryEntry[]> => {
    setLoading(true);
    setError(null);

    try {
      const results = await memoryService.searchEntries(query);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError("Failed to search entries");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    searchResults,
    saveEntry,
    searchMemories,
    loadEntries,
  };
};
