import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';
import { t } from 'i18next';
import useIsMobile from 'utils/useIsMobile';
import { type Coin } from 'api/types/shared';
import InsightPageWrapper from '../InsightPageWrapper';
import { WhaleAssetsTreeMapWidget } from './components/WhaleAssetsTreeMapWidget';
import { WhaleNetflowChartWidget } from './components/WhaleNetflowChartWidget';
import { WhaleCoinsWidget } from './components/WhaleCoinsWidget';
import { WhaleStatsWidget } from './components/WhaleStatsWidget';
import { WhaleTitleWidget } from './components/WhaleTitleWidget';
import { WhaleTransactionsHistoryWidget } from './components/WhaleTransactionsHistoryWidget';

export default function PageWhaleDetails() {
  const isMobile = useIsMobile();
  const [selectedCoinTrx, setSelectedCoinTrx] = useState<Coin | undefined>(
    undefined,
  );

  const { network: networkName, address: holderAddress } = useParams<{
    network: string;
    address: string;
  }>();
  if (!holderAddress || !networkName)
    throw new Error('whale address or network name is missing');

  return (
    <InsightPageWrapper hasBack mainClassName={isMobile ? '' : '!pt-0'}>
      <div className="flex max-w-full flex-nowrap justify-between gap-3 overflow-hidden border-b border-b-white/10 pb-3 mobile:flex-col">
        <div className="relative flex w-1/3 flex-col gap-3 p-3 ps-0 mobile:w-full">
          <WhaleTitleWidget
            holderAddress={holderAddress}
            networkName={networkName}
            hr
          />
          <WhaleStatsWidget
            holderAddress={holderAddress}
            networkName={networkName}
          />
        </div>
        <div className="relative w-auto grow space-y-3 border-l border-white/10 p-3 pe-0  mobile:w-full">
          <WhaleAssetsTreeMapWidget
            holderAddress={holderAddress}
            networkName={networkName}
            hr
          />
          <WhaleNetflowChartWidget
            holderAddress={holderAddress}
            networkName={networkName}
          />
        </div>
      </div>
      <div className="space-y-3 pt-3">
        <WhaleCoinsWidget
          holderAddress={holderAddress}
          networkName={networkName}
          type="trading"
          hr
          onSelect={setSelectedCoinTrx}
        />
        <WhaleCoinsWidget
          holderAddress={holderAddress}
          networkName={networkName}
          type="holding"
          hr
          onSelect={setSelectedCoinTrx}
        />
        <WhaleTransactionsHistoryWidget
          holderAddress={holderAddress}
          networkName={networkName}
        />
      </div>

      <Modal
        centered
        open={selectedCoinTrx !== undefined}
        onCancel={() => setSelectedCoinTrx(undefined)}
        destroyOnClose
        footer={false}
        closable
        className="[&_.ant-modal-header]:mb-6 [&_.ant-modal-title]:text-start"
        width={isMobile ? '90%' : '80%'}
      >
        <WhaleTransactionsHistoryWidget
          holderAddress={holderAddress}
          networkName={networkName}
          coin={selectedCoinTrx}
          emptyContent={
            <div className="p-4 text-v1-content-secondary">
              {t('common:nothing-to-show')}
            </div>
          }
        />
      </Modal>
    </InsightPageWrapper>
  );
}
