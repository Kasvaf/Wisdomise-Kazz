import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { ChartWidgetProvider } from 'shared/AdvancedChart/ChartWidgetProvider';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsMeta } from './CoinDetailsMeta';
import { UnifiedCoinDetailsProvider, useResolveComplexSlug } from './lib';

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const params = useDiscoveryParams();
  const complexSlug = useResolveComplexSlug(params.slugs ?? []);
  if (!complexSlug) return <>loading...</>;

  return (
    <UnifiedCoinDetailsProvider slug={complexSlug}>
      {focus && <CoinDetailsMeta />}
      <ChartWidgetProvider>
        {expanded ? <CoinDetailsExpanded /> : <CoinDetailsCompact />}
      </ChartWidgetProvider>
    </UnifiedCoinDetailsProvider>
  );
};
