import { useParams } from 'react-router-dom';
import { Wallet } from 'shared/Wallet';
import InsightPageWrapper from '../InsightPageWrapper';
import { WhaleOverviewWidget } from './components/WhaleOverviewWidget';
import { WhaleAssetsTreeMapWidget } from './components/WhaleAssetsTreeMapWidget';
import { WhaleBalanceChartWidget } from './components/WhaleBalanceChartWidget';
import { WhaleNetflowChartWidget } from './components/WhaleNetflowChartWidget';
import { Whale14DaysStats } from './components/Whale14DaysStats';
import { WhaleHistoricalPnlWidget } from './components/WhaleHistoricalPnlWidget';
import { WhaleTradesWidget } from './components/WhaleTradesWidget';
import { WhaleHoldsWidget } from './components/WhaleHoldsWidget';

export default function PageWhaleDetails() {
  const { network: networkName, address: holderAddress } = useParams<{
    network: string;
    address: string;
  }>();
  if (!holderAddress || !networkName)
    throw new Error('whale address or network name is missing');

  return (
    <InsightPageWrapper hasBack>
      <div className="grid grid-cols-6 items-start gap-6">
        <Wallet
          wallet={{
            network: networkName,
            address: holderAddress,
          }}
          mode="title"
          className="col-span-2 mobile:col-span-6"
        />
        <div className="col-span-4 mobile:hidden" />
        <WhaleOverviewWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-2 h-full mobile:col-span-6"
        />
        <WhaleAssetsTreeMapWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-4 h-full mobile:col-span-6"
        />
        <WhaleBalanceChartWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-3 h-full mobile:col-span-6"
        />
        <WhaleNetflowChartWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-3 h-full mobile:col-span-6"
        />
        <Whale14DaysStats
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-2 h-full mobile:col-span-6"
        />
        <WhaleHistoricalPnlWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-4 h-full mobile:col-span-6"
        />
        <WhaleTradesWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-6 h-full"
        />
        <WhaleHoldsWidget
          holderAddress={holderAddress}
          networkName={networkName}
          className="col-span-6 h-full"
        />
      </div>
    </InsightPageWrapper>
  );
}
