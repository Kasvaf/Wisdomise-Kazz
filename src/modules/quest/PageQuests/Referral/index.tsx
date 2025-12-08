import { useReferralStatusQuery } from 'api';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import gradient from './gradient.png';
import leaderboard from './users.png';

const Referral: React.FC<{ className?: string }> = ({ className }) => {
  const { data: referralStatus } = useReferralStatusQuery();

  return (
    <NavLink
      className={clsx(
        'relative block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 md:h-[13rem]',
        'hover:saturate-200',
        className,
      )}
      to="/account/referral"
    >
      <img
        alt=""
        className="absolute top-0 left-0 h-full w-full"
        src={gradient}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <h2 className="font-semibold text-xl">Referral</h2>
          <p className="mt-4 mb-10 max-w-52 text-v1-content-secondary text-xs max-md:mt-2">
            Refer Friends and Unlock Rewards.
          </p>
        </div>
        <div className="flex items-center justify-around text-center text-xs">
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Referrals</h3>
            <p className="text-sm">{referralStatus?.referred_users_count}</p>
          </div>
          <div className="h-8 border-v1-border-primary/30 border-r"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">
              Trade Fees Earned
            </h3>
            <p className="text-sm">
              ${referralStatus?.referral_trade_revenue.toFixed(2)}
            </p>
          </div>
          <div className="h-8 border-v1-border-primary/30 border-r"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Wise Club Earned</h3>
            <p className="text-sm">
              ${referralStatus?.referral_subscription_revenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <img
        alt=""
        className="-mb-8 absolute top-4 right-0 size-48 max-md:size-32"
        src={leaderboard}
      />
    </NavLink>
  );
};

export default Referral;
