import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import {
  type IndicatorHeatmapResolution,
  useIndicatorHeatmap,
} from 'api/market-pulse';
import { ButtonSelect } from 'shared/ButtonSelect';
import { AccessShield } from 'shared/AccessShield';
import useSearchParamAsState from 'shared/useSearchParamAsState';
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
        </>
      }
      headerClassName="flex-wrap"
      contentClassName="!min-h-[450px]"
      loading={heatmap.isLoading}
      empty={heatmap.data?.results?.length === 0}
    >
      <AccessShield
        mode="children"
        sizes={{
          'guest': true,
          'free': true,
          'trial': false,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
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
      </AccessShield>
    </OverviewWidget>
  );
}
