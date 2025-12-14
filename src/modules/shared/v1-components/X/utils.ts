import type { TweetV2 } from 'services/rest/twitter';

export function getXSearchUrl(query: string) {
  return `https://x.com/search?q=${encodeURIComponent(query)}`;
}

export function getXUserUrl(username: string) {
  return `https://x.com/${username}`;
}

interface TweetEntity {
  start: number;
  end: number;
  display: string;
  href: string;
}

function escapeHTML(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function extractEnrichedTweetText(tweet: TweetV2) {
  const [rangeStart, rangeEnd] = tweet.displayTextRange;
  const rawText = tweet.text.slice(rangeStart, rangeEnd);

  const entities: TweetEntity[] = [];

  for (const url of tweet.entities?.urls ?? []) {
    entities.push({
      start: url.indices[0] - rangeStart,
      end: url.indices[1] - rangeStart,
      display: url.display_url,
      href: url.url,
    });
  }

  for (const symbol of tweet.entities?.symbols ?? []) {
    entities.push({
      start: symbol.indices[0] - rangeStart,
      end: symbol.indices[1] - rangeStart,
      display: `$${symbol.text}`,
      href: getXSearchUrl(`$${symbol.text}`),
    });
  }

  for (const hashtag of tweet.entities?.hashtags ?? []) {
    entities.push({
      start: hashtag.indices[0] - rangeStart,
      end: hashtag.indices[1] - rangeStart,
      display: `#${hashtag.text}`,
      href: getXSearchUrl(`#${hashtag.text}`),
    });
  }

  for (const m of tweet.entities?.user_mentions ?? []) {
    entities.push({
      start: m.indices[0] - rangeStart,
      end: m.indices[1] - rangeStart,
      display: `@${m.screen_name}`,
      href: getXUserUrl(m.screen_name),
    });
  }

  // Remove entities outside visible range
  const filtered = entities.filter(
    e => e.start >= 0 && e.end <= rawText.length,
  );

  // Sort by start index
  filtered.sort((a, b) => a.start - b.start);

  let html = '';
  let cursor = 0;

  for (const entity of filtered) {
    // Add plain text before entity
    if (cursor < entity.start) {
      html += escapeHTML(rawText.slice(cursor, entity.start));
    }

    // Add entity
    html += `<a
      href="${escapeHTML(entity.href)}"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >${escapeHTML(entity.display)}</a>`;

    cursor = entity.end;
  }

  // Add remaining text
  if (cursor < rawText.length) {
    html += escapeHTML(rawText.slice(cursor));
  }

  return html;
}
