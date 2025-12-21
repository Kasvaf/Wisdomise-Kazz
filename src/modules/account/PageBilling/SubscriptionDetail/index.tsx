import { bxInfoCircle, bxRightArrowAlt, bxsPlusSquare } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import CancelBanner from 'modules/account/PageBilling/SubscriptionDetail/CancelBanner';
import CurrentPlan from 'modules/account/PageBilling/SubscriptionDetail/OverviewTab/CurrentPlan';
import StakeModalContent from 'modules/account/PageBilling/SubscriptionDetail/StakeModalContent';
import { Referral } from 'modules/account/PageReferral';
import Utility from 'modules/account/PageToken/Utility';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import { useNavigate } from 'react-router-dom';
import { useAccountQuery, useHasFlag, useSubscription } from 'services/rest';
import { useLockingStateQuery } from 'services/rest/defi';
import { useRevenueQuery } from 'services/rest/revenue';
import VipBadge from 'shared/AccessShield/VipBanner/VipBadge';
import { DebugPin } from 'shared/DebugPin';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { PageTitle } from 'shared/PageTitle';
import useModal from 'shared/useModal';
import { Button } from 'shared/v1-components/Button';
import { addComma, formatNumber } from 'utils/numbers';
import { ReactComponent as Bag } from './bag.svg';
import bg from './bg.png';
import flash from './flash.png';
import { ReactComponent as Gift } from './gift.svg';
import gradient from './gradient.png';

export default function SubscriptionDetail() {
  const { plan, currentPeriodEnd, group } = useSubscription();
  const { data: lockState } = useLockingStateQuery();
  const { data: revenue } = useRevenueQuery();
  const navigate = useNavigate();
  const ensureWalletConnected = useEnsureWalletConnected();
  const hasFlag = useHasFlag();
  const [stakeModal, openStakeModal] = useModal(StakeModalContent);

  const { data } = useAccountQuery();

  const subItem = data?.subscription_item;
  const paymentMethod = subItem?.payment_method;

  const stakeMore = async () => {
    if (await ensureWalletConnected()) {
      void openStakeModal({});
    }
  };

  return (
    <div>
      <PageTitle
        description="Manage Your Staking, Track Your Rewards and Invite Friends for Additional Bonuses."
        title="Wise Club"
      />
      {paymentMethod === 'TOKEN' ? (
        <>
          <div className="mt-6 flex gap-3 max-md:flex-wrap [&>div]:w-1/3 [&>div]:max-md:w-full">
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <h2 className="mb-5 font-medium">Stake Info</h2>
              <div className="grid grid-cols-2 gap-y-16 rounded-xl border border-v1-inverse-overlay-10 px-5 py-4 max-md:grid-cols-1 max-md:gap-y-8">
                {group === 'free' ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-xl">Free</h3>
                    <p className="font-medium text-v1-inverse-overlay-70 text-xs">
                      Subscription Plan
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <h3 className="flex items-center gap-1 font-semibold text-xl">
                        {plan?.name} <VipBadge className="h-5" />
                      </h3>
                      <p className="text-v1-inverse-overlay-50 text-xs">
                        {plan?.periodicity.toLowerCase()}
                      </p>
                      <p className="font-medium text-v1-inverse-overlay-70 text-xs">
                        Subscription Plan
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="gap-2 font-semibold text-xl">
                        {dayjs(currentPeriodEnd ?? 0).fromNow(true)}{' '}
                        <span className="font-normal text-sm">Left</span>
                      </h3>
                      <p className="text-v1-inverse-overlay-50 text-xs">
                        {dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY')}
                      </p>
                      <p className="font-medium text-v1-inverse-overlay-70 text-xs">
                        Expires On
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="flex items-baseline gap-1 font-semibold text-xl">
                        {addComma(lockState?.locked_wsdm_balance)}
                        <span className="font-normal text-sm">WSDM</span>
                        <HoverTooltip title="Updated every minute">
                          <Icon
                            className={clsx('cursor-help')}
                            name={bxInfoCircle}
                            size={12}
                          />
                        </HoverTooltip>
                      </h3>
                      <p className="text-v1-inverse-overlay-50 text-xs">
                        ${lockState?.locked_wsdm_balance_usd.toFixed(2)}
                      </p>
                      <p className="font-medium text-v1-inverse-overlay-70 text-xs">
                        Current Staked Amount
                      </p>
                    </div>
                  </>
                )}
                {hasFlag('/account/billing?revenue') && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-xl">
                      $
                      {formatNumber(revenue?.net_revenue ?? 0, {
                        compactInteger: false,
                        separateByComma: false,
                        decimalLength: 2,
                        minifyDecimalRepeats: false,
                      })}
                    </h3>
                    <p className="text-v1-inverse-overlay-50 text-xs">
                      Net Revenue
                    </p>
                    <p className="font-medium text-v1-inverse-overlay-70 text-xs">
                      {formatNumber(revenue?.trading_volume ?? 0, {
                        compactInteger: true,
                        separateByComma: false,
                        decimalLength: 2,
                        minifyDecimalRepeats: false,
                      })}{' '}
                      Trading Volume
                    </p>
                  </div>
                )}
              </div>
              <Utility />
            </div>
            {hasFlag('/account/billing?revenue') && (
              <div className="rounded-xl bg-v1-surface-l2 p-5">
                <h2 className="font-medium">Revenue</h2>
                <div className="mt-5 rounded-xl border border-v1-inverse-overlay-10 px-5 py-4">
                  <h3 className="mb-2 font-semibold text-xl">$0</h3>
                  <p className="text-v1-inverse-overlay-50 text-xs">
                    Total Income from Wisdomise
                  </p>
                </div>
                <div className="relative mt-5 flex overflow-hidden rounded-xl bg-v1-overlay-100">
                  <img alt="" className="absolute right-5" src={bg} />
                  <div className="relative grow p-5">
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Bag />
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium text-3xl">$0</h3>
                        <p className="bg-pro-gradient bg-clip-text text-transparent text-xs">
                          Ready to claim
                        </p>
                      </div>
                    </div>
                    <Button
                      className="mt-12 w-full"
                      disabled={true}
                      size="md"
                      variant="pro"
                    >
                      <Gift />
                      Claim Your Rewards
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <div className="-mt-3 mb-2 flex items-center justify-between">
                <h2 className="font-medium">Referral</h2>
                <Button
                  className="-mr-4"
                  onClick={() => navigate('/account/referral')}
                  variant="link"
                >
                  <span>Referral Page</span>
                  <Icon name={bxRightArrowAlt} />
                </Button>
              </div>
              <Referral />
            </div>
          </div>
          {group !== 'free' && (
            <div className="relative mt-3 overflow-hidden rounded-xl bg-v1-surface-l2 p-5">
              <img
                alt="flash"
                className="absolute right-10 bottom-0 h-full"
                src={flash}
              />
              <img
                alt=""
                className="absolute right-0 bottom-0 h-full"
                src={gradient}
              />
              <div className="relative">
                <h2 className="mb-3 w-max bg-brand-gradient bg-clip-text font-medium text-transparent">
                  Boost Your Earnings!
                </h2>
                <p className="mb-5 text-xs">
                  Increase Your Stake to Earn More Rewards and Maximize Your
                  Share in Wisdomise Revenue.
                </p>
                <Button className="w-64" onClick={stakeMore} variant="wsdm">
                  <DebugPin
                    color="orange"
                    title="/account/billing?payment_method=lock"
                  />
                  <Icon name={bxsPlusSquare} />
                  Stake More
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex justify-between gap-4 max-md:flex-col">
          <CurrentPlan />
          <CancelBanner />
        </div>
      )}
      {stakeModal}
    </div>
  );
}
