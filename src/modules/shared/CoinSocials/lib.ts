import type { CoinCommunityData } from 'api/discovery';
import type { SymbolSocailAddresses } from 'api/proto/network_radar';

type KnownSocialType =
  | 'reddit'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'youtube'
  | 'tiktok'
  | 'telegram'
  | 'github';

export type Social = {
  url: URL;
  type: KnownSocialType;
};

type RawLink = {
  data: string | null;
  guess: KnownSocialType | null;
};

export const KNOWN_HOSTS: Record<KnownSocialType, string[]> = {
  reddit: ['reddit.com', 'www.reddit.com'],
  instagram: ['instagram.com', 'www.instagram.com', 'instagr.am'],
  facebook: ['facebook.com', 'www.facebook.com', 'fb.com'],
  x: [
    'twitter.com',
    'www.twitter.com',
    'x.com',
    'www.x.com',
    't.com',
    'www.t.com',
  ],
  youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
  telegram: [
    't.me',
    'www.t.me',
    'telegram.org',
    'www.telegram.org',
    'telegram.me',
    'www.telegram.me',
  ],
  github: ['github.com', 'www.github.com'],
};

export const getLogo = (type: Social['type']) =>
  `https://www.google.com/s2/favicons?domain=${KNOWN_HOSTS[type][0]}`;

export const resolveSocials = (
  value?: Partial<CoinCommunityData['links'] & SymbolSocailAddresses> | null,
): Social[] => {
  if (!value) return [];
  const rawLinks: RawLink[] = [
    {
      data: value?.twitter_screen_name || null,
      guess: 'x',
    },
    {
      data: value?.facebook_username || null,
      guess: 'facebook',
    },
    {
      data: value?.subreddit_url || null,
      guess: 'reddit',
    },
    {
      data: value?.telegram_channel_identifier || null,
      guess: 'telegram',
    },
    ...(value?.homepage?.map?.(
      x =>
        ({
          data: x || null,
          guess: null,
        }) satisfies RawLink,
    ) ?? []),
    {
      data: value.telegram || null,
      guess: 'telegram',
    },
    {
      data: value.twitter || null,
      guess: 'x',
    },
    {
      data: value.website || null,
      guess: null,
    },
  ];

  let ret: Social[] = [];

  let seenUrls: string[] = [];

  for (const rawLink of rawLinks) {
    if (!rawLink.data) continue;

    if (!rawLink.guess) {
      for (const [socialType, knownHosts] of Object.entries(KNOWN_HOSTS)) {
        if (
          knownHosts.some(
            x =>
              rawLink.data?.startsWith(x) ||
              rawLink.data?.startsWith(`http://${x}`) ||
              rawLink.data?.startsWith(`https://${x}`),
          )
        ) {
          rawLink.guess = socialType as KnownSocialType;
        }
      }
    }

    if (!rawLink.guess) continue;

    const knownHost = KNOWN_HOSTS[rawLink.guess][0];

    try {
      const newItem: Social = {
        type: rawLink.guess,
        url: new URL(rawLink.data, `https://${knownHost}`),
      };

      if (seenUrls.includes(`${newItem.url.origin}${newItem.url.pathname}`)) {
        continue;
      }

      ret = [...ret, newItem];
      seenUrls = [...seenUrls, `${newItem.url.origin}${newItem.url.pathname}`];
    } catch {}
  }
  return ret.filter((x, i, s) => s.findLastIndex(y => y.url === x.url) === i);
};
