import SubscriptionDetail from 'modules/account/PageBilling/SubscriptionDetail';
import WiseClub from 'modules/account/PageBilling/WiseClub';
import { useReadUnlockedInfo } from 'modules/account/PageToken/web3/locking/contract';
import PageWrapper from 'modules/base/PageWrapper';
import { useAccountQuery, useSubscription } from 'services/rest';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';

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
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      loading={isLoading}
    >
      {showDetails ? <SubscriptionDetail /> : <WiseClub />}
    </PageWrapper>
  );
}
