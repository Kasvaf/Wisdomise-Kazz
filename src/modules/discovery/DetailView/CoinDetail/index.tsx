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

  const coinByAddress = useDetailedCoins({
    network: contractAddress ? slugOrNetwork : undefined,
    query: contractAddress,
  });

  useEffect(() => {
    const slugBySearch = coinByAddress.data?.[0]?.symbol?.slug;
    if (slugBySearch) {
      const newSearchParams = createSearchParams(searchParams);
      newSearchParams.set('slug', slugBySearch);
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams, coinByAddress.data]);

  return {
    slug:
      typeof contractAddress === 'string'
        ? undefined
        : slugOrNetwork || undefined,
    isLoading: typeof contractAddress === 'string',
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
