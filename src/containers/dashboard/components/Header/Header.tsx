import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import {
  useGetUserInfoQuery,
  useGetInvestorAssetStructureQuery,
} from "api/horosApi";
import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { ReactComponent as WithdrawIcon } from "@images/withdraw.svg";
import { ReactComponent as DepositIcon } from "@images/deposit.svg";
import { ReactComponent as NewWallet } from "@images/new_wallet.svg";
import { Tab } from "containers/dashboard/types";
import { gaClick } from "utils/ga";
import { floatData, isStage } from "utils/utils";
import { ReactComponent as LogoutIcon } from "@images/logout.svg";
import { ReactComponent as PlanIcon } from "@images/plan.svg";
import { ReactComponent as TransactionIcon } from "@images/transaction.svg";
import { ReactComponent as ReferralIcon } from "@images/referral.svg";
import KycMenuItem from "../Header/Kyc";
import DepositPlanModal from "./DepositPlanModal";

interface HeaderProps {
  tab: Tab;
  handleTabClick: (tab: Tab) => unknown;
  signOut: () => unknown;
}

function Header({ signOut }: HeaderProps) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const { data: userInfo } = useGetUserInfoQuery({});
  const userName = userInfo?.customer.user.email || "";
  const kycLevel = userInfo?.kyc_level_bindings[0];

  const investorAsset = useGetInvestorAssetStructureQuery({});
  const [showDepositPlan, setShowDepositPlan] = useState(false);

  const onShowDepositPage = () => {
    setShowWalletMenu(false);

    const key =
      investorAsset?.data.results[0].trader_instances[0]?.exchange_account.key;
    navigate(`/app/deposit/${key}`);
  };

  const onShowWithdrawPage = () => {
    setShowWalletMenu(false);
    navigate("/app/withdraw");
  };

  const hasWallet =
    investorAsset?.data &&
    investorAsset?.data.results.length > 0 &&
    investorAsset?.data?.results[0]?.trader_instances.length > 0;

  return (
    <div className="mb-8 flex justify-between">
      <h1 className="mb-2 font-campton text-xl text-white xl:text-2xl">
        Welcome
      </h1>
      <div className="ml-auto flex">
        {hasWallet && (
          <div className="mx-4 flex items-center justify-evenly border-r-2 border-gray-main px-4">
            <NewWallet />

            <div className="ml-4 min-w-0 grow-0">
              <Dropdown
                overlay={
                  <div className="mt-1 flex  flex-col space-y-2 rounded-sm border border-nodata/20 bg-bgcolor p-4">
                    <button
                      type="button"
                      onClick={() => {
                        onShowDepositPage();
                      }}
                      className="flex items-center justify-start bg-transparent p-4  text-white hover:bg-gray-dark"
                    >
                      <DepositIcon className="mr-2 w-[20px] text-2xl" />
                      Deposit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onShowWithdrawPage();
                      }}
                      className=" flex items-center justify-start bg-transparent px-4 py-3   text-white hover:bg-gray-dark"
                    >
                      <WithdrawIcon className="mr-2 w-[20px]" /> Withdraw
                    </button>
                  </div>
                }
                trigger={["click"]}
                onVisibleChange={(flag: boolean) => setShowWalletMenu(flag)}
                visible={showWalletMenu}
              >
                <button className="horos-filter-btn-alt group bg-transparent fill-white/50 py-2 px-0 normal-case hover:bg-transparent hover:fill-white hover:text-white">
                  <p className="px-2 font-bold uppercase text-primary">
                    wallet
                  </p>
                  <p className="font-bold text-primary">
                    $
                    {hasWallet
                      ? floatData(
                          investorAsset?.data.results[0].trader_instances[0]
                            ?.exchange_account.total_equity
                        )
                      : 0}
                  </p>
                  <ChevronDown className="w-6" />
                </button>
              </Dropdown>
            </div>
          </div>
        )}
        <div className="min-w-0 grow-0">
          <Dropdown
            overlay={
              <div className="mt-1 flex w-[23rem] flex-col space-y-2 rounded-sm border border-nodata/20 bg-bgcolor p-4">
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap border-b border-b-nodata/20 p-2 pb-4 text-nodata">
                  {userName}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDepositPlan(true);
                  }}
                  className=" flex items-center justify-start bg-transparent py-[10px] px-2  text-white hover:bg-gray-dark"
                >
                  <PlanIcon className="mr-2 w-[24px]" /> Subscription Plans
                </button>

                {isStage() && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/app/transactions");
                      }}
                      className="flex items-center justify-start bg-transparent py-[10px]  px-2 text-white hover:bg-gray-dark"
                    >
                      <TransactionIcon className="mr-2 w-[24px]" />
                      Transaction History
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/app/referral");
                  }}
                  className=" flex items-center justify-start bg-transparent py-[10px] px-2  text-white hover:bg-gray-dark"
                >
                  <ReferralIcon className="mr-2 w-[24px]" /> Referral
                </button>

                <KycMenuItem
                  kycBinding={kycLevel}
                  onClick={() => setShowMenu(false)}
                />

                <hr />
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    signOut();
                    gaClick("sign out");
                    setTimeout(() => navigate("/"), 1000);
                  }}
                  className="horos-filter-btn-alt group  justify-start  rounded-sm border border-nodata/20 bg-transparent  fill-error p-2 uppercase text-error hover:bg-gray-dark hover:fill-error hover:text-error"
                >
                  <LogoutIcon className="mr-2" /> Logout
                </button>
              </div>
            }
            trigger={["click"]}
            onVisibleChange={(flag: boolean) => setShowMenu(flag)}
            visible={showMenu}
          >
            <div className="flex cursor-pointer gap-3">
              <div className=" flex h-10 w-10 flex-[0_0_10] flex-col items-center justify-center rounded-md bg-gray-dark bg-gradient-to-r from-gradientFromTransparent via-gradientToTransparent to-gradientToTransparent uppercase">
                <p className="text-xl text-primary">{userName.charAt(0)}</p>
              </div>
              <button className="horos-filter-btn-alt group bg-transparent fill-white/50 py-2 px-0 normal-case hover:bg-transparent hover:fill-white hover:text-white">
                <span>{userName}</span>
                <ChevronDown className="w-6" />
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
      {showDepositPlan && (
        <DepositPlanModal toggle={() => setShowDepositPlan(false)} />
      )}
    </div>
  );
}

export default Header;
