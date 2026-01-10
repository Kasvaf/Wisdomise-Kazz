import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useMemo } from 'react';
import { useTokenTweets } from 'services/rest/discovery';
import type { Mark } from '../../../../../public/charting_library';
import { getMarkSize } from '../utils';

export const useTweetMarks = ({
  deviceType,
}: {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) => {
  const { symbol } = useUnifiedCoinDetails();
  const { data: tweets } = useTokenTweets({
    contractAddress: symbol.contractAddress ?? undefined,
  });

  // Use smaller mark size on mobile for better visibility and reduced overlap
  const markSize = getMarkSize(deviceType);

  const marks = useMemo(() => {
    return (
      tweets?.map(
        tweet =>
          ({
            borderWidth: 0,
            hoveredBorderWidth: 0,
            id: `tweet_${tweet.user.username}_${tweet.tweet_id}`,
            label: 'X',
            imageUrl: tweet.user.profile_picture,

            minSize: markSize,
            time: new Date(tweet.related_at).getTime() / 1000,
            text: `Tweet from @${tweet.user.username}`,
            color: 'blue',
          }) as Mark,
      ) ?? []
    );
  }, [tweets, markSize]);

  return { marks };
};
