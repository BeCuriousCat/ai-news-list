// Repository data structure
export interface Repository {
  name: string;
  owner: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  starsToday: number;
  topics: string[];
  builtBy: Contributor[];
}

export interface Contributor {
  username: string;
  avatarUrl: string;
}

// API request parameters
export interface TrendingParams {
  since: 'daily' | 'weekly' | 'monthly';
  language?: string;
}

// API response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  cached: boolean;
  timestamp: string;
  meta?: {
    totalCount: number;
    aiCount: number;
    since: string;
  };
}

// Cache entry structure
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
