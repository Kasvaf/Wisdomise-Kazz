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

  return (
    <OverviewWidget
      title={t('coin-details.tabs.coin_introduction.title', {
        name: `${coinOverview.data?.symbol.name ?? slug} (${
          coinOverview.data?.symbol.abbreviation ?? slug
        })`,
      })}
      loading={coinOverview.isInitialLoading}
      empty={{
        enabled: !coinOverview.data?.community_data?.description,
        refreshButton: true,
        title: t('coin-details.tabs.coin_introduction.empty.title'),
        subtitle: '',
      }}
      onRefresh={coinOverview.refetch}
      refreshing={coinOverview.isRefetching}
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
