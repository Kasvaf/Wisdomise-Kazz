import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { SocialLogo } from '../SocialLogo';
import { ReactComponent as CommentIcon } from './comment.svg';
import { ReactComponent as LikeIcon } from './like.svg';
import { ReactComponent as BoostIcon } from './boost.svg';
import { ReactComponent as ShareIcon } from './share.svg';
import { ReactComponent as ShortIcon } from './short.svg';
import { ReactComponent as LongIcon } from './long.svg';

const badgeSharedClassName = clsx(
  'flex h-6 shrink-0 items-center justify-center gap-1 rounded-full bg-white/5 px-3 text-xs font-light capitalize [&_svg]:size-[13px]',
);

export function SocialMessageStats({
  message,
  className,
  onReadMore,
  mode,
}: {
  message: SocialMessage;
  className?: string;
  onReadMore?: () => void;
  mode?: 'expandable' | 'normal';
}) {
  const { t } = useTranslation('coin-radar');
  const logoType =
    message.social_type === 'trading_view' ? undefined : message.social_type;

  const releasedDate =
    message.social_type === 'trading_view'
      ? message.content.author_updated_at
      : message.content.related_at;

  const comments =
    message.social_type === 'twitter'
      ? (message.content.reply_count ?? 0) + (message.content.quote_count ?? 0)
      : message.social_type === 'reddit'
      ? message.content.num_comments
      : message.social_type === 'trading_view'
      ? message.content.total_comments
      : undefined;

  const likes =
    message.social_type === 'twitter' ? message.content.like_count : undefined;

  const boosts =
    message.social_type === 'trading_view'
      ? message.content.social_boost_score
      : undefined;

  const shares =
    message.social_type === 'twitter'
      ? message.content.retweet_count
      : undefined;

  const side =
    message.social_type === 'trading_view'
      ? message.content.side === 'Short'
        ? 'SHORT'
        : 'LONG'
      : undefined;

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-start gap-2',
        className,
      )}
    >
      {logoType && (
        <SocialLogo type={logoType} className="size-6 rounded-full" />
      )}
      {typeof likes === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            'bg-white/5 text-v1-content-primary',
          )}
        >
          <LikeIcon />
          <ReadableNumber value={likes} />
        </span>
      )}
      {typeof comments === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            'bg-white/5 text-v1-content-primary',
          )}
        >
          <CommentIcon />
          <ReadableNumber value={comments} />
        </span>
      )}
      {typeof shares === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            'bg-white/5 text-v1-content-primary',
          )}
        >
          <ShareIcon />
          <ReadableNumber value={shares} />
        </span>
      )}
      {typeof boosts === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            'bg-white/5 text-v1-content-primary',
          )}
        >
          <BoostIcon />
          <ReadableNumber value={boosts} />
        </span>
      )}
      {releasedDate && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable' && '!px-6 mobile:!px-4',
            'bg-white/5 text-v1-content-primary',
          )}
        >
          <ReadableDate value={releasedDate} />
        </span>
      )}
      {typeof side === 'string' && (
        <span
          className={clsx(
            'flex size-6 shrink-0 items-center justify-center rounded-full',
            side === 'SHORT'
              ? 'bg-v1-content-positive/10'
              : 'bg-v1-content-negative/10',
          )}
        >
          {side === 'SHORT' ? <ShortIcon /> : <LongIcon />}
        </span>
      )}
      {mode === 'expandable' && (
        <button
          className={clsx(
            badgeSharedClassName,
            'bg-v1-content-brand/20 !px-6 text-v1-content-brand mobile:!px-4',
            'transition-all hover:brightness-110 active:brightness-90',
          )}
          onClick={onReadMore}
        >
          {t('social-messages.read_more')}
        </button>
      )}
    </div>
  );
}
