import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api/discovery';
import { TEMPLE_ORIGIN } from 'config/constants';
import { formatNumber } from 'utils/numbers';

export const useSocialMessage = (message: SocialMessage) => {
  const { t } = useTranslation('coin-radar');

  return useMemo(() => {
    const user: {
      url?: string;
      avatar?: string;
      name?: string;
      subtitle?: string;
    } =
      message.social_type === 'reddit'
        ? {
            url: message.content.url ?? undefined,
            name: message.content.subreddit
              ? `r/${message.content.subreddit}`
              : undefined,
            subtitle: t('social-messages.members', {
              size: formatNumber(message.content.num_subscribers ?? 0, {
                compactInteger: true,
                separateByComma: true,
                decimalLength: 0,
                minifyDecimalRepeats: false,
              }),
            }),
          }
        : message.social_type === 'telegram'
          ? {
              url: message.content.webpage_url ?? undefined,
              name: message.content.channel_name,
              subtitle: t('social-messages.subscribers', {
                size: formatNumber(message.content.participants_count ?? 0, {
                  compactInteger: true,
                  separateByComma: true,
                  decimalLength: 0,
                  minifyDecimalRepeats: false,
                }),
              }),
            }
          : message.social_type === 'twitter'
            ? {
                url: message.content.user.username
                  ? `https://x.com/${message.content.user.username}`
                  : undefined,
                name: message.content.user.name,
                subtitle: message.content.user.username
                  ? `@${message.content.user.username}`
                  : undefined,
              }
            : message.social_type === 'trading_view'
              ? {
                  name: message.content.author_username,
                  avatar: message.content.author_avatar_link,
                }
              : {
                  name: 'Unknown',
                };

    const title =
      message.social_type === 'reddit'
        ? message.content.title
        : message.social_type === 'trading_view'
          ? message.content.title
          : undefined;

    let preview =
      message.social_type === 'reddit'
        ? message.content.text
        : message.social_type === 'telegram'
          ? message.content.message_text
          : message.social_type === 'twitter'
            ? message.content.text
            : message.social_type === 'trading_view'
              ? message.content.preview_text
              : undefined;
    preview = preview ? preview.trim() : undefined;

    let image =
      message.social_type === 'telegram'
        ? message.content.photo_url
        : message.social_type === 'reddit'
          ? message.content.thumbnail
          : message.social_type === 'trading_view'
            ? message.content.cover_image_link
            : message.social_type === 'twitter' &&
                typeof message.content.media === 'string'
              ? message.content.media
              : message.social_type === 'twitter' &&
                  Array.isArray(message.content.media)
                ? message.content.media?.[0]?.url
                : undefined;
    image =
      image && /^http(s?):\/\//.test(image)
        ? image
        : image
          ? TEMPLE_ORIGIN + image
          : undefined;

    const releasedDate =
      message.social_type === 'trading_view'
        ? message.content.author_updated_at
        : message.content.related_at;

    const comments =
      // message.social_type === 'twitter'
      //   ? (message.content.reply_count ?? 0) + (message.content.quote_count ?? 0)
      // : : message.social_type === 'reddit'
      // ? message.content.num_comments
      message.social_type === 'trading_view'
        ? message.content.total_comments
        : undefined;

    const likes =
      message.social_type === 'twitter'
        ? message.content.like_count
        : undefined;

    const boosts =
      message.social_type === 'trading_view'
        ? message.content.social_boost_score
        : undefined;

    const ups =
      message.social_type === 'reddit' ? message.content.ups : undefined;

    const downs =
      message.social_type === 'reddit' ? message.content.downs : undefined;

    const shares =
      message.social_type === 'twitter'
        ? message.content.retweet_count
        : // : message.social_type === 'telegram'
          // ? message.content.forwards
          undefined;

    const views =
      message.social_type === 'telegram' ? message.content.views : undefined;

    const side =
      message.social_type === 'trading_view'
        ? message.content.side === 'Short'
          ? 'SHORT'
          : message.content.side === 'Long'
            ? 'LONG'
            : undefined
        : undefined;

    return {
      user,
      title,
      image,
      preview,
      releasedDate,
      comments,
      likes,
      boosts,
      ups,
      downs,
      shares,
      views,
      side,
    };
  }, [message, t]);
};
