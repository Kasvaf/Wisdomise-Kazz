import { clsx } from 'clsx';
import { useMediaDialog } from 'modules/discovery/ListView/XTracker/useMediaDialog';
import type { FC } from 'react';
import type { TwitterTweet } from 'services/rest/discovery';
import { ReadableDate } from 'shared/ReadableDate';
import { XUser } from 'shared/v1-components/X/XProfileEmbed';
import { ReactComponent as QuoteIcon } from './quote.svg';
import { ReactComponent as ReplyIcon } from './reply.svg';
import { ReactComponent as RetweetIcon } from './retweet.svg';
import { ReactComponent as TweetIcon } from './tweet.svg';

export function XPostEmbed({
  value,
  isQuote,
}: {
  value: TwitterTweet;
  isQuote?: boolean;
}) {
  const openPost = () => {
    window.open(
      `https://x.com/${value.user.username}/status/${value.tweet_id}`,
      '_blank',
    );
  };

  return (
    <div
      className="relative block w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-v1-surface-l1 text-sm transition-colors"
      onClick={openPost}
    >
      <div className="flex items-start justify-between gap-2 px-4 pt-3">
        <XUser
          className="overflow-hidden"
          isBlueVerified={value.user.is_blue_verified}
          mini={isQuote}
          name={value.user.name}
          profilePicture={value.user.profile_picture}
          username={value.user.username}
        />
        <div className="flex items-center gap-1">
          <ReadableDate suffix={false} value={value.related_at} />
          {!isQuote && (
            <TweetType className="-mr-2 size-4 shrink-0" value={value} />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-start p-3 pt-4">
        {value.replied_tweet && (
          <div className="mb-2 flex h-7 w-full items-center justify-start overflow-hidden rounded-[12px] px-[8px]">
            <div className="mr-[10px] h-full w-[3px] min-w-[3px] rounded-full bg-[#425464]"></div>
            <span className="text-nowrap break-words text-[#8B98A6]">
              Replying to <span>@{value.replied_tweet.user.username}</span>
            </span>
          </div>
        )}
        <div className="flex w-full flex-col items-center justify-start gap-[8px]">
          <p className="w-full whitespace-pre-wrap break-words">{value.text}</p>
          <XPostMedia value={value} />
          {value.quoted_tweet && (
            <XPostEmbed isQuote={true} value={value.quoted_tweet} />
          )}
        </div>
      </div>
    </div>
  );
}

const XPostMedia: FC<{
  value: TwitterTweet;
  className?: string;
}> = ({ value, className }) => {
  const { dialog, openMedia } = useMediaDialog();

  if (!value.media?.length) return null;

  return (
    <div
      className={clsx(
        'grid w-full gap-px overflow-hidden rounded-xl border border-white/10',
        value.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
        className,
      )}
    >
      {value.media.map((m, i, s) => (
        <div
          className={clsx(
            'max-h-96',
            'relative w-full cursor-pointer bg-v1-surface-l2',
            i === s.length - 1 && (i + 1) % 2 === 1
              ? 'col-span-2'
              : 'col-span-1',
          )}
          key={i}
          onClick={e => {
            openMedia(m.url);
            e.stopPropagation();
          }}
        >
          <img
            alt={`media-${i}-bg`}
            className="absolute inset-0 size-full scale-110 object-cover opacity-75 blur-sm"
            src={m.url}
          />

          <img
            alt={`media-${i}`}
            className={clsx('object-contain', 'relative size-full')}
            src={m.url}
          />
        </div>
      ))}
      {dialog}
    </div>
  );
};

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
