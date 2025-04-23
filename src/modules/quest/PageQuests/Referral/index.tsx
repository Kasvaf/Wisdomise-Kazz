import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useReferralStatusQuery } from 'api';
import leaderboard from './users.png';
import gradient from './gradient.png';

const Referral: React.FC<{ className?: string }> = ({ className }) => {
  const { data: referralStatus } = useReferralStatusQuery();

  return (
    <NavLink
      to="/account/referral"
      className={clsx(
        'relative block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4',
        'hover:saturate-200',
        className,
      )}
    >
      <img
        src={gradient}
        alt=""
        className="absolute left-0 top-0 h-full w-full"
      />
      <div className="relative">
        <h2 className="text-xl font-semibold">Referral</h2>
        <p className="mb-10 mt-3 max-w-52 text-xs text-v1-content-secondary">
          Refer Friends and Unlock Rewards.
        </p>
        <div className="flex items-center justify-around text-center text-xs">
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Referrals</h3>
            <p>{referralStatus?.referred_users_count}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">
              Trade Fees Earned
            </h3>
            <p>${referralStatus?.referral_trade_revenue.toFixed(2)}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Wise Club Earned</h3>
            <p>${referralStatus?.referral_subscription_revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <img
        src={leaderboard}
        alt=""
        className="absolute right-0 top-4 -mb-8 h-32 w-32"
      />
    </NavLink>
  );
};

export default Referral;
