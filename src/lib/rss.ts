import { Repository } from './types';

// RSS feed 配置
const FEED_CONFIG = {
  title: 'AI News List - GitHub Trending AI Repositories',
  description: 'Daily collection of the hottest AI-related repositories from GitHub Trending',
  link: 'https://ai-news-list.vercel.app',
  language: 'en-us',
  generator: 'AI News List RSS Generator',
};

// 格式化日期为 RFC 822 格式
function formatRFC822Date(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = days[date.getUTCDay()];
  const dayNum = date.getUTCDate().toString().padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

// HTML 转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 生成单个 RSS item
function generateItem(repo: Repository, since: string): string {
  const title = `${repo.owner}/${repo.name}`;
  const description = [
    repo.description || 'No description available',
    '',
    `⭐ ${repo.stars.toLocaleString()} stars`,
    repo.starsToday > 0 ? `📈 ${repo.starsToday.toLocaleString()} stars ${since === 'daily' ? 'today' : since === 'weekly' ? 'this week' : 'this month'}` : '',
    repo.language ? `💻 Language: ${repo.language}` : '',
    repo.topics.length > 0 ? `🏷️ Topics: ${repo.topics.slice(0, 5).join(', ')}` : '',
  ].filter(Boolean).join('<br/>');

  return `
    <item>
      <title>${escapeHtml(title)}</title>
      <link>${repo.url}</link>
      <guid isPermaLink="true">${repo.url}</guid>
      <description>${escapeHtml(description)}</description>
      <pubDate>${formatRFC822Date(new Date())}</pubDate>
      <source url="${FEED_CONFIG.link}/api/rss?since=${since}">${FEED_CONFIG.title}</source>
    </item>`;
}

// 生成完整 RSS feed
export function generateRSSFeed(
  repos: Repository[],
  since: 'daily' | 'weekly' | 'monthly' = 'daily'
): string {
  const sinceLabel = since === 'daily' ? 'Daily' : since === 'weekly' ? 'Weekly' : 'Monthly';
  const title = `${FEED_CONFIG.title} (${sinceLabel})`;

  const items = repos.map(repo => generateItem(repo, since)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(title)}</title>
    <link>${FEED_CONFIG.link}</link>
    <atom:link href="${FEED_CONFIG.link}/api/rss?since=${since}" rel="self" type="application/rss+xml"/>
    <description>${escapeHtml(FEED_CONFIG.description)}</description>
    <language>${FEED_CONFIG.language}</language>
    <generator>${FEED_CONFIG.generator}</generator>
    <lastBuildDate>${formatRFC822Date(new Date())}</lastBuildDate>
    <ttl>${since === 'daily' ? '30' : since === 'weekly' ? '120' : '360'}</ttl>
${items}
  </channel>
</rss>`;
}

// 生成 Atom feed (可选)
export function generateAtomFeed(
  repos: Repository[],
  since: 'daily' | 'weekly' | 'monthly' = 'daily'
): string {
  const sinceLabel = since === 'daily' ? 'Daily' : since === 'weekly' ? 'Weekly' : 'Monthly';
  const title = `${FEED_CONFIG.title} (${sinceLabel})`;
  const now = new Date().toISOString();

  const entries = repos.map(repo => {
    const content = [
      repo.description || 'No description available',
      '',
      `⭐ ${repo.stars.toLocaleString()} stars`,
      repo.starsToday > 0 ? `📈 ${repo.starsToday.toLocaleString()} stars ${since === 'daily' ? 'today' : since === 'weekly' ? 'this week' : 'this month'}` : '',
      repo.language ? `💻 Language: ${repo.language}` : '',
    ].filter(Boolean).join('<br/>');

    return `
  <entry>
    <title>${escapeHtml(`${repo.owner}/${repo.name}`)}</title>
    <link href="${repo.url}"/>
    <id>${repo.url}</id>
    <updated>${now}</updated>
    <summary>${escapeHtml(repo.description || 'No description')}</summary>
    <content type="html">${escapeHtml(content)}</content>
  </entry>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeHtml(title)}</title>
  <link href="${FEED_CONFIG.link}"/>
  <link href="${FEED_CONFIG.link}/api/rss?since=${since}" rel="self"/>
  <updated>${now}</updated>
  <id>${FEED_CONFIG.link}/</id>
  <subtitle>${escapeHtml(FEED_CONFIG.description)}</subtitle>
${entries}
</feed>`;
}
