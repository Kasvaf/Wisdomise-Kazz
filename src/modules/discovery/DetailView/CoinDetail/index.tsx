import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { ChartWidgetProvider } from 'shared/AdvancedChart';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsMeta } from './CoinDetailsMeta';

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const params = useDiscoveryParams();
  const slug = (params.slugs ?? []).join('_');

  return (
    <>
      {focus && <CoinDetailsMeta slug={slug} />}
      <ChartWidgetProvider>
        {expanded ? (
          <CoinDetailsExpanded slug={slug} />
        ) : (
          <CoinDetailsCompact slug={slug} />
        )}
      </ChartWidgetProvider>
    </>
  );
};
