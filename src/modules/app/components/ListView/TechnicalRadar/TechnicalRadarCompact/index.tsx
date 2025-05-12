/* eslint-disable import/max-dependencies */
import { type FC } from 'react';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type TechnicalRadarCoin } from 'api';
import TechnicalRadarSharingModal from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSharingModal';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
import { useCoinPreDetailModal } from '../../CoinPreDetailModal';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';
import { TechnicalRadarCoinsCharts } from './TechnicalRadarCoinsCharts';

export const TechnicalRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'technical-radar-tab',
    'table',
  );

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<TechnicalRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
    });

  return (
    <>
      <TechnicalRadarViewSelect
        className="mb-4 w-full"
        value={tab}
        onChange={setTab}
        size="sm"
        surface={1}
      />
      {tab === 'chart' && (
        <TechnicalRadarCoinsCharts onClick={row => openModal(row)} />
      )}
      {tab === 'table' && (
        <TechnicalRadarCoinsTable onClick={row => openModal(row)} />
      )}
      <CoinPreDetailModal
        coin={selectedRow?.symbol}
        categories={selectedRow?.symbol.categories}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={isModalOpen}
        onClose={() => closeModal()}
        hasShare={true}
      >
        {selectedRow?.sparkline && (
          <CoinPriceChart value={selectedRow?.sparkline?.prices ?? []} />
        )}
        {selectedRow && (
          <>
            <TechnicalRadarSentiment
              value={selectedRow}
              mode="expanded"
              className="w-full"
            />
          </>
        )}
        {selectedRow && (
          <TechnicalRadarSharingModal open={false} coin={selectedRow} />
        )}
      </CoinPreDetailModal>
    </>
  );
};
