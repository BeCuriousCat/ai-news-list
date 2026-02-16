"use client";

import { useState, useEffect, useCallback } from "react";
import { Repository, ApiResponse } from "@/lib/types";
import RepositoryList from "@/components/RepositoryList";
import FilterBar from "@/components/FilterBar";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [since, setSince] = useState<"daily" | "weekly" | "monthly">("daily");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRepositories = useCallback(
    async (timeRange: "daily" | "weekly" | "monthly") => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trending?since=${timeRange}`);
        const data: ApiResponse<Repository[]> = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch repositories");
        }

        setRepositories(data.data || []);
        setLastUpdated(data.timestamp);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        setRepositories([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchRepositories(since);
  }, [since, fetchRepositories]);

  const handleSinceChange = (newSince: "daily" | "weekly" | "monthly") => {
    setSince(newSince);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            AI News List
          </h1>
          <a
            href={`/api/rss?since=${since}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
            title="RSS Feed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            RSS
          </a>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Daily collection of the hottest AI-related repositories from GitHub
        </p>
      </header>

      {/* Filter Bar */}
      <FilterBar
        since={since}
        onSinceChange={handleSinceChange}
        totalCount={repositories.length}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
      />

      {/* Repository List */}
      <RepositoryList
        repositories={repositories}
        isLoading={isLoading}
        error={error}
      />

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Data sourced from{" "}
          <a
            href="https://github.com/trending"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            GitHub Trending
          </a>
        </p>
        <p className="mt-1">
          Filtered for AI-related repositories using keywords and topics
        </p>
      </footer>
    </main>
  );
}
