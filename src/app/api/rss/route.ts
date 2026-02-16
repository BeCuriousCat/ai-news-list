import { NextRequest, NextResponse } from 'next/server';
import { getTrendingRepos } from '@/lib/scraper';
import { filterAIRepositories, sortByAIRelevance } from '@/lib/filter';
import { getCache, setCache, getCacheKey, getTTL } from '@/lib/cache';
import { generateRSSFeed } from '@/lib/rss';
import { Repository, TrendingParams } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const since = (searchParams.get('since') || 'daily') as TrendingParams['since'];

  // Validate since parameter
  if (!['daily', 'weekly', 'monthly'].includes(since)) {
    return new NextResponse('Invalid "since" parameter', { status: 400 });
  }

  const params: TrendingParams = { since };
  const cacheKey = getCacheKey(params);

  try {
    // Check cache first
    let repos = getCache<Repository[]>(cacheKey);

    if (!repos) {
      // Fetch trending repositories
      const allRepos = await getTrendingRepos(params);

      // Filter to AI-related repositories
      const aiRepos = filterAIRepositories(allRepos);

      // Sort by AI relevance
      repos = sortByAIRelevance(aiRepos);

      // Cache the result
      const ttl = getTTL(since);
      setCache(cacheKey, repos, ttl);
    }

    // Generate RSS feed
    const rss = generateRSSFeed(repos, since);

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `public, max-age=${since === 'daily' ? 1800 : since === 'weekly' ? 7200 : 21600}`,
      },
    });

  } catch (error) {
    console.error('Failed to generate RSS feed:', error);

    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <description>Failed to generate RSS feed</description>
  </channel>
</rss>`,
      {
        status: 500,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    );
  }
}

// Configure for edge runtime
export const runtime = 'nodejs';
