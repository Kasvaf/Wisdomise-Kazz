import type { CoinCommunityData } from 'api/discovery';
import { lazy, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// https://simpleicons.org
import { ReactComponent as FacebookIcon } from './facebook.svg';
import { ReactComponent as RedditIcon } from './reddit.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';
import { ReactComponent as TwitterIcon } from './x.svg';
import { ReactComponent as TwitterPostIcon } from './x_post.svg';

const FacebookEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.FacebookEmbed })),
);
const XEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.XEmbed })),
);

function extractTwitterInfo(twitterScreenerName: string): {
  type: 'profile' | 'post' | 'other';
  value?: string;
} {
  const lastPart = twitterScreenerName.slice(
    twitterScreenerName.lastIndexOf('/') + 1,
  );
  if (twitterScreenerName.includes('/status/')) {
    return {
      type: 'post',
      value: lastPart,
    };
  } else if (!twitterScreenerName.includes('?')) {
    return {
      type: 'profile',
      value: lastPart,
    };
  }
  return { type: 'other' };
}

export const useCoinCommunityLinks = (
  value?: CoinCommunityData['links'] | null,
) => {
  const { t } = useTranslation('coin-radar');
  return useMemo(() => {
    let ret: Array<{
      type: 'social';
      name: string;
      preview?: ReactNode;
      icon: ReactNode;
      label: ReactNode;
      url: URL;
    }> = [];
    if (value?.subreddit_url) {
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'reddit',
          icon: <RedditIcon />,
          label: t('coin-details.tabs.coin_links.reddit'),
          url: new URL(value?.subreddit_url, 'https://reddit.com'),
        },
      ];
    }
    if (value?.twitter_screen_name) {
      const twitterInfo = extractTwitterInfo(value.twitter_screen_name);
      const isPost = twitterInfo.type === 'post' && twitterInfo.value;
      const isProfile = twitterInfo.type === 'profile' && twitterInfo.value;
      const url = new URL(
        value?.twitter_screen_name.replace('x.com', 'twitter.com'),
        'https://twitter.com',
      );
      ret = [
        ...ret,
        {
          type: 'social',
          name: isPost ? 'twitter-post' : 'twitter-profile',
          icon: isPost ? <TwitterPostIcon /> : <TwitterIcon />,
          preview: isPost ? (
            <XEmbed
              id={url.href}
              twitterTweetEmbedProps={{
                tweetId: twitterInfo.value as never,
                options: {
                  theme: 'dark',
                },
              }}
              url={url.href}
              width={350}
            />
          ) : isProfile ? (
            <a
              className="!bg-[#17222e] !text-white flex items-center gap-1 rounded-xl border border-white/10 p-3 text-xs"
              href={url.href}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="size-8 rounded-full"
                src={`https://unavatar.io/x/${twitterInfo.value ?? ''}`}
              />
              @{twitterInfo.value}
            </a>
          ) : null,
          label: t('coin-details.tabs.coin_links.twitter'),
          url,
        },
      ];
    }
    if (value?.facebook_username) {
      const url = new URL(value?.facebook_username, 'https://facebook.com');
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'facebook',
          icon: <FacebookIcon />,
          label: t('coin-details.tabs.coin_links.facebook'),
          preview: <FacebookEmbed url={url.href} width={350} />,
          url,
        },
      ];
    }
    if (value?.telegram_channel_identifier) {
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'telegram',
          icon: <TelegramIcon />,
          label: t('coin-details.tabs.coin_links.telegram'),
          url: new URL(value?.telegram_channel_identifier, 'https://t.me'),
        },
      ];
    }
    return ret;
  }, [value, t]);
};
