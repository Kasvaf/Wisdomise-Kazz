import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useEffect, useMemo } from 'react';
import { useTokenTweets } from 'services/rest/discovery';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import { getXTweetUrl } from 'shared/v1-components/X/utils';
import type { Mark } from '../../../../../public/charting_library';

export const useTweetMarks = () => {
  const { symbol } = useUnifiedCoinDetails();
  const [widget] = useAdvancedChartWidget();
  const { data: tweets } = useTokenTweets({
    contractAddress: symbol.contractAddress ?? undefined,
  });

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

            minSize: 25,
            time: new Date(tweet.related_at).getTime() / 1000,
            text: `Tweet from @${tweet.user.username}`,
            color: 'blue',
          }) as Mark,
      ) ?? []
    );
  }, [tweets]);

  useEffect(() => {
    widget?.onChartReady(() => {
      widget.subscribe('onMarkClick', params => {
        const markParams = params.toString().split('_');
        if (markParams[0] === 'tweet') {
          window.open(getXTweetUrl(markParams[1], markParams[2]), '_blank');
        }
      });
    });
  }, [widget]);

  return { marks };
};
