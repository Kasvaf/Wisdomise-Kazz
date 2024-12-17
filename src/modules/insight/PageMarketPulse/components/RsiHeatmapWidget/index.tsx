import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import {
  type IndicatorHeatmapResolution,
  useIndicatorHeatmap,
} from 'api/market-pulse';
import { ButtonSelect } from 'shared/ButtonSelect';
import { AccessSheild } from 'shared/AccessSheild';
import useSearchParamAsState from 'shared/useSearchParamAsState';
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
      title={t('common.rsi_heatmap')}
      headerClassName="flex-wrap"
      contentClassName="!min-h-[450px]"
      loading={heatmap.isLoading}
      empty={heatmap.data?.results?.length === 0}
    >
      <AccessSheild mode="children" size={1} level={1}>
        <RsiHeatmapChart
          className="h-full py-2"
          data={heatmap.data?.results ?? []}
          resolution={resolution}
          headerActions={
            <ButtonSelect
              className="mobile:w-full"
              value={resolution}
              onChange={setResolution}
              options={[
                {
                  label: '15m',
                  value: '15m',
                },
                {
                  label: '30m',
                  value: '30m',
                },
                {
                  label: '1h',
                  value: '1h',
                },
                {
                  label: '4h',
                  value: '4h',
                },
                {
                  label: '1d',
                  value: '1d',
                },
              ]}
            />
          }
        />
      </AccessSheild>
    </OverviewWidget>
  );
}
