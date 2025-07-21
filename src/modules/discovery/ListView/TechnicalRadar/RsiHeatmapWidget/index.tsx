import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import {
  type IndicatorHeatmapResolution,
  useIndicatorHeatmap,
} from 'api/discovery';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { AccessShield } from 'shared/AccessShield';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { usePageState } from 'shared/usePageState';
import { IndicatorIcon } from '../IndicatorIcon';
import { RsiHeatmapChart } from './RsiHeatmapChart';

export function RsiHeatmapWidget({ className }: { className?: string }) {
  const { t } = useTranslation('market-pulse');
  const [pageState, setPageState] = usePageState<{
    resolution: IndicatorHeatmapResolution;
  }>('rsi-heatmapRes', {
    resolution: '1h',
  });
  const heatmap = useIndicatorHeatmap({
    indicator: 'rsi',
    resolution: pageState.resolution,
  });
  useLoadingBadge(heatmap.isLoading);
  return (
    <OverviewWidget
      className={className}
      title={
        <>
          <IndicatorIcon value={'rsi'} className="mr-px align-middle" />
          {t('common.rsi_heatmap')}
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
          guest: false,
          initial: false,
          free: false,
          vip: false,
        }}
      >
        <RsiHeatmapChart
          className="h-full py-2"
          data={heatmap.data ?? []}
          resolution={pageState.resolution}
          headerActions={
            <ButtonSelect
              className="mobile:w-full"
              value={pageState.resolution}
              onChange={newRes => setPageState({ resolution: newRes })}
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
