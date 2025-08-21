import type { TwitterTweet } from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { ReadableDate } from 'shared/ReadableDate';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as QuoteIcon } from './quote.svg';
import { ReactComponent as ReplyIcon } from './reply.svg';
import { ReactComponent as RetweetIcon } from './retweet.svg';
import { ReactComponent as TweetIcon } from './tweet.svg';

const TweetUser: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => (
  <a
    className={clsx(
      'group flex items-center gap-1 text-v1-content-secondary',
      className,
    )}
    href={`https://x.com/${value.user.username}`}
    referrerPolicy="no-referrer"
    rel="noreferrer"
    target="_blank"
  >
    <img
      className="size-6 shrink-0 rounded-full bg-v1-surface-l5"
      src={`https://unavatar.io/x/${value.user.username}`}
    />
    <p className="shrink text-v1-content-primary">{value.user.name}</p>
    <p className="group-hover:underline">@{value.user.username}</p>
  </a>
);

const TweetTime: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => (
  <a
    className="hover:underline"
    href={`https://x.com/${value.user.username}/status/${value.tweet_id}`}
    referrerPolicy="no-referrer"
    rel="noreferrer"
    target="_blank"
  >
    <ReadableDate
      className={clsx('text-v1-content-secondary', className)}
      popup={false}
      value={value.related_at}
    />
  </a>
);

const TweetType: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => {
  const isRetweet = !!value?.retweeted_tweet;
  const isQuote = !!value?.quoted_tweet;
  const isReply = !!value?.replied_tweet;
  const Component = isRetweet
    ? RetweetIcon
    : isQuote
      ? QuoteIcon
      : isReply
        ? ReplyIcon
        : TweetIcon;
  return <Component className={className} />;
};

const TweetMedia: FC<{
  value: TwitterTweet;
  className?: string;
  onOpen?: (media: TwitterTweet['media'][number]) => void;
  expanded?: boolean;
}> = ({ value, className, onOpen, expanded }) => {
  if (!value.media?.length) return null;
  return (
    <div
      className={clsx(
        'grid gap-2 overflow-hidden rounded-xl',
        value.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
        className,
      )}
    >
      {value.media.map((m, i, s) => (
        <div
          className={clsx(
            expanded ? 'h-80' : 'h-48',
            'relative w-full cursor-pointer rounded-lg bg-v1-surface-l2',
            i === s.length - 1 && (i + 1) % 2 === 1
              ? 'col-span-2'
              : 'col-span-1',
          )}
          key={i}
          onClick={() => onOpen?.(m)}
        >
          {expanded && (
            <img
              alt={`media-${i}-bg`}
              className="absolute inset-0 size-full scale-110 object-cover opacity-75 blur-sm"
              src={m.url}
            />
          )}
          <img
            alt={`media-${i}`}
            className={clsx(
              expanded ? 'object-contain' : 'object-cover',
              'relative size-full',
            )}
            src={m.url}
          />
        </div>
      ))}
    </div>
  );
};

export const TweetCard: FC<{
  value: TwitterTweet;
  nest?: boolean;
  expanded?: boolean;
  className?: string;
  onOpenMedia?: (media: TwitterTweet['media'][number]) => void;
  onOpenRelatedTokens?: (tweetId: TwitterTweet['tweet_id']) => void;
}> = ({
  value,
  nest = true,
  className,
  onOpenMedia,
  onOpenRelatedTokens,
  expanded,
}) => {
  return (
    <div className={clsx('w-full space-y-2 rounded-lg p-2', className)}>
      <div className="flex items-center justify-between gap-1">
        <div
          className={clsx(
            'flex max-w-full items-center gap-px overflow-hidden font-normal text-v1-content-secondary',
          )}
        >
          <TweetUser className="shrink overflow-hidden text-xs" value={value} />
          <span>.</span>
          <TweetTime className="text-xxs" value={value} />
        </div>
        <TweetType className="size-4 shrink-0" value={value} />
      </div>

      <div className={clsx(nest && 'ps-6', 'flex flex-col gap-2')}>
        {value.replied_tweet && (
          <div className="text-v1-content-secondary text-xs">
            {'Replying to '}
            <a
              className="text-v1-background-brand hover:underline"
              href={`https://x.com/${value.replied_tweet.user.username}`}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target="_blank"
            >
              @{value.replied_tweet.user.username}
            </a>
          </div>
        )}
        {value.text && (
          <p
            className="max-w-full whitespace-pre-wrap text-sm"
            style={{
              overflowWrap: 'anywhere',
            }}
          >
            {value.text}
          </p>
        )}
        <TweetMedia expanded={expanded} onOpen={onOpenMedia} value={value} />
        <Button
          className="!px-2 max-w-max self-end"
          onClick={() => onOpenRelatedTokens?.(value.tweet_id)}
          size={expanded ? 'xs' : '2xs'}
          variant="ghost"
        >
          {'Related Tokens'}
        </Button>
      </div>

      {value.retweeted_tweet && (
        <div className="ps-6">
          <TweetCard
            className="bg-v1-surface-l-next p-2"
            expanded={expanded}
            nest={false}
            onOpenMedia={onOpenMedia}
            value={value.retweeted_tweet}
          />
        </div>
      )}
    </div>
  );
};
