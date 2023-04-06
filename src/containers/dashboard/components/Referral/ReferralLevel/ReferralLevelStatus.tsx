import type { FC } from "react";
import classNames from "classnames";
import { ReactComponent as User } from "@images/icons/user-dim.svg";
import { ReactComponent as ActiveUser } from "@images/icons/active-user-dim.svg";

interface ReferralLevelStatusProps {
  totalRequired: number;
  activeRequired: number;
  referredUsers: number;
  activeReferredUsers: number;
  claimed: boolean;
}

const ReferralLevelStatus: FC<ReferralLevelStatusProps> = ({
  totalRequired,
  referredUsers,
  activeRequired,
  activeReferredUsers,
  claimed = false,
}) => {
  return (
    <div
      className={
        "relative flex h-10 rounded-full bg-bgcolor px-4 py-2 text-base font-medium"
      }
    >
      <div
        className={classNames({
          "-z-1 absolute left-0 top-0 h-10 w-full rounded-full bg-gradient-to-r from-gradientFrom to-gradientTo opacity-20":
            claimed,
        })}
      ></div>
      <div
        className={classNames("flex flex-nowrap gap-2 font-inter", {
          "bg-gradient-to-r from-gradientFrom to-gradientTo bg-clip-text text-base font-medium text-transparent":
            claimed,
          "text-base font-medium text-white": !claimed,
        })}
      >
        {!claimed ? (
          <>
            <div className="flex flex-nowrap gap-2">
              {`${Math.min(referredUsers, totalRequired)}/${totalRequired}`}
              <User />
            </div>
            {activeRequired > 0 && (
              <div className="flex flex-nowrap gap-2">
                {`${Math.min(
                  activeReferredUsers,
                  activeRequired
                )}/${activeRequired}`}
                <ActiveUser />
              </div>
            )}
          </>
        ) : (
          "Claimed"
        )}
      </div>
    </div>
  );
};

export default ReferralLevelStatus;
