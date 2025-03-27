import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import { type IndicatorHeatmapResolution, useIndicatorHeatmap } from 'api';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { AccessShield } from 'shared/AccessShield';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { LoadingBadge } from 'shared/Loading';
import { IndicatorIcon } from '../IndicatorIcon';
import { RsiHeatmapChart } from './RsiHeatmapChart';

export function RsiHeatmapWidget({ className }: { className?: string }) {
  const { t } = useTranslation('market-pulse');
  const [resolution, setResolution] =
    useSearchParamAsState<IndicatorHeatmapResolution>('rsi-heatmapRes', '1h');
  const heatmap = useIndicatorHeatmap({
    indicator: 'rsi',
    resolution,
  });
  return (
    <OverviewWidget
      className={className}
      title={
        <>
          <IndicatorIcon value={'rsi'} className="mr-px align-middle" />
          {t('common.rsi_heatmap')}
          <LoadingBadge value={heatmap.isFetching} />
        </>
      }
      headerClassName="flex-wrap"
      contentClassName="!min-h-[450px]"
      loading={heatmap.isLoading}
      empty={heatmap.data?.length === 0}
    >
      <AccessShield
        mode="children"
        sizes={{
          'guest': true,
          'initial': true,
          'free': true,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <RsiHeatmapChart
          className="h-full py-2"
          data={heatmap.data ?? []}
          resolution={resolution}
          headerActions={
            <ButtonSelect
              className="mobile:w-full"
              value={resolution}
              onChange={setResolution}
              size="sm"
              options={[
                {
                  label: '15m',
                  value: '15m' as const,
                },
                {
                  label: '30m',
                  value: '30m' as const,
                },
                {
                  label: '1h',
                  value: '1h' as const,
                },
                {
                  label: '4h',
                  value: '4h' as const,
                },
                {
                  label: '1d',
                  value: '1d' as const,
                },
              ]}
            />
          }
        />
      </AccessShield>
    </OverviewWidget>
  );
}
