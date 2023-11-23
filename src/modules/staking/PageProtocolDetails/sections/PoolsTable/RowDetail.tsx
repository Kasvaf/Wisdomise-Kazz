import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import {
  usePoolTvlHistory,
  type ProtocolPools,
  usePoolApyHistory,
} from 'api/staking';
import AreaChart from '../../AreaChart';

interface Props {
  row: ProtocolPools['results']['pool'][number];
}
export default function RowDetail({ row }: Props) {
  const { t } = useTranslation('staking');
  const tvlHistory = usePoolTvlHistory(row.key);
  const apyHistory = usePoolApyHistory(row.key);

  return (
    <div className="flex items-center justify-center gap-6">
      {tvlHistory.isLoading || apyHistory.isLoading ? (
        <Spin />
      ) : (
        <>
          <div className="basis-1/2">
            <AreaChart
              yField="tvl"
              xField="date"
              data={tvlHistory.data || []}
              title={t('info.chart.tvl-history')}
            />
          </div>
          <div className="basis-1/2">
            <AreaChart
              yField="apy"
              xField="date"
              theme="purple"
              data={apyHistory.data || []}
              title={t('info.chart.apy-history')}
            />
          </div>
        </>
      )}
    </div>
  );
}
