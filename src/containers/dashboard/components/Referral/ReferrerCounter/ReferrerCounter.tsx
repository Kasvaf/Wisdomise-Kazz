import { ReactComponent as ActiveUser } from "@images/icons/active-user.svg";
import { ReactComponent as Star } from "@images/icons/gradient-star.svg";
import { ReactComponent as User } from "@images/icons/user.svg";
import { FC } from "react";
import UserCounterBox from "./CounterBox";

interface IReferrerSectionProps {
  totalReferredUsers: number;
  activeReferredUsers: number;
}

const ReferrerSection: FC<IReferrerSectionProps> = ({
  totalReferredUsers,
  activeReferredUsers,
}) => {
  return (
    <div className="referral-panel flex min-h-[128px] flex-nowrap gap-16 p-8 max-md:flex-wrap">
      <UserCounterBox
        icon={<User className="w-8" />}
        title="Invited user"
        count={totalReferredUsers}
      />
      <div className="w-[1px] bg-[#626B75]" />
      <UserCounterBox
        icon={<ActiveUser className="w-8" />}
        title="Active user"
        count={activeReferredUsers}
      />
      <div className="flex items-start gap-2">
        <Star />
        <p className="text-sm font-normal text-white">
          An active user is a user who has activated a package in his profile
          and started it
        </p>
      </div>
    </div>
  );
};

export default ReferrerSection;
