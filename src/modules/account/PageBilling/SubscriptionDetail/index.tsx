import dayjs from 'dayjs';
import { useSubscription } from 'api';
import { PageTitle } from 'shared/PageTitle';
import { useLockingStateQuery } from 'api/defi';
import { addComma } from 'utils/numbers';
import wiseClub from './wise-club.png';

export default function SubscriptionDetail() {
  const { plan, currentPeriodEnd } = useSubscription();
  const { data: lockState } = useLockingStateQuery();

  return (
    <div>
      <PageTitle
        title="Subscription"
        description="Manage Your Staking, Track Your Rewards and Invite Friends for Additional Bonuses."
      />
      <div className="mt-6 grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <div className="rounded-xl bg-v1-surface-l2 p-5">
          <h2 className="mb-5 font-semibold">Stake Info</h2>
          <div className="grid grid-cols-2 gap-y-20 rounded-xl border border-v1-inverse-overlay-10 p-6 mobile:grid-cols-1">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                {plan?.name}{' '}
                <img
                  src={wiseClub}
                  alt="wise-club"
                  className="ml-1 inline h-5"
                />
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
                Current Locked Amount
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">$40</h3>
              <p className="text-xs text-v1-inverse-overlay-50">
                Reward Distributed in 10 Days
              </p>
              <p className="text-xs font-medium text-v1-inverse-overlay-70">
                Expected Staking Reward
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-v1-surface-l2 p-5"></div>
        <div className="rounded-xl bg-v1-surface-l2 p-5"></div>
      </div>
    </div>
  );
}
