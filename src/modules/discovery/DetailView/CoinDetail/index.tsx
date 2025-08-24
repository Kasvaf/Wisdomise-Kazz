import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { ChartWidgetProvider } from 'shared/AdvancedChart';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsMeta } from './CoinDetailsMeta';
import { useResolveComplexSlug } from './lib';

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const params = useDiscoveryParams();
  const complexSlug = useResolveComplexSlug(params.slugs ?? []);

  // return <pre>{JSON.stringify(complexSlug, null, 3)}</pre>;

  if (!complexSlug) return <>loading...</>;
  return (
    <>
      {focus && <CoinDetailsMeta slug={complexSlug} />}
      <ChartWidgetProvider>
        {expanded ? (
          <CoinDetailsExpanded slug={complexSlug} />
        ) : (
          <CoinDetailsCompact slug={complexSlug} />
        )}
      </ChartWidgetProvider>
    </>
  );
};
