import * as cheerio from "cheerio";
import { Repository, TrendingParams } from "./types";

// Parse number string like "1,234" or "12.3k" to number
function parseNumber(str: string): number {
  if (!str) return 0;
  str = str.trim().replace(/,/g, "");

  if (str.endsWith("k")) {
    return Math.floor(parseFloat(str) * 1000);
  }
  if (str.endsWith("K")) {
    return Math.floor(parseFloat(str) * 1000);
  }

  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : num;
}

// Parse stars today string like "1,234 stars today" or "1,234 stars this week"
function parseStarsToday(str: string): number {
  if (!str) return 0;
  const match = str.match(/([\d,]+(?:\.\d+)?[kK]?)/);
  if (!match) return 0;
  return parseNumber(match[1]);
}

// Fetch HTML from GitHub Trending
export async function fetchTrendingHTML(
  params: TrendingParams,
): Promise<string> {
  // GitHub 代理列表（国内可访问）
  const githubProxies = [
    "https://ghproxy.net/",
    "https://mirror.ghproxy.com/",
    "", // 直连（最后尝试）
  ];

  // 构建目标 URL
  const targetUrl = new URL("https://github.com/trending");
  if (params.language) {
    targetUrl.pathname = `/trending/${params.language}`;
  }
  targetUrl.searchParams.set("since", params.since);

  // 代理配置
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

  // 尝试不同的方式获取数据
  for (const proxy of githubProxies) {
    try {
      const fetchUrl = proxy
        ? `${proxy}${targetUrl.toString()}`
        : targetUrl.toString();

      const response = await fetch(fetchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AI-News-Bot/1.0)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        // @ts-ignore - Node.js fetch 代理支持
        dispatcher: proxyUrl ? undefined : undefined,
      });

      if (response.ok) {
        return response.text();
      }
    } catch (error) {
      console.log(`Failed with proxy ${proxy || "direct"}:`, error);
      continue;
    }
  }

  throw new Error("Failed to fetch trending page from all sources");
}

// Parse HTML and extract repository data
export function parseTrendingRepos(html: string): Repository[] {
  const $ = cheerio.load(html);
  const repos: Repository[] = [];

  $("article.Box-row").each((_, element) => {
    const $row = $(element);

    // Get full name from href
    const href = $row.find("h2 a").attr("href") || "";
    const fullName = href.replace(/^\//, "");
    const [owner, name] = fullName.split("/");

    if (!owner || !name) return;

    // Get description
    const description =
      $row.find("p.col-9").text().trim() ||
      $row.find('[itemprop="description"]').text().trim() ||
      null;

    // Get language
    const language =
      $row.find('[itemprop="programmingLanguage"]').text().trim() ||
      $row.find('[data-testid="language"]').text().trim() ||
      null;

    // Get stars count
    const starsText = $row.find('a[href*="/stargazers"]').text().trim();
    const stars = parseNumber(starsText);

    // Get forks count
    const forksText =
      $row.find('a[href*="/forks"]').text().trim() ||
      $row.find('a[href*="/network/members"]').text().trim();
    const forks = parseNumber(forksText);

    // Get stars today
    const starsTodayText =
      $row.find("span.float-sm-right").text().trim() ||
      $row.find('[data-testid="stars-today"]').text().trim();
    const starsToday = parseStarsToday(starsTodayText);

    // Get topics
    const topics: string[] = [];
    $row.find('[data-testid="topic-tag"], .topic-tag').each((_, topicEl) => {
      const topic = $(topicEl).text().trim();
      if (topic) topics.push(topic);
    });

    // Get contributors
    const builtBy: { username: string; avatarUrl: string }[] = [];
    $row
      .find('.avatar-stack a, [data-testid="avatar-stack"] a')
      .each((_, avatarEl) => {
        const $avatar = $(avatarEl);
        const username = $avatar.attr("href")?.replace(/^\//, "") || "";
        const avatarUrl = $avatar.find("img").attr("src") || "";
        if (username) {
          builtBy.push({ username, avatarUrl });
        }
      });

    repos.push({
      owner,
      name,
      fullName,
      url: `https://github.com/${fullName}`,
      description,
      language,
      stars,
      forks,
      starsToday,
      topics,
      builtBy,
    });
  });

  return repos;
}

// Main function to get trending repositories
export async function getTrendingRepos(
  params: TrendingParams,
): Promise<Repository[]> {
  const html = await fetchTrendingHTML(params);
  return parseTrendingRepos(html);
}
