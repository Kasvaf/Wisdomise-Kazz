import { useAccountQuery, usePlansQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { DebugPin } from 'shared/DebugPin';
import { Button } from 'shared/v1-components/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import SubscriptionDetail from 'modules/account/PageBilling/SubscriptionDetail';
import { FeaturesTable } from 'modules/account/PageBilling/FeaturesTable';
import { MAIN_LANDING } from 'config/constants';
import { useReadUnlockedInfo } from 'modules/account/PageToken/web3/locking/contract';
import { useVipModal } from 'modules/account/PageBilling/useVipModal';
import bag from './images/bag.png';
import starlight from './images/starlight.png';
import bg from './images/bg.png';
import { ReactComponent as Arrow } from './images/arrow.svg';

export default function PageBilling() {
  const plans = usePlansQuery();
  const { isLoading: subIsLoading, group } = useSubscription();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();
  const { data: account } = useAccountQuery();
  const { data, isPending } = useReadUnlockedInfo();
  const { tokenPaymentModal, openVipModal } = useVipModal();

  const showDetails =
    (data?.unlockAmount ?? 0n) > 0n ||
    (group !== 'free' && group !== 'initial' && account?.info);

  const isLoading = subIsLoading || isPending;

  const onLockClick = async () => {
    if (!plans.data?.results[0]) return;
    const isLoggedIn = await ensureAuthenticated();
    if (isLoggedIn) {
      openVipModal();
    }
  };

  return (
    <PageWrapper
      hasBack
      className="h-full"
      loading={isLoading}
      mountWhileLoading
    >
      {showDetails ? (
        <SubscriptionDetail />
      ) : (
        <div className="relative flex flex-col items-center">
          <img src={starlight} className="absolute" alt="" />
          <img
            src={bg}
            className="absolute top-0 mobile:top-40 md:w-1/2"
            alt=""
          />
          <div className="relative flex flex-col items-center">
            <h1 className="mt-10 text-center text-3xl font-semibold mobile:text-2xl">
              Join{' '}
              <span className="bg-wsdm-gradient bg-clip-text text-transparent">
                Wise
              </span>{' '}
              Club for{' '}
              <span className="bg-pro-gradient bg-clip-text text-transparent">
                VIP
              </span>{' '}
              benefits
            </h1>
            <p className="mt-3 text-center text-v1-content-secondary mobile:text-sm">
              Stake <span className="text-v1-content-primary">$WSDM</span>,
              Unlock Alpha Signals, and Farm{' '}
              <span className="text-v1-content-primary">50%</span> of Platform
              Revenue Monthly — Straight Degen Passive Income.
            </p>
            <h2 className="mt-12 text-2xl mobile:text-xl">
              Stake & farm the bag{' '}
              <img
                src={bag}
                alt="baf"
                className="inline-block size-8 mobile:size-6"
              />
            </h2>
            <Button
              variant="wsdm"
              onClick={onLockClick}
              className="mb-10 mt-4 w-80"
            >
              <DebugPin
                title="/account/billing?payment_method=lock"
                color="orange"
              />
              Stake Now
              <Arrow />
            </Button>
            <div className="mb-16 rounded-3xl bg-v1-overlay-10 px-5 py-2 text-sm text-v1-content-secondary">
              Have Questions or Need More Details? Check Out Our FAQ Page for
              Answers:{' '}
              <a
                href={`${MAIN_LANDING('en')}/token/faq`}
                target="_blank"
                className="text-v1-content-link"
                rel="noreferrer"
              >
                FAQ Page
              </a>
            </div>
            {tokenPaymentModal}
            {ModalLogin}
            <FeaturesTable className="mb-10" />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
