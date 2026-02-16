'use client';

import { Repository } from '@/lib/types';

interface RepositoryCardProps {
  repo: Repository;
}

// Format number with K/M suffix
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get language color
function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    'Python': '#3572A5',
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Jupyter Notebook': '#DA5B0B',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'C++': '#f34b7d',
    'Java': '#b07219',
    'R': '#198CE7',
    'Julia': '#a270ba',
  };
  return colors[language || ''] || '#8b949e';
}

export default function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-200 dark:border-gray-700">
      {/* Header: Name and Stars */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg truncate block"
          >
            {repo.owner}/{repo.name}
          </a>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 ml-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium">{formatNumber(repo.stars)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 min-h-[40px]">
        {repo.description || 'No description available'}
      </p>

      {/* Language and Topics */}
      <div className="flex flex-wrap gap-2 mb-3">
        {repo.language && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Footer: Forks and Stars Today */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {formatNumber(repo.forks)}
          </span>
        </div>
        {repo.starsToday > 0 && (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {formatNumber(repo.starsToday)} today
          </span>
        )}
      </div>
    </div>
  );
}
