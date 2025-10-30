import type { TwitterTweet } from 'api/discovery';
import { clsx } from 'clsx';
import { useMediaDialog } from 'modules/discovery/ListView/XTracker/useMediaDialog';
import type { FC } from 'react';
import { ReadableDate } from 'shared/ReadableDate';
import { XUser } from 'shared/v1-components/X/XProfileEmbed';

export function XPostEmbed({
  value,
  isQuote,
}: {
  value: TwitterTweet;
  isQuote?: boolean;
}) {
  return (
    <a
      className="relative block w-full cursor-pointer overflow-hidden rounded-xl border border-x-border bg-x-bg text-sm transition-colors hover:bg-x-bg-hover"
      href={`https://x.com/${value.user.username}/status/${value.tweet_id}`}
      target="_blank"
    >
      <div className="flex justify-between gap-1 px-4 pt-3">
        <XUser
          className="overflow-hidden"
          isBlueVerified={value.user.is_blue_verified}
          mini={isQuote}
          name={value.user.name}
          profilePicture={value.user.profile_picture}
          username={value.user.username}
        />
        <ReadableDate suffix={false} value={value.related_at} />
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
          <p className="w-full whitespace-pre-wrap">{value.text}</p>
          <XPostMedia value={value} />
          {value.quoted_tweet && (
            <XPostEmbed isQuote={true} value={value.quoted_tweet} />
          )}
        </div>
      </div>
    </a>
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
        'grid w-full gap-px overflow-hidden rounded-xl border-[#425464] border-[1px]',
        value.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
        className,
      )}
    >
      {value.media.map((m, i, s) => (
        <div
          className={clsx(
            'max-h-48',
            'relative w-full cursor-pointer bg-v1-surface-l2',
            i === s.length - 1 && (i + 1) % 2 === 1
              ? 'col-span-2'
              : 'col-span-1',
          )}
          key={i}
          onClick={e => {
            openMedia(m.url);
            e.preventDefault();
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
