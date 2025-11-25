import { t } from 'i18next';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useState } from 'react';
import type { Coin } from 'services/rest/types/shared';
import { Dialog } from 'shared/v1-components/Dialog';
import { WhaleAssetsTreeMapWidget } from './WhaleAssetsTreeMapWidget';
import { WhaleCoinsWidget } from './WhaleCoinsWidget';
import { WhaleNetflowChartWidget } from './WhaleNetflowChartWidget';
import { WhaleStatsWidget } from './WhaleStatsWidget';
import { WhaleTitleWidget } from './WhaleTitleWidget';
import { WhaleTransactionsHistoryWidget } from './WhaleTransactionsHistoryWidget';

export const WhaleDetail: FC<{
  expanded?: boolean;
  focus?: boolean;
}> = () => {
  const params = useDiscoveryParams();
  const [networkName, holderAddress] = params.slugs ?? [];
  const [selectedCoinTrx, setSelectedCoinTrx] = useState<Coin | undefined>(
    undefined,
  );
  return (
    <>
      {!holderAddress || !networkName ? (
        <div>{'Empty'}</div>
      ) : (
        <>
          <div className="flex max-w-full mobile:flex-col flex-nowrap justify-between gap-3 overflow-hidden border-b border-b-white/10 pb-3">
            <div className="relative flex mobile:w-full w-1/3 flex-col gap-3 ps-0 pe-3">
              <WhaleTitleWidget
                holderAddress={holderAddress}
                hr
                networkName={networkName}
              />
              <WhaleStatsWidget
                holderAddress={holderAddress}
                networkName={networkName}
              />
            </div>
            <div className="relative mobile:w-full w-auto grow space-y-3 border-white/10 border-l ps-3 pe-0">
              <WhaleAssetsTreeMapWidget
                holderAddress={holderAddress}
                hr
                networkName={networkName}
              />
              <WhaleNetflowChartWidget
                holderAddress={holderAddress}
                networkName={networkName}
              />
            </div>
          </div>
          <div className="space-y-3 py-3">
            <WhaleCoinsWidget
              holderAddress={holderAddress}
              hr
              networkName={networkName}
              onSelect={setSelectedCoinTrx}
              type="trading"
            />
            <WhaleCoinsWidget
              holderAddress={holderAddress}
              hr
              networkName={networkName}
              onSelect={setSelectedCoinTrx}
              type="holding"
            />
            <WhaleTransactionsHistoryWidget
              holderAddress={holderAddress}
              networkName={networkName}
            />
          </div>

          <Dialog
            className="w-[90%]"
            closable
            contentClassName="p-4"
            mode="modal"
            onClose={() => setSelectedCoinTrx(undefined)}
            open={selectedCoinTrx !== undefined}
            surface={2}
          >
            <WhaleTransactionsHistoryWidget
              coin={selectedCoinTrx}
              emptyContent={
                <div className="p-4 text-v1-content-secondary">
                  {t('common:nothing-to-show')}
                </div>
              }
              holderAddress={holderAddress}
              networkName={networkName}
              surface={3}
            />
          </Dialog>
        </>
      )}
    </>
  );
};
