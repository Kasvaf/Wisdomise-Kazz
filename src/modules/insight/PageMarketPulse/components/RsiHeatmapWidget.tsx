import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import {
  type IndicatorHeatmapResolution,
  useIndicatorHeatmap,
} from 'api/market-pulse';
import { ButtonSelect } from 'shared/ButtonSelect';
import { ProLocker } from 'shared/ProLocker';
import { RsiHeatmapChart } from './RsiHeatmapChart';

export function RsiHeatmapWidget({ className }: { className?: string }) {
  const { t } = useTranslation('market-pulse');
  const [resolution, setResolution] =
    useState<IndicatorHeatmapResolution>('1h');
  const heatmap = useIndicatorHeatmap({
    indicator: 'rsi',
    resolution,
  });
  return (
    <OverviewWidget
      className={className}
      title={t('indicator_list.rsi.heatmap.title')}
      headerClassName="flex-wrap"
      contentClassName="!min-h-[450px] !p-0"
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
      loading={heatmap.isLoading}
      empty={heatmap.data?.results?.length === 0}
    >
      <ProLocker mode="children" level={1} className="px-5 2xl:px-6">
        <RsiHeatmapChart
          className="h-full py-2"
          data={heatmap.data?.results ?? []}
          resolution={resolution}
        />
      </ProLocker>
    </OverviewWidget>
  );
}
