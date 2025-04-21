import { type ReactNode, useMemo } from 'react';
import {
  bxlFacebook,
  bxlReddit,
  bxlTelegram,
  bxlTwitter,
} from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { type CoinDetails } from 'api/types/shared';
import Icon from 'shared/Icon';

export const useCommunityData = (
  value: CoinDetails['community_data'] | null,
) => {
  const { t } = useTranslation('coin-radar');
  return useMemo(() => {
    let ret: Array<{
      type: 'social';
      icon: ReactNode;
      label: ReactNode;
      href: string;
    }> = [];
    if (value?.links?.subreddit_url) {
      ret = [
        ...ret,
        {
          type: 'social',
          icon: <Icon name={bxlReddit} />,
          label: t('coin-details.tabs.coin_links.reddit'),
          href: value?.links?.subreddit_url,
        },
      ];
    }
    if (value?.links?.twitter_screen_name) {
      ret = [
        ...ret,
        {
          type: 'social',
          icon: <Icon name={bxlTwitter} />,
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
          icon: <Icon name={bxlFacebook} />,
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
          icon: <Icon name={bxlTelegram} />,
          label: t('coin-details.tabs.coin_links.telegram'),
          href: `https://t.me/${value.links?.telegram_channel_identifier}`,
        },
      ];
    }
    return ret;
  }, [value, t]);
};
