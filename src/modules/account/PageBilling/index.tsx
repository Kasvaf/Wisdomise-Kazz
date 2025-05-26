import { useAccountQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SubscriptionDetail from 'modules/account/PageBilling/SubscriptionDetail';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { useReadUnlockedInfo } from 'modules/account/PageToken/web3/locking/contract';
import WiseClub from 'modules/account/PageBilling/WiseClub';

export default function PageBilling() {
  const isMobile = useIsMobile();
  const { isLoading: subIsLoading, group } = useSubscription();
  const { data: account, isLoading: accountIsLoading } = useAccountQuery();
  const { data, isPending } = useReadUnlockedInfo();

  const showDetails =
    ((data?.unlockAmount ?? 0n) > 0n ||
      (group !== 'free' && group !== 'initial')) &&
    account?.info &&
    group !== 'guest';

  const isLoading = subIsLoading || isPending || accountIsLoading;

  return (
    <PageWrapper
      hasBack
      loading={isLoading}
      extension={!isMobile && <CoinExtensionsGroup />}
    >
      {showDetails ? <SubscriptionDetail /> : <WiseClub />}
    </PageWrapper>
  );
}
