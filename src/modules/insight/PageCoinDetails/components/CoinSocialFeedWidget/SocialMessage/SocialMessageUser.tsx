import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import { formatNumber } from 'utils/numbers';

export function SocialMessageUser({
  message,
  className,
  type,
}: {
  message: SocialMessage;
  className?: string;
  type: 'title' | 'large-title';
}) {
  const { t } = useTranslation('coin-radar');

  const user = useMemo(() => {
    let ret: {
      url?: string;
      avatar?: string;
      name?: string;
      subtitle?: string;
    };
    switch (message.social_type) {
      case 'reddit': {
        ret = {
          url: message.content.url ?? undefined,
          name: message.content.subreddit
            ? `r/${message.content.subreddit}`
            : undefined,
          subtitle: t('social-messages.members', {
            size: formatNumber(message.content.num_subscribers ?? 0, {
              compactInteger: true,
              seperateByComma: true,
              decimalLength: 0,
              minifyDecimalRepeats: false,
            }),
          }),
        };
        break;
      }
      case 'telegram': {
        ret = {
          url: message.content.webpage_url ?? undefined,
          name: message.content.channel_name,
          subtitle: t('social-messages.subscribers', {
            size: formatNumber(message.content.participants_count ?? 0, {
              compactInteger: true,
              seperateByComma: true,
              decimalLength: 0,
              minifyDecimalRepeats: false,
            }),
          }),
        };
        break;
      }
      case 'twitter': {
        ret = {
          url: message.content.user.username
            ? `https://x.com/${message.content.user.username}`
            : undefined,
          name: message.content.user.name,
          subtitle: message.content.user.username
            ? `@${message.content.user.username}`
            : undefined,
        };
        break;
      }
      case 'trading_view': {
        ret = {
          name: message.content.author_username,
          avatar: message.content.author_avatar_link,
        };
        break;
      }
    }
    return ret;
  }, [message, t]);

  const LinkComp = user.url ? 'a' : 'div';

  return (
    <LinkComp
      className={clsx(
        'flex max-w-full items-center gap-2 overflow-hidden',
        className,
      )}
      href={user.url}
      target="_blank"
      rel="noreferrer"
    >
      {user.avatar && (
        <img
          src={user.avatar}
          alt={user.name || 'User Avatar'}
          className={clsx(
            'size-6 shrink-0 rounded-full bg-v1-surface-l5 object-contain',
            type === 'title' ? 'size-6' : 'size-8',
          )}
        />
      )}
      <div>
        {user.name && (
          <div className="flex items-center gap-2 text-xs text-v1-content-primary">
            {user.name}
            {message.social_type === 'telegram' && !user.url && (
              <span className="rounded-xl bg-white/10 px-1 text-[9px]">
                {'VIP Channel'}
              </span>
            )}
          </div>
        )}
        {user.subtitle && (
          <p className="text-xxs font-light text-v1-content-secondary">
            {user.subtitle}
          </p>
        )}
      </div>
    </LinkComp>
  );
}
