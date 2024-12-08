import { useState } from 'react';
import { OverviewWidget } from 'shared/OverviewWidget';

import { ButtonSelect } from 'shared/ButtonSelect';
import { useTechnicalRadarTopCoins } from 'api/market-pulse';
import { TechnicalCharts } from './TechnicalCharts';
import { TechnicalCharts2 } from './TechnicalCharts2';

export function TechnicalOverviewWidget({ className }: { className?: string }) {
  const [tab, setTab] = useState<'chart' | 'table'>('chart');
  const technicalTopCoins = useTechnicalRadarTopCoins();

  return (
    <OverviewWidget
      className={className}
      title={'~Overview'}
      contentClassName="!min-h-[450px]"
      loading={technicalTopCoins.isLoading}
      empty={technicalTopCoins.data?.length === 0}
    >
      <div>
        <ButtonSelect
          className="mb-6 mobile:w-full"
          value={tab}
          onChange={setTab}
          options={[
            {
              label: '~Chart View',
              value: 'chart',
            },
            {
              label: '~Table View',
              value: 'table',
            },
          ]}
        />
      </div>

      {tab === 'chart' && <TechnicalCharts />}
      {tab === 'table' && <TechnicalCharts2 />}
    </OverviewWidget>
  );
}
