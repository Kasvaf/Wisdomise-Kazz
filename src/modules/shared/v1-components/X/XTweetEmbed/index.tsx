import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { calcValueByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import { useMediaDialog } from 'modules/discovery/ListView/XTracker/useMediaDialog';
import { type FC, useMemo } from 'react';
import type { Tweet } from 'services/rest/discovery';
import {
  type TweetV2,
  useTwitterPostPreviewQuery,
} from 'services/rest/twitter';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import Skeleton from 'shared/v1-components/Skeleton';
import { ReactComponent as BookmarkIcon } from 'shared/v1-components/X/assets/bookmark.svg';
import { ReactComponent as CalendarIcon } from 'shared/v1-components/X/assets/calendar.svg';
import { ReactComponent as LikeIcon } from 'shared/v1-components/X/assets/like.svg';
import { ReactComponent as ReplyIcon } from 'shared/v1-components/X/assets/reply.svg';
import { ReactComponent as RetweetIcon } from 'shared/v1-components/X/assets/retweet.svg';
import { ReactComponent as ViewIcon } from 'shared/v1-components/X/assets/view.svg';
import { ReactComponent as XIcon } from 'shared/v1-components/X/assets/x.svg';
import { extractEnrichedTweetText } from 'shared/v1-components/X/utils';
import { XUser, XUserSkeleton } from 'shared/v1-components/X/XProfileEmbed';

export function XTweetEmbed({
  value: _value,
  tweetId,
  isQuote,
  className,
}: {
  value?: Tweet | TweetV2;
  tweetId?: string;
  isQuote?: boolean;
  className?: string;
}) {
  const { data, isPending } = useTwitterPostPreviewQuery({
    tweetId,
    enabled: !_value,
  });

  const value = useMemo(() => {
    const tweet = _value ?? data;
    if (!tweet) return undefined;

    const isV1 = 'user' in tweet;
    return {
      user: {
        profilePicture: isV1
          ? tweet.user.profile_picture
          : tweet.author.profilePicture,
        username: isV1 ? tweet.user.username : tweet.author.userName,
        name: isV1 ? tweet.user.name : tweet.author.name,
        isBlueVerified: isV1
          ? tweet.user.is_blue_verified
          : tweet.author.isBlueVerified,
        verifiedType: isV1 ? undefined : tweet.author.verifiedType,
        createdAt: isV1 ? tweet.user.created_at : tweet.author.createdAt,
        followers: isV1 ? tweet.user.followers_count : tweet.author.followers,
      },
      replyCount: isV1 ? tweet.reply_count : tweet.replyCount,
      likeCount: isV1 ? tweet.like_count : tweet.likeCount,
      retweetCount: isV1 ? tweet.retweet_count : tweet.retweetCount,
      viewCount: isV1 ? tweet.impression_count : tweet.viewCount,
      bookmarkCount: isV1 ? tweet.bookmark_count : tweet.bookmarkCount,
      createdAt: isV1 ? tweet.related_at : tweet.createdAt,
      isReply: isV1
        ? !!tweet.replied_tweet
        : tweet.isReply && tweet.inReplyToUsername,
      inReplyToUsername: isV1
        ? tweet.replied_tweet?.user?.username
        : tweet.inReplyToUsername,
      media: isV1
        ? tweet.media.map(m => ({ url: m.url }))
        : tweet.extendedEntities?.media?.map(m => ({ url: m.media_url_https })),
      quotedTweet: tweet.quoted_tweet,
      text: isV1 ? tweet.text : extractEnrichedTweetText(tweet),
      id: isV1 ? tweet.tweet_id : tweet.id,
    };
  }, [_value, data]);

  const calcTimeColor = () =>
    calcValueByThreshold({
      value:
        Date.now() -
        (value?.createdAt ? new Date(value?.createdAt).getTime() : 0),
      rules: [
        { limit: 10 * 60 * 1000, result: 'text-v1-content-positive' },
        { limit: 60 * 60 * 1000, result: 'text-v1-content-notice' },
      ],
      fallback: 'text-v1-content-negative',
    });

  const tweetUrl = `https://x.com/${value?.user.username}/status/${value?.id}`;
  const replyIntent = `https://x.com/intent/tweet?in_reply_to=${value?.id}`;
  const likeIntent = `https://x.com/intent/like?tweet_id=${value?.id}`;
  const retweetIntent = `https://x.com/intent/retweet?tweet_id=${value?.id}`;

  return (
    <div
      className={clsx(
        '!bg-x-bg relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-x-border p-3 text-sm transition-colors',
        isQuote
          ? 'hover:!bg-x-quote-bg-hover cursor-pointer'
          : 'hover:!bg-x-bg-hover min-h-60',
        className,
      )}
      onClick={e => {
        isQuote && window.open(tweetUrl, '_blank');
        e.stopPropagation();
      }}
    >
      {!_value && isPending ? (
        <div className="w-full space-y-3">
          <XUserSkeleton />
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="w-24 bg-white/5 leading-none" />
            <Skeleton className="w-24 bg-white/5 leading-none" />
          </div>
          <hr className="border-x-border" />
          <Skeleton className="mb-2 w-32 bg-white/5" />
          <Skeleton className="mb-4 w-52 bg-white/5" />
          <Skeleton className="mb-4 h-32 bg-white/5" />
          <Skeleton className="h-10 rounded-xl bg-white/5" />
        </div>
      ) : value ? (
        <div className="@container w-full">
          <div>
            <div className="flex items-start justify-between gap-2 pb-3">
              <XUser
                className="overflow-hidden"
                isBlueVerified={value.user.isBlueVerified}
                mini={isQuote}
                name={value.user.name}
                profilePicture={value.user.profilePicture}
                username={value.user.username}
                verifiedType={value.user.verifiedType}
              />
              <a
                className="flex flex-col items-center gap-2"
                href={tweetUrl}
                target="_blank"
              >
                {!isQuote && (
                  <HoverTooltip title="Read More on X">
                    <XIcon className="size-5" />
                  </HoverTooltip>
                )}
                <HoverTooltip title="Tweet Created at">
                  <div>
                    <ReadableDate
                      className={clsx(calcTimeColor(), 'font-medium')}
                      suffix={false}
                      value={value.createdAt}
                    />
                  </div>
                </HoverTooltip>
              </a>
            </div>
            {!isQuote && (
              <>
                <div className="flex items-center justify-between @max-2xs:text-xs">
                  <div className="flex items-center gap-1 text-x-content-secondary">
                    <CalendarIcon className="size-4" />
                    Joined {dayjs(value.user.createdAt).format('MMM YYYY')}
                  </div>
                  <div className="flex items-center gap-1">
                    <ReadableNumber
                      className="ml-3 font-medium"
                      format={{ decimalLength: 1 }}
                      value={value.user.followers}
                    />
                    <span className="text-x-content-secondary">Followers</span>
                  </div>
                </div>
                <hr className="mt-2 mb-3 border-x-border" />
              </>
            )}
          </div>
          <div className="">
            {value.isReply && (
              <div className="mb-2 flex h-7 w-full items-center justify-start overflow-hidden rounded-[12px] px-[8px]">
                <div className="mr-[10px] h-full w-[3px] min-w-[3px] rounded-full bg-x-content-secondary"></div>
                <span className="text-nowrap break-words text-x-content-secondary">
                  Replying to{' '}
                  <a
                    className="hover:!underline"
                    href={`https://x.com/${value?.inReplyToUsername}`}
                  >
                    @{value.inReplyToUsername}
                  </a>
                </span>
              </div>
            )}
            <div className="flex w-full flex-col items-center justify-start gap-[8px]">
              <div
                className="[&_a]:!text-x-content-brand [&_a]:hover:!underline w-full whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: value.text ?? '' }}
              />
              <XPostMedia value={value.media} />
              {value.quotedTweet && !isQuote && (
                <XTweetEmbed isQuote={true} value={value.quotedTweet} />
              )}
            </div>

            {!isQuote && (
              <div>
                <div className="mt-3 mb-2 flex items-center justify-between text-x-content-secondary">
                  {dayjs(value.createdAt).format('h:mm A · MMM D, YYYY')}
                  <HoverTooltip title="Bookmark">
                    <a
                      className="group hover:!text-x-blue-primary flex items-center"
                      href={tweetUrl}
                      target="_blank"
                    >
                      <div className="flex items-center justify-center rounded-full p-1 group-hover:bg-x-blue-primary-hover">
                        <BookmarkIcon className="size-4" />
                      </div>
                      <ReadableNumber
                        format={{
                          compactInteger: true,
                          decimalLength: 1,
                          exactDecimal: true,
                        }}
                        value={value.bookmarkCount}
                      />
                    </a>
                  </HoverTooltip>
                </div>
                <hr className="border-x-border" />
              </div>
            )}
            <div
              className={clsx(
                'mt-2 flex items-center justify-between text-x-content-secondary text-xs',
              )}
            >
              <HoverTooltip title="Reply">
                <a
                  className="group hover:!text-x-blue-primary flex items-center"
                  href={replyIntent}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="flex items-center justify-center rounded-full p-1 group-hover:bg-x-blue-primary-hover">
                    <ReplyIcon className="size-4" />
                  </div>
                  <ReadableNumber
                    format={{
                      compactInteger: true,
                      decimalLength: 1,
                      exactDecimal: true,
                    }}
                    value={value.retweetCount}
                  />
                </a>
              </HoverTooltip>
              <HoverTooltip title="Retweet">
                <a
                  className="group hover:!text-x-green-primary flex items-center"
                  href={retweetIntent}
                  target="_blank"
                >
                  <div className="flex items-center justify-center rounded-full p-1 group-hover:bg-x-green-primary-hover">
                    <RetweetIcon className="size-4" />
                  </div>
                  <ReadableNumber
                    format={{
                      compactInteger: true,
                      decimalLength: 1,
                      exactDecimal: true,
                    }}
                    value={value.retweetCount}
                  />
                </a>
              </HoverTooltip>
              <HoverTooltip title="Like">
                <a
                  className="group hover:!text-x-red-primary flex items-center"
                  href={likeIntent}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="flex items-center justify-center rounded-full p-1 group-hover:bg-x-red-primary-hover">
                    <LikeIcon className="size-4" />
                  </div>
                  <ReadableNumber
                    format={{
                      compactInteger: true,
                      decimalLength: 1,
                      exactDecimal: true,
                    }}
                    value={value.likeCount}
                  />
                </a>
              </HoverTooltip>
              <HoverTooltip title="View">
                <a
                  className="group hover:!text-x-blue-primary flex items-center"
                  href={tweetUrl}
                  target="_blank"
                >
                  <div className="flex items-center justify-center rounded-full p-1 group-hover:bg-x-blue-primary-hover">
                    <ViewIcon className="size-4" />
                  </div>
                  <ReadableNumber
                    format={{
                      compactInteger: true,
                      decimalLength: 1,
                      exactDecimal: true,
                    }}
                    value={value.viewCount}
                  />
                </a>
              </HoverTooltip>
            </div>
            {!isQuote && (
              <Button
                as="a"
                className="!bg-transparent !text-x-content-brand !rounded-3xl mt-2 w-full"
                href={tweetUrl}
                size="md"
                target="_blank"
                variant="outline"
              >
                Read More on <XIcon className="[*>svg]:size-3" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        'Tweet Not Found'
      )}
    </div>
  );
}

const XPostMedia: FC<{
  value?: { url: string }[];
  className?: string;
}> = ({ value, className }) => {
  const { dialog, openMedia } = useMediaDialog();

  if (!value?.length) return null;

  return (
    <div
      className={clsx(
        'grid w-full gap-px overflow-hidden rounded-xl border border-x-border',
        value.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
        className,
      )}
    >
      {value.map((m, i, s) => (
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
