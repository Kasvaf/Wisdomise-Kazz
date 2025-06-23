import { type FC } from 'react';
import { clsx } from 'clsx';
import { type TwitterTweet } from 'api/discovery';
import { ReadableDate } from 'shared/ReadableDate';
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
      'flex items-center gap-1 text-v1-content-secondary',
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
    <p>@{value.user.username}</p>
  </a>
);

const TweetTime: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => (
  <ReadableDate
    className={clsx('text-v1-content-secondary', className)}
    value={value.related_at}
    popup={false}
  />
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
}> = ({ value, className, onOpen }) => {
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
        <img
          key={i}
          src={m.url}
          alt={`media-${i}`}
          onClick={() => onOpen?.(m)}
          className={clsx(
            'h-48 w-full cursor-pointer rounded-lg bg-v1-surface-l2 object-cover',
            i === s.length - 1 && (i + 1) % 2 === 1
              ? 'col-span-2'
              : 'col-span-1',
          )}
        />
      ))}
    </div>
  );
};

export const TweetCard: FC<{
  value: TwitterTweet;
  nest?: boolean;
  className?: string;
  onOpenMedia?: (media: TwitterTweet['media'][number]) => void;
}> = ({ value, nest = true, className, onOpenMedia }) => {
  return (
    <div className={clsx('w-full space-y-2 rounded-lg', className)}>
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

      <div className={clsx(nest && 'ps-6', 'space-y-2')}>
        {value.replied_tweet && (
          <div className="text-xs text-v1-content-secondary">
            {'Replying to '}
            <a
              href={`https://x.com/${value.replied_tweet.user.username}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              className="text-v1-background-brand"
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
        <TweetMedia value={value} onOpen={onOpenMedia} />
      </div>

      {value.retweeted_tweet && (
        <div className="ps-6">
          <TweetCard
            value={value.retweeted_tweet}
            nest={false}
            className="p-2 bg-v1-surface-l-next"
            onOpenMedia={onOpenMedia}
          />
        </div>
      )}
      {/* <div className="flex items-start gap-3">
        <img
          className="size-6 shrink-0 rounded-full bg-gray-700"
          src={`https://unavatar.io/x/${targetTweet.user.username}`}
        />
        <div className="flex w-full flex-col">
          <div className="text-sm font-semibold">
            {targetTweet.user.name}{' '}
            <span className="font-normal text-gray-400">
              @{targetTweet.user.username}
            </span>
          </div>
          {isReply && (
            <div className="text-xs text-v1-content-secondary">
              {'Replying to '}
              <span className="text-v1-background-brand">
                @{targetTweet.replied_tweet?.user.username}
              </span>
            </div>
          )}
          {targetTweet.text && (
            <div className="mt-2 whitespace-pre-wrap text-sm">
              {targetTweet.text}
            </div>
          )}
          {renderMedia()}

          {isQuote && depth < 2 && (
            <div className="mt-3 rounded-xl border border-gray-700 bg-[#101010] p-3">
              <TweetCard
                value={targetTweet.quoted_tweet as TwitterTweet}
                depth={depth + 1}
              />
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};
