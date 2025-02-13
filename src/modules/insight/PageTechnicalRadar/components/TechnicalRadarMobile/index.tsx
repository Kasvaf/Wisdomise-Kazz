/* eslint-disable import/max-dependencies */
import { useState } from 'react';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import RadarsTabs from 'modules/insight/RadarsTabs';
import CoinPreDetailModal from 'modules/insight/PageHome/components/HomeMobile/CoinPreDetailModal';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';
import { TechnicalRadarCoinsCharts } from './TechnicalRadarCoinsCharts';

export const TechnicalRadarMobile = () => {
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'overviewTab',
    'chart',
  );

  const [detailSlug, setDetailSlug] = useState('');

  return (
    <>
      <MobileSearchBar className="mb-4" />
      <RadarsTabs className="mb-4" />
      <TechnicalRadarViewSelect
        className="mb-4 w-full"
        value={tab}
        onChange={setTab}
        size="sm"
        surface={1}
      />
      {tab === 'chart' && <TechnicalRadarCoinsCharts onClick={setDetailSlug} />}
      {tab === 'table' && <TechnicalRadarCoinsTable onClick={setDetailSlug} />}
      <CoinPreDetailModal slug={detailSlug} onClose={() => setDetailSlug('')} />
    </>
  );
};
