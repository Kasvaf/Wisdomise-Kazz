import { clsx } from 'clsx';
import type { FC } from 'react';
import type { Tweet } from 'services/rest/discovery';
import { Button } from 'shared/v1-components/Button';
import { XTweetEmbed } from 'shared/v1-components/X/XTweetEmbed';

export const TweetCard: FC<{
  value: Tweet;
  nest?: boolean;
  expanded?: boolean;
  className?: string;
  onOpenMedia?: (media: Tweet['media'][number]) => void;
  onOpenRelatedTokens?: (tweetId: Tweet['tweet_id']) => void;
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
