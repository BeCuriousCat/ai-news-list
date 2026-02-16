'use client';

interface FilterBarProps {
  since: 'daily' | 'weekly' | 'monthly';
  onSinceChange: (since: 'daily' | 'weekly' | 'monthly') => void;
  totalCount: number;
  lastUpdated: string | null;
  isLoading: boolean;
}

const TIME_OPTIONS = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
] as const;

// Format timestamp to readable string
function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}

export default function FilterBar({
  since,
  onSinceChange,
  totalCount,
  lastUpdated,
  isLoading,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onSinceChange(option.value)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  since === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> AI repositories
          </span>
          {lastUpdated && (
            <span className="text-gray-500 dark:text-gray-400">
              Updated {formatTimestamp(lastUpdated)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
