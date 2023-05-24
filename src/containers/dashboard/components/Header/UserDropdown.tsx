import { Dropdown } from "antd";
import { useGetUserInfoQuery } from "api/horosApi";
import { ReactComponent as LogoutIcon } from "@images/logout.svg";
import { ReactComponent as PlanIcon } from "@images/plan.svg";
import { ReactComponent as TransactionIcon } from "@images/transaction.svg";
import { ReactComponent as ReferralIcon } from "@images/referral.svg";
import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { gaClick } from "utils/ga";
import { isStage } from "utils/utils";
import KycMenuItem from "../Header/Kyc";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import DepositPlanModal from "./DepositPlanModal";

interface IProps {
  isOpen: boolean;
  onToggle: (n?: any) => void;
  onSignout: () => void;
}

export default function UserDropdown({ isOpen, onToggle, onSignout }: IProps) {
  const { data: userInfo } = useGetUserInfoQuery({});
  const userName = userInfo?.customer.user.email || "";
  const kycLevel = userInfo?.kyc_level_bindings[0];

  const [shouldShowDepositPlans, setShouldShowDepositPlans] = useState(false);
  const openDepositPlans = useCallback(() => {
    onToggle(false);
    setShouldShowDepositPlans(true);
  }, []);

  const navigate = useNavigate();
  const signout = useCallback(() => {
    onToggle(false);
    onSignout();
    gaClick("sign out");
    setTimeout(() => navigate("/"), 1000);
  }, []);

  return (
    <>
      <div className="min-w-0 grow-0">
        <Dropdown
          overlay={
            <div className="absolute right-0 top-full mt-1 flex w-[23rem] flex-col space-y-2 rounded-sm border border-nodata/20 bg-bgcolor p-4">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap border-b border-b-nodata/20 p-2 pb-4 text-nodata">
                {userName}
              </div>
              {/* <button
                type="button"
                onClick={openDepositPlans}
                className=" flex items-center justify-start bg-transparent px-2 py-[10px]  text-white hover:bg-gray-dark"
              >
                <PlanIcon className="mr-2 w-[24px]" /> Subscription Plans
              </button> */}

              {isStage() && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onToggle(false);
                      navigate("/app/transactions");
                    }}
                    className="flex items-center justify-start bg-transparent px-2  py-[10px] text-white hover:bg-gray-dark"
                  >
                    <TransactionIcon className="mr-2 w-[24px]" />
                    Transaction History
                  </button>
                </>
              )}
              {/* <button
                type="button"
                onClick={() => {
                  onToggle(false);
                  navigate("/app/referral");
                }}
                className=" flex items-center justify-start bg-transparent px-2 py-[10px]  text-white hover:bg-gray-dark"
              >
                <ReferralIcon className="mr-2 w-[24px]" /> Referral
              </button> */}

              {/* <KycMenuItem
                kycBinding={kycLevel}
                onClick={() => onToggle(false)}
              /> */}

              <button
                type="button"
                onClick={signout}
                className="horos-filter-btn-alt group  justify-start  rounded-sm border border-nodata/20 bg-transparent  fill-error p-2 uppercase text-error hover:bg-gray-dark hover:fill-error hover:text-error"
              >
                <LogoutIcon className="mr-2" /> Logout
              </button>
            </div>
          }
          trigger={["click"]}
          onVisibleChange={onToggle}
          visible={isOpen}
        >
          <div className="flex cursor-pointer gap-3">
            <div className=" flex h-10 w-10 flex-[0_0_2.5rem] flex-col items-center justify-center rounded-md bg-gray-dark bg-gradient-to-r from-gradientFromTransparent via-gradientToTransparent to-gradientToTransparent uppercase">
              <p className="text-xl text-primary">{userName.charAt(0)}</p>
            </div>
            <button className="horos-filter-btn-alt group hidden bg-transparent fill-white/50 px-0 py-2 normal-case hover:bg-transparent hover:fill-white hover:text-white md:flex">
              <span>{userName}</span>
              <ChevronDown className="w-6" />
            </button>
          </div>
        </Dropdown>
      </div>
      {shouldShowDepositPlans && (
        <DepositPlanModal toggle={() => setShouldShowDepositPlans(false)} />
      )}
    </>
  );
}
