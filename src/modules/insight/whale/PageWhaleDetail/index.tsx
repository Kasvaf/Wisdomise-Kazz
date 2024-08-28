import { useParams } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import { useWhaleDetails } from 'api';
import { WalletAddress } from 'shared/WalletAddress';
import { WhaleBalanceChart } from './WhaleBalanceChart';
import { WhaletInfo } from './WalletInfo';
import { WhaleAssetsTable } from './WhaleAssetsTable';

export default function PageWhaleDetail() {
  const { network, address } = useParams<{
    network: string;
    address: string;
  }>();
  if (!address || !network) throw new Error('unexpected');

  const whale = useWhaleDetails({
    holderAddress: address,
    networkAbbreviation: network,
  });

  return (
    <PageWrapper loading={whale.isLoading}>
      <div className="grid grid-cols-3 items-start gap-6 mobile:grid-cols-1">
        <WalletAddress address={address} network={network} mode="title" />
        <div className="col-span-2 mobile:col-span-full" />
        <WhaletInfo
          whale={whale.data}
          className="col-span-1 h-full rounded-xl bg-black/30 mobile:col-span-full"
          loading={whale.isFetching}
          onRefresh={whale.refetch}
        />
        <WhaleBalanceChart
          whale={whale.data}
          className="col-span-2 rounded-xl mobile:col-span-full"
        />
        <WhaleAssetsTable
          whale={whale.data}
          className="col-span-full rounded-xl"
        />
      </div>
    </PageWrapper>
  );
}
