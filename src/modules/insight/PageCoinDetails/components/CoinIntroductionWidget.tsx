import { useTranslation } from 'react-i18next';
import { useCoinDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import useIsMobile from 'utils/useIsMobile';

export function CoinIntroductionWidget({
  id,
  slug,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinDetails({ slug });
  const isMobile = useIsMobile();

  if (
    !coinOverview.data?.community_data?.description &&
    !coinOverview.isLoading
  )
    return null;

  return (
    <OverviewWidget
      title={
        isMobile
          ? null
          : t('coin-details.tabs.coin_introduction.title', {
              name: `${coinOverview.data?.symbol.name ?? slug} (${
                coinOverview.data?.symbol.abbreviation ?? slug
              })`,
            })
      }
      loading={coinOverview.isInitialLoading}
      id={id}
      contentClassName="max-h-80 mobile:max-h-max"
      className="mobile:p-0"
      surface={isMobile ? 3 : 1}
    >
      <p className="mb-2 hidden text-xs font-medium mobile:block">
        {t('common.description')}
      </p>
      <div
        className="text-sm font-light leading-relaxed text-v1-content-primary mobile:text-xs [&_a]:underline"
        dangerouslySetInnerHTML={{
          __html: coinOverview.data?.community_data?.description ?? '',
        }}
      />
    </OverviewWidget>
  );
}
