import { type FC } from 'react';
import { useState } from 'react';
import { t } from 'i18next';
import { type Coin } from 'api/types/shared';
import { Dialog } from 'shared/v1-components/Dialog';
import { WhaleAssetsTreeMapWidget } from './WhaleAssetsTreeMapWidget';
import { WhaleNetflowChartWidget } from './WhaleNetflowChartWidget';
import { WhaleCoinsWidget } from './WhaleCoinsWidget';
import { WhaleStatsWidget } from './WhaleStatsWidget';
import { WhaleTitleWidget } from './WhaleTitleWidget';
import { WhaleTransactionsHistoryWidget } from './WhaleTransactionsHistoryWidget';

export const WhaleDetail: FC<{
  slug: string;
  expanded?: boolean;
  focus?: boolean;
}> = ({ slug }) => {
  const [selectedCoinTrx, setSelectedCoinTrx] = useState<Coin | undefined>(
    undefined,
  );

  const [networkName, holderAddress] = slug.split('/');
  if (!holderAddress || !networkName)
    throw new Error('whale address or network name is missing');

  return (
    <>
      <div className="flex max-w-full flex-nowrap justify-between gap-3 overflow-hidden border-b border-b-white/10 p-3 mobile:flex-col">
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
      <div className="space-y-3 p-3">
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

      <Dialog
        open={selectedCoinTrx !== undefined}
        onClose={() => setSelectedCoinTrx(undefined)}
        closable
        className="w-[90%]"
        mode="modal"
        surface={2}
        contentClassName="p-4"
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
          surface={3}
        />
      </Dialog>
    </>
  );
};
