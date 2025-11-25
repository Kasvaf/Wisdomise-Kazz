import { clsx } from 'clsx';
import type { FC } from 'react';
import type { TwitterTweet } from 'services/rest/discovery';
import { ReadableDate } from 'shared/ReadableDate';
import { Button } from 'shared/v1-components/Button';
import { XPostEmbed } from 'shared/v1-components/X/XPostEmbed';
import { XUser } from 'shared/v1-components/X/XProfileEmbed';
import { ReactComponent as QuoteIcon } from './quote.svg';
import { ReactComponent as ReplyIcon } from './reply.svg';
import { ReactComponent as RetweetIcon } from './retweet.svg';
import { ReactComponent as TweetIcon } from './tweet.svg';

const TweetTime: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => (
  <ReadableDate
    className={clsx('text-v1-content-secondary', className)}
    popup={false}
    value={value.related_at}
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

export const TweetCard: FC<{
  value: TwitterTweet;
  nest?: boolean;
  expanded?: boolean;
  className?: string;
  onOpenMedia?: (media: TwitterTweet['media'][number]) => void;
  onOpenRelatedTokens?: (tweetId: TwitterTweet['tweet_id']) => void;
}> = ({ value, nest = true, className, onOpenRelatedTokens, expanded }) => {
  return (
    <div className={clsx('w-full p-3', className)}>
      <div className="mb-3 flex items-center justify-between gap-1">
        <div
          className={clsx(
            'flex max-w-full items-center gap-1 overflow-hidden font-normal',
          )}
        >
          <XUser
            className="shrink overflow-hidden"
            isBlueVerified={value.user.is_blue_verified}
            mini
            name={value.user.name}
            profilePicture={value.user.profile_picture}
            username={value.user.username}
          />
          <span>.</span>
          <TweetTime className="text-xxs" value={value} />
        </div>
        <TweetType className="size-4 shrink-0" value={value} />
      </div>
      <XPostEmbed value={value} />

      <div className={clsx(nest && 'ps-6', 'flex flex-col gap-2')}>
        <Button
          className="mt-2 max-w-max self-end"
          onClick={() => onOpenRelatedTokens?.(value.tweet_id)}
          size={expanded ? 'xs' : '2xs'}
          variant="ghost"
        >
          {'Related Tokens'}
        </Button>
      </div>
    </div>
  );
};
