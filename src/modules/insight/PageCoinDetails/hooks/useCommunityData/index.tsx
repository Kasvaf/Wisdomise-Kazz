import { type ReactNode, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { type CoinDetails } from 'api/types/shared';
// https://simpleicons.org
import { ReactComponent as FacebookIcon } from './facebook.svg';
import { ReactComponent as RedditIcon } from './reddit.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';
import { ReactComponent as TwitterIcon } from './x.svg';

function extractTwitterInfo(twitterScreenerName: string): {
  type: 'profile' | 'post' | 'other';
  value?: string;
} {
  if (twitterScreenerName.includes('/status/')) {
    return {
      type: 'post',
      value: twitterScreenerName.slice(
        twitterScreenerName.lastIndexOf('/') + 1,
      ),
    };
  } else if (!twitterScreenerName.includes('?')) {
    return {
      type: 'profile',
      value: twitterScreenerName,
    };
  }
  return { type: 'other' };
}

export const useCommunityData = (
  value: CoinDetails['community_data'] | null,
) => {
  const { t } = useTranslation('coin-radar');
  return useMemo(() => {
    let ret: Array<{
      type: 'social';
      name: string;
      preview?: ReactNode;
      icon: ReactNode;
      label: ReactNode;
      href: string;
    }> = [];
    if (value?.links?.subreddit_url) {
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'reddit',
          icon: <RedditIcon />,
          label: t('coin-details.tabs.coin_links.reddit'),
          href: value?.links?.subreddit_url,
        },
      ];
    }
    if (value?.links?.twitter_screen_name) {
      const twitterInfo = extractTwitterInfo(value.links.twitter_screen_name);
      const isPost = twitterInfo.type === 'post' && twitterInfo.value;
      ret = [
        ...ret,
        {
          type: 'social',
          name: isPost ? 'twitter-post' : 'twitter-profile',
          icon: <TwitterIcon />,
          preview: isPost ? (
            <div className="relative h-52 w-96">
              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
              <iframe
                title="twitter-preview"
                src={`https://platform.twitter.com/embed/Tweet.html?dnt=false&frame=false&hideCard=true&hideThread=true&id=${
                  twitterInfo?.value ?? '0'
                }&lang=en&&theme=dark&widgetsVersion=2615f7e52b7e0%3A1702314776716&width=350px`}
                className="absolute left-0 top-0 h-full w-full"
              />
            </div>
          ) : null,
          label: t('coin-details.tabs.coin_links.twitter'),
          href: `https://x.com/${value.links?.twitter_screen_name}`,
        },
      ];
    }
    if (value?.links?.facebook_username) {
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'facebook',
          icon: <FacebookIcon />,
          label: t('coin-details.tabs.coin_links.facebook'),
          href: `https://facebook.com/${value.links?.facebook_username}`,
        },
      ];
    }
    if (value?.links?.telegram_channel_identifier) {
      ret = [
        ...ret,
        {
          type: 'social',
          name: 'telegram',
          icon: <TelegramIcon />,
          label: t('coin-details.tabs.coin_links.telegram'),
          href: `https://t.me/${value.links?.telegram_channel_identifier}`,
        },
      ];
    }
    return ret;
  }, [value, t]);
};
