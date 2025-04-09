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
      const response = await axios.get<MemoryEntry[]>(`${API_URL}/entries`);
      return response.data;
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
      const response = await axios.post<SearchResult[]>(`${API_URL}/search`, {
        query,
        limit,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching entries:", error);
      throw error;
    }
  },
};
