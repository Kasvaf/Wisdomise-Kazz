import { generateTokenLink } from 'modules/discovery/DetailView/CoinDetail/lib';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalRadarCoinsCharts } from './TechnicalRadarCoinsCharts';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';

export const TechnicalRadarCompact: FC<{ focus?: boolean }> = () => {
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'technical-radar-tab',
    'table',
  );

  const navigate = useNavigate();

  return (
    <div className="p-3">
      <TechnicalRadarViewSelect
        className="mb-4 w-full"
        onChange={setTab}
        size="sm"
        surface={1}
        value={tab}
      />
      {tab === 'chart' && (
        <TechnicalRadarCoinsCharts
          onClick={r => {
            if (r.networks) {
              navigate(generateTokenLink(r.networks));
            }
          }}
        />
      )}
      {tab === 'table' && (
        <TechnicalRadarCoinsTable
          onClick={r => {
            if (r.networks) {
              navigate(generateTokenLink(r.networks));
            }
          }}
        />
      )}
    </div>
  );
};
