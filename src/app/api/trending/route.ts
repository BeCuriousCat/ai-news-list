import { NextRequest, NextResponse } from 'next/server';
import { getTrendingRepos } from '@/lib/scraper';
import { filterAIRepositories, sortByAIRelevance } from '@/lib/filter';
import { getCache, setCache, getCacheKey, getTTL } from '@/lib/cache';
import { Repository, TrendingParams, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const since = (searchParams.get('since') || 'daily') as TrendingParams['since'];
  const language = searchParams.get('language') || undefined;

  // Validate since parameter
  if (!['daily', 'weekly', 'monthly'].includes(since)) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      data: null,
      error: 'Invalid "since" parameter. Must be "daily", "weekly", or "monthly"',
      cached: false,
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  }

  const params: TrendingParams = { since, language };
  const cacheKey = getCacheKey(params);

  // Check cache first
  const cachedData = getCache<Repository[]>(cacheKey);
  if (cachedData) {
    return NextResponse.json<ApiResponse<Repository[]>>({
      success: true,
      data: cachedData,
      error: null,
      cached: true,
      timestamp: new Date().toISOString(),
      meta: {
        totalCount: cachedData.length,
        aiCount: cachedData.length,
        since,
      },
    });
  }

  try {
    // Fetch trending repositories
    const allRepos = await getTrendingRepos(params);

    // Filter to AI-related repositories
    const aiRepos = filterAIRepositories(allRepos);

    // Sort by AI relevance
    const sortedRepos = sortByAIRelevance(aiRepos);

    // Cache the result
    const ttl = getTTL(since);
    setCache(cacheKey, sortedRepos, ttl);

    return NextResponse.json<ApiResponse<Repository[]>>({
      success: true,
      data: sortedRepos,
      error: null,
      cached: false,
      timestamp: new Date().toISOString(),
      meta: {
        totalCount: allRepos.length,
        aiCount: sortedRepos.length,
        since,
      },
    });

  } catch (error) {
    console.error('Failed to fetch trending:', error);

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch trending repositories',
      cached: false,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Configure edge runtime for better performance
export const runtime = 'nodejs';

// Revalidate every 30 minutes
export const revalidate = 1800;
