import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { useEffect } from 'react';
import { ChartWidgetProvider } from 'shared/AdvancedChart/ChartWidgetProvider';
import useIsMobile from 'utils/useIsMobile';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsMeta } from './CoinDetailsMeta';
import CoinDetailsMobile from './CoinDetailsMobile';
import { UnifiedCoinDetailsProvider, useResolveComplexSlug } from './lib';

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const params = useDiscoveryParams();
  const complexSlug = useResolveComplexSlug(params.slugs ?? []);
  const isMobile = useIsMobile();
  const [, , setBaseSlug] = useActiveQuote();

  // Inform ActiveQuoteProvider about the current slug so it can load the correct pairs
  useEffect(() => {
    if (complexSlug?.slug) {
      setBaseSlug(complexSlug.slug);
    }
  }, [complexSlug?.slug, setBaseSlug]);

  if (!complexSlug) return <>loading...</>;

  return (
    <UnifiedCoinDetailsProvider slug={complexSlug}>
      {focus && <CoinDetailsMeta />}
      <ChartWidgetProvider>
        {isMobile ? (
          <CoinDetailsMobile />
        ) : expanded ? (
          <CoinDetailsExpanded />
        ) : (
          <CoinDetailsCompact />
        )}
      </ChartWidgetProvider>
    </UnifiedCoinDetailsProvider>
  );
};
