export interface MemoryEntry {
  id: string;
  content: string;
  timestamp: string;
}

export interface SearchResult extends MemoryEntry {
  similarity: number;
}
