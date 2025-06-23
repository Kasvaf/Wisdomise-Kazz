import { useEffect, type FC } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChartWidgetProvider } from 'shared/AdvancedChart';
import { useDetailedCoins } from 'api/discovery';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsMeta } from './CoinDetailsMeta';
import { ReactComponent as EmptyIcon } from './empty.svg';

const useCoinSlug = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('slug');
  const [slugOrNetwork, contractAddress] = (query ?? '').split('/');
  const isSlug = !(query ?? '').includes('/');

  const calculatedSlug = useDetailedCoins({
    network: isSlug ? undefined : slugOrNetwork,
    query: contractAddress,
  }).data?.[0].symbol.slug;

  useEffect(() => {
    if (calculatedSlug) {
      const newSearchParams = createSearchParams(searchParams);
      newSearchParams.set('slug', calculatedSlug);
      setSearchParams(newSearchParams);
    }
  }, [calculatedSlug, isSlug, searchParams, setSearchParams]);

  return {
    slug: isSlug ? slugOrNetwork || undefined : undefined,
    isLoading: !isSlug,
  };
};

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const { t } = useTranslation();
  const { slug, isLoading } = useCoinSlug();

  return (
    <>
      {slug ? (
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
      ) : isLoading ? (
        <div className="p-3 text-xs">{t('common:loading')}</div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center gap-2 p-3 py-24">
            <EmptyIcon className="mb-2 h-36" />
            <h2 className="text-2xl font-semibold">
              {t('common:select-detail-first')}
            </h2>
            <p className="max-w-[290px] text-center text-xs text-v1-content-secondary">
              {t('common:select-detail-first-description')}
            </p>
          </div>
        </>
      )}
    </>
  );
};
