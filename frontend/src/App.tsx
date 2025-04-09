import { AlertCircle, BookOpen, Calendar, Clock, Search } from "lucide-react";
import { useState } from "react";
import { useMemory } from "./hooks/useMemory";
import { formatDate } from "./utils/date";

function App() {
  const [activeTab, setActiveTab] = useState("write");
  const [currentEntry, setCurrentEntry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { entries, error, loading, saveEntry, searchMemories, searchResults } =
    useMemory();

  const handleSaveEntry = async () => {
    await saveEntry(currentEntry);
    setCurrentEntry("");
  };

  const handleSearch = async () => {
    await searchMemories(searchQuery);
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">Memory Bank</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
          <button
            onClick={() => setActiveTab("write")}
            className={`p-3 rounded-lg mb-2 ${
              activeTab === "write"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <BookOpen size={20} />
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`p-3 rounded-lg mb-2 ${
              activeTab === "search"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`p-3 rounded-lg mb-2 ${
              activeTab === "timeline"
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Calendar size={20} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {/* Error display */}
          {error && (
            <div className="m-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}

          {/* Write tab */}
          {activeTab === "write" && (
            <div className="h-full flex flex-col p-6">
              <h2 className="text-lg font-semibold mb-4">New Memory</h2>
              <textarea
                className="flex-1 p-4 border rounded-lg resize-none mb-4 focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="What's on your mind today? Write your thoughts, ideas, or reflections..."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
              />
              <button
                onClick={handleSaveEntry}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading || !currentEntry.trim()}
              >
                {loading ? "Saving..." : "Save Memory"}
              </button>
            </div>
          )}

          {/* Search tab */}
          {activeTab === "search" && (
            <div className="h-full flex flex-col p-6">
              <h2 className="text-lg font-semibold mb-4">Search Memories</h2>
              <div className="flex mb-4">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l-lg focus:ring focus:ring-blue-200 focus:outline-none"
                  placeholder="Search your thoughts semantically..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {searchResults.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-4 rounded-lg shadow mb-3"
                  >
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(entry.timestamp)}
                      </p>
                      <p className="text-sm text-blue-500">
                        {Math.round(entry.similarity * 100)}% match
                      </p>
                    </div>
                    <p>{entry.content}</p>
                  </div>
                ))}

                {searchResults.length === 0 && searchQuery && !loading && (
                  <p className="text-center text-gray-500 mt-8">
                    No matching memories found
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timeline tab */}
          {activeTab === "timeline" && (
            <div className="h-full flex flex-col p-6">
              <h2 className="text-lg font-semibold mb-4">Memory Timeline</h2>

              {loading && entries.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                  Loading memories...
                </p>
              ) : (
                <div className="relative flex-1 overflow-y-auto">
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-300"></div>

                  {entries.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8 ml-10">
                      No memories yet. Create your first entry!
                    </p>
                  ) : (
                    entries.map((entry) => (
                      <div key={entry.id} className="ml-10 mb-6 relative">
                        <div className="absolute left-[-25px] w-6 h-6 rounded-full bg-blue-500 border-4 border-white"></div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-500 mb-1 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {formatDate(entry.timestamp)}
                          </p>
                          <p>{entry.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
