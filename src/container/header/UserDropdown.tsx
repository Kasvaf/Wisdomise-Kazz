import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { ReactComponent as LogoutIcon } from "@images/logout.svg";
import { ReactComponent as TransactionIcon } from "@images/transaction.svg";
import { Dropdown } from "antd";
import { useGetUserInfoQuery } from "api/horosApi";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gaClick } from "utils/ga";
import { isStage } from "utils/utils";
import DepositPlanModal from "../../containers/dashboard/components/Header/DepositPlanModal";
import { DropdownContainer } from "./components";

interface IProps {
  isOpen: boolean;
  onToggle: (n?: any) => void;
  onSignout: () => void;
}

export default function UserDropdown({ isOpen, onToggle, onSignout }: IProps) {
  const { data: userInfo } = useGetUserInfoQuery({});
  const nickname = userInfo?.customer.nickname;
  const email = userInfo?.customer.user.email;

  const [shouldShowDepositPlans, setShouldShowDepositPlans] = useState(false);

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
          open={isOpen}
          trigger={["click"]}
          onOpenChange={onToggle}
          dropdownRender={() => (
            <DropdownContainer>
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap border-b border-b-nodata/20 p-2 pb-4 text-nodata">
                {email}
              </div>

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
              <button
                type="button"
                onClick={signout}
                className="horos-filter-btn-alt group  justify-start  rounded-sm border border-nodata/20 bg-transparent  fill-error p-2 uppercase text-error hover:bg-gray-dark hover:fill-error hover:text-error"
              >
                <LogoutIcon className="mr-2" /> Logout
              </button>
            </DropdownContainer>
          )}
        >
          <div className="flex cursor-pointer items-center justify-start gap-3">
            <div>
              <p className="inline-block h-10 w-10 self-start rounded-full bg-white/5 text-center text-xl leading-10 text-white">
                {nickname?.charAt(0).toLocaleUpperCase()}
              </p>
            </div>

            <button className="flex font-medium text-white">
              {nickname}
              <ChevronDown className="w-6 fill-white" />
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
