import { useTranslation } from 'react-i18next';
import { useCoinOverview } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';

export function CoinIntroductionWidget({
  id,
  slug,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });

  if (
    !coinOverview.data?.community_data?.description &&
    !coinOverview.isLoading
  )
    return null;

  return (
    <OverviewWidget
      title={t('coin-details.tabs.coin_introduction.title', {
        name: `${coinOverview.data?.symbol.name ?? slug} (${
          coinOverview.data?.symbol.abbreviation ?? slug
        })`,
      })}
      loading={coinOverview.isInitialLoading}
      id={id}
      contentClassName="max-h-80"
    >
      <div
        className="text-sm font-light leading-relaxed text-v1-content-primary [&_a]:underline"
        dangerouslySetInnerHTML={{
          __html: coinOverview.data?.community_data?.description ?? '',
        }}
      />
    </OverviewWidget>
  );
}
