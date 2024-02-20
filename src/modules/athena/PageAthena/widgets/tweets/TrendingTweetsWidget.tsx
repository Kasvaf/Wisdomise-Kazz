import dayjs from 'dayjs';
import { WidgetWrapper } from '../WidgetWrapper';
import tweetsIcon from './fire.svg';
import { useTopTweetsQuery } from './useTopTweetsQuery';

export default function TrendingTweetsWidget() {
  const { data, isLoading } = useTopTweetsQuery();

  if (isLoading) {
    return null;
  }

  return (
    <WidgetWrapper
      scroll
      iconSrc={tweetsIcon}
      title="Trending Tweets"
      poweredBy="lunarcrush"
    >
      {data?.map(tweet => (
        <a
          href={tweet.url}
          target="_blank"
          key={tweet.lunar_id}
          className=" flex items-start gap-3 border-b border-solid border-white/10 py-4"
          rel="noreferrer"
        >
          <img src={tweet.profile_image} className="w-10 rounded-lg" />
          <div className="flex grow flex-col gap-y-1">
            <div className="flex w-full justify-between text-base leading-none">
              <span className="text-white/70">
                @{tweet.twitter_screen_name}
              </span>
              <span className="text-white/60">
                {dayjs(tweet.related_at).fromNow()}
              </span>
            </div>
            <p className="mt-4 text-sm">{tweet.body}</p>
          </div>
        </a>
      ))}
    </WidgetWrapper>
  );
}
