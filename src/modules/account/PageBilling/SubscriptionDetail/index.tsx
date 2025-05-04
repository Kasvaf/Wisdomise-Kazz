import dayjs from 'dayjs';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import {
  useAccountQuery,
  useInstantCancelMutation,
  useSubscription,
} from 'api';
import { PageTitle } from 'shared/PageTitle';
import { useLockingStateQuery } from 'api/defi';
import { addComma } from 'utils/numbers';
import { Referral } from 'modules/account/PageReferral';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { DebugPin } from 'shared/DebugPin';
import Utility from 'modules/account/PageToken/Utility';
import CurrentPlan from 'modules/account/PageBilling/SubscriptionDetail/OverviewTab/CurrentPlan';
import wiseClub from './wise-club.png';
import gradient from './gradient.png';
import { ReactComponent as Bag } from './bag.svg';
import { ReactComponent as Gift } from './gift.svg';
import bg from './bg.png';
import flash from './flash.png';
// eslint-disable-next-line import/max-dependencies
import gradient2 from './gradient-2.png';

export default function SubscriptionDetail() {
  const { plan, currentPeriodEnd, level } = useSubscription();
  const { data: lockState } = useLockingStateQuery();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useInstantCancelMutation();

  const { data } = useAccountQuery();
  const firstDayNextMonth = dayjs().add(1, 'month').startOf('month');

  const subItem = data?.subscription_item;
  const paymentMethod = subItem?.payment_method;

  const cancel = () => {
    void mutateAsync().then(() => {
      return notification.success({
        message: 'Subscription cancelled successfully.',
      });
    });
  };

  return (
    <div>
      <PageTitle
        title="Wise Club"
        description="Manage Your Staking, Track Your Rewards and Invite Friends for Additional Bonuses."
      />
      {paymentMethod === 'TOKEN' ? (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3 mobile:grid-cols-1">
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <h2 className="mb-5 font-medium">Stake Info</h2>
              <div className="grid grid-cols-2 gap-y-16 rounded-xl border border-v1-inverse-overlay-10 px-5 py-4 mobile:grid-cols-1">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">
                    {plan?.name}{' '}
                    {level > 0 && (
                      <img
                        src={wiseClub}
                        alt="wise-club"
                        className="ml-1 inline h-5"
                      />
                    )}
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
                  <h3 className="gap-2 text-xl font-semibold">
                    {addComma(lockState?.locked_wsdm_balance)}{' '}
                    <span className="text-sm font-normal">WSDM</span>
                  </h3>
                  <p className="text-xs text-v1-inverse-overlay-50">
                    ${lockState?.locked_wsdm_balance_usd}
                  </p>
                  <p className="text-xs font-medium text-v1-inverse-overlay-70">
                    Current Staked Amount
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">$0</h3>
                  <p className="text-xs text-v1-inverse-overlay-50">
                    Reward Distributed in {firstDayNextMonth.format('MMMM D')}
                  </p>
                  <p className="text-xs font-medium text-v1-inverse-overlay-70">
                    Expected Staking Reward
                  </p>
                </div>
              </div>
              <Utility />
            </div>
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
          {level > 0 && (
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
                <Button variant="wsdm" className="w-64">
                  <DebugPin
                    title="/account/billing?payment_method=lock"
                    color="orange"
                  />
                  Stake More
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex justify-between">
          <CurrentPlan />
          <div className="relative overflow-hidden rounded-xl bg-[#090C10] p-12">
            <img src={gradient2} alt="" className="absolute left-0 top-0" />
            <div className="relative">
              <img src={wiseClub} alt="wise-club" className="h-6" />
              <h2 className="mt-4 text-2xl font-medium">
                <span className="bg-pro-gradient bg-clip-text text-transparent">
                  W
                </span>
                ise Club is Here!
              </h2>
              <h3 className="mt-8 text-xl font-medium">
                Important Subscription Update
              </h3>
              <p className="mt-2 text-xs text-v1-content-secondary">
                We’ve Upgraded Our Subscription Model to Staking for Better
                Rewards and Long-Term Benefits.
              </p>

              <h3 className="mt-8 text-xl font-medium">What’s Changing?</h3>
              <ul className="ml-4 mt-2 text-sm text-v1-content-secondary [&>li]:list-disc">
                <li>Old Fiat-Based Subscription Is Discontinued</li>
                <li>
                  New Subscription Is Activated Through Staking $1000 $WSDM
                </li>
                <li>Earn Passive Revenue While Staying Subscribed</li>
              </ul>

              <h3 className="mt-8 text-xl font-medium">What You Need to Do</h3>
              <ul className="ml-4 mt-2 text-sm text-v1-content-secondary [&>li]:list-disc">
                <li>Cancel Your Current Fiat Subscription</li>
                <li>Stake $1000 WSDM to Activate Wise Club</li>
                <li>Enjoy Premium Tools, Lower Fees, and Revenue Share!</li>
              </ul>

              <Button
                variant="pro"
                className="mt-6 w-full"
                onClick={cancel}
                loading={isPending}
              >
                Cancel & Updgrade to Wise Club
                <Icon name={bxRightArrowAlt} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
