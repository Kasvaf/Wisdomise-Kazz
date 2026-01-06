import { useEffect } from 'react';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import { useShare } from 'shared/useShare';
import { getXTweetUrl } from 'shared/v1-components/X/utils';

export const useMarksClickListener = () => {
  const [widget] = useAdvancedChartWidget();
  const [copy, content] = useShare('copy');

  useEffect(() => {
    widget?.onChartReady(() => {
      widget.subscribe('onMarkClick', params => {
        const markParams = params.toString().split('_');
        const type = markParams[0];
        if (type === 'tweet') {
          window.open(getXTweetUrl(markParams[1], markParams[2]), '_blank');
        } else if (type === 'swap') {
          void copy(markParams[1], 'Wallet address copied to clipboard');
        }
      });
    });
  }, [widget, copy]);

  return { content };
};
