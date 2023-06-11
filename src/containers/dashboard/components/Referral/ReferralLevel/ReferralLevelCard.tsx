import cls from "classnames";
import type { FC } from "react";
import ReferralLevelBadge from "./ReferralLevelBadge";
import ReferralLevelStatus from "./ReferralLevelStatus";
import { ReferralLevelProps } from "./types";

const ReferralLevelCard: FC<ReferralLevelProps> = ({
  data: {
    level,
    active_referred_users: activeRequired,
    referred_users: totalRequired,
    bonuses,
    description,
    key,
  },
  referredUsers,
  levelBindings,
  activeReferredUsers,
}) => {
  const getProgress = (): number => {
    const activeUsersPercentage = Math.min(
      (activeReferredUsers / activeRequired) * 100,
      100
    );
    const totalUsersPercentage = Math.min(
      (referredUsers / totalRequired) * 100,
      100
    );

    const percentage = (activeUsersPercentage + totalUsersPercentage) / 2;

    return Math.min(percentage, 100);
  };

  const getClaimedStatus = () => {
    if (levelBindings.find((l) => l.referral_level.key === key)) return true;

    return getProgress() === 100;
  };

  return (
    <div
      className={cls(
        "referral-panel flex flex-grow-0 basis-1/3 flex-col gap-6 p-6 font-poppins text-white"
      )}
    >
      <div className={"flex items-center justify-between"}>
        <ReferralLevelBadge
          level={level}
          claimed={getClaimedStatus()}
          progress={getClaimedStatus() ? 0 : getProgress()}
        />
        <ReferralLevelStatus
          activeRequired={activeRequired}
          totalRequired={totalRequired}
          activeReferredUsers={activeReferredUsers}
          referredUsers={referredUsers}
          claimed={getClaimedStatus()}
        />
      </div>
      <h2 className="text-lg font-semibold text-white">{description}</h2>

      <div className="flex flex-1 flex-col gap-2 pt-0">
        <div className="text-sm font-light text-white/60">Requirements</div>
        <div className="text-sm font-medium text-white">
          <span>{`Refer ${totalRequired} users`}</span> <br />
          <span>{`Refer ${activeRequired} active users`}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-0">
        <div className="text-sm font-light text-white/60">Benefits</div>
        {bonuses.map((b) => {
          // ** other types of bonus will be should here
          if (b.subscription_bonus)
            return (
              <div
                key={b.subscription_bonus?.key}
                className="text-sm font-medium text-white"
              >
                {`${b.subscription_bonus?.duration_days} Days ${b.subscription_bonus?.subscription_plan.title} Subscription Plan`}
              </div>
            );
          return <>-</>;
        })}
      </div>
    </div>
  );
};

export default ReferralLevelCard;
