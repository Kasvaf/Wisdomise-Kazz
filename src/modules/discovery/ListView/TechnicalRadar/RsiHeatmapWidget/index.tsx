import { useTranslation } from 'react-i18next';
import {
  type IndicatorHeatmapResolution,
  useIndicatorHeatmap,
} from 'services/rest/discovery';
import { AccessShield } from 'shared/AccessShield';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import { usePageState } from 'shared/usePageState';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
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
      contentClassName="!min-h-[450px]"
      empty={heatmap.data?.length === 0}
      headerClassName="flex-wrap"
      loading={heatmap.isLoading}
      title={
        <>
          <IndicatorIcon className="mr-px align-middle" value={'rsi'} />
          {t('common.rsi_heatmap')}
        </>
      }
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
          headerActions={
            <ButtonSelect
              className="max-md:w-full"
              onChange={newRes => setPageState({ resolution: newRes })}
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
              size="sm"
              value={pageState.resolution}
            />
          }
          resolution={pageState.resolution}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
