import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialMessage } from 'api';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as CommentIcon } from './comment.svg';
import { ReactComponent as LikeIcon } from './like.svg';
import { ReactComponent as BoostIcon } from './boost.svg';
import { ReactComponent as ShareIcon } from './share.svg';
import { ReactComponent as ShortIcon } from './short.svg';
import { ReactComponent as LongIcon } from './long.svg';
import { ReactComponent as ViewIcon } from './view.svg';
import { ReactComponent as UpIcon } from './up.svg';
import { ReactComponent as DownIcon } from './down.svg';

const badgeSharedClassName = clsx(
  'flex shrink-0 items-center justify-center rounded-full font-light capitalize mobile:px-2 [&_svg]:size-[1.3em]',
);

const expandableBadgeClassName = clsx(
  'h-7 gap-1 bg-white/5 px-2 text-v1-content-primary',
);

const normalBadgeClassName = clsx(
  'gap-[2px] text-v1-content-primary opacity-80',
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
    message.social_type === 'twitter' ? message.content.like_count : undefined;

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

  return (
    <div
      className={clsx(
        'flex items-center justify-start mobile:overflow-auto',
        className,
      )}
    >
      {typeof views === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
          )}
        >
          <ViewIcon />
          <ReadableNumber value={views} />
        </span>
      )}
      {typeof ups === 'number' && ups > 0 && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
          )}
        >
          <UpIcon />
          <ReadableNumber value={ups} />
        </span>
      )}
      {typeof downs === 'number' && downs > 0 && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
          )}
        >
          <DownIcon />
          <ReadableNumber value={downs} />
        </span>
      )}
      {typeof boosts === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
          )}
        >
          <BoostIcon />
          <ReadableNumber value={boosts} />
        </span>
      )}
      {typeof likes === 'number' && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
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
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
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
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
          )}
        >
          <ShareIcon />
          <ReadableNumber value={shares} />
        </span>
      )}
      {releasedDate && (
        <span
          className={clsx(
            badgeSharedClassName,
            mode === 'expandable'
              ? expandableBadgeClassName
              : normalBadgeClassName,
            mode === 'expandable' && 'grow !px-6 mobile:!px-4',
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
              ? 'bg-v1-content-negative/10'
              : 'bg-v1-content-positive/10',
          )}
        >
          {side === 'SHORT' ? <ShortIcon /> : <LongIcon />}
        </span>
      )}
      {mode === 'expandable' && (
        <button
          className={clsx(
            badgeSharedClassName,
            expandableBadgeClassName,
            'grow !bg-v1-content-brand/10 !px-6 !text-v1-content-brand mobile:!px-4',
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
