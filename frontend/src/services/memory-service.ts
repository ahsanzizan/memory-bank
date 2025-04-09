import axios from "axios";
import { API_URL } from "../constants";
import { MemoryEntry, SearchResult } from "../types/memory-entry";

export const memoryService = {
  createEntry: async (
    content: string,
    timestamp: string = new Date().toISOString()
  ): Promise<MemoryEntry> => {
    try {
      const response = await axios.post<MemoryEntry>(`${API_URL}/entries`, {
        content,
        timestamp,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating entry:", error);
      throw error;
    }
  },

  getEntries: async (): Promise<MemoryEntry[]> => {
    try {
      const response = await axios.get<{ entries: MemoryEntry[] }>(
        `${API_URL}/entries`
      );
      return response.data.entries;
    } catch (error) {
      console.error("Error fetching entries:", error);
      throw error;
    }
  },

  searchEntries: async (
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> => {
    try {
      const response = await axios.get<{ results: SearchResult[] }>(
        `${API_URL}/search?query=${query}&limit=${limit}`
      );
      return response.data.results.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error("Error searching entries:", error);
      throw error;
    }
  },
};
