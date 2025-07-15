import { type FC } from 'react';
import { clsx } from 'clsx';
import { type TwitterTweet } from 'api/discovery';
import { ReadableDate } from 'shared/ReadableDate';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as QuoteIcon } from './quote.svg';
import { ReactComponent as RetweetIcon } from './retweet.svg';
import { ReactComponent as ReplyIcon } from './reply.svg';
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
    target="_blank"
    referrerPolicy="no-referrer"
    rel="noreferrer"
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
    href={`https://x.com/${value.user.username}/status/${value.tweet_id}`}
    target="_blank"
    referrerPolicy="no-referrer"
    rel="noreferrer"
    className="hover:underline"
  >
    <ReadableDate
      className={clsx('text-v1-content-secondary', className)}
      value={value.related_at}
      popup={false}
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
          key={i}
          className={clsx(
            expanded ? 'h-80' : 'h-48',
            'relative w-full cursor-pointer rounded-lg bg-v1-surface-l2',
            i === s.length - 1 && (i + 1) % 2 === 1
              ? 'col-span-2'
              : 'col-span-1',
          )}
          onClick={() => onOpen?.(m)}
        >
          {expanded && (
            <img
              src={m.url}
              alt={`media-${i}-bg`}
              className="absolute inset-0 size-full scale-110 object-cover opacity-75 blur-sm"
            />
          )}
          <img
            src={m.url}
            alt={`media-${i}`}
            className={clsx(
              expanded ? 'object-contain' : 'object-cover',
              'relative size-full',
            )}
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
          <TweetUser value={value} className="shrink overflow-hidden text-xs" />
          <span>.</span>
          <TweetTime value={value} className="text-xxs" />
        </div>
        <TweetType value={value} className="size-4 shrink-0" />
      </div>

      <div className={clsx(nest && 'ps-6', 'flex flex-col gap-2')}>
        {value.replied_tweet && (
          <div className="text-xs text-v1-content-secondary">
            {'Replying to '}
            <a
              href={`https://x.com/${value.replied_tweet.user.username}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              className="text-v1-background-brand hover:underline"
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
        <TweetMedia value={value} onOpen={onOpenMedia} expanded={expanded} />
        <Button
          onClick={() => onOpenRelatedTokens?.(value.tweet_id)}
          size="3xs"
          variant="ghost"
          className="max-w-max self-end"
        >
          {'Related Tokens'}
        </Button>
      </div>

      {value.retweeted_tweet && (
        <div className="ps-6">
          <TweetCard
            value={value.retweeted_tweet}
            nest={false}
            className="p-2 bg-v1-surface-l-next"
            onOpenMedia={onOpenMedia}
            expanded={expanded}
          />
        </div>
      )}
    </div>
  );
};
