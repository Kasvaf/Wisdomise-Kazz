import { type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChartWidgetProvider } from 'shared/AdvancedChart';
import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsMeta } from './CoinDetailsMeta';
import { ReactComponent as EmptyIcon } from './empty.svg';

export const CoinDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = ({ expanded, focus }) => {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const { t } = useTranslation();

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
