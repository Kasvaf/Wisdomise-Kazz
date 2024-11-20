import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as ExternalLinkIcon } from './external_link.svg';

export function SocialMessageUser({
  message,
  className,
  type,
}: {
  message: SocialMessage;
  className?: string;
  type: 'title' | 'large-title' | 'link';
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
          url: message.content.author
            ? `https://reddit.com/u/${message.content.author}`
            : undefined,
          name: message.content.author
            ? `u/${message.content.author}`
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

  if (type !== 'link') {
    return (
      <div
        className={clsx(
          'flex max-w-full items-center gap-2 overflow-hidden',
          className,
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User Avatar'}
            className={clsx(
              'size-6 rounded-full bg-v1-surface-l5 object-contain',
              type === 'title' ? 'size-6' : 'size-8',
            )}
          />
        ) : (
          <div
            className={clsx(
              'rounded-full bg-v1-surface-l5',
              type === 'title' ? 'size-6' : 'size-8',
            )}
          />
        )}
        <div>
          {user.name && (
            <p className="text-xs text-v1-content-primary">{user.name}</p>
          )}
          {user.subtitle && (
            <p className="mt-px text-xs font-light text-v1-content-secondary">
              {user.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      {user.url && (
        <a
          href={user.url}
          target="_blank"
          className={clsx(
            'inline-flex items-center gap-1 rounded-full !bg-white/10 px-2 py-1 text-xs !text-v1-content-primary',
            'transition-all hover:underline active:brightness-90',
            'max-w-full overflow-hidden text-ellipsis',
            className,
          )}
          rel="noreferrer"
        >
          <ExternalLinkIcon />
          {user.url.replace('https://', '')}
        </a>
      )}
    </>
  );
}
