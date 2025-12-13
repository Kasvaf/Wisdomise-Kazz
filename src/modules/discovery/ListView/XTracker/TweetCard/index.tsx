import { clsx } from 'clsx';
import type { FC } from 'react';
import type { TwitterTweet } from 'services/rest/discovery';
import { Button } from 'shared/v1-components/Button';
import { XTweetEmbed } from 'shared/v1-components/X/XTweetEmbed';

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
      <XTweetEmbed value={value} />

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
