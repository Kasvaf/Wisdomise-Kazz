import dayjs from 'dayjs';
import { bxInfoCircle, bxRightArrowAlt, bxsPlusSquare } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAccountQuery, useHasFlag, useSubscription } from 'api';
import { PageTitle } from 'shared/PageTitle';
import { useLockingStateQuery } from 'api/defi';
import { addComma, formatNumber } from 'utils/numbers';
import { Referral } from 'modules/account/PageReferral';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { DebugPin } from 'shared/DebugPin';
import Utility from 'modules/account/PageToken/Utility';
import CurrentPlan from 'modules/account/PageBilling/SubscriptionDetail/OverviewTab/CurrentPlan';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import StakeModalContent from 'modules/account/PageBilling/SubscriptionDetail/StakeModalContent';
import useModal from 'shared/useModal';
import { HoverTooltip } from 'shared/HoverTooltip';
import { useRevenueQuery } from 'api/revenue';
import CancelBanner from 'modules/account/PageBilling/SubscriptionDetail/CancelBanner';
import VipBadge from 'shared/AccessShield/VipBanner/VipBadge';
import gradient from './gradient.png';
import { ReactComponent as Bag } from './bag.svg';
import { ReactComponent as Gift } from './gift.svg';
import bg from './bg.png';
// eslint-disable-next-line import/max-dependencies
import flash from './flash.png';

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
        title="Wise Club"
        description="Manage Your Staking, Track Your Rewards and Invite Friends for Additional Bonuses."
      />
      {paymentMethod === 'TOKEN' ? (
        <>
          <div className="mt-6 flex gap-3 mobile:flex-wrap [&>div]:w-1/3 [&>div]:mobile:w-full">
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <h2 className="mb-5 font-medium">Stake Info</h2>
              <div className="grid grid-cols-2 gap-y-16 rounded-xl border border-v1-inverse-overlay-10 px-5 py-4 mobile:grid-cols-1 mobile:gap-y-8">
                {group === 'free' ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <p className="text-xs font-medium text-v1-inverse-overlay-70">
                      Subscription Plan
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <h3 className="flex items-center gap-1 text-xl font-semibold">
                        {plan?.name} <VipBadge className="h-5" />
                      </h3>
                      <p className="text-xs text-v1-inverse-overlay-50">
                        {plan?.periodicity.toLowerCase()}
                      </p>
                      <p className="text-xs font-medium text-v1-inverse-overlay-70">
                        Subscription Plan
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="gap-2 text-xl font-semibold">
                        {dayjs(currentPeriodEnd ?? 0).fromNow(true)}{' '}
                        <span className="text-sm font-normal">Left</span>
                      </h3>
                      <p className="text-xs text-v1-inverse-overlay-50">
                        {dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY')}
                      </p>
                      <p className="text-xs font-medium text-v1-inverse-overlay-70">
                        Expires On
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="flex items-baseline gap-1 text-xl font-semibold">
                        {addComma(lockState?.locked_wsdm_balance)}
                        <span className="text-sm font-normal">WSDM</span>
                        <HoverTooltip title="Updated every minute">
                          <Icon
                            size={12}
                            name={bxInfoCircle}
                            className={clsx('cursor-help')}
                          />
                        </HoverTooltip>
                      </h3>
                      <p className="text-xs text-v1-inverse-overlay-50">
                        ${lockState?.locked_wsdm_balance_usd.toFixed(2)}
                      </p>
                      <p className="text-xs font-medium text-v1-inverse-overlay-70">
                        Current Staked Amount
                      </p>
                    </div>
                  </>
                )}
                {hasFlag('/account/billing?revenue') && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">
                      $
                      {formatNumber(revenue?.net_revenue ?? 0, {
                        compactInteger: false,
                        seperateByComma: false,
                        decimalLength: 2,
                        minifyDecimalRepeats: false,
                      })}
                    </h3>
                    <p className="text-xs text-v1-inverse-overlay-50">
                      Net Revenue
                    </p>
                    <p className="text-xs font-medium text-v1-inverse-overlay-70">
                      {formatNumber(revenue?.trading_volume ?? 0, {
                        compactInteger: true,
                        seperateByComma: false,
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
                  <h3 className="mb-2 text-xl font-semibold">$0</h3>
                  <p className="text-xs text-v1-inverse-overlay-50">
                    Total Income from Wisdomise
                  </p>
                </div>
                <div className="relative mt-5 flex overflow-hidden rounded-xl bg-v1-overlay-100">
                  <img src={bg} alt="" className="absolute right-5" />
                  <div className="relative grow p-5">
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Bag />
                      </div>
                      <div>
                        <h3 className="mb-1 text-3xl font-medium">$0</h3>
                        <p className="bg-pro-gradient bg-clip-text text-xs text-transparent">
                          Ready to claim
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="pro"
                      className="mt-12 w-full"
                      size="md"
                      disabled={true}
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
                  variant="link"
                  className="-mr-4"
                  onClick={() => navigate('/account/referral')}
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
                src={flash}
                alt="flash"
                className="absolute bottom-0 right-10 h-full"
              />
              <img
                src={gradient}
                alt=""
                className="absolute bottom-0 right-0 h-full"
              />
              <div className="relative">
                <h2 className="mb-3 w-max bg-wsdm-gradient bg-clip-text font-medium text-transparent">
                  Boost Your Earnings!
                </h2>
                <p className="mb-5 text-xs">
                  Increase Your Stake to Earn More Rewards and Maximize Your
                  Share in Wisdomise Revenue.
                </p>
                <Button variant="wsdm" className="w-64" onClick={stakeMore}>
                  <DebugPin
                    title="/account/billing?payment_method=lock"
                    color="orange"
                  />
                  <Icon name={bxsPlusSquare} />
                  Stake More
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex justify-between gap-4 mobile:flex-col">
          <CurrentPlan />
          <CancelBanner />
        </div>
      )}
      {stakeModal}
    </div>
  );
}
