import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import { type RsiHeatmapResolution, useRsiHeatmap } from 'api/market-pulse';
import { ButtonSelect } from 'shared/ButtonSelect';
import { RsiHeatmapChart } from './RsiHeatmapChart';

export function RsiHeatmapWidget({ className }: { className?: string }) {
  const { t } = useTranslation('market-pulse');
  const [resolution, setResolution] = useState<RsiHeatmapResolution>('1h');
  const heatmapData = useRsiHeatmap({
    resolution,
  });
  return (
    <OverviewWidget
      className={className}
      contentClassName="h-full"
      title={t('indicator_list.rsi.heatmap.title')}
      headerClassName="flex-wrap"
      headerActions={
        <ButtonSelect
          className="mobile:w-full mobile:justify-center [&>button]:grow"
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
    >
      <RsiHeatmapChart
        className="h-full"
        data={heatmapData.data ?? []}
        loading={heatmapData.isLoading}
        resolution={resolution}
      />
    </OverviewWidget>
  );
}
