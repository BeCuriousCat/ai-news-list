'use client';

import { Repository } from '@/lib/types';
import RepositoryCard from './RepositoryCard';

interface RepositoryListProps {
  repositories: Repository[];
  isLoading: boolean;
  error: string | null;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="skeleton h-6 w-3/4 rounded mb-2" />
          <div className="skeleton h-4 w-full rounded mb-3" />
          <div className="skeleton h-4 w-2/3 rounded mb-3" />
          <div className="flex gap-2 mb-3">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="flex justify-between">
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Error display component
function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load repositories</h3>
      <p className="text-gray-500 dark:text-gray-400">{error}</p>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No AI repositories found</h3>
      <p className="text-gray-500 dark:text-gray-400">Try a different time range or check back later</p>
    </div>
  );
}

export default function RepositoryList({ repositories, isLoading, error }: RepositoryListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (repositories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo, index) => (
        <RepositoryCard key={`${repo.fullName}-${index}`} repo={repo} />
      ))}
    </div>
  );
}
